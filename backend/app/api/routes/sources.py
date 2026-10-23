"""ASTRA Data Sources API Route

Endpoints for inspecting provider feeds, access licensing, and telemetry status.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path
from app.schemas.sources import DataSource, SourceDomain
from app.schemas.common import ServiceResult
from app.services import SourcesService, get_sources_service
from app.core.config import settings

router = APIRouter(prefix="/sources", tags=["Sources"])


@router.get("", response_model=ServiceResult[List[DataSource]])
async def list_sources(
    domain: Optional[SourceDomain] = Query(None, description="Filter by surveillance domain"),
    service: SourcesService = Depends(get_sources_service),
) -> ServiceResult[List[DataSource]]:
    sources = await service.list_sources(domain=domain)
    return ServiceResult[List[DataSource]](
        data=sources,
        is_demo=settings.demo_mode or any(s.is_demo for s in sources),
    )


@router.get("/{source_id}", response_model=ServiceResult[DataSource])
async def get_source(
    source_id: str = Path(..., description="Unique provider ID"),
    service: SourcesService = Depends(get_sources_service),
) -> ServiceResult[DataSource]:
    source = await service.get_source(source_id)
    return ServiceResult[DataSource](
        data=source,
        is_demo=settings.demo_mode or source.is_demo,
    )
