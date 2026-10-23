"""ASTRA CORTEX AI Assistant Schemas

Pydantic models for reasoning requests, structured findings, and provenance citations.
"""

from datetime import datetime, timezone
from typing import List, Optional, Literal, Union
from pydantic import Field
from app.schemas.common import (
    AstraBaseModel,
    BoundingBox,
    SourceReference,
    DataProvenance,
    ConfidenceLevel,
    GeospatialEntityType,
)

CortexResponseStatus = Literal["success", "partial", "no-data", "error"]
CortexFindingType = Literal["fact", "inference", "uncertainty", "missing-data", "suggestion"]


class VesselContext(AstraBaseModel):
    type: Literal["vessel"]
    entity_id: str


class AircraftContext(AstraBaseModel):
    type: Literal["aircraft"]
    entity_id: str


class SatelliteContext(AstraBaseModel):
    type: Literal["satellite"]
    entity_id: str


class EventContext(AstraBaseModel):
    type: Literal["event"]
    entity_id: str


class RegionContext(AstraBaseModel):
    type: Literal["region"]
    bounding_box: BoundingBox


class GeneralContext(AstraBaseModel):
    type: Literal["general"]


CortexQueryContext = Union[
    VesselContext,
    AircraftContext,
    SatelliteContext,
    EventContext,
    RegionContext,
    GeneralContext,
]


class CortexQueryRequest(AstraBaseModel):
    query: str
    context: Optional[CortexQueryContext] = None
    session_id: Optional[str] = None


class CortexFinding(AstraBaseModel):
    type: CortexFindingType
    content: str
    source_ref: Optional[SourceReference] = None
    confidence: Optional[ConfidenceLevel] = None
    entity_id: Optional[str] = None
    entity_type: Optional[GeospatialEntityType] = None
    map_link: Optional[dict] = None
    route_link: Optional[str] = None


class CortexQueryResponse(AstraBaseModel):
    query_id: str
    query: str
    status: CortexResponseStatus
    summary: str
    findings: List[CortexFinding]
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_demo: bool = Field(default=True)
    demo_label: Optional[str] = "DEMONSTRATION RESPONSE — Simulated reasoning without live LLM inference"
    data_provenance: List[DataProvenance] = Field(default_factory=lambda: ["demonstration"])
    sources_consulted: List[SourceReference] = Field(default_factory=list)
    error_message: Optional[str] = None
