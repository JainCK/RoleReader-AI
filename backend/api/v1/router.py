from fastapi import APIRouter
from .endpoints import health, comparison

api_router = APIRouter()

# Include health endpoints
api_router.include_router(health.router, tags=["health"])

# Include comparison endpoints  
api_router.include_router(comparison.router, prefix="/api", tags=["comparison"])