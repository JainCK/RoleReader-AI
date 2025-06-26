from sqlalchemy.orm import Session
from typing import List, Optional
import logging
from database import ComparisonHistory
from app.models.schemas import ComparisonRequest, ComparisonResponse, ComparisonHistoryResponse
from .nlp_service import NLPProcessor
from app.utils.text_utils import validate_text_input
from app.exceptions import ComparisonException, ValidationException

logger = logging.getLogger(__name__)


class ComparisonService:
    """Service for handling resume comparisons"""
    
    def __init__(self, nlp_service: NLPProcessor):
        self.nlp_service = nlp_service
    
    async def compare_resume_job(self, request: ComparisonRequest, db: Session) -> ComparisonResponse:
        """Compare resume against job description"""
        try:
            # Validate inputs
            if not validate_text_input(request.resume_text):
                raise ValidationException("Resume text is too short or invalid")
            
            if not validate_text_input(request.job_description):
                raise ValidationException("Job description is too short or invalid")
            
            # Process with NLP
            comparison_result = await self.nlp_service.compare_texts(
                request.resume_text,
                request.job_description
            )
            
            # Save to database
            db_comparison = ComparisonHistory(
                resume_text=request.resume_text[:1000],
                job_description=request.job_description[:1000],
                match_score=comparison_result["match_score"],
                missing_keywords=comparison_result["missing_keywords"],
                found_keywords=comparison_result["found_keywords"],
                suggestions=comparison_result["suggestions"]
            )
            
            db.add(db_comparison)
            db.commit()
            db.refresh(db_comparison)
            
            return ComparisonResponse(
                id=db_comparison.id,
                match_score=comparison_result["match_score"],
                required_skills=comparison_result["required_skills"],
                found_keywords=comparison_result["found_keywords"],
                missing_keywords=comparison_result["missing_keywords"],
                suggestions=comparison_result["suggestions"],
                similarity_details=comparison_result.get("similarity_details", {})
            )
            
        except (ValidationException, Exception) as e:
            logger.error(f"Error in comparison: {str(e)}")
            raise ComparisonException(f"Comparison failed: {str(e)}")
    
    def get_comparison_history(self, db: Session, limit: int = 10, offset: int = 0) -> List[ComparisonHistoryResponse]:
        """Get comparison history"""
        try:
            comparisons = db.query(ComparisonHistory)\
                .order_by(ComparisonHistory.created_at.desc())\
                .offset(offset)\
                .limit(limit)\
                .all()
            
            return [
                ComparisonHistoryResponse(
                    id=comp.id,
                    match_score=comp.match_score,
                    created_at=comp.created_at,
                    missing_keywords_count=len(comp.missing_keywords) if comp.missing_keywords else 0,
                    found_keywords_count=len(comp.found_keywords) if comp.found_keywords else 0
                )
                for comp in comparisons
            ]
            
        except Exception as e:
            logger.error(f"Error fetching history: {str(e)}")
            raise ComparisonException(f"Failed to fetch history: {str(e)}")
    
    def get_comparison_details(self, comparison_id: int, db: Session) -> ComparisonResponse:
        """Get detailed comparison results by ID"""
        try:
            comparison = db.query(ComparisonHistory)\
                .filter(ComparisonHistory.id == comparison_id)\
                .first()
            
            if not comparison:
                raise ComparisonException("Comparison not found")
            
            required_skills = []
            if comparison.found_keywords:
                required_skills.extend([{"skill": kw, "found": True} for kw in comparison.found_keywords])
            if comparison.missing_keywords:
                required_skills.extend([{"skill": kw, "found": False} for kw in comparison.missing_keywords])
            
            return ComparisonResponse(
                id=comparison.id,
                match_score=comparison.match_score,
                required_skills=required_skills,
                found_keywords=comparison.found_keywords or [],
                missing_keywords=comparison.missing_keywords or [],
                suggestions=comparison.suggestions or [],
                similarity_details={}
            )
            
        except ComparisonException:
            raise
        except Exception as e:
            logger.error(f"Error fetching comparison details: {str(e)}")
            raise ComparisonException(f"Failed to fetch comparison details: {str(e)}")
    
    def delete_comparison(self, comparison_id: int, db: Session) -> bool:
        """Delete a comparison record"""
        try:
            comparison = db.query(ComparisonHistory)\
                .filter(ComparisonHistory.id == comparison_id)\
                .first()
            
            if not comparison:
                raise ComparisonException("Comparison not found")
            
            db.delete(comparison)
            db.commit()
            return True
            
        except ComparisonException:
            raise
        except Exception as e:
            logger.error(f"Error deleting comparison: {str(e)}")
            raise ComparisonException(f"Failed to delete comparison: {str(e)}")
