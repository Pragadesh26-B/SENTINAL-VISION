from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "CRIMEFACE AI Backend"
    API_V1_STR: str = "/api"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Gemini AI
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_IMAGE_MODEL: str = "imagen-3.0-generate-002"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    STORAGE_BUCKET_NAME: str = "crimeface-sketches"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
