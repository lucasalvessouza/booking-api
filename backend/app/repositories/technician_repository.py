from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from app.models.models import Technician, TechnicianRole, Booking
from .booking_repository import is_technician_available

def get_next_available_technician(db: Session, role_id: int, date: str, time: str = None):
    if time:
        start_time = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M:%S")
        technician = db.query(Technician).filter(Technician.role_id == role_id).filter(~Technician.bookings.any(Booking.start_time == start_time)).first()
        if technician:
            return technician, start_time
        return None, None
    for i in range(9, 17):
        start_time = datetime.strptime(f"{date} {i}:00:00", "%Y-%m-%d %H:%M:%S")
        end_time = datetime.strptime(f"{date} {i+1}:00:00", "%Y-%m-%d %H:%M:%S")
        technician = db.query(Technician).filter(Technician.role_id == role_id).filter(~Technician.bookings.any(Booking.start_time.between(start_time, end_time))).first()
        if technician:
            return technician, start_time

def create_technician(db: Session, name: str):
    technician = Technician(name=name)
    db.add(technician)
    db.commit()
    db.refresh(technician)
    return technician

def get_roles(db: Session):
    return db.query(TechnicianRole).join(Technician).filter(Technician.role_id == TechnicianRole.id).all()

def get_role_by_name(db: Session, name: str):
    return db.query(TechnicianRole).filter(func.lower(TechnicianRole.name) == func.lower(name)).first()