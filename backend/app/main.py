import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.api.routes import forensic, cases

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("crimeface")

app = FastAPI(
    title="CRIMEFACE AI Backend",
    description="Forensic Biometric Analysis & AI Facial Composite Reconstruction System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure local static directory exists and mount it
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(os.path.join(static_dir, "composites"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include Routers
app.include_router(forensic.router, prefix=settings.API_V1_STR)
app.include_router(cases.router, prefix=settings.API_V1_STR)


@app.get("/api/health")
async def health_check():
    return {
        "status": "operational",
        "system": "CRIMEFACE AI Forensic Node",
        "gemini_model": settings.GEMINI_MODEL,
        "image_model": settings.GEMINI_IMAGE_MODEL,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "supabase_configured": bool(settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
