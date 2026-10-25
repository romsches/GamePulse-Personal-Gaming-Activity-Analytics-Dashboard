"""GamePulse Personal Analytics API main application module.

Initializes FastAPI with OpenAPI documentation, CORS middleware,
database table creation lifecycle hooks, and modular sub-routers.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
import app.models  # Ensures all ORM models are registered before metadata operations
from app.routers import activities, analytics, upload

# Pre-initialize schema tables upon module execution
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for startup and shutdown hooks."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Gaming & Activity Personal Analytics Dashboard. Built with FastAPI, pandas, and SQLAlchemy.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Cross-Origin Resource Sharing (CORS) Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount domain routers
app.include_router(activities.router)
app.include_router(analytics.router)
app.include_router(upload.router)


@app.get("/", tags=["Root"], summary="Root service discovery")
def root():
    """Service metadata and interactive documentation endpoints."""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "health_check": "/health"
    }


@app.get("/health", tags=["Health"], summary="System health check")
def health_check():
    """Liveness probe returning operational status."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }
