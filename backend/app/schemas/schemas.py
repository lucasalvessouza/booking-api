from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserSignIn(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True

class UserSignInResponse(BaseModel):
    access_token: str

    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    start_time: datetime
    role_id: int
