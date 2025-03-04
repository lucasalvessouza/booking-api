from sqlalchemy.orm import Session
from app.models.models import Technician, TechnicianRole

def get_next_available_technician(db: Session, role_id: int):
    return db.query(Technician).join(Technician.role).filter(TechnicianRole.id == role_id).first()

def create_technician(db: Session, name: str):
    technician = Technician(name=name)
    db.add(technician)
    db.commit()
    db.refresh(technician)
    return technician

def get_roles(db: Session):
    return db.query(TechnicianRole).join(Technician).filter(Technician.role_id == TechnicianRole.id).all()