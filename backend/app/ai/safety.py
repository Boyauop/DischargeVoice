from app.core.config import get_settings

UNSAFE_PHRASES = {
    "diagnose": "I cannot diagnose medical conditions.",
    "increase my dose": "I cannot change medication doses.",
    "decrease my dose": "I cannot change medication doses.",
    "stop taking": "I cannot advise stopping prescribed medication.",
    "start taking": "I cannot prescribe new medications.",
}

EMERGENCY_PHRASES = {
    "chest pain",
    "difficulty breathing",
    "can\'t breathe",
    "severe bleeding",
    "passed out",
    "unconscious",
}


def check_safety(message: str) -> tuple[bool, str | None]:
    normalized = message.lower()

    for phrase, reason in UNSAFE_PHRASES.items():
        if phrase in normalized:
            return False, f"{reason} Please contact your healthcare professional."

    if any(phrase in normalized for phrase in EMERGENCY_PHRASES):
        return False, get_settings().emergency_message

    return True, None
