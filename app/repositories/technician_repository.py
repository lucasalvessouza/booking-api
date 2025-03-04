from sqlalchemy.orm import Session
from app.models.models import Technician, TechnicianRole

def get_next_available_technician(db: Session, role: str):
    return db.query(Technician).join(Technician.role).filter(TechnicianRole.name == role).first()

def create_technician(db: Session, name: str):
    technician = Technician(name=name)
    db.add(technician)
    db.commit()
    db.refresh(technician)
    return technician
