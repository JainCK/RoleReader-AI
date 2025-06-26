# File: backend/api/v1/endpoints/health.py
from fastapi import APIRouter, Depends
from app.models.schemas import HealthResponse
from app.services import NLPService
from app.api.dependencies import get_nlp_service

router = APIRouter()


@router.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {"message": "AI Resume Comparison API", "status": "healthy"}


@router.get("/health", response_model=HealthResponse)
async def health_check(nlp_service: NLPService = Depends(get_nlp_service)):
    """Detailed health check"""
    return HealthResponse(
        status="healthy",
        nlp_ready=nlp_service.is_initialized,
        version="1.0.0"
    )