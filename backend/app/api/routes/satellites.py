"""ASTRA Space API Route

Endpoints for querying catalogued satellites and Keplerian orbital parameters.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path
from app.schemas.satellites import Satellite, SatelliteType
from app.schemas.common import ServiceResult
from app.services import SpaceService, get_space_service
from app.core.config import settings

router = APIRouter(prefix="/satellites", tags=["Space"])


@router.get("", response_model=ServiceResult[List[Satellite]])
async def list_satellites(
    sat_type: Optional[SatelliteType] = Query(None, description="Filter by satellite constellation or mission type"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    service: SpaceService = Depends(get_space_service),
) -> ServiceResult[List[Satellite]]:
    satellites, _ = await service.list_satellites(
        sat_type=sat_type,
        limit=limit,
        offset=offset,
    )

    return ServiceResult[List[Satellite]](
        data=satellites,
        is_demo=settings.demo_mode or any(s.provenance == "demonstration" for s in satellites),
    )


@router.get("/{satellite_id}", response_model=ServiceResult[Satellite])
async def get_satellite(
    satellite_id: str = Path(..., description="Unique satellite ID or NORAD Catalog ID"),
    service: SpaceService = Depends(get_space_service),
) -> ServiceResult[Satellite]:
    satellite = await service.get_satellite(satellite_id)
    return ServiceResult[Satellite](
        data=satellite,
        is_demo=settings.demo_mode or satellite.provenance == "demonstration",
    )
