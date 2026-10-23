"""ASTRA Analytics Service

Business logic layer for cross-domain situational awareness metrics.
"""

from app.repositories.base import IAnalyticsRepository
from app.schemas.analytics import AnalyticsSummary


class AnalyticsService:
    def __init__(self, repository: IAnalyticsRepository):
        self._repo = repository

    async def get_overview(self) -> AnalyticsSummary:
        return await self._repo.get_overview()
