# StayNest — React + Express + MySQL

This version converts the uploaded StayNest prototype from MongoDB/Mongoose to **MySQL** while keeping the React/Vite + Node/Express architecture.

## What was changed

- Replaced MongoDB/Mongoose with MySQL (`mysql2` + SQL tables).
- Added automatic database/table creation in `server/config/db.js`.
- Added SQL schema in `server/schema.sql`.
- Rebuilt the unused/old `App.jsx` login prototype into a real React Router application.
- Connected login/register to the backend with JWT.
- Added seeker flow: search/filter stays, property details, shortlist, compare, visit request, booking request, reviews and profile.
- Added owner flow: owner dashboard, add property, view visit/booking requests and accept/decline requests.
- Added notification, messaging and supporting API routes.
- Added demo seed data.

## 1. Install MySQL

Use MySQL Server/MySQL Workbench or XAMPP. Start the MySQL service.

## 2. Configure the backend

Copy `server/.env.example` to `server/.env` and set your MySQL password:

```env
PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=staynest
JWT_SECRET=change_this_staynest_secret
```

The server automatically creates the `staynest` database and its tables on startup.

## 3. Install packages

From the project root:

```bash
npm run setup
```

If the root command is inconvenient, run these separately:

```bash
npm install
cd server
npm install
cd ../client
npm install
cd ..
```

## 4. Add demo data

```bash
npm run seed
```

Demo accounts:

- Seeker: `student@staynest.demo` / `StayNest123`
- Owner: `owner@staynest.demo` / `StayNest123`

## 5. Start the application

```bash
npm run dev
```

Frontend: `http://localhost:3000`
Backend health check: `http://localhost:5001/api/health`

## Main application flow

### Seeker

Welcome → Login/Register → Find stays → Search/filter → View details → Shortlist/Compare → Request visit → Request booking → Review → Profile.

### Owner

Login → Owner dashboard → Add property → See listings → Receive visit/booking requests → Accept/Decline.

## SQL tables

`users`, `properties`, `reviews`, `shortlists`, `bookings`, `visits`, `conversations`, `conversation_participants`, `messages`, `notifications`.

## Important

The original uploaded project had two different frontend layers: a small `App.jsx` login prototype and a larger set of React components/context/API files that were not being used by that `App.jsx`. This version makes the larger React application the actual running frontend and connects it to the SQL backend.
