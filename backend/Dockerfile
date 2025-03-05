FROM python:3.12

WORKDIR /app/backend

COPY backend/requirements.txt .

COPY backend/.env .

RUN pip install -r requirements.txt

COPY backend/ /app/backend


CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]