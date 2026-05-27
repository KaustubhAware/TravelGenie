import logging

import bcrypt
from fastapi import APIRouter, HTTPException, Header
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel

from psycopg2.extras import RealDictCursor

from app.db import get_connection
from dotenv import load_dotenv

from app.config import get_settings
from app.responses import success_response

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin")

settings = get_settings()
SECRET_KEY = settings.ADMIN_SECRET_KEY
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 2
ROLE_NAMES = {"admin", "vendor", "customer", "agent", "user"}


class LoginRequest(BaseModel):
    username: str
    password: str


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8"),
        )
    except (ValueError, TypeError):
        return False


def ensure_user_columns(cursor):
    """Deprecated: schema is managed via schema.sql only."""
    logger.debug(
        "ensure_user_columns is deprecated and no longer mutates schema"
    )


def _authenticate_admin_db(cursor, username: str, password: str):
    cursor.execute(
        """
        SELECT id, username, password_hash, full_name
        FROM admins
        WHERE LOWER(username) = LOWER(%s)
        LIMIT 1
        """,
        (username,),
    )
    row = cursor.fetchone()
    if not row:
        return None

    password_hash = row["password_hash"]
    if not verify_password(password, password_hash):
        logger.warning("Failed admin login attempt for user: %s", username)
        return None

    return row


def _seed_admin_from_env(cursor, username: str, password: str):
    """Insert or reset admin password from env fallback (dev recovery)."""
    password_hash = hash_password(password)
    cursor.execute(
        """
        INSERT INTO admins (username, password_hash, full_name)
        VALUES (%s, %s, %s)
        ON CONFLICT (username) DO UPDATE
        SET password_hash = EXCLUDED.password_hash
        RETURNING id
        """,
        (username, password_hash, "System Administrator"),
    )
    return cursor.fetchone()


@router.post("/login")
def login(data: LoginRequest):
    load_dotenv()
    get_settings.cache_clear()
    runtime_settings = get_settings()

    username = data.username.strip()
    password = data.password.strip()

    if not username or not password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        env_user = runtime_settings.ADMIN_USERNAME.strip()
        env_pass = runtime_settings.ADMIN_PASSWORD.strip()

        # Env credentials always refresh the DB hash (dev recovery).
        if (
            username.lower() == env_user.lower()
            and password == env_pass
        ):
            _seed_admin_from_env(cursor, env_user, password)
            conn.commit()
            admin_row = _authenticate_admin_db(cursor, env_user, password)
        else:
            admin_row = _authenticate_admin_db(cursor, username, password)

        if not admin_row:
            logger.warning(
                "Admin login rejected for username: %s", username
            )
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password",
            )

        payload = {
            "sub": str(admin_row["id"]),
            "id": admin_row["id"],
            "uid": str(admin_row["id"]),
            "email": admin_row["username"],
            "username": admin_row["username"],
            "role": "admin",
            "exp": datetime.utcnow()
            + timedelta(hours=TOKEN_EXPIRE_HOURS),
        }

        token = jwt.encode(
            payload,
            runtime_settings.ADMIN_SECRET_KEY,
            algorithm=ALGORITHM,
        )

        return success_response(
            message="Admin login successful",
            data={
                "access_token": token,
                "user": {
                    "id": admin_row["id"],
                    "uid": str(admin_row["id"]),
                    "email": admin_row["username"],
                    "username": admin_row["username"],
                    "role": "admin",
                },
            },
            access_token=token,
        )

    except HTTPException:
        conn.rollback()
        raise
    except Exception as exc:
        conn.rollback()
        logger.error("Admin login error: %s", exc)
        raise HTTPException(status_code=500, detail="Login failed") from exc
    finally:
        cursor.close()
        conn.close()


def verify_token(token: str):
    runtime_settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            runtime_settings.ADMIN_SECRET_KEY,
            algorithms=[ALGORITHM],
        )
        if not payload.get("sub"):
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = payload.get("id") or payload.get("uid") or payload.get("sub")
        if str(user_id).lower() in ROLE_NAMES:
            raise HTTPException(status_code=401, detail="Invalid token identity")

        payload["id"] = user_id
        payload["uid"] = str(user_id)
        payload.setdefault("email", payload.get("username", ""))
        payload.setdefault("role", "admin")
        return payload
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )


def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing",
        )

    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0] != "Bearer":
        raise HTTPException(
            status_code=401,
            detail="Invalid token format",
        )

    return verify_token(parts[1])

