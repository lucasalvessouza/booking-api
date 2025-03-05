from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from .utils import validate_token
from app.schemas.schemas import PromptCreate
from app.services.prompt import interpret_user_input
from app.services.prompt import (
 handle_create_booking,
 handle_get_booking_id,
 handle_cancel_booking,
 handle_get_next_booking,
 handle_get_booking_details
)

router = APIRouter(prefix="/prompt", tags=["Prompting"])

@router.post("/")
def prompt(payload: PromptCreate, token: dict = Depends(validate_token), db: Session = Depends(get_db)):
    user_id = token.get("sub")
    intent = interpret_user_input(payload.user_input)
    if "error" in intent:
        raise HTTPException(status_code=400, detail=intent["error"])

    action = intent.get("action")
    print(intent)
    message = None
    if action == "create_booking":
        message = handle_create_booking(db, intent["role"], intent["date"], intent["time"], user_id)

    elif action == "get_booking_id":
        message = handle_get_booking_id(db, user_id)

    elif action == "get_next_booking":
        message = handle_get_next_booking(db, user_id)

    elif action == "get_booking_details":
        message = handle_get_booking_details(db, intent["booking_id"], user_id)

    elif action == "cancel_booking":
        message = handle_cancel_booking(db, intent["booking_id"], user_id)
    
    return {"message": message}