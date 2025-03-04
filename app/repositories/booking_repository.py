from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import Booking

def create_booking(db: Session, user_id: int, technician_id: int, start_time: datetime):
    end_time = start_time + timedelta(hours=1)
    booking = Booking(user_id=user_id, technician_id=technician_id, start_time=start_time, end_time=end_time)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def is_technician_available(db: Session, technician_id: int, start_time: datetime):
    end_time = start_time + timedelta(hours=1)

    is_technician_busy = db.query(Booking).filter(
        Booking.technician_id == technician_id,
        Booking.start_time < end_time,
        Booking.end_time > start_time
    ).first()

    return not is_technician_busy and start_time > datetime.now()