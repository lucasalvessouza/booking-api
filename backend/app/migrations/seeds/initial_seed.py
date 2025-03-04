import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from app.database import SessionLocal
from app.models.models import Booking, Technician, TechnicianRole, User


def initial_seed() -> None:
    session = SessionLocal()

    try:
        for role in ['Plumber', 'Electrician', 'Carpenter', 'Welder']:
            technician_role = TechnicianRole(name=role)
            session.add(technician_role)
        session.commit()

        technicians = [
            Technician(name="Nicolas Woollett", role_id=session.query(TechnicianRole).filter_by(name="Plumber").first().id),
            Technician(name="Franky Flay", role_id=session.query(TechnicianRole).filter_by(name="Electrician").first().id),
            Technician(name="Griselda Dickson", role_id=session.query(TechnicianRole).filter_by(name="Welder").first().id)
        ]
        
        session.add_all(technicians)
        session.commit()

        session.add(User(email="admin@mail.com", password="admin"))
        session.commit()
        
        bookings = [
            Booking(
                user_id=1,
                technician_id=session.query(Technician).filter_by(name="Nicolas Woollett").first().id,
                start_time="2022-10-15 10:00:00",
                end_time="2022-10-15 11:00:00"
            ),
            Booking(
                user_id=1,
                technician_id=session.query(Technician).filter_by(name="Franky Flay").first().id,
                start_time="2022-10-16 18:00:00",
                end_time="2022-10-16 19:00:00"
            ),
            Booking(
                user_id=1,
                technician_id=session.query(Technician).filter_by(name="Griselda Dickson").first().id,
                start_time="2022-10-18 11:00:00",
                end_time="2022-10-18 12:00:00"
            ),
        ]
        session.add_all(bookings)
        session.commit()
    finally:
        session.close()

if __name__ == "__main__":
    initial_seed()
