from fastapi import Header, HTTPException
from app.services.auth import verify_token, create_access_token
from datetime import timedelta

def validate_token(authorization: str = Header(None)) -> dict:
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    token = authorization.split(" ")[1]
    try:
        payload = verify_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return payload

def generate_token(data) -> str:
    return create_access_token(data=data)