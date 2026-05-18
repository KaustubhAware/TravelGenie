# TravelGenie

AI-Powered Tour & Travel Agency Operations Platform

TravelGenie is an enterprise-style SaaS simulation for travel companies. It combines AI itinerary generation, customer booking requests, admin/agent review workflows, package management, analytics, invoices, and PostgreSQL-backed operations.

## Highlights

- AI itinerary generation with Gemini
- Customer portal for trips, bookings, invoices, and saved itineraries
- Admin dashboard for revenue, bookings, customers, packages, and analytics
- Agent workspace for assigned booking operations
- Booking lifecycle: `pending -> under_review -> payment_pending -> paid -> completed`
- Rejection and cancellation workflows
- PDF itinerary and invoice export
- PostgreSQL schema with users, packages, bookings, payments, invoices, notes, activity logs
- Firebase Authentication for customers
- JWT-based admin access
- Route-level frontend code splitting
- Production environment examples and deployment docs

## Tech Stack

Frontend:

- React + Vite
- Tailwind CSS
- React Router
- Firebase Auth
- Chart.js
- Leaflet
- jsPDF + html2canvas

Backend:

- FastAPI
- PostgreSQL
- Firebase Admin SDK
- Gemini AI
- Scikit-learn
- JWT authentication

## Project Structure

```text
backend/
  app/
    routes/
    ml/
    config.py
    db.py
    firebase_auth.py
    main.py
    responses.py
  schema.sql
  requirements.txt

frontend/
  src/
    components/
    config/
    layouts/
    pages/
    services/
    utils/
    App.jsx

docs/
  architecture.md
  api.md
  database.md
  deployment.md
  diagrams.md
  sdlc.md
```

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Environment Variables

Backend: copy `backend/.env.example` to `backend/.env`.

Frontend: copy `frontend/.env.example` to `frontend/.env`.

Never commit Firebase service account files, production database passwords, or API keys.

## Database Setup

Create a PostgreSQL database and run:

```bash
psql -d travelgenie -f backend/schema.sql
```

## Deployment

- Frontend: Vercel using `frontend/vercel.json`
- Backend: Render/Railway using `backend/Procfile` or `render.yaml`
- Database: Render PostgreSQL, Railway PostgreSQL, Supabase, Neon, or another PostgreSQL host

See [docs/deployment.md](docs/deployment.md).

## Documentation

- [Architecture](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Database Documentation](docs/database.md)
- [Diagram Support](docs/diagrams.md)
- [SDLC Support](docs/sdlc.md)
- [Deployment Guide](docs/deployment.md)

## Verification Commands

```bash
python -m py_compile backend/app/main.py backend/app/config.py backend/app/db.py
```

```bash
cd frontend
npm run build
```

## Portfolio Positioning

TravelGenie demonstrates:

- SDLC-based module planning
- Enterprise workflow design
- AI integration
- Authentication and role-based access
- Database normalization
- SaaS dashboard UI
- Analytics and audit logging
- Deployment-ready configuration

## License

Educational and portfolio project.
