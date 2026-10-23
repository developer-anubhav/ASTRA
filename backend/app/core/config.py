"""ASTRA Backend Configuration

Centralized, typed configuration using Pydantic Settings.
Never exposes credentials or uses unsafe production defaults.
"""

from typing import List, Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application identity
    APP_NAME: str = "ASTRA Intelligence Engine"
    APP_VERSION: str = "0.2.0"
    APP_ENV: str = Field(default="development", description="development | staging | production")
    DEBUG: bool = Field(default=False)

    # Server binding
    API_HOST: str = Field(default="0.0.0.0")
    API_PORT: int = Field(default=8000)
    API_V1_PREFIX: str = Field(default="/api/v1")

    # Security & CORS
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"],
        description="Allowed frontend origin URLs for CORS",
    )

    # Database (PostgreSQL / PostGIS)
    # If None or connection fails, application runs in explicitly degraded demo mode.
    DATABASE_URL: Optional[str] = Field(
        default=None,
        description="PostgreSQL/PostGIS connection string: postgresql+asyncpg://user:pass@host:5432/dbname",
    )
    DATABASE_POOL_SIZE: int = Field(default=5)
    DATABASE_MAX_OVERFLOW: int = Field(default=10)
    DATABASE_TIMEOUT_SECONDS: float = Field(default=5.0)

    # Operational Mode
    DEMO_MODE: bool = Field(
        default=True,
        description="When True, fallback demonstration fixtures are served if live providers or DB are absent",
    )
    CORTEX_REASONING_MODE: str = Field(
        default="demonstration",
        description="demonstration | live | unavailable",
    )

    # Logging
    LOG_LEVEL: str = Field(default="INFO")
    STRUCTURED_LOGGING: bool = Field(default=True)

    @property
    def VERSION(self) -> str:
        return self.APP_VERSION

    @property
    def ENVIRONMENT(self) -> str:
        return self.APP_ENV

    @property
    def demo_mode(self) -> bool:
        return self.DEMO_MODE

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    @field_validator("APP_ENV")
    @classmethod
    def validate_env(cls, v: str) -> str:
        valid = {"development", "staging", "production", "test"}
        if v.lower() not in valid:
            raise ValueError(f"APP_ENV must be one of {valid}")
        return v.lower()


settings = Settings()
