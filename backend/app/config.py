"""Application configuration settings module.

Loads environment variables using Pydantic Settings with strong typing,
sensible defaults for local development, and production overrides.
"""

import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration parameters for GamePulse Analytics API."""

    APP_NAME: str = "GamePulse Analytics API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database connection string:
    # Defaults to local SQLite for zero-configuration setup,
    # or PostgreSQL in containerized/production environments.
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./gaming_activity.db")

    # Allowed CORS Origins for cross-origin frontend requests
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost",
        "http://127.0.0.1",
        "*"
    ]

    # File upload constraints (in Megabytes)
    MAX_UPLOAD_SIZE_MB: int = 15

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
