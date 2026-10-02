from fastapi import APIRouter, Depends, HTTPException, status

from app.models.user import User
from app.security.auth import get_current_user

router = APIRouter(tags=["discharge"])


@router.get("/discharge-plan")
def get_discharge_plan(current_user: User = Depends(get_current_user)) -> dict:
    if current_user.role != "patient":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Patients only")

    return {
        "message": "No discharge plan has been uploaded yet.",
        "safety_notice": "Contact your healthcare professional if discharge details are missing.",
    }
