# CRPMS — Car Repair & Payment Management System

A full-stack web application for managing vehicle maintenance, repair services, and payment records. Built with React 19, Express, and MySQL.

## Tech Stack

**Frontend:** React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios  
**Backend:** Express 5, MySQL2, JWT, bcrypt, Helmet, CORS, express-rate-limit  
**Database:** MySQL (MariaDB)

## Features

- User authentication (register/login) with JWT and password hashing
- Role-based access control (Admin / Customer)
- Vehicle fleet registration and management (CRUD)
- Service catalog with pricing (Admin-managed)
- Service record logging (link cars to services)
- Payment receipt recording with auto-price fill
- Dashboard overview with key metrics (fleet count, revenue, jobs completed)
- Responsive sidebar layout (mobile drawer, desktop sticky)
- Search/filter vehicles by plate, model, brand, or mechanic
- Custom toast notifications and confirm modals
- Backend input validation, rate limiting, and security headers

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL / MariaDB
- npm

### 1. Clone & Install

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Database Setup

Import the SQL dump located at `backend/db/crpms (1).sql` into your MySQL server:

```bash
mysql -u root -p crpms < "backend/db/crpms (1).sql"
```

### 3. Configure Environment

Create `backend/.env`:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=crpms
JWT_SECRET=your_jwt_secret_key
```

Optionally create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173`, the backend on `http://localhost:5000`.

### Default Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@crpms.com | See SQL dump (bcrypt hash) | Admin |
| crpms@gmail.com | See SQL dump | Customer |

## Project Structure

```
├── backend/
│   ├── controllers/    # Route handlers
│   ├── routes/         # Express route definitions
│   ├── middleware/      # Auth & admin guards
│   ├── db/             # Database connection & schema
│   ├── server.js       # Entry point
│   └── .env            # Environment config
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI (Sidebar, Toast, ConfirmModal, Navigation)
│   │   ├── pages/      # Welcome, Login, Register, Dashboard
│   │   ├── utils/      # Axios API client
│   │   ├── App.jsx     # Routes & auth guards
│   │   └── main.jsx    # Entry point
│   ├── index.html
│   └── vite.config.js
└── README.md
```
