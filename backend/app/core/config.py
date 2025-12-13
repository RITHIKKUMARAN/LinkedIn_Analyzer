import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LinkedIn Insights API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/linkedin_insights")
    LINKEDIN_USERNAME: str = ""
    LINKEDIN_PASSWORD: str = ""
    MANUAL_LOGIN: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
