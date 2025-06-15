from fastapi import Depends
from sqlalchemy.orm import Session
from core.database import get_db
from services import NLPService, ComparisonService

# Global instances
nlp_service = NLPService()
comparison_service = ComparisonService(nlp_service)


def get_nlp_service() -> NLPService:
    """Get NLP service instance"""
    return nlp_service


def get_comparison_service() -> ComparisonService:
    """Get comparison service instance"""
    return comparison_service