"""ASTRA API v1 Router

Aggregates all sub-domain routers into the versioned API tree.
"""

from fastapi import APIRouter
from app.api.routes import (
    health,
    maritime,
    aircraft,
    satellites,
    events,
    sources,
    analytics,
    assistant,
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health.router)
api_router.include_router(maritime.router)
api_router.include_router(aircraft.router)
api_router.include_router(satellites.router)
api_router.include_router(events.router)
api_router.include_router(sources.router)
api_router.include_router(analytics.router)
api_router.include_router(assistant.router)
