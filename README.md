# 📊 GamePulse — Personal Gaming & Activity Analytics Dashboard

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![pandas](https://img.shields.io/badge/pandas-2.2+-150458?style=for-the-badge&logo=pandas&logoColor=white)](https://pandas.pydata.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4+-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Desktop_Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **GamePulse** is an end-to-end data intelligence and personal analytics platform. It ingests gaming and personal activity logs (CSV/JSON), processes vectorized metrics and monthly time-series using **pandas** and **SQLAlchemy**, and visualizes them on a sleek, reactive dashboard with **Chart.js** and **Tailwind CSS**.

---

## 🏛️ System Architecture

```
                                  ┌────────────────────────┐
                                  │      Client Web UI     │
                                  │ (React 18 + Chart.js)  │
                                  └───────────┬────────────┘
                                              │ Port :3000 / :5173
                                              ▼
                                  ┌────────────────────────┐
                                  │   Reverse Proxy / API  │
                                  │     (Nginx / Vite)     │
                                  └───────────┬────────────┘
                                              │ HTTP /api/*
                                              ▼
                                  ┌────────────────────────┐
                                  │    FastAPI Backend     │
                                  │  (Pydantic v2 + Uvicorn│
                                  └──────┬──────────┬──────┘
                                         │          │
                 Vectorized Aggregations │          │ Queries & CRUD
                                         ▼          ▼
                                   ┌──────────┐ ┌──────────────┐
                                   │  pandas  │ │  SQLAlchemy  │
                                   │  Engine  │ │  ORM Engine  │
                                   └──────────┘ └──────┬───────┘
                                                       │
                                        ┌──────────────┴──────────────┐
                                        ▼                             ▼
                                ┌───────────────┐             ┌───────────────┐
                                │ PostgreSQL 16 │  (or local) │ SQLite 3 (Dev)│
                                │  (Production) │             │  (Zero-config)│
                                └───────────────┘             └───────────────┘
```

---

## 🌟 Key Capabilities

### 1. Robust File Ingestion & Intelligent Column Mapping
- **Formats**: Drag-and-drop ingestion of standard `.csv` and `.json` files (up to 15 MB).
- **Fuzzy Header Normalization**: Automatically normalizes synonyms without user intervention:
  - `game`, `name`, `game_title` $\rightarrow$ `title`
  - `genre`, `type` $\rightarrow$ `category`
  - `hours`, `time_spent`, `duration` $\rightarrow$ `hours_played`
  - `cost`, `spent`, `price` $\rightarrow$ `money_spent`
  - `device`, `system` $\rightarrow$ `platform`
- **Validation**: Strict schema verification, automated timestamp coercion, and null-value remediation via pandas.
- **One-Click Demo Population**: Built-in button to populate the dashboard with realistic multi-month sample data.

### 2. High-Performance Vectorized Analytics
- **Entertainment Efficiency**: Calculates aggregate cost per hour (`total_spent / total_hours`), quantifying personal ROI on entertainment.
- **Monthly Time-Series Dynamics**: Dual-axis bar and line aggregation tracking hours played vs. monthly expenditure.
- **Genre & Platform Share**: Vectorized percentage distribution computation across game categories and hardware platforms (PC, PS5, Xbox, Switch, Mobile).
- **Top 10 Ranking**: Top-performing titles ranked by cumulative gameplay duration.

### 3. Multi-Dimensional Real-Time Filtering
- Dynamic title search, category filter, platform filter, and custom date boundaries.
- Quick presets: **All Time**, **30 Days**, **90 Days**, and **6 Months**.
- Instant re-aggregation: All KPI summary cards and Chart.js visualizations recalculate dynamically without page reload.

### 4. Dual-Mode Storage Architecture
- **Production/Docker**: PostgreSQL 16 with pre-ping connection pooling and persistent volume mapping.
- **Local Dev / Testing**: Zero-configuration SQLite fallback, allowing immediate standalone execution without external dependencies.

---

## 🖥️ Running via Docker Desktop (One-Click GUI Experience)

This project is tailored specifically for **Docker Desktop**. You do **not** need to run continuous terminal commands to use the application.

### Initial 1-Click Setup:
Double-click the included launcher script in the project root:
```
Launch-Docker.bat
```
This script ensures Docker Desktop is running, registers the container group, and automatically opens the dashboard in your default browser.

---

### Managing Directly Inside Docker Desktop:

Once launched, the project permanently appears in the **Docker Desktop GUI**:

1. Open **Docker Desktop**.
2. Click on the **Containers** tab in the left sidebar.
3. Locate the container group named **`gamepulse-analytics`**:

| Container | Image / Role | Port Link in Docker Desktop |
| :--- | :--- | :--- |
| **`gamepulse-frontend`** | React 18 + Nginx Web Dashboard | Click **`3000:80`** $\rightarrow$ opens [http://localhost:3000](http://localhost:3000) |
| **`gamepulse-backend`** | FastAPI REST Analytics API | Click **`8000:8000`** $\rightarrow$ opens [http://localhost:8000/docs](http://localhost:8000/docs) |
| **`gamepulse-db`** | PostgreSQL 16 Alpine Database | Port `5432:5432` (Health-monitored) |

4. **Starting / Stopping**:
   - Click the green **Play (▶️)** button next to `gamepulse-analytics` to start all services.
   - Click the port link **`3000:80`** right inside Docker Desktop to launch the Web UI in your browser.
   - Click the square **Stop (⏹️)** button to pause the application whenever you are done.

---

## 💻 Local Development Setup (Without Docker)

If you prefer to run the codebase locally using Python and Node.js:

### Prerequisites:
- Python 3.11+
- Node.js 18+ & npm

### 1. Backend Setup:
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate       # On Windows (PowerShell/CMD)
# source venv/bin/activate    # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
*API & Interactive Documentation will be available at:* [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Frontend Setup:
In a separate terminal:
```bash
cd frontend

# Install npm packages
npm install

# Start Vite dev server
npm run dev
```
*Web Dashboard will be available at:* [http://localhost:5173](http://localhost:5173).

---

## 🧪 Automated Testing Suite

The backend includes a comprehensive `pytest` test suite verifying health probes, CRUD operations, pandas analytics math, and file parsing:

```bash
cd backend
.\venv\Scripts\python.exe -m pytest -v
```

### Test Coverage Highlights:
- `test_health_check`: Liveness probe status verification.
- `test_create_and_read_activity`: Full lifecycle persistence and schema compliance.
- `test_analytics_calculation`: Vectorized pandas aggregation math (hours, $/hr, top games, monthly trends).
- `test_csv_upload`: In-memory multipart CSV ingestion and header normalization.
- `test_load_sample_data`: Pre-packaged dataset ingestion workflow.

---

## 📡 REST API Reference

Interactive documentation is automatically generated and accessible via **Swagger UI** (`/docs`) and **ReDoc** (`/redoc`).

### Core Endpoints:

#### `GET /api/analytics`
Computes KPI summary statistics and visual chart data.
- **Parameters**: `start_date`, `end_date`, `category`, `platform`, `search`
- **Response**:
```json
{
  "kpis": {
    "total_hours": 128.5,
    "total_spent": 284.95,
    "avg_cost_per_hour": 2.22,
    "total_activities": 37,
    "unique_games": 12,
    "top_game": "Baldur's Gate 3",
    "top_category": "RPG",
    "total_days_active": 32
  },
  "monthly_trend": [
    { "month": "2026-05", "hours": 27.5, "spent": 144.97, "session_count": 8 },
    { "month": "2026-06", "hours": 32.0, "spent": 39.99, "session_count": 10 }
  ],
  "category_distribution": [
    { "category": "RPG", "hours": 58.2, "spent": 119.98, "percentage": 45.3 }
  ],
  "platform_distribution": [
    { "platform": "PC", "hours": 94.0, "count": 26 }
  ],
  "top_games": [
    { "title": "Baldur's Gate 3", "category": "RPG", "total_hours": 34.5, "total_spent": 59.99, "sessions_count": 7 }
  ],
  "categories_list": ["Action RPG", "Indie Roguelike", "RPG", "Shooter", "Strategy"],
  "platforms_list": ["Nintendo Switch", "PC", "PS5", "Xbox Series X"]
}
```

#### `GET /api/activities`
Retrieves a paginated list of activity records.
- **Parameters**: `skip` (default 0), `limit` (default 25), `search`, `category`, `platform`, `start_date`, `end_date`

#### `POST /api/activities`
Creates a single activity record manually.
- **Payload**:
```json
{
  "title": "Elden Ring: Shadow of the Erdtree",
  "category": "Action RPG",
  "platform": "PS5",
  "date": "2026-10-15",
  "hours_played": 4.5,
  "money_spent": 39.99,
  "rating": 9.8,
  "notes": "Defeated Messmer after several attempts"
}
```

#### `POST /api/upload`
Multipart file upload accepting `.csv` or `.json` files.

#### `POST /api/upload/load-sample`
Populates the database with the included multi-month sample dataset.

#### `DELETE /api/activities`
Purges all activity records from the database.

---

## 📂 Data Schema Specification

### CSV Format (`sample_data/gaming_activity.csv`):
```csv
title,category,platform,date,hours_played,money_spent,rating,notes
Baldur's Gate 3,RPG,PC,2026-05-02,4.5,59.99,10.0,Created High Elf Wizard
Cyberpunk 2077,RPG,PC,2026-06-01,3.5,29.99,9.5,Phantom Liberty expansion
Counter-Strike 2,Shooter,PC,2026-07-12,1.5,0.0,8.0,Competitive matches
```

### JSON Format (`sample_data/gaming_activity.json`):
```json
[
  {
    "title": "Black Myth: Wukong",
    "category": "Action RPG",
    "platform": "PC",
    "date": "2026-08-20",
    "hours_played": 4.5,
    "money_spent": 59.99,
    "rating": 9.6,
    "notes": "Chapter 1 completed"
  }
]
```

---

## 💼 Senior Engineering Highlights & Interview Talking Points

1. **Vectorized Aggregation vs. Database Bottlenecks**:
   - Rather than overloading the database with numerous complex `GROUP BY` subqueries on every filter combination, the backend executes a single indexed SQL query and uses **pandas** for high-throughput vectorized in-memory aggregations and time-series resampling.
2. **Schema Resilience & Dialect Ingestion**:
   - The file upload parser gracefully reconciles column variations, encoding differences, and date formats across user datasets, ensuring production reliability without throwing unexpected unhandled exceptions.
3. **Decoupled Architecture**:
   - Strict separation between domain logic (`analytics.py`), persistence abstractions (`crud.py`), ORM schemas (`models.py`), and contract validations (`schemas.py`).
4. **Optimized Containerization**:
   - Multi-stage Docker build for the React frontend, yielding an ultra-lightweight Nginx production image with gzipped static assets and integrated reverse proxying.
5. **Observability & Diagnostics**:
   - Built-in `/health` endpoint and PostgreSQL container healthcheck verification guaranteeing that backend workers only connect once the database is fully ready.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
