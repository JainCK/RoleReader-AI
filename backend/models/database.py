from sqlalchemy import Column, Integer, Text, Float, DateTime, JSON 
from sqlalchemy.sql import func
from core.database import Base


class ComparisonHistory(Base):
    """Table to store comparison history and results"""
    __tablename__ = "comparison_history"
    
    id = Column(Integer, primary_key=True, index=True)
    resume_text = Column(Text, nullable=False)
    job_description = Column(Text, nullable=False)
    match_score = Column(Float, nullable=False)
    found_keywords = Column(JSON, nullable=True)
    missing_keywords = Column(JSON, nullable=True)
    suggestions = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<ComparisonHistory(id={self.id}, match_score={self.match_score})>"