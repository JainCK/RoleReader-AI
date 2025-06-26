from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.schemas import (
    ComparisonRequest,
    ComparisonResponse, 
    ComparisonHistoryResponse
)
from app.services import ComparisonService
from app.api.dependencies import get_comparison_service
from app.exceptions import ComparisonException, ValidationException

router = APIRouter()


@router.post("/compare", response_model=ComparisonResponse)
async def compare_resume_job(
    request: ComparisonRequest,
    db: Session = Depends(get_db),
    comparison_service: ComparisonService = Depends(get_comparison_service)
):
    """Compare resume against job description"""
    try:
        return await comparison_service.compare_resume_job(request, db)
    except ValidationException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ComparisonException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/history", response_model=List[ComparisonHistoryResponse])
async def get_comparison_history(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    comparison_service: ComparisonService = Depends(get_comparison_service)
):
    """Get comparison history"""
    try:
        return comparison_service.get_comparison_history(db, limit, offset)
    except ComparisonException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/comparison/{comparison_id}", response_model=ComparisonResponse)
async def get_comparison_details(
    comparison_id: int,
    db: Session = Depends(get_db),
    comparison_service: ComparisonService = Depends(get_comparison_service)
):
    """Get detailed comparison results by ID"""
    try:
        return comparison_service.get_comparison_details(comparison_id, db)
    except ComparisonException as e:
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/comparison/{comparison_id}")
async def delete_comparison(
    comparison_id: int,
    db: Session = Depends(get_db),
    comparison_service: ComparisonService = Depends(get_comparison_service)
):
    """Delete a comparison record"""
    try:
        comparison_service.delete_comparison(comparison_id, db)
        return {"message": "Comparison deleted successfully"}
    except ComparisonException as e:
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )