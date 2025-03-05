import openai
import os
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import FastAPI
from app.repositories.booking_repository import create_booking
from app.repositories.technician_repository import (
 get_next_available_technician,
 get_role_by_name,
 get_roles
)
from app.repositories.booking_repository import (
    get_booking_by_id,
    get_next_user_booking,
    delete_booking
)

app = FastAPI()
oai_client = openai.Client(api_key=os.getenv("OPENAI_API_KEY"))

def interpret_user_input(user_input: str) -> dict:
    prompt = f"""
    Interpret the following user input and return a JSON object.

    Input: "{user_input}"

    Possible actions:
    1. Book a technician (e.g., "I want to book a gardener for tomorrow at 9 AM")
       - Output: {{"action": "create_booking", "role": "gardener", "date": "{(datetime.now() + timedelta(days=1)).date()}", "time": "09:00:00"}} 
       - Note: If the input contains "tomorrow," the date should be interpreted as {datetime.now() + timedelta(days=1)}.
       - Note: If the user inform the date, it should be formatted as a string in ISO 8601 format (e.g., 'YYYY-MM-DD').
       - Note: If the user inform don't inform the time, return "time" as null.

    2. Book a technician (e.g., "I want to book a gardener for 2025-05-05 at 11 AM")
       - Output: {{"action": "create_booking", "role": "gardener", "date": "2025-05-05", "time": "11:00:00"}} 
       - Note: If the user inform the date, it should be formatted as a string in ISO 8601 format (e.g., 'YYYY-MM-DD').
       - Note: If the user inform don't inform the time, return "time" as null.
    
    3. Give me the details of my booking ID (e.g., "What is the details of booking 123?", "Get my booking 123")
       - Output: {{"action": "get_booking_details", "booking_id": 123}}

    4. Get booking ID (e.g., "What is my booking ID?")
       - Output: {{"action": "get_booking_id"}}

    5. Give me my next booking details (e.g., "What is my next booking?")
       - Output: {{"action": "get_next_booking"}}

    6. Cancel booking (e.g., "Cancel booking 123")
       - Output: {{"action": "cancel_booking", "booking_id": 123}}

    Ensure that the "date" field is correctly formatted as a string in ISO 8601 format (e.g., 'YYYY-MM-DDTHH:MM:SS').
    Ensure the JSON is correctly formatted.
    """

    try:
        response = oai_client.chat.completions.create(
            model="gpt-3.5-turbo-1106",  
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        content = response.choices[0].message.content
        return json.loads(content)
    except json.JSONDecodeError:
        return {"error": "Invalid response from OpenAI"}

def parse_date(date_str: str, time: str) -> datetime:
    date = None
    if date_str == "tomorrow":
        date = (datetime.now() + timedelta(days=1)).date()
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError as e:
        print(e)

    if time:
        date = datetime.combine(date, datetime.strptime(time, "%H:%M:%S").time())
    return date


def handle_create_booking(db: Session, role_name: str, date: str, time: str, user_id: int) -> str:
    start_time = parse_date(date, time)
    if not start_time:
        return "Invalid date format. Please use YYYY-MM-DD."
    role = get_role_by_name(db, role_name)
    if not role:
        roles = ", ".join([role.name for role in get_roles(db)])
        return f"{role_name.capitalize()} is not a valid technician role. Available roles: {roles}"
    
    technician, next_time_available = get_next_available_technician(
        db,
        role.id,
        start_time.date() if time else start_time,
        start_time.time() if time else None
    )
    if not next_time_available:
        return f'There is not technician {role_name.capitalize()} available at the requested time. ' \
        f"Try to book at another time or simply 'Book a {role_name.capitalize()} for tomorrow' and we will find the next time available."
    create_booking(db, user_id, technician.id, next_time_available)
    return f"Booking confirmed for {next_time_available.strftime('%A at %I:%M %p')} with {technician.name}."

def handle_get_booking_id(db: Session, user_id: int) -> str:
    booking = get_next_user_booking(db, user_id)
    if not booking:
        return "No booking found."

    return f"Your next booking ID is {booking.id}"

def handle_cancel_booking(db: Session, booking_id: int, user_id: int) -> str:
    booking = get_booking_by_id(db, booking_id)
    if not booking or int(booking.user_id) != int(user_id):
        return f"Booking ID {booking_id} not found."

    delete_booking(db, booking_id)
    return f"Booking ID {booking_id} cancelled."

def handle_get_next_booking(db: Session, user_id: int) -> str:
    booking = get_next_user_booking(db, user_id)
    if not booking:
        return "No upcoming bookings found."

    return f"Your next booking is on {booking.start_time.strftime('%A at %I:%M %p')} with {booking.technician.name}."

def handle_get_booking_details(db: Session, booking_id: int, user_id: int) -> str:
    booking = get_booking_by_id(db, booking_id)
    if not booking or int(booking.user_id) != int(user_id):
        return f"Booking ID {booking_id} not found."
    return f"Your booking with {booking.technician.name} is on {booking.start_time.strftime('%A at %I:%M %p')}."
    
