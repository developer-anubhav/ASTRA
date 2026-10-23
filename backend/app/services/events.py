"""ASTRA Events Service

Business logic layer for global intelligence events and filtering.
"""

from typing import List, Optional, Tuple
from app.core.errors import EntityNotFoundError
from app.repositories.base import IEventsRepository
from app.schemas.events import GlobalEvent, EventCategory, EventSeverity
from app.schemas.common import BoundingBox


class EventsService:
    def __init__(self, repository: IEventsRepository):
        self._repo = repository

    async def list_events(
        self,
        category: Optional[EventCategory] = None,
        severity: Optional[EventSeverity] = None,
        bbox: Optional[BoundingBox] = None,
        query: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> Tuple[List[GlobalEvent], int]:
        return await self._repo.list_events(
            category=category,
            severity=severity,
            bbox=bbox,
            query=query,
            limit=limit,
            offset=offset,
        )

    async def get_event(self, event_id: str) -> GlobalEvent:
        event = await self._repo.get_event_by_id(event_id)
        if not event:
            raise EntityNotFoundError(entity_type="GlobalEvent", entity_id=event_id)
        return event
