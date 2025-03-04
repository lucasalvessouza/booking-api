from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    bookings = relationship("Booking", back_populates="user")

class Technician(Base):
    __tablename__ = "technicians"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    role_id = Column(Integer, ForeignKey("technician_roles.id"))

    bookings = relationship("Booking", back_populates="technician")

class TechnicianRole(Base):
    __tablename__ = "technician_roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    technician_id = Column(Integer, ForeignKey("technicians.id"))
    start_time = Column(DateTime, default=datetime.datetime.now)
    end_time = Column(DateTime, default=datetime.datetime.now)

    user = relationship("User", back_populates="bookings")
    technician = relationship("Technician", back_populates="bookings")
