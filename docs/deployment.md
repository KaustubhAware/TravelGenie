# Deployment Guide

## Frontend: Vercel

1. Set root directory to `frontend`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add environment variables from `frontend/.env.example`.
5. Set `VITE_API_BASE_URL` to the deployed backend URL plus `/api`.

## Backend: Render or Railway

1. Set root directory to `backend`.
2. Build command: `pip install -r requirements.txt`.
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
4. Add environment variables from `backend/.env.example`.
5. Configure PostgreSQL, JWT, Gemini, Razorpay, CORS, and upload directory environment variables.

## PostgreSQL Cloud

Use Render PostgreSQL, Railway PostgreSQL, Supabase, Neon, or any managed PostgreSQL provider.

Run:

```bash
psql <your_connection_url> -f backend/schema.sql
```

## Production Checklist

- `ENVIRONMENT=production`
- Strong `JWT_SECRET_KEY`
- Strong `ADMIN_SECRET_KEY`
- Strong admin password
- Correct `CORS_ORIGINS`
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- `GEMINI_API_KEY` or service-specific Gemini keys
- Database credentials stored in platform secrets
- Frontend API URL points to backend deployment
- Upload path is writable on the backend host, or replaced with durable object storage before scaling horizontally
