# Gemstone Recommendation App

A full-stack MERN application for personalized gemstone recommendations, catalog discovery, favorites, user dashboards, and admin analytics.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Context API, Recharts, jsPDF
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Deployment targets: Vercel for frontend, Render for backend, MongoDB Atlas for database

## Project Structure

```text
backend/
  src/config/
  src/controllers/
  src/data/
  src/middleware/
  src/models/
  src/routes/
  src/services/
  src/utils/
frontend/
  src/components/
  src/context/
  src/layouts/
  src/pages/
  src/services/
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update `backend/.env` with your MongoDB URI and JWT secret.

4. Seed the gemstone catalog and default admin:

```bash
npm run seed --prefix backend
```

Default admin:

```text
email: admin@gemstone.local
password: Admin123!
```

5. Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Environment Variables

Backend:

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`

Frontend:

- `VITE_API_URL`

## API Overview

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

Gemstones:

- `GET /api/gemstones`
- `GET /api/gemstones/:id`
- `POST /api/gemstones` admin
- `PUT /api/gemstones/:id` admin
- `DELETE /api/gemstones/:id` admin

Recommendations:

- `POST /api/recommendations`
- `GET /api/recommendations`
- `GET /api/recommendations/:id`
- `DELETE /api/recommendations/:id`

Favorites:

- `POST /api/favorites`
- `GET /api/favorites`
- `DELETE /api/favorites/:id`

Admin:

- `GET /api/admin/users`
- `GET /api/admin/analytics`

## Recommendation Engine

The engine is implemented in `backend/src/services/recommendationService.js`. It scores gemstones by goal fit, zodiac planetary association, and profession-related benefit signals. The logic is isolated so new rules can be added without changing controllers.

## Deployment

Frontend on Vercel:

- Set `VITE_API_URL` to your Render backend URL plus `/api`.
- Build command: `npm run build`
- Output directory: `dist`

Backend on Render:

- Root directory: `backend`
- Start command: `npm start`
- Add `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CLIENT_URL`.

MongoDB Atlas:

- Create a cluster and database user.
- Whitelist Render access or configure secure network access.
- Use the Atlas connection string as `MONGO_URI`.

## Notes

Gemstone recommendations are educational and preference-based. They are not medical, legal, financial, or professional astrological advice.
