from pydantic import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()




class Settings(BaseSettings):
    """Application settings"""
    
    # Database
DATABASE_URL = os.getenv("DATABASE_URL")    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_debug: bool = True
    
    # CORS
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://yourdomain.com"
    ]
    
    # Logging
    log_level: str = "INFO"
    
    # NLP
    max_text_length: int = 50000
    min_text_length: int = 50
    similarity_threshold: float = 0.8
    
    # Rate Limiting
    rate_limit_rpm: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        
        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str) -> any:
            if field_name == 'allowed_origins':
                return [x.strip() for x in raw_val.split(',')]
            return cls.json_loads(raw_val)


settings = Settings()