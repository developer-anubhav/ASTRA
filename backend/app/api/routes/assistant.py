"""ASTRA CORTEX AI Assistant API Route

Endpoints for natural language intelligence reasoning and entity cross-correlation.
"""

from fastapi import APIRouter, Depends, status
from app.schemas.assistant import CortexQueryRequest, CortexQueryResponse
from app.schemas.common import ServiceResult
from app.services import CortexAssistantService, get_assistant_service
from app.core.config import settings

router = APIRouter(prefix="/assistant", tags=["CORTEX Assistant"])


@router.post("/query", response_model=ServiceResult[CortexQueryResponse], status_code=status.HTTP_200_OK)
async def query_cortex(
    request: CortexQueryRequest,
    service: CortexAssistantService = Depends(get_assistant_service),
) -> ServiceResult[CortexQueryResponse]:
    response = await service.process_query(request)
    return ServiceResult[CortexQueryResponse](
        data=response,
        is_demo=settings.demo_mode or response.is_demo,
    )
