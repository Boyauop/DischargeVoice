from pydantic import BaseModel, Field


class AssistantMessageRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    discharge_plan_context: str | None = None


class AssistantMessageResponse(BaseModel):
    response: str
    source: str
    safety_notice: str | None = None
