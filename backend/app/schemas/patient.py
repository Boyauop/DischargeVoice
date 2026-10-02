from pydantic import BaseModel


class PatientProfile(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
