from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import pages
from app.core.database import engine, Base

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
    
    # Initialize and login to scraper
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

app.include_router(pages.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "LinkedIn Insights API is running"}
