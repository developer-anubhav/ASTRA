"""ASTRA Space Service

Business logic layer for satellite orbital tracking and catalog lookup.
"""

from typing import List, Optional, Tuple
from app.core.errors import EntityNotFoundError
from app.repositories.base import ISpaceRepository
from app.schemas.satellites import Satellite, SatelliteType


class SpaceService:
    def __init__(self, repository: ISpaceRepository):
        self._repo = repository

    async def list_satellites(
        self,
        sat_type: Optional[SatelliteType] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Satellite], int]:
        return await self._repo.list_satellites(
            sat_type=sat_type,
            limit=limit,
            offset=offset,
        )

    async def get_satellite(self, satellite_id: str) -> Satellite:
        satellite = await self._repo.get_satellite_by_id(satellite_id)
        if not satellite:
            raise EntityNotFoundError(entity_type="Satellite", entity_id=satellite_id)
        return satellite
