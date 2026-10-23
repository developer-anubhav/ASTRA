"""ASTRA Global Events Schemas

Pydantic models for intelligence dispatches, factual status, and severity tags.
"""

from datetime import datetime
from typing import List, Optional, Literal
from app.schemas.common import AstraBaseModel, GeoCoordinate, SourceReference, DataProvenance

EventCategory = Literal[
    "conflict",
    "disaster",
    "political",
    "economic",
    "environmental",
    "humanitarian",
    "security",
    "diplomatic",
    "technology",
    "other",
]

EventSeverity = Literal["critical", "high", "medium", "low", "informational"]

FactualStatus = Literal["reported", "corroborated", "official", "disputed", "retracted"]


class GlobalEvent(AstraBaseModel):
    id: str
    title: str
    summary: str
    category: EventCategory
    severity: EventSeverity
    factual_status: FactualStatus
    location: Optional[GeoCoordinate] = None
    location_name: Optional[str] = None
    country: Optional[str] = None
    started_at: datetime
    updated_at: datetime
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    tags: Optional[List[str]] = None
    source: SourceReference
    provenance: DataProvenance
    analysis_note: Optional[str] = None
