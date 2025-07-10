import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database - Default to PostgreSQL for production
    database_url: str = "postgresql://username:password@localhost:5432/rolereader_db"
    
    # Test database override
    testing: bool = False
    test_database_url: str = "sqlite:///./test.db"
    
    # API Keys
    huggingface_api_token: Optional[str] = None
    
    # API Configuration
    api_title: str = "AI Resume Comparison API"
    api_description: str = "Compare resumes against job descriptions using AI"
    api_version: str = "1.0.0"
    
    # CORS
    allowed_origins: list = ["http://localhost:3000", "http://localhost:3001"]
    
    # Text Processing
    min_text_length: int = 500
    max_text_length: int = 20000
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @property
    def get_database_url(self) -> str:
        """Return appropriate database URL based on environment"""
        if self.testing:
            return self.test_database_url
        return self.database_url

settings = Settings()