import firebase_admin

from firebase_admin import (
    credentials,
    auth
)

from fastapi import (
    Header,
    HTTPException
)

from pathlib import Path
from app.config import get_settings

# ============================================
# ABSOLUTE FIREBASE KEY PATH
# ============================================

settings = get_settings()

FIREBASE_KEY_PATH = settings.firebase_key_path

if settings.ENVIRONMENT != "production":
    print("\nFIREBASE KEY PATH:\n", FIREBASE_KEY_PATH)

# ============================================
# INITIALIZE FIREBASE
# ============================================

if not firebase_admin._apps:

    try:

        cred = credentials.Certificate(
            str(FIREBASE_KEY_PATH)
        )

        firebase_admin.initialize_app(
            cred
        )

        if settings.ENVIRONMENT != "production":
            print("\nFIREBASE INITIALIZED SUCCESSFULLY\n")

    except Exception as e:

        print("\nFIREBASE INIT ERROR:\n", str(e))

# ============================================
# VERIFY FIREBASE TOKEN
# ============================================

def verify_firebase_token(
    authorization: str = Header(None)
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Missing token"
        )

    try:

        parts = authorization.split(" ")

        if len(parts) != 2:

            raise HTTPException(
                status_code=401,
                detail="Invalid token format"
            )

        token = parts[1]

        decoded_token = auth.verify_id_token(
            token
        )

        if settings.ENVIRONMENT != "production":
            print("\nTOKEN VERIFIED SUCCESSFULLY\n")

        return decoded_token

    except Exception as e:

        print(
            "\nFIREBASE VERIFY ERROR:\n",
            str(e)
        )

        raise HTTPException(
            status_code=401,
            detail=f"Firebase Error: {str(e)}"
        )
