"""ASTRA Global Events API Route

Endpoints for querying intelligence dispatches, factual corroboration, and crisis events.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path
from app.schemas.events import GlobalEvent, EventCategory, EventSeverity
from app.schemas.common import ServiceResult, BoundingBox
from app.services import EventsService, get_events_service
from app.core.config import settings

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=ServiceResult[List[GlobalEvent]])
async def list_events(
    category: Optional[EventCategory] = Query(None, description="Filter by event category"),
    severity: Optional[EventSeverity] = Query(None, description="Filter by severity level"),
    q: Optional[str] = Query(None, description="Search keyword in title or summary"),
    min_lat: Optional[float] = Query(None, ge=-90.0, le=90.0),
    max_lat: Optional[float] = Query(None, ge=-90.0, le=90.0),
    min_lon: Optional[float] = Query(None, ge=-180.0, le=180.0),
    max_lon: Optional[float] = Query(None, ge=-180.0, le=180.0),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    service: EventsService = Depends(get_events_service),
) -> ServiceResult[List[GlobalEvent]]:
    bbox = None
    if None not in (min_lat, max_lat, min_lon, max_lon):
        bbox = BoundingBox(
            min_lat=min_lat,  # type: ignore
            max_lat=max_lat,  # type: ignore
            min_lon=min_lon,  # type: ignore
            max_lon=max_lon,  # type: ignore
        )

    events, _ = await service.list_events(
        category=category,
        severity=severity,
        bbox=bbox,
        query=q,
        limit=limit,
        offset=offset,
    )

    return ServiceResult[List[GlobalEvent]](
        data=events,
        is_demo=settings.demo_mode or any(e.provenance == "demonstration" for e in events),
    )


@router.get("/{event_id}", response_model=ServiceResult[GlobalEvent])
async def get_event(
    event_id: str = Path(..., description="Unique event ID"),
    service: EventsService = Depends(get_events_service),
) -> ServiceResult[GlobalEvent]:
    event = await service.get_event(event_id)
    return ServiceResult[GlobalEvent](
        data=event,
        is_demo=settings.demo_mode or event.provenance == "demonstration",
    )
