"""ASTRA Analytics Schemas

Pydantic models for aggregated multi-domain metrics and timeseries summaries.
"""

from datetime import datetime
from typing import Dict, List, Optional
from app.schemas.common import AstraBaseModel, DataProvenance
from app.schemas.events import EventCategory, EventSeverity
from app.schemas.maritime import VesselType
from app.schemas.aircraft import AircraftCategory
from app.schemas.sources import SourceDomain


class DomainCount(AstraBaseModel):
    domain: SourceDomain
    count: int
    label: str


class TimeSeriesPoint(AstraBaseModel):
    timestamp: datetime
    value: int
    label: Optional[str] = None


class AnalyticsSummary(AstraBaseModel):
    generated_at: datetime
    period: str
    vessel_count: int
    aircraft_count: int
    satellite_count: int
    event_count: int
    source_count: int
    active_sources: int
    events_by_category: Dict[EventCategory, int]
    events_by_severity: Dict[EventSeverity, int]
    vessels_by_type: Dict[VesselType, int]
    aircraft_by_category: Dict[AircraftCategory, int]
    event_time_series: List[TimeSeriesPoint]
    coverage_note: str
    provenance: DataProvenance
