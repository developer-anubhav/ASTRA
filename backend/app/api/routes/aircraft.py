"""ASTRA Aviation API Route

Endpoints for querying aircraft telemetry and airspace surveillance.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path
from app.schemas.aircraft import Aircraft, AircraftCategory
from app.schemas.common import ServiceResult, BoundingBox
from app.services import AviationService, get_aviation_service
from app.core.config import settings

router = APIRouter(prefix="/aircraft", tags=["Aviation"])


@router.get("", response_model=ServiceResult[List[Aircraft]])
async def list_aircraft(
    category: Optional[AircraftCategory] = Query(None, description="Filter by aircraft category"),
    min_lat: Optional[float] = Query(None, ge=-90.0, le=90.0),
    max_lat: Optional[float] = Query(None, ge=-90.0, le=90.0),
    min_lon: Optional[float] = Query(None, ge=-180.0, le=180.0),
    max_lon: Optional[float] = Query(None, ge=-180.0, le=180.0),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    service: AviationService = Depends(get_aviation_service),
) -> ServiceResult[List[Aircraft]]:
    bbox = None
    if None not in (min_lat, max_lat, min_lon, max_lon):
        bbox = BoundingBox(
            min_lat=min_lat,  # type: ignore
            max_lat=max_lat,  # type: ignore
            min_lon=min_lon,  # type: ignore
            max_lon=max_lon,  # type: ignore
        )

    aircraft_list, _ = await service.list_aircraft(
        category=category,
        bbox=bbox,
        limit=limit,
        offset=offset,
    )

    return ServiceResult[List[Aircraft]](
        data=aircraft_list,
        is_demo=settings.demo_mode or any(a.provenance == "demonstration" for a in aircraft_list),
    )


@router.get("/{aircraft_id}", response_model=ServiceResult[Aircraft])
async def get_aircraft(
    aircraft_id: str = Path(..., description="Unique aircraft ID, ICAO24 hex code, or callsign"),
    service: AviationService = Depends(get_aviation_service),
) -> ServiceResult[Aircraft]:
    aircraft = await service.get_aircraft(aircraft_id)
    return ServiceResult[Aircraft](
        data=aircraft,
        is_demo=settings.demo_mode or aircraft.provenance == "demonstration",
    )
