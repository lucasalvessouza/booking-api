from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import UserCreate, UserResponse, UserSignIn, UserSignInResponse
from app.repositories.user_repository import (
 create_user, authenticate_user, get_user_by_email
)
from .utils import validate_token, generate_token

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    create_user(db, user_data)
    return Response(status_code=status.HTTP_201_CREATED)
    

@router.post("/signin", response_model=UserSignInResponse)
def signin(user_data: UserSignIn, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = generate_token({"sub": str(user.id), "email": user.email})
    return {"access_token": access_token}


@router.get("/me")
def me(token: dict = Depends(validate_token), db: Session = Depends(get_db)):
    user = get_user_by_email(db, token.get("email"))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {
        "id": user.id,
        "email": user.email
    }


