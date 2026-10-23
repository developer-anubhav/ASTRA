"""ASTRA Error Handling and Domain Exceptions

Defines standardized domain exceptions and consistent error envelopes.
"""

from typing import Optional, Any
from fastapi import Request, status
from fastapi.responses import JSONResponse


class AstraException(Exception):
    """Base exception for all ASTRA backend domain errors."""

    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST, details: Optional[Any] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details


class EntityNotFoundError(AstraException):
    def __init__(self, entity_type: str, entity_id: str):
        super().__init__(
            message=f"{entity_type} record not found with ID: {entity_id}",
            status_code=status.HTTP_404_NOT_FOUND,
        )


class ProviderUnavailableError(AstraException):
    def __init__(self, provider_name: str, domain: str):
        super().__init__(
            message=f"External intelligence provider '{provider_name}' for domain '{domain}' is currently unavailable or unconfigured.",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


class DatabaseUnavailableError(AstraException):
    def __init__(self, message: str = "Database connection unavailable"):
        super().__init__(
            message=message,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


async def astra_exception_handler(request: Request, exc: AstraException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "data": None,
            "error": exc.message,
            "is_demo": True,
            "details": exc.details,
        },
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    # Never leak internal stack traces or database errors in production
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "data": None,
            "error": "An internal situational processing error occurred.",
            "is_demo": True,
        },
    )
