from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import assistant, auth, discharge, patients
from app.core.config import get_settings
from app.database.session import engine
from app.models.user import Base

settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DischargeVoice API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(patients.router, prefix=settings.api_prefix)
app.include_router(discharge.router, prefix=settings.api_prefix)
app.include_router(assistant.router, prefix=settings.api_prefix)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}
