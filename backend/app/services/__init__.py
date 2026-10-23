"""ASTRA Services Package and Dependency Injection Providers"""

from fastapi import Depends

from app.repositories import (
    get_maritime_repo,
    get_aviation_repo,
    get_space_repo,
    get_events_repo,
    get_sources_repo,
    get_analytics_repo,
    IMaritimeRepository,
    IAviationRepository,
    ISpaceRepository,
    IEventsRepository,
    ISourcesRepository,
    IAnalyticsRepository,
)
from app.services.maritime import MaritimeService
from app.services.aviation import AviationService
from app.services.space import SpaceService
from app.services.events import EventsService
from app.services.sources import SourcesService
from app.services.analytics import AnalyticsService
from app.services.assistant import CortexAssistantService


def get_maritime_service(
    repo: IMaritimeRepository = Depends(get_maritime_repo),
) -> MaritimeService:
    return MaritimeService(repo)


def get_aviation_service(
    repo: IAviationRepository = Depends(get_aviation_repo),
) -> AviationService:
    return AviationService(repo)


def get_space_service(
    repo: ISpaceRepository = Depends(get_space_repo),
) -> SpaceService:
    return SpaceService(repo)


def get_events_service(
    repo: IEventsRepository = Depends(get_events_repo),
) -> EventsService:
    return EventsService(repo)


def get_sources_service(
    repo: ISourcesRepository = Depends(get_sources_repo),
) -> SourcesService:
    return SourcesService(repo)


def get_analytics_service(
    repo: IAnalyticsRepository = Depends(get_analytics_repo),
) -> AnalyticsService:
    return AnalyticsService(repo)


def get_assistant_service(
    maritime_repo: IMaritimeRepository = Depends(get_maritime_repo),
    aviation_repo: IAviationRepository = Depends(get_aviation_repo),
    space_repo: ISpaceRepository = Depends(get_space_repo),
    events_repo: IEventsRepository = Depends(get_events_repo),
    sources_repo: ISourcesRepository = Depends(get_sources_repo),
) -> CortexAssistantService:
    return CortexAssistantService(
        maritime_repo,
        aviation_repo,
        space_repo,
        events_repo,
        sources_repo,
    )


__all__ = [
    "MaritimeService",
    "AviationService",
    "SpaceService",
    "EventsService",
    "SourcesService",
    "AnalyticsService",
    "CortexAssistantService",
    "get_maritime_service",
    "get_aviation_service",
    "get_space_service",
    "get_events_service",
    "get_sources_service",
    "get_analytics_service",
    "get_assistant_service",
]
