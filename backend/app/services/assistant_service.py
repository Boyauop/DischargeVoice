from app.ai.safety import check_safety


def generate_assistant_response(message: str, discharge_plan_context: str | None) -> tuple[str, str, str | None]:
    safe, notice = check_safety(message)
    if not safe:
        return notice or "Please contact your healthcare professional.", "safety", notice

    if discharge_plan_context:
        response = (
            "Based on your discharge plan: "
            f"{discharge_plan_context.strip()} "
            "Please follow instructions from your healthcare professional."
        )
        return response, "discharge_plan", None

    response = (
        "I cannot determine that from the information provided. "
        "Please check your discharge paperwork or contact your healthcare professional."
    )
    return response, "unknown", None
