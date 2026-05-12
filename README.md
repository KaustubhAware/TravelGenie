# TravelGenie – AI Powered Travel Planner

TravelGenie is a full-stack AI-powered travel planning platform that helps users generate intelligent itineraries, manage bookings, save trips, and personalize their travel experience.

The platform combines AI-generated travel recommendations with a modern SaaS-style dashboard and booking system.

---

# Features

## AI Trip Generation

* Generate intelligent travel itineraries
* Personalized recommendations
* Budget-based planning
* Day-wise itinerary generation
* Travel sentiment analysis

## User Authentication

* Firebase Authentication
* User registration and login
* Protected routes
* Secure token verification

## User Profile System

* Profile completion system
* Save travel preferences
* Store city and country
* Personalized travel experience

## Booking System

* Trip booking flow
* Booking ID generation
* Payment simulation
* Booking history
* User-specific bookings

## Saved Trips

* Save AI-generated itineraries
* Fetch saved trips per user
* Re-book saved trips

## Admin Dashboard

* Total bookings analytics
* Revenue analytics
* Top destinations
* Booking management
* Status updates

## Modern UI

* Responsive design
* Tailwind CSS interface
* Modern SaaS layout
* Animated UI sections
* Globe visualization

---

# Tech Stack

## Frontend

* React (Vite)
* Tailwind CSS
* React Router DOM
* Firebase Authentication
* React Hot Toast
* React Icons
* Chart.js

## Backend

* FastAPI
* Python
* PostgreSQL
* Firebase Admin SDK
* JWT Authentication
* Uvicorn

---

# Project Structure

```bash
TravelGenie/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── main.py
│   │   ├── db.py
│   │   └── firebase_auth.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/KaustubhAware/TravelGenie.git
```

```bash
cd TravelGenie
```

---

# Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Create Virtual Environment

```bash
python -m venv venv
```

## Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run Backend

```bash
python -m uvicorn app.main:app --reload
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

---

# Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file inside backend:

```env
DATABASE_URL=your_database_url
ADMIN_SECRET_KEY=your_secret_key
```

---

# Firebase Setup

Add your Firebase Admin SDK key file:

```bash
backend/firebase_key.json
```

This file is ignored using `.gitignore`.

---

# Database

Database used:

* PostgreSQL

Main tables:

* users
* bookings
* itineraries

---

# Future Enhancements

* Live destination autocomplete
* Weather integration
* Interactive maps
* Crowd prediction system
* AI travel chatbot
* Hotel recommendation engine
* PDF itinerary export
* Real payment gateway integration
* Email confirmations

---

# Author

Kaustubh Aware

GitHub:

[https://github.com/KaustubhAware](https://github.com/KaustubhAware)

---

# License

This project is for educational and portfolio purposes.
