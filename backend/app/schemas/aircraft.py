"""ASTRA Aviation Schemas

Pydantic models for aircraft state vectors and airframe metadata.
"""

from datetime import datetime
from typing import Optional, Literal
from app.schemas.common import AstraBaseModel, GeoCoordinate, SourceReference, DataProvenance, DataQuality

AircraftCategory = Literal[
    "commercial",
    "private",
    "military",
    "cargo",
    "helicopter",
    "drone",
    "glider",
    "unknown",
]


class AircraftPosition(AstraBaseModel):
    position: GeoCoordinate
    heading: Optional[float] = None
    speed_knots: Optional[float] = None
    vertical_rate_ms: Optional[float] = None
    squawk: Optional[str] = None
    on_ground: bool = False
    observed_at: datetime


class Aircraft(AstraBaseModel):
    id: str
    icao24: Optional[str] = None
    callsign: Optional[str] = None
    registration: Optional[str] = None
    aircraft_type: Optional[str] = None
    operator: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    category: AircraftCategory
    latest_position: Optional[AircraftPosition] = None
    source: SourceReference
    quality: DataQuality
    provenance: DataProvenance
    coverage_note: Optional[str] = None
