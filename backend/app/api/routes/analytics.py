"""ASTRA Analytics API Route

Endpoints for aggregated cross-domain situational awareness metrics and trends.
"""

from fastapi import APIRouter, Depends
from app.schemas.analytics import AnalyticsSummary
from app.schemas.common import ServiceResult
from app.services import AnalyticsService, get_analytics_service
from app.core.config import settings

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=ServiceResult[AnalyticsSummary])
async def get_overview(
    service: AnalyticsService = Depends(get_analytics_service),
) -> ServiceResult[AnalyticsSummary]:
    summary = await service.get_overview()
    return ServiceResult[AnalyticsSummary](
        data=summary,
        is_demo=settings.demo_mode or summary.provenance == "demonstration",
    )
