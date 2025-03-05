from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.repositories.booking_repository import create_booking, is_technician_available
from app.repositories.technician_repository import get_next_available_technician
from app.repositories.user_repository import get_user_by_email
from app.models.models import Booking
from app.schemas.schemas import BookingCreate
from .utils import validate_token

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("/")
def book_technician(payload: BookingCreate, token: dict = Depends(validate_token), db: Session = Depends(get_db)):
    technician, start_time = get_next_available_technician(db, role_id=payload.role_id, date=payload.start_time.date(), time=payload.start_time.time())
    if not technician:
        raise HTTPException(status_code=400, detail="No available technician")
    
    user = get_user_by_email(db, token.get("email"))
    user_id = user.id
    booking = create_booking(
     db,
     user_id,
     technician.id,
     start_time
    )
    return booking

@router.get("/")
def get_bookings(token: dict = Depends(validate_token), db: Session = Depends(get_db)):
    user = get_user_by_email(db, token.get("email"))
    bookings = db.query(Booking).filter(Booking.user_id == user.id).all()

    return [{
        "id": booking.id,
        "start_time": booking.start_time,
        "end_time": booking.end_time
    } for booking in bookings]

@router.get("/{id}")
def get_booking(id: int, token: dict = Depends(validate_token), db: Session = Depends(get_db)):
    user = get_user_by_email(db, token.get("email"))
    booking = db.query(Booking).filter(Booking.id == id, Booking.user_id == user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {
        "id": booking.id,
        "start_time": booking.start_time,
        "end_time": booking.end_time,
        "technician": {
            "name": booking.technician.name,
            "role": booking.technician.role.name
        }
    }

@router.delete("/{id}")
def delete_booking(id: int, token: dict = Depends(validate_token), db: Session = Depends(get_db)):
    user = get_user_by_email(db, token.get("email"))
    booking = db.query(Booking).filter(Booking.id == id, Booking.user_id == user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted"}