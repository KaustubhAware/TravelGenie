import os

from functools import lru_cache

from pathlib import Path

from dotenv import load_dotenv

# =====================================================
# LOAD ENV
# =====================================================

_env_path = Path(__file__).resolve().parents[1] / ".env"

if not _env_path.exists():

    _env_path = (
        Path(__file__).resolve().parents[2] / ".env"
    )

load_dotenv(_env_path)

# =====================================================
# SETTINGS
# =====================================================

class Settings:

    APP_NAME = os.getenv(
        "APP_NAME",
        "TravelGenie API"
    )

    APP_VERSION = os.getenv(
        "APP_VERSION",
        "1.0.0"
    )

    ENVIRONMENT = os.getenv(
        "ENVIRONMENT",
        "development"
    )

    API_PREFIX = os.getenv(
        "API_PREFIX",
        "/api"
    )

    # =====================================================
    # FRONTEND
    # =====================================================

    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )

    # =====================================================
    # DATABASE
    # =====================================================

    DB_HOST = os.getenv(
        "DB_HOST",
        "localhost"
    )

    DB_NAME = os.getenv(
        "DB_NAME",
        "travelgenie"
    )

    DB_USER = os.getenv(
        "DB_USER",
        "postgres"
    )

    DB_PASSWORD = os.getenv(
        "DB_PASSWORD",
        "root"
    )

    DB_PORT = os.getenv(
        "DB_PORT",
        "5432"
    )

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        ""
    )

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        os.getenv("ADMIN_SECRET_KEY", "MYSECRET123")
    )

    # =====================================================
    # ADMIN
    # =====================================================

    ADMIN_SECRET_KEY = os.getenv(
        "ADMIN_SECRET_KEY",
        "MYSECRET123"
    )

    ADMIN_USERNAME = os.getenv(
        "ADMIN_USERNAME",
        "admin"
    )

    ADMIN_PASSWORD = os.getenv(
        "ADMIN_PASSWORD",
        "admin123"
    )

    # =====================================================
    # GEMINI
    # =====================================================

    GEMINI_API_KEY = os.getenv(
        "GEMINI_API_KEY",
        ""
    )

    GEMINI_ITINERARY_API_KEY = os.getenv(
        "GEMINI_ITINERARY_API_KEY",
        os.getenv("GEMINI_API_KEY", ""),
    )

    GEMINI_CHAT_API_KEY = os.getenv(
        "GEMINI_CHAT_API_KEY",
        os.getenv("GEMINI_API_KEY", ""),
    )

    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL",
        "gemini-1.5-flash"
    )

    GEMINI_FALLBACK_MODEL = os.getenv(
        "GEMINI_FALLBACK_MODEL",
        "gemini-1.5-flash-8b",
    )

    # =====================================================
    # CLOUDINARY
    # =====================================================

    CLOUDINARY_URL = os.getenv(
        "CLOUDINARY_URL",
        ""
    )

    UPLOAD_DIR = os.getenv(
        "UPLOAD_DIR",
        str(Path(__file__).resolve().parents[1] / "uploads")
    )

    # =====================================================
    # RAZORPAY
    # IMPORTANT
    # =====================================================

    RAZORPAY_KEY_ID = os.getenv(
        "RAZORPAY_KEY_ID",
        ""
    )

    RAZORPAY_KEY_SECRET = os.getenv(
        "RAZORPAY_KEY_SECRET",
        ""
    )

    # =====================================================
    # HELPERS
    # =====================================================

    @property
    def cors_origin_list(self):

        return [

            origin.strip()

            for origin in self.CORS_ORIGINS.split(",")

            if origin.strip()

        ]

    # =====================================================
    # VALIDATION
    # =====================================================

    def validate(self):

        missing = []

        if self.ENVIRONMENT == "production":

            required = {

                "ADMIN_SECRET_KEY":
                    self.ADMIN_SECRET_KEY,

                "JWT_SECRET_KEY":
                    self.JWT_SECRET_KEY,

                "DB_PASSWORD":
                    self.DB_PASSWORD,

                "RAZORPAY_KEY_ID":
                    self.RAZORPAY_KEY_ID,

                "RAZORPAY_KEY_SECRET":
                    self.RAZORPAY_KEY_SECRET,

            }

            missing = [

                key

                for key, value in required.items()

                if not value or value in {
                    "MYSECRET123",
                    "root",
                }

            ]

            if (
                not self.GEMINI_ITINERARY_API_KEY
                and
                not self.GEMINI_CHAT_API_KEY
            ):

                missing.append(
                    "GEMINI_ITINERARY_API_KEY or GEMINI_CHAT_API_KEY"
                )

        return missing

# =====================================================
# CACHE
# =====================================================

@lru_cache
def get_settings():

    return Settings()
