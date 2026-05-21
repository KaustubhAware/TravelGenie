from fastapi import (
    APIRouter,
    HTTPException,
    Header,
    Depends,
)

from jose import (
    jwt,
    JWTError,
)

from datetime import (
    datetime,
    timedelta,
)

from pydantic import BaseModel

from app.firebase_auth import (
    verify_firebase_token,
)

from app.db import get_connection

from app.config import get_settings

from app.responses import success_response


router = APIRouter(prefix="/admin")


# =====================================================
# CONFIG
# =====================================================

settings = get_settings()

SECRET_KEY = settings.ADMIN_SECRET_KEY

ALGORITHM = "HS256"

TOKEN_EXPIRE_HOURS = 2


# =====================================================
# ADMIN MODEL
# =====================================================

class LoginRequest(BaseModel):

    username: str

    password: str


# =====================================================
# ADMIN USER
# =====================================================

ADMIN_USER = {

    "username":
        settings.ADMIN_USERNAME,

    "password":
        settings.ADMIN_PASSWORD,

}


# =====================================================
# ADMIN LOGIN
# =====================================================

@router.post("/login")
def login(data: LoginRequest):

    if (

        data.username != ADMIN_USER["username"]

        or

        data.password != ADMIN_USER["password"]

    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    payload = {

        "sub":
            data.username,

        "exp":
            datetime.utcnow()

            +

            timedelta(
                hours=TOKEN_EXPIRE_HOURS
            )

    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return success_response(

        message="Admin login successful",

        data={
            "access_token": token
        },

        access_token=token

    )


# =====================================================
# VERIFY ADMIN TOKEN
# =====================================================

def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


# =====================================================
# GET CURRENT ADMIN
# =====================================================

def get_current_user(
    authorization: str = Header(None)
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    parts = authorization.split(" ")

    if (

        len(parts) != 2

        or

        parts[0] != "Bearer"

    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid token format"
        )

    token = parts[1]

    return verify_token(token)


# =====================================================
# ENSURE USER COLUMNS
# =====================================================

def ensure_user_columns(cursor):

    cursor.execute(
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS name VARCHAR(120),
        ADD COLUMN IF NOT EXISTS role VARCHAR(40) DEFAULT 'user',
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """
    )


# =====================================================
# SAVE FIREBASE USER
# =====================================================

@router.post("/save-user")
async def save_user(

    user=Depends(
        verify_firebase_token
    )

):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        ensure_user_columns(cursor)

        firebase_uid = user["uid"]

        email = user.get(
            "email",
            ""
        )

        name = user.get(
            "name",
            "Traveler"
        )

        print(
            "FIREBASE USER:",
            firebase_uid,
            email
        )

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE firebase_uid = %s
            """,
            (firebase_uid,)
        )

        existing = cursor.fetchone()

        # CREATE USER

        if not existing:

            cursor.execute(
                """
                INSERT INTO users
                (
                    firebase_uid,
                    name,
                    email,
                    role
                )

                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s
                )
                """,
                (
                    firebase_uid,
                    name,
                    email,
                    "user"
                )
            )

            conn.commit()

            print(
                "USER SAVED"
            )

        else:

            print(
                "USER ALREADY EXISTS"
            )

        return success_response(

            message="User saved successfully",

            data={

                "firebase_uid":
                    firebase_uid,

                "email":
                    email,

            }

        )

    except Exception as e:

        conn.rollback()

        print(
            "SAVE USER ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        cursor.close()

        conn.close()