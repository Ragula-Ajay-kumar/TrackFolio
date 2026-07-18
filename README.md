# TrackFolio

TrackFolio is a full-stack job application tracker that helps students organize internship and placement applications. Users can securely manage applications, monitor progress, and view analytics through an interactive dashboard.

🌐 **Live Demo:** https://track-folio.vercel.app  
📖 **API Docs:** https://trackfolio-api-4hp1.onrender.com/docs

> **Note:** The backend is hosted on Render's free tier, so the first request after inactivity may take 30–50 seconds to wake up.

---

## Features

- Secure JWT-based authentication
- Add, edit, and delete job applications
- Track application status (Applied, OA, Interview, Offer, Rejected)
- Dashboard with application statistics and charts
- Follow-up reminders for the next 7 days
- Per-user data isolation
- Persistent PostgreSQL database storage

---

## Tech Stack

| Layer | Technologies |
|--------|--------------|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios, Recharts |
| Backend | FastAPI, SQLAlchemy, Pydantic, python-jose (JWT), Passlib |
| Database | PostgreSQL (Supabase), SQLite (Local Development) |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## Architecture

```
React (Vite)
      │
 REST API (JWT)
      │
 FastAPI Backend
      │
 PostgreSQL
```

---

## How It Works

1. Users sign up or log in securely.
2. The frontend sends authenticated API requests using JWT.
3. FastAPI validates requests and performs CRUD operations.
4. Application data is stored in PostgreSQL.
5. The dashboard displays application statistics and upcoming follow-ups.

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Backend: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current User |
| GET | `/applications` | List Applications |
| POST | `/applications` | Create Application |
| PUT | `/applications/{id}` | Update Application |
| DELETE | `/applications/{id}` | Delete Application |
| GET | `/dashboard` | Dashboard Analytics |

---

## Future Improvements

- Email reminders
- Kanban board
- CSV import/export
- Refresh token authentication

---

## Author

**Ragula-Ajay-Kumar**
