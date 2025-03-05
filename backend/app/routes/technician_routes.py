from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.repositories.technician_repository import get_roles

router = APIRouter(prefix="/technician_roles", tags=["TechnicianRoles"])

@router.get("/")
def book_technician(db: Session = Depends(get_db)):
    return get_roles(db)