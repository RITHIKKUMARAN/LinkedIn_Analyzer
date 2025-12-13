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
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(pages.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "LinkedIn Insights API is running"}
