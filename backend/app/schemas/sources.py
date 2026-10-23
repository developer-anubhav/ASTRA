"""ASTRA Data Sources & Registry Schemas

Pydantic models for data providers, access constraints, and rate limits.
"""

from datetime import datetime
from typing import Optional, Literal
from app.schemas.common import AstraBaseModel

SourceStatus = Literal["active", "degraded", "unavailable", "unconfigured", "limited"]
SourceDomain = Literal["maritime", "aviation", "space", "events", "analytics", "environment"]


class DataSource(AstraBaseModel):
    id: str
    name: str
    domain: SourceDomain
    description: str
    status: SourceStatus
    base_url: Optional[str] = None
    last_checked: Optional[datetime] = None
    last_successful: Optional[datetime] = None
    rate_limit_note: Optional[str] = None
    license_note: Optional[str] = None
    coverage_note: Optional[str] = None
    attribution_required: bool = False
    requires_api_key: bool = False
    is_demo: bool = False
