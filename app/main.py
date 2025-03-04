from fastapi import FastAPI
from app.database import engine
from app.models.models import Base
from app.routes import user_routes
from alembic import command
from alembic.config import Config
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.include_router(user_routes.router)