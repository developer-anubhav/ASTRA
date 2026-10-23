"""ASTRA Maritime Service

Business logic layer for vessel tracking, filtering, and detail extraction.
"""

from typing import List, Optional, Tuple
from app.core.errors import EntityNotFoundError
from app.repositories.base import IMaritimeRepository
from app.schemas.maritime import Vessel, VesselType
from app.schemas.common import BoundingBox


class MaritimeService:
    def __init__(self, repository: IMaritimeRepository):
        self._repo = repository

    async def list_vessels(
        self,
        vessel_type: Optional[VesselType] = None,
        bbox: Optional[BoundingBox] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[Vessel], int]:
        return await self._repo.list_vessels(
            vessel_type=vessel_type,
            bbox=bbox,
            limit=limit,
            offset=offset,
        )

    async def get_vessel(self, vessel_id: str) -> Vessel:
        vessel = await self._repo.get_vessel_by_id(vessel_id)
        if not vessel:
            raise EntityNotFoundError(entity_type="Vessel", entity_id=vessel_id)
        return vessel
