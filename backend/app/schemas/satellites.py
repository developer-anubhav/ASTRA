"""ASTRA Space Schemas

Pydantic models for satellite catalog, Keplerian orbital elements, and propagated estimates.
"""

from datetime import datetime
from typing import Optional, Literal
from app.schemas.common import AstraBaseModel, GeoCoordinate, SourceReference, DataProvenance, DataQuality

SatelliteType = Literal[
    "communications",
    "earth-observation",
    "navigation",
    "scientific",
    "weather",
    "military",
    "debris",
    "unknown",
]


class OrbitalElements(AstraBaseModel):
    epoch: datetime
    inclination: float
    raan: float
    eccentricity: float
    argument_of_perigee: float
    mean_anomaly: float
    mean_motion: float
    b_star_drag_term: Optional[float] = None
    rev_at_epoch: Optional[int] = None
    semimajor_axis_km: Optional[float] = None
    perigee_km: Optional[float] = None
    apogee_km: Optional[float] = None
    period_minutes: Optional[float] = None


class PropagatedPosition(AstraBaseModel):
    position: GeoCoordinate
    propagated_at: datetime
    data_epoch: datetime
    propagation_note: str = (
        "Position is a propagated estimate from orbital elements, not a directly observed position"
    )


class Satellite(AstraBaseModel):
    id: str
    norad_id: Optional[int] = None
    cospar_id: Optional[str] = None
    name: str
    country: Optional[str] = None
    launch_date: Optional[str] = None
    sat_type: SatelliteType
    operational_status: Optional[str] = None
    orbital_elements: Optional[OrbitalElements] = None
    propagated_position: Optional[PropagatedPosition] = None
    source: SourceReference
    quality: DataQuality
    provenance: DataProvenance
