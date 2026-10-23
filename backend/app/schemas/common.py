"""ASTRA Common Geospatial and Provenance Schemas

Defines core provenance, coordinate, and generic response envelope models.
"""

from datetime import datetime, timezone
from typing import Generic, Optional, TypeVar, Literal
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

T = TypeVar("T")

DataProvenance = Literal["live", "cached", "demonstration", "propagated", "inferred"]
DataQuality = Literal["verified", "unverified", "estimated", "historical"]
ConfidenceLevel = Literal["high", "medium", "low", "unknown"]
GeospatialEntityType = Literal["vessel", "aircraft", "satellite", "event", "poi"]


class AstraBaseModel(BaseModel):
    """Base model with camelCase aliasing for seamless frontend compatibility."""
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class SourceReference(AstraBaseModel):
    source_id: str
    source_name: str
    source_url: Optional[str] = None
    observed_at: datetime
    ingested_at: datetime
    provenance: DataProvenance
    attribution: Optional[str] = None
    license_note: Optional[str] = None


class DataFreshness(AstraBaseModel):
    last_updated: Optional[datetime] = None
    stale_since: Optional[datetime] = None
    is_stale: bool = False
    update_interval_seconds: Optional[int] = None
    coverage_note: Optional[str] = None


class GeoCoordinate(AstraBaseModel):
    lat: float = Field(..., ge=-90.0, le=90.0)
    lon: float = Field(..., ge=-180.0, le=180.0)
    altitude_meters: Optional[float] = None
    accuracy_meters: Optional[float] = None


class BoundingBox(AstraBaseModel):
    min_lat: float = Field(..., ge=-90.0, le=90.0)
    max_lat: float = Field(..., ge=-90.0, le=90.0)
    min_lon: float = Field(..., ge=-180.0, le=180.0)
    max_lon: float = Field(..., ge=-180.0, le=180.0)

    @property
    def south(self) -> float:
        return self.min_lat

    @property
    def north(self) -> float:
        return self.max_lat

    @property
    def west(self) -> float:
        return self.min_lon

    @property
    def east(self) -> float:
        return self.max_lon


class ServiceResult(AstraBaseModel, Generic[T]):
    """Standardized response envelope consumed by ASTRA frontend."""
    data: Optional[T] = None
    error: Optional[str] = None
    is_demo: bool = Field(default=True, description="True if response contains simulated records")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class HealthResponse(AstraBaseModel):
    status: Literal["healthy", "degraded", "unhealthy"]
    version: str
    environment: str
    timestamp: datetime
    database: dict
    services: dict
