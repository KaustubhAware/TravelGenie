from datetime import datetime, timedelta

from fastapi import Depends, Header, HTTPException
from jose import JWTError, jwt

from app.config import get_settings

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24
ROLE_NAMES = {"admin", "vendor", "customer", "agent", "user"}


def create_access_token(payload: dict, expires_hours: int = ACCESS_TOKEN_EXPIRE_HOURS) -> str:
    settings = get_settings()
    token_payload = payload.copy()
    token_payload["exp"] = datetime.utcnow() + timedelta(hours=expires_hours)
    return jwt.encode(token_payload, settings.JWT_SECRET_KEY, algorithm=ALGORITHM)


def verify_access_token(token: str) -> dict:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc

    if not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("id") or payload.get("uid") or payload.get("sub")
    if str(user_id).lower() in ROLE_NAMES:
        raise HTTPException(status_code=401, detail="Invalid token identity")

    if user_id is not None:
        try:
            normalized_user_id = int(user_id)
        except (TypeError, ValueError) as exc:
            raise HTTPException(status_code=401, detail="Invalid token identity") from exc

        payload["id"] = normalized_user_id
        payload["uid"] = str(normalized_user_id)

    payload.setdefault("email", "")
    payload.setdefault("role", "customer")
    return payload


def get_current_user(authorization: str = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid token format")

    payload = verify_access_token(token)

    # Tokens prove identity, but PostgreSQL remains the source of truth for
    # deleted accounts and role changes.
    from app.db import get_connection

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT
                id, email, full_name, role, COALESCE(is_deleted, FALSE),
                COALESCE(is_vendor, FALSE), COALESCE(vendor_status, 'none')
            FROM users
            WHERE id = %s
            LIMIT 1
            """,
            (payload["id"],),
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="User no longer exists")
        if row[4]:
            raise HTTPException(status_code=403, detail="Account is deactivated")

        payload["id"] = row[0]
        payload["uid"] = str(row[0])
        payload["email"] = row[1] or payload.get("email", "")
        payload["full_name"] = row[2]
        payload["role"] = row[3] or "customer"
        payload["is_vendor"] = bool(row[5])
        payload["vendor_status"] = row[6]
        return payload
    finally:
        cursor.close()
        conn.close()


def require_roles(*roles: str):
    def _dependency(user: dict = Depends(get_current_user)):
        if roles and user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user

    return _dependency
