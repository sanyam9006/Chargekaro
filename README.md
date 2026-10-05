# ⚡ ChargeKaro — India's Unified EV Charging Hub

> **Find any EV charging station in India. All networks, one app.**  
> Real-time availability, wait times, multi-network aggregation, interactive maps, and navigation.

---

## 🌟 Overview

**ChargeKaro** is a full-featured EV charging station discovery and management platform designed specifically for the Indian electric vehicle ecosystem. It aggregates stations from major charging networks (Tata Power EZ Charge, Jio-bp pulse, Ather Grid, Statiq, Zeon Charging, Fortum Charge & Drive, and more) into a single, intuitive interface.

Built with performance and simplicity in mind, ChargeKaro features a **zero-dependency Node.js backend** and a **lightning-fast, responsive vanilla JavaScript frontend** with Leaflet-powered maps and PWA support.

---

## ✨ Features

- 🗺️ **Interactive Leaflet Map**: Explore EV charging stations across India with custom markers, network color codes, and popups.
- 🔍 **Smart Search & Multi-Filter**: Filter stations by:
  - **Network Provider** (Tata Power, Jio-bp, Ather, Statiq, Zeon, etc.)
  - **Connector Type** (CCS2, Type 2, CHAdeMO, Bharat AC/DC, 15A Socket)
  - **Charging Speed & Power** (Fast DC, Ultra-Fast, Slow AC)
  - **Current Availability** (Available, In Use, Offline)
  - **Amenities** (Café, Restrooms, WiFi, Shopping, 24/7 Security)
- 📋 **Station Details**:
  - Real-time connector availability and live status
  - Tariff rates (₹/kWh or ₹/hr)
  - Operating hours, full address, and turn-by-turn navigation links
- ⭐ **Reviews & Ratings**: Read real community feedback and submit ratings for charging reliability.
- ❤️ **Favorites**: Bookmark your frequent charging spots for instant access.
- 📱 **PWA Ready**: Progressive Web App support for installation on mobile devices.
- ⚡ **Zero-Dependency Backend**: Runs entirely on native Node.js standard libraries (`http`, `fs`, `path`, `url`).

---

## 🛠️ Tech Stack

- **Frontend**:
  - Semantic HTML5 & Modern Vanilla CSS (CSS Variables, Flexbox, CSS Grid)
  - Vanilla JavaScript (ES6+ Modules, Component Architecture)
  - [Leaflet.js](https://leafletjs.com/) for interactive OpenStreetMap rendering
  - Google Fonts (Inter & Space Grotesk)
- **Backend**:
  - Node.js (Built-in `http` server — zero `npm` dependencies required)
  - RESTful JSON API (`/api/v1`)
  - Lightweight JSON-based file database persistence

---

## 📁 Project Structure

```plaintext
chargekaro/
├── public/                     # Frontend client assets
│   ├── css/
│   │   ├── index.css           # Global tokens & base styles
│   │   ├── components.css      # Reusable UI component styles
│   │   ├── pages.css           # Page-level styles (Home, Detail, etc.)
│   │   └── responsive.css      # Media queries & mobile optimizations
│   ├── js/
│   │   ├── components/         # FilterPanel, MapView, StationCard, etc.
│   │   ├── data/               # Seed data for stations and companies
│   │   ├── pages/              # Home, StationList, Favorites, About
│   │   ├── api.js              # Client API service
│   │   └── app.js              # SPA router & app bootstrap
│   ├── assets/                 # Icons and media
│   ├── index.html              # Main HTML entry point
│   └── manifest.json           # PWA web manifest
├── server/                     # Backend server
│   ├── server.js               # Zero-dependency HTTP REST server
│   ├── db.js                   # Database controller & helpers
│   └── database.json           # JSON persistence file
├── .gitignore                  # Git ignore rules
├── package.json                # Project scripts and metadata
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or later recommended)

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sanyam9006/Chargekaro.git
   cd Chargekaro
   ```

2. **Start the application:**
   *(No `npm install` needed! The server runs entirely on Node.js built-ins)*
   ```bash
   npm start
   ```

3. **Open in your browser:**
   ```text
   http://localhost:3000
   ```

---

## 📡 API Endpoints

The backend provides a clean RESTful API under `/api/v1`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/stats` | Summary statistics of charging stations & networks |
| `GET` | `/api/v1/companies` | List all EV charging network operators |
| `GET` | `/api/v1/companies/:id` | Get details of a specific operator |
| `GET` | `/api/v1/stations` | Search and list charging stations (supports filters) |
| `GET` | `/api/v1/stations/:id` | Detailed station information and port availability |
| `GET` | `/api/v1/stations/:id/reviews` | Get reviews for a specific station |
| `POST` | `/api/v1/stations/:id/reviews` | Submit a review for a station |
| `GET` | `/api/v1/favorites` | Retrieve user's bookmarked stations |
| `POST` | `/api/v1/favorites` | Add a station to favorites |
| `DELETE` | `/api/v1/favorites/:stationId` | Remove a station from favorites |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
