"""ASTRA Sources Service

Business logic layer for external data provider registry and telemetry.
"""

from typing import List, Optional
from app.core.errors import EntityNotFoundError
from app.repositories.base import ISourcesRepository
from app.schemas.sources import DataSource, SourceDomain


class SourcesService:
    def __init__(self, repository: ISourcesRepository):
        self._repo = repository

    async def list_sources(
        self,
        domain: Optional[SourceDomain] = None,
    ) -> List[DataSource]:
        return await self._repo.list_sources(domain=domain)

    async def get_source(self, source_id: str) -> DataSource:
        source = await self._repo.get_source_by_id(source_id)
        if not source:
            raise EntityNotFoundError(entity_type="DataSource", entity_id=source_id)
        return source
