# LinkedIn Insights Service

A production-grade, full-stack application for analyzing LinkedIn Company Pages.
Built with **FastAPI**, **PostgreSQL**, **React**, **Three.js**, and **Tailwind CSS**.

## Features

- **Automated Scraping**: Fetches public data using Playwright (headless).
- **Store-First Logic**: Caches results in Postgres to minimize external requests.
- **Premium UI**: 3D interactive elements, Glassmorphism, and GSAP animations.
- **Data Insights**: Visualizes followers, posts, and engagement metrics.

## Tech Stack

### Backend
- **FastAPI**: High-performance Async Python API
- **SQLAlchemy 2.0**: Modern ORM with Async Support
- **PostgreSQL**: Relational Database
- **Playwright**: Robust scraping engine
- **Alembic**: Database migrations

### Frontend
- **React (Vite)**: Fast frontend tooling
- **Tailwind CSS**: Utility-first styling
- **React Three Fiber**: 3D WebGL implementation
- **GSAP**: Professional animation library

## Setup & Running

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (Local development)

### Quick Start (Docker)
1. Clone the repository.
2. Run the full stack:
   ```bash
   docker compose up --build
   ```
3. Access the App:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### API Usage
- **Get Page Details**: `GET /api/v1/pages/{page_id}`
  - Example: `curl http://localhost:8000/api/v1/pages/google`

### Testing
Run backend tests using pytest:
```bash
cd backend
python -m venv venv
# Activate venv
pip install -r requirements.txt
pytest
```

## Architecture
- **Scraper**: Uses `Playwright` to navigate public LinkedIn pages. Falls back to meta tag extraction if standard selectors are obfuscated.
- **Database**: `CompanyPage` is the parent entity. `Post` and `Employee` are children with cascading deletes.

## Limitations
- **Public Scraping**: LinkedIn aggressively blocks scrapers. Login-based scraping is disabled for safety. Minimal data is extracted via generic meta tags if the main DOM is obfuscated.
- **Rate Limiting**: Not strictly enforced at API level, but recommended to avoid IP bans.
