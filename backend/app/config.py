import os
from functools import lru_cache
from pathlib import Path


class Settings:
    APP_NAME = os.getenv("APP_NAME", "TravelGenie API")
    APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    API_PREFIX = os.getenv("API_PREFIX", "/api")

    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )

    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_NAME = os.getenv("DB_NAME", "travelgenie")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
    DB_PORT = os.getenv("DB_PORT", "5432")

    ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "MYSECRET123")
    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH", "")

    @property
    def cors_origin_list(self):
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    @property
    def firebase_key_path(self):
        if self.FIREBASE_KEY_PATH:
            return Path(self.FIREBASE_KEY_PATH)

        return Path(__file__).resolve().parent.parent / "firebase_key.json"

    def validate(self):
        missing = []

        if self.ENVIRONMENT == "production":
            required = {
                "ADMIN_SECRET_KEY": self.ADMIN_SECRET_KEY,
                "GEMINI_API_KEY": self.GEMINI_API_KEY,
                "DB_PASSWORD": self.DB_PASSWORD,
            }

            missing = [
                key
                for key, value in required.items()
                if not value or value in {"MYSECRET123", "root"}
            ]

        return missing


@lru_cache
def get_settings():
    return Settings()
