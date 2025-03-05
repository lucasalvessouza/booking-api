# Booking Platform

This project is a **Full Stack Application** combining:

- **FastAPI** for the backend (in `backend` folder)
- **Next.js** for the frontend (in `frontend` folder)
- **PostgreSQL** as the database (via Docker)

---

## 📦 Project Structure

```
.
├── backend/                 # FastAPI backend
│    ├── app/
│    │     ├── main.py      # FastAPI entry point
│    │     ├── migrations/  # Alembic migrations
│    │     └── models.py    # SQLAlchemy models
│    └── Dockerfile         # API Docker setup
├── frontend/                # Next.js frontend
│    ├── pages/
│    └── Dockerfile         # Frontend Docker setup
└── docker-compose.yml       # Docker Compose setup
```

---

## 🚀 Quick Start

Ensure **Docker** and **Docker Compose** are installed:

```bash
# Check Docker installation
docker --version

# Check Docker Compose installation
docker-compose --version
```

### 1. Clone the Repository

```bash
git clone git@github.com:lucasalvessouza/booking-api.git
cd booking-api
```

### 2. Environment Configuration

Create `.env` files for both **backend** and **frontend**:

#### Backend (`backend/.env`):

```
DATABASE_URL=postgresql://user:password@localhost:5432/booking_db
JWT_SECRET_KEY=<GENERATE-YOUR-RANDOM-KEY>
OPENAI_API_KEY=<YOUR-OPENAI-TOKEN>
```

#### Frontend (`frontend/.env.local`):

```
NEXT_PUBLIC_API_URL=http://api:8000
```

### 3. Run the Project

Use Docker Compose to spin up the entire stack:

```bash
docker-compose up --build
```

### 4. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend (FastAPI Docs)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Database**: localhost:5432 (user: `user`, password: `password`, db: `booking_db`)

Note: You can Sign In with a pre-populate user:
email: admin@gmail.com
password: admin

---

## 🔧 Development Workflow

### Check Logs

```bash
# Backend logs
docker-compose logs api

# Frontend logs
docker-compose logs frontend

# Database logs
docker-compose logs db
```

### Run Alembic Migrations

If you make database changes, run:

```bash
# Access the backend container
docker-compose exec api bash

# Inside the container
alembic revision --autogenerate -m "your message"
alembic upgrade head
```

### Seed the Database

Seeding only happens when the **PostgreSQL volume** is first created.

If needed, manually run the seed script:

```bash
docker-compose exec api python app/migrations/seeds/initial_seed.py
```

### Reset the Environment

If you want to **reset everything** (including the database):

```bash
docker-compose down -v
```

---

## 📚 Useful Commands

| Command                            | Description                     |
|------------------------------------|---------------------------------|
| `docker-compose up --build`        | Build and run the full stack    |
| `docker-compose down -v`          | Stop and remove all containers  |
| `docker-compose exec api bash`    | Open a shell in the API service |
| `docker-compose logs -f`          | Tail logs from all services     |

---

## 🛠️ Troubleshooting

1. **Database connection issues?** Ensure PostgreSQL is healthy:

```bash
docker-compose ps
```

2. **Migrations not running?** Confirm Alembic is correctly configured in `alembic.ini`.

---

