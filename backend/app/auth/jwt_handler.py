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
        payload["id"] = user_id
        payload["uid"] = str(user_id)

    payload.setdefault("email", "")
    payload.setdefault("role", "customer")
    return payload


def get_current_user(authorization: str = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid token format")

    return verify_access_token(token)


def require_roles(*roles: str):
    def _dependency(user: dict = Depends(get_current_user)):
        if roles and user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user

    return _dependency
