from fastapi import FastAPI
from app.routes import user_routes
from app.routes import booking_routes
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.include_router(user_routes.router)
app.include_router(booking_routes.router)