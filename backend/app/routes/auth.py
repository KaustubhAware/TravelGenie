from fastapi import APIRouter, HTTPException, Header
from jose import jwt, JWTError
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
from fastapi import Depends
from app.firebase_auth import verify_firebase_token
from app.db import get_connection
from app.config import get_settings
from app.responses import success_response

router = APIRouter(prefix="/admin")

# 🔐 CONFIG
settings = get_settings()
SECRET_KEY = settings.ADMIN_SECRET_KEY
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 2


# ================= MODELS =================
class LoginRequest(BaseModel):
    username: str
    password: str


# ================= ADMIN USER =================
ADMIN_USER = {
    "username": settings.ADMIN_USERNAME,
    "password": settings.ADMIN_PASSWORD
}


# ================= LOGIN =================
@router.post("/login")
def login(data: LoginRequest):

    if (
        data.username != ADMIN_USER["username"] or
        data.password != ADMIN_USER["password"]
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    payload = {
        "sub": data.username,
        "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return success_response(
        message="Admin login successful",
        data={"access_token": token},
        access_token=token
    )


# ================= VERIFY TOKEN =================
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ================= GET CURRENT USER =================
def get_current_user(authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    parts = authorization.split(" ")

    if len(parts) != 2 or parts[0] != "Bearer":
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = parts[1]

    return verify_token(token)

# ================= SAVE USER =================

@router.post("/save-user")
async def save_user(
    user=Depends(verify_firebase_token)
):

    uid = user["uid"]

    email = user["email"]

    conn = get_connection()

    cursor = conn.cursor()

    # CHECK EXISTING USER
    cursor.execute(
        """
        SELECT id
        FROM users
        WHERE firebase_uid = %s
        """,
        (uid,)
    )

    existing = cursor.fetchone()

    # INSERT USER
    if not existing:

        cursor.execute(
            """
            INSERT INTO users
            (
                firebase_uid,
                email
            )
            VALUES (%s, %s)
            """,
            (uid, email)
        )

        conn.commit()

    cursor.close()

    conn.close()

    return success_response(
        message="User saved",
        data={}
    )
