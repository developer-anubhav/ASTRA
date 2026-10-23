"""ASTRA Repository Provider and Factory

Dependency injection providers for maritime, aviation, space, events, sources, and analytics repositories.
"""

from typing import Optional
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db_session
from app.repositories.base import (
    IMaritimeRepository,
    IAviationRepository,
    ISpaceRepository,
    IEventsRepository,
    ISourcesRepository,
    IAnalyticsRepository,
)
from app.repositories.in_memory import (
    InMemoryMaritimeRepository,
    InMemoryAviationRepository,
    InMemorySpaceRepository,
    InMemoryEventsRepository,
    InMemorySourcesRepository,
    InMemoryAnalyticsRepository,
)
from app.repositories.db_repository import (
    DatabaseMaritimeRepository,
    DatabaseAviationRepository,
    DatabaseSpaceRepository,
    DatabaseEventsRepository,
    DatabaseSourcesRepository,
)

# Singleton in-memory repositories for demonstration and development fallback
_in_memory_maritime = InMemoryMaritimeRepository()
_in_memory_aviation = InMemoryAviationRepository()
_in_memory_space = InMemorySpaceRepository()
_in_memory_events = InMemoryEventsRepository()
_in_memory_sources = InMemorySourcesRepository()
_in_memory_analytics = InMemoryAnalyticsRepository(
    _in_memory_maritime,
    _in_memory_aviation,
    _in_memory_space,
    _in_memory_events,
    _in_memory_sources,
)


async def get_maritime_repo(
    session: Optional[AsyncSession] = Depends(get_db_session),
) -> IMaritimeRepository:
    if settings.demo_mode or session is None:
        return _in_memory_maritime
    return DatabaseMaritimeRepository(session)


async def get_aviation_repo(
    session: Optional[AsyncSession] = Depends(get_db_session),
) -> IAviationRepository:
    if settings.demo_mode or session is None:
        return _in_memory_aviation
    return DatabaseAviationRepository(session)


async def get_space_repo(
    session: Optional[AsyncSession] = Depends(get_db_session),
) -> ISpaceRepository:
    if settings.demo_mode or session is None:
        return _in_memory_space
    return DatabaseSpaceRepository(session)


async def get_events_repo(
    session: Optional[AsyncSession] = Depends(get_db_session),
) -> IEventsRepository:
    if settings.demo_mode or session is None:
        return _in_memory_events
    return DatabaseEventsRepository(session)


async def get_sources_repo(
    session: Optional[AsyncSession] = Depends(get_db_session),
) -> ISourcesRepository:
    if settings.demo_mode or session is None:
        return _in_memory_sources
    return DatabaseSourcesRepository(session)


async def get_analytics_repo(
    maritime_repo: IMaritimeRepository = Depends(get_maritime_repo),
    aviation_repo: IAviationRepository = Depends(get_aviation_repo),
    space_repo: ISpaceRepository = Depends(get_space_repo),
    events_repo: IEventsRepository = Depends(get_events_repo),
    sources_repo: ISourcesRepository = Depends(get_sources_repo),
) -> IAnalyticsRepository:
    # Use aggregation repository over the active domain repositories
    return InMemoryAnalyticsRepository(
        maritime_repo,
        aviation_repo,
        space_repo,
        events_repo,
        sources_repo,
    )
