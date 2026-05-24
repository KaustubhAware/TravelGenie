import logging

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, Header
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.firebase_auth import verify_firebase_token
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
            "sub": admin_row["username"],
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
            data={"access_token": token},
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
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if not payload.get("sub"):
            raise HTTPException(status_code=401, detail="Invalid token")
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


@router.post("/save-user")
async def save_user(user=Depends(verify_firebase_token)):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        ensure_user_columns(cursor)

        firebase_uid = user["uid"]
        email = user.get("email") or ""
        display_name = (
            user.get("name")
            or user.get("displayName")
            or user.get("display_name")
            or "Traveler"
        )

        cursor.execute(
            """
            SELECT id FROM users WHERE firebase_uid = %s
            """,
            (firebase_uid,),
        )
        existing = cursor.fetchone()

        if not existing:
            cursor.execute(
                """
                INSERT INTO users (
                    firebase_uid, name, full_name, email, role
                )
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    firebase_uid,
                    display_name,
                    display_name,
                    email,
                    "customer",
                ),
            )
            conn.commit()
            logger.info("User saved: %s", firebase_uid)
        else:
            cursor.execute(
                """
                UPDATE users
                SET
                    name = COALESCE(NULLIF(%s, ''), name),
                    full_name = COALESCE(NULLIF(%s, ''), full_name),
                    email = COALESCE(NULLIF(%s, ''), email),
                    updated_at = CURRENT_TIMESTAMP
                WHERE firebase_uid = %s
                """,
                (display_name, display_name, email, firebase_uid),
            )
            conn.commit()

        return success_response(
            message="User saved successfully",
            data={"firebase_uid": firebase_uid, "email": email},
        )

    except HTTPException:
        conn.rollback()
        raise
    except Exception as exc:
        conn.rollback()
        logger.error("Save user error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        cursor.close()
        conn.close()
