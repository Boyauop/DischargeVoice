from fastapi import APIRouter, Depends

from app.models.user import User
from app.schemas.patient import PatientProfile
from app.security.auth import get_current_user

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("/me", response_model=PatientProfile)
def get_my_profile(current_user: User = Depends(get_current_user)) -> PatientProfile:
    return PatientProfile(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
    )
