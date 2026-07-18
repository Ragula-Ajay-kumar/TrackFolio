from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from .models import StatusEnum


# --- Auth ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --- Applications ---
class ApplicationBase(BaseModel):
    company: str
    role: str
    status: StatusEnum = StatusEnum.applied
    applied_date: Optional[date] = None
    follow_up_date: Optional[date] = None
    notes: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[StatusEnum] = None
    applied_date: Optional[date] = None
    follow_up_date: Optional[date] = None
    notes: Optional[str] = None


class ApplicationOut(ApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class DashboardStats(BaseModel):
    total: int
    by_status: dict[str, int]
    due_soon: list[ApplicationOut]
