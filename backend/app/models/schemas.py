from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional
from datetime import datetime

class ErrorResponse(BaseModel):
    detail: str

class ComparisonRequest(BaseModel):
    resume_text: str = Field(..., min_length=50)
    job_description: str = Field(..., min_length=50)
    
    @validator('resume_text', 'job_description')
    def validate_text(cls, v):
        if len(v.strip()) < 50:
            raise ValueError('Text must be at least 50 characters long')
        return v.strip()

class SkillMatch(BaseModel):
    skill: str
    found: bool
    importance: float = 1.0

class ComparisonResponse(BaseModel):
    id: int
    match_score: float = Field(..., ge=0, le=100)
    required_skills: List[SkillMatch] = []
    found_keywords: List[str] = []
    missing_keywords: List[str] = []
    suggestions: List[str] = []
    similarity_details: Dict[str, Any] = {}

class ComparisonHistoryResponse(BaseModel):
    id: int
    match_score: float
    created_at: datetime
    missing_keywords_count: int
    found_keywords_count: int
    
    class Config:
        from_attributes = True

class HealthResponse(BaseModel):
    status: str
    nlp_ready: bool
    version: str