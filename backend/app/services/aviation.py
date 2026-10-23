"""ASTRA Aviation Service

Business logic layer for aircraft monitoring and airspace queries.
"""

from typing import List, Optional, Tuple
from app.core.errors import EntityNotFoundError
from app.repositories.base import IAviationRepository
from app.schemas.aircraft import Aircraft, AircraftCategory
from app.schemas.common import BoundingBox


class AviationService:
    def __init__(self, repository: IAviationRepository):
        self._repo = repository

    async def list_aircraft(
        self,
        category: Optional[AircraftCategory] = None,
        bbox: Optional[BoundingBox] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Aircraft], int]:
        return await self._repo.list_aircraft(
            category=category,
            bbox=bbox,
            limit=limit,
            offset=offset,
        )

    async def get_aircraft(self, aircraft_id: str) -> Aircraft:
        aircraft = await self._repo.get_aircraft_by_id(aircraft_id)
        if not aircraft:
            raise EntityNotFoundError(entity_type="Aircraft", entity_id=aircraft_id)
        return aircraft
