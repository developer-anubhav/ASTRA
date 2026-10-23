"""ASTRA Health API Route

Reports system health, database readiness, and operational mode without leaking secrets.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, status
from app.core.config import settings
from app.db.session import check_db_health
from app.schemas.common import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def get_health() -> HealthResponse:
    """Returns application health status and database connectivity."""
    db_ok, db_msg, db_details = await check_db_health()

    # If database is configured but failing, mark as degraded; otherwise healthy
    overall_status = "healthy"
    if settings.DATABASE_URL and not db_ok:
        overall_status = "degraded"

    return HealthResponse(
        status=overall_status,  # type: ignore
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc),
        database={
            "status": "connected" if db_ok else "unreachable" if settings.DATABASE_URL else "unconfigured",
            "message": db_msg,
            **db_details,
        },
        services={
            "maritime": "operational",
            "aviation": "operational",
            "space": "operational",
            "events": "operational",
            "cortex": "operational (demonstration mode)" if settings.demo_mode else "operational",
            "demo_mode": settings.demo_mode,
        },
    )
