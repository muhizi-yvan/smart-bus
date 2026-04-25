# 🚌 SmartBus — Smart Bus Travel System

A modern, professional, and fully responsive frontend for a Smart Bus Travel System built with **React (Vite)** + **Tailwind CSS**.

---

## 📁 Project Structure

```
smartbus/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                        # App entry point
    ├── App.jsx                         # Router + route definitions
    ├── index.css                       # Global styles + Tailwind layers
    │
    ├── context/
    │   └── AuthContext.jsx             # JWT auth state (login, register, logout)
    │
    ├── services/
    │   ├── api.js                      # Axios instance + all API service functions
    │   └── mockData.js                 # Demo/fallback data for offline usage
    │
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx              # Responsive navbar w/ role-based nav links
    │   │   ├── ProtectedRoute.jsx      # Route guards (ProtectedRoute, AdminRoute, GuestRoute)
    │   │   ├── LoadingSpinner.jsx      # Full-page & inline spinner
    │   │   ├── StatusBadge.jsx         # On Time / Delayed / Departed badge
    │   │   └── Alert.jsx               # Error & success alert component
    │   │
    │   ├── user/
    │   │   ├── BusCard.jsx             # Bus listing card w/ Book Now button
    │   │   └── SeatGrid.jsx            # Interactive seat selection grid
    │   │
    │   └── admin/
    │       └── StatsCard.jsx           # Dashboard summary stat card
    │
    └── pages/
        ├── auth/
        │   ├── LoginPage.jsx           # Login form + demo fill buttons
        │   └── RegisterPage.jsx        # Registration form
        │
        ├── user/
        │   ├── HomePage.jsx            # Hero, search, popular routes, features
        │   ├── BusListPage.jsx         # Filterable bus listing
        │   ├── BookingPage.jsx         # Seat selection + booking confirmation
        │   └── MyTicketsPage.jsx       # User's booking history
        │
        └── admin/
            ├── AdminDashboard.jsx      # Stats overview + recent buses table
            ├── AddBusPage.jsx          # Form to add new bus
            └── ManageBusesPage.jsx     # Full CRUD table with inline edit + status modal
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment (optional)
```bash
# Create a .env file
VITE_API_URL=http://localhost:5000
```
> If no backend is running, the app uses built-in mock data automatically.

### 3. Start development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 🔐 Authentication

JWT tokens are stored in `localStorage`. Role-based routing:
- `role: "user"` → redirected to `/` (passenger interface)
- `role: "admin"` → redirected to `/admin` (admin dashboard)

**Demo credentials** (shown as buttons on login page):
| Role      | Email                  | Password   |
|-----------|------------------------|------------|
| Passenger | user@smartbus.rw       | user123    |
| Admin     | admin@smartbus.rw      | admin123   |

---

## 🌐 API Endpoints Used

| Method | Endpoint                     | Description           | Auth     |
|--------|------------------------------|-----------------------|----------|
| POST   | `/api/users/register`        | Register user         | Public   |
| POST   | `/api/users/login`           | Login (returns JWT)   | Public   |
| GET    | `/api/users/profile`         | Get current user      | Required |
| GET    | `/api/buses`                 | List all buses        | Public   |
| POST   | `/api/buses`                 | Add new bus           | Admin    |
| PUT    | `/api/buses/:id`             | Update bus            | Admin    |
| DELETE | `/api/buses/:id`             | Delete bus            | Admin    |
| POST   | `/api/tickets`               | Book a ticket         | Required |
| GET    | `/api/tickets`               | All tickets           | Admin    |
| GET    | `/api/tickets/user/:userId`  | User's tickets        | Required |

> The API service (`src/services/api.js`) automatically attaches the `Authorization: Bearer <token>` header to all protected requests.

---

## 🎨 Design System

- **Font**: Syne (display/headings) + DM Sans (body)
- **Theme**: Dark mode with sky-blue brand accent (`#0ea5e9`)
- **Colors**: Custom Tailwind config with `brand`, `surface` palettes
- **Components**: Cards, badges, inputs, buttons — all via reusable Tailwind `@layer components`

---

## 📦 Tech Stack

| Library           | Version  | Purpose                        |
|-------------------|----------|--------------------------------|
| React             | 18.x     | UI framework                   |
| Vite              | 5.x      | Build tool                     |
| Tailwind CSS      | 3.x      | Utility-first styling          |
| React Router DOM  | 6.x      | Client-side routing            |
| Axios             | 1.x      | HTTP client with interceptors  |
| Lucide React      | 0.344    | Icon library                   |

---

## ✨ Features Summary

### Passenger
- 🏠 Hero landing page with city search
- 🚌 Bus listing with live filters (from, to, date, status)
- 💺 Interactive seat grid — booked seats disabled
- 🎫 My Tickets — booking history with status
- 📱 Fully mobile-responsive

### Admin
- 📊 Dashboard with stats (buses, bookings, occupancy)
- ➕ Add bus form with validation
- 📋 Manage buses — inline edit, delete confirmation modal
- 🔄 Status update modal (On Time / Delayed / Departed)
