from fastapi import APIRouter, Depends

from app.models.user import User
from app.schemas.assistant import AssistantMessageRequest, AssistantMessageResponse
from app.security.auth import get_current_user
from app.services.assistant_service import generate_assistant_response

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.post("/message", response_model=AssistantMessageResponse)
def assistant_message(
    payload: AssistantMessageRequest,
    current_user: User = Depends(get_current_user),
) -> AssistantMessageResponse:
    response, source, safety_notice = generate_assistant_response(
        payload.message, payload.discharge_plan_context
    )

    return AssistantMessageResponse(response=response, source=source, safety_notice=safety_notice)
