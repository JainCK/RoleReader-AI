from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import uvicorn

from core.database import engine, Base
from api.v1.router import api_router
from api.dependencies import nlp_service
from config import settings

# Configure logging
logging.basicConfig(level=getattr(logging, settings.log_level))
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting up AI Resume Comparison API...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize NLP service
    await nlp_service.initialize()
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Resume Comparison API...")


# Create FastAPI app
app = FastAPI(
    title="AI Resume Comparison API",
    description="Compare resumes against job descriptions using AI-powered analysis",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host=settings.api_host, 
        port=settings.api_port, 
        reload=settings.api_debug
    )