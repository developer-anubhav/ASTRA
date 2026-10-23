"""ASTRA Backend Main Application

FastAPI entrypoint with lifespan events, CORS policies, structured logging,
and global exception handling.
"""

import time
import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.errors import (
    AstraException,
    astra_exception_handler,
    generic_exception_handler,
)
from app.api.router import api_router
from app.db.session import close_engine

logger = get_logger("app.main")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manages application startup and graceful shutdown."""
    setup_logging(log_level=settings.LOG_LEVEL)
    logger.info(
        "Starting ASTRA Global Intelligence API",
        extra={
            "environment": settings.ENVIRONMENT,
            "version": settings.VERSION,
            "demo_mode": settings.demo_mode,
        },
    )
    yield
    logger.info("Shutting down ASTRA Global Intelligence API...")
    await close_engine()
    logger.info("Shutdown complete.")


def create_app() -> FastAPI:
    """Factory function for FastAPI application instance."""
    app = FastAPI(
        title="ASTRA Global Intelligence API",
        description="Unified backend API foundation and CORTEX reasoning boundary for ASTRA.",
        version=settings.VERSION,
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        openapi_url="/openapi.json" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # Cross-Origin Resource Sharing (CORS)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    # Middleware: Request ID & Request Timing
    @app.middleware("http")
    async def request_logging_middleware(request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        start_time = time.perf_counter()

        try:
            response = await call_next(request)
            duration_ms = (time.perf_counter() - start_time) * 1000.0
            response.headers["X-Request-ID"] = request_id

            logger.info(
                f"{request.method} {request.url.path} -> {response.status_code} ({duration_ms:.2f}ms)",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "status_code": response.status_code,
                    "duration_ms": round(duration_ms, 2),
                },
            )
            return response
        except Exception as exc:
            duration_ms = (time.perf_counter() - start_time) * 1000.0
            logger.error(
                f"Unhandled exception during {request.method} {request.url.path}: {str(exc)}",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "duration_ms": round(duration_ms, 2),
                },
                exc_info=True,
            )
            raise

    # Validation Exception Handler
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "data": None,
                "error": "Request validation error",
                "details": exc.errors(),
                "is_demo": True,
            },
        )

    # Domain & Generic Exception Handlers
    app.add_exception_handler(AstraException, astra_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)

    # Mount versioned API routes
    app.include_router(api_router)

    # Root health/info probe for convenience
    @app.get("/", include_in_schema=False)
    async def root_probe():
        return {
            "name": "ASTRA Global Intelligence API",
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
            "status": "online",
            "docs": "/docs" if settings.DEBUG else "disabled",
        }

    return app


app = create_app()
