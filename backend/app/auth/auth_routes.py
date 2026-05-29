import logging

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
)

from psycopg2.extras import (
    RealDictCursor,
)

from app.auth.jwt_handler import (
    create_access_token,
    get_current_user,
)

from app.auth.password_utils import (
    hash_password,
    verify_password,
)

from app.db import get_connection

from app.responses import (
    success_response,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

# =====================================================
# CONSTANTS
# =====================================================

MAX_PASSWORD_LENGTH = 72

# =====================================================
# REQUEST MODELS
# =====================================================


class RegisterRequest(BaseModel):

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
        max_length=128,
    )

    full_name: str | None = Field(
        default=None,
        max_length=160,
    )


class LoginRequest(BaseModel):

    email: EmailStr

    password: str = Field(
        ...,
        min_length=1,
        max_length=128,
    )

# =====================================================
# TOKEN HELPER
# =====================================================


def _token_for_user(user: dict) -> str:

    return create_access_token(
        {
            "sub": str(user["id"]),
            "id": user["id"],
            "uid": str(user["id"]),
            "email": user["email"],
            "role": user.get("role") or "customer",
            "is_vendor": bool(user.get("is_vendor")),
            "vendor_status": user.get("vendor_status") or "none",
        }
    )

# =====================================================
# REGISTER
# =====================================================


@router.post("/register")
def register(data: RegisterRequest):

    conn = get_connection()

    cursor = conn.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        email = data.email.lower().strip()

        password = data.password.strip()

        if len(password.encode("utf-8")) > MAX_PASSWORD_LENGTH:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Password too long. "
                    "Maximum supported length is 72 bytes."
                ),
            )

        full_name = (
            data.full_name
            or email.split("@")[0]
        ).strip()

        # =================================================
        # CHECK EXISTING USER
        # =================================================

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE LOWER(email) = LOWER(%s)
            LIMIT 1
            """,
            (email,),
        )

        existing_user = cursor.fetchone()

        if existing_user:

            raise HTTPException(
                status_code=409,
                detail="Email already registered",
            )

        # =================================================
        # HASH PASSWORD
        # =================================================

        hashed_password = hash_password(
            password
        )

        # =================================================
        # INSERT USER
        # =================================================

        cursor.execute(
            """
            INSERT INTO users (
                email,
                password_hash,
                name,
                full_name,
                role,
                profile_completed
            )
            VALUES (
                %s,
                %s,
                %s,
                %s,
                'customer',
                FALSE
            )
            RETURNING
                id,
                email,
                full_name,
                role
            """,
            (
                email,
                hashed_password,
                full_name,
                full_name,
            ),
        )

        user = dict(cursor.fetchone())

        conn.commit()

        # =================================================
        # JWT TOKEN
        # =================================================

        token = _token_for_user(user)

        return success_response(
            message="Registration successful",
            data={
                "user": user,
                "access_token": token,
            },
            access_token=token,
        )

    except HTTPException:

        conn.rollback()

        raise

    except Exception as exc:

        conn.rollback()

        logger.exception(
            "User registration failed"
        )

        raise HTTPException(
            status_code=500,
            detail="Registration failed",
        ) from exc

    finally:

        cursor.close()

        conn.close()

# =====================================================
# LOGIN
# =====================================================


@router.post("/login")
def login(data: LoginRequest):

    conn = get_connection()

    cursor = conn.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        email = data.email.lower().strip()

        password = data.password.strip()

        # =================================================
        # FETCH USER
        # =================================================

        cursor.execute(
            """
            SELECT
                id,
                email,
                full_name,
                role,
                password_hash,
                is_deleted,
                COALESCE(is_vendor, FALSE) AS is_vendor,
                COALESCE(vendor_status, 'none') AS vendor_status
            FROM users
            WHERE LOWER(email) = LOWER(%s)
            LIMIT 1
            """,
            (email,),
        )

        user = cursor.fetchone()

        # =================================================
        # USER NOT FOUND
        # =================================================

        if not user:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        # =================================================
        # DELETED USER
        # =================================================

        if user.get("is_deleted"):

            raise HTTPException(
                status_code=403,
                detail="Account is deactivated",
            )

        if (
            (user.get("role") == "vendor" or user.get("is_vendor"))
            and user.get("vendor_status") != "approved"
        ):

            raise HTTPException(
                status_code=403,
                detail=(
                    "Your vendor account is currently under review by "
                    "TravelGenie administration."
                ),
            )

        # =================================================
        # PASSWORD CHECK
        # =================================================

        stored_hash = user.get(
            "password_hash"
        )

        if not stored_hash:

            raise HTTPException(
                status_code=500,
                detail=(
                    "User password hash missing"
                ),
            )

        password_valid = verify_password(
            password,
            stored_hash,
        )

        if not password_valid:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        # =================================================
        # PUBLIC USER
        # =================================================

        public_user = {
            "id": user["id"],
            "email": user["email"],
            "full_name": user.get(
                "full_name"
            ),
            "role": user.get("role")
            or "customer",
            "is_vendor": bool(user.get("is_vendor")),
            "vendor_status": user.get("vendor_status") or "none",
        }

        # =================================================
        # CREATE JWT
        # =================================================

        token = _token_for_user(
            public_user
        )

        return success_response(
            message="Login successful",
            data={
                "user": public_user,
                "access_token": token,
            },
            access_token=token,
        )

    except HTTPException:

        raise

    except Exception as exc:

        logger.exception(
            "User login failed"
        )

        raise HTTPException(
            status_code=500,
            detail="Login failed",
        ) from exc

    finally:

        cursor.close()

        conn.close()

# =====================================================
# CURRENT USER
# =====================================================


@router.get("/me")
def me(
    user=Depends(
        get_current_user
    )
):

    return success_response(
        message="Authenticated user",
        data={"user": user},
    )
