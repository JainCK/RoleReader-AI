from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional
from datetime import datetime

class ComparisonRequest(BaseModel):
    """Request schema for resume comparison"""
    resume_text: str = Field(..., min_length=50, description="Resume text content")
    job_description: str = Field(..., min_length=50, description="Job description text")
    
    @validator('resume_text', 'job_description')
    def validate_text_length(cls, v):
        if len(v.strip()) < 50:
            raise ValueError('Text must be at least 50 characters long')
        return v.strip()

class SkillMatch(BaseModel):
    """Individual skill match details"""
    skill: str
    found: bool
    importance: Optional[float] = None

class ComparisonResponse(BaseModel):
    """Response schema for comparison results"""
    id: int
    match_score: float = Field(..., ge=0, le=100, description="Match percentage (0-100)")
    required_skills: List[SkillMatch] = Field(default_factory=list)
    found_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    similarity_details: Dict[str, Any] = Field(default_factory=dict)

class ComparisonHistoryResponse(BaseModel):
    """Response schema for comparison history list"""
    id: int
    match_score: float
    created_at: datetime
    missing_keywords_count: int
    found_keywords_count: int
    
    class Config:
        from_attributes = True

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    nlp_ready: bool
    version: str

class ErrorResponse(BaseModel):
    """Error response schema"""
    detail: str
    error_code: Optional[str] = None