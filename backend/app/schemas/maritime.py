"""ASTRA Maritime Schemas

Pydantic models for vessels, positions, and track histories.
"""

from datetime import datetime
from typing import List, Optional, Literal
from app.schemas.common import AstraBaseModel, GeoCoordinate, SourceReference, DataProvenance, DataQuality

VesselType = Literal[
    "cargo",
    "tanker",
    "fishing",
    "passenger",
    "military",
    "research",
    "tug",
    "sailing",
    "pleasure",
    "other",
    "unknown",
]


class VesselPosition(AstraBaseModel):
    position: GeoCoordinate
    heading: Optional[float] = None
    speed_knots: Optional[float] = None
    course_over_ground: Optional[float] = None
    nav_status: Optional[str] = None
    observed_at: datetime


class VesselTrackPoint(AstraBaseModel):
    position: GeoCoordinate
    heading: Optional[float] = None
    speed_knots: Optional[float] = None
    observed_at: datetime


class Vessel(AstraBaseModel):
    id: str
    mmsi: Optional[str] = None
    imo: Optional[str] = None
    call_sign: Optional[str] = None
    name: Optional[str] = None
    flag: Optional[str] = None
    vessel_type: VesselType
    type_code: Optional[int] = None
    gross_tonnage: Optional[int] = None
    length_meters: Optional[float] = None
    beam_meters: Optional[float] = None
    draft: Optional[float] = None
    destination: Optional[str] = None
    eta: Optional[datetime] = None
    latest_position: Optional[VesselPosition] = None
    track_history: Optional[List[VesselTrackPoint]] = None
    source: SourceReference
    quality: DataQuality
    provenance: DataProvenance
    coverage_note: Optional[str] = None
