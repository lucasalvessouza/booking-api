"""database_seed

Revision ID: ccd3c1c6d0c9
Revises: a7f6e14948e8
Create Date: 2025-03-04 10:16:40.241004

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import Booking, Technician, TechnicianRole, User


# revision identifiers, used by Alembic.
revision: str = 'ccd3c1c6d0c9'
down_revision: Union[str, None] = 'a7f6e14948e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
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

        session.add(User(username="admin", password="admin"))
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

def downgrade() -> None:
    session = SessionLocal()

    try:
        session.query(Booking).delete()
        session.query(Technician).delete()
        session.query(TechnicianRole).delete()
        session.query(User).delete()
        session.commit()
    finally:
        session.close()
