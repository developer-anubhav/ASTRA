"""ASTRA Maritime API Route

Endpoints for querying tracked vessels and positional histories.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path
from app.schemas.maritime import Vessel, VesselType
from app.schemas.common import ServiceResult, BoundingBox
from app.services import MaritimeService, get_maritime_service
from app.core.config import settings

router = APIRouter(prefix="/maritime", tags=["Maritime"])


@router.get("", response_model=ServiceResult[List[Vessel]])
async def list_vessels(
    vessel_type: Optional[VesselType] = Query(None, description="Filter by vessel category"),
    min_lat: Optional[float] = Query(None, ge=-90.0, le=90.0),
    max_lat: Optional[float] = Query(None, ge=-90.0, le=90.0),
    min_lon: Optional[float] = Query(None, ge=-180.0, le=180.0),
    max_lon: Optional[float] = Query(None, ge=-180.0, le=180.0),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    service: MaritimeService = Depends(get_maritime_service),
) -> ServiceResult[List[Vessel]]:
    bbox = None
    if None not in (min_lat, max_lat, min_lon, max_lon):
        bbox = BoundingBox(
            min_lat=min_lat,  # type: ignore
            max_lat=max_lat,  # type: ignore
            min_lon=min_lon,  # type: ignore
            max_lon=max_lon,  # type: ignore
        )

    vessels, _ = await service.list_vessels(
        vessel_type=vessel_type,
        bbox=bbox,
        limit=limit,
        offset=offset,
    )

    return ServiceResult[List[Vessel]](
        data=vessels,
        is_demo=settings.demo_mode or any(v.provenance == "demonstration" for v in vessels),
    )


@router.get("/{vessel_id}", response_model=ServiceResult[Vessel])
async def get_vessel(
    vessel_id: str = Path(..., description="Unique vessel ID or MMSI"),
    service: MaritimeService = Depends(get_maritime_service),
) -> ServiceResult[Vessel]:
    vessel = await service.get_vessel(vessel_id)
    return ServiceResult[Vessel](
        data=vessel,
        is_demo=settings.demo_mode or vessel.provenance == "demonstration",
    )
