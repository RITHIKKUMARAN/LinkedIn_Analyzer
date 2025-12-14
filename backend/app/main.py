import sys
import asyncio

# CRITICAL: Must be set BEFORE any other async code runs on Windows
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import pages, chat
from app.core.database import engine, Base
from app.core.config import settings

app = FastAPI(
    title="LinkedIn Insights API",
    description="API for fetching and analyzing LinkedIn Company Page data",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default
    "*" # Allow all for dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # Initialize database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Scraper initialization disabled due to Windows Playwright compatibility issues
    # The scraper will be initialized on-demand when first scraping request is made
    # Uncomment below if running on Linux/Mac or after fixing Windows event loop
    """
    print("=" * 50)
    print("ATTEMPTING TO START SCRAPER...")
    print("=" * 50)
    try:
        from app.api.endpoints.pages import scraper
        print("Scraper imported successfully")
        await scraper.start()
        print("Scraper.start() completed")
    except Exception as e:
        print(f"ERROR starting scraper: {e}")
        import traceback
        traceback.print_exc()
    """

app.include_router(pages.router, prefix="/api/v1", tags=["pages"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])

@app.get("/")
async def root():
    return {"message": "LinkedIn Insights API is running"}
