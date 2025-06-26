import re
from typing import Dict, Any, Optional
import logging

from app.config import settings

logger = logging.getLogger(__name__)


def validate_text_input(text: str, min_length: int = 50) -> bool:
    """Validate text input for minimum length and content quality"""
    if not text or not isinstance(text, str):
        return False
    
    cleaned_text = text.strip()
    
    if len(cleaned_text) < min_length:
        return False
    
    meaningful_chars = re.sub(r'[^\w\s]', '', cleaned_text)
    if len(meaningful_chars) < min_length * 0.7:
        return False
    
    return True


def sanitize_text(text: str) -> str:
    """Sanitize text input by removing potentially harmful content"""
    if not text:
        return ""
    
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    
    return text.strip()


def extract_contact_info(text: str) -> Dict[str, Optional[str]]:
    """Extract basic contact information from resume text"""
    contact_info = {
        "email": None,
        "phone": None,
        "linkedin": None
    }
    
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email_match = re.search(email_pattern, text)
    if email_match:
        contact_info["email"] = email_match.group()
    
    phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phone_match = re.search(phone_pattern, text)
    if phone_match:
        contact_info["phone"] = phone_match.group()
    
    linkedin_pattern = r'linkedin\.com/in/[\w-]+'
    linkedin_match = re.search(linkedin_pattern, text, re.IGNORECASE)
    if linkedin_match:
        contact_info["linkedin"] = linkedin_match.group()
    
    return contact_info


def calculate_keyword_density(text: str, keywords: list) -> Dict[str, float]:
    """Calculate keyword density in text"""
    if not text or not keywords:
        return {}
    
    text_lower = text.lower()
    word_count = len(text_lower.split())
    
    keyword_density = {}
    for keyword in keywords:
        keyword_lower = keyword.lower()
        count = text_lower.count(keyword_lower)
        density = (count / word_count) * 100 if word_count > 0 else 0
        keyword_density[keyword] = round(density, 2)
    
    return keyword_density


def format_suggestions(suggestions: list, max_length: int = 150) -> list:
    """Format suggestions to ensure they're concise and actionable"""
    formatted_suggestions = []
    
    for suggestion in suggestions:
        if len(suggestion) > max_length:
            suggestion = suggestion[:max_length-3] + "..."
        
        if not any(suggestion.lower().startswith(prefix) for prefix in 
                  ['consider', 'add', 'include', 'improve', 'enhance', 'try', 'focus']):
            suggestion = f"Consider: {suggestion}"
        
        formatted_suggestions.append(suggestion)
    
    return formatted_suggestions


def get_text_statistics(text: str) -> Dict[str, int]:
    """Get basic statistics about the text"""
    if not text:
        return {"word_count": 0, "character_count": 0, "sentence_count": 0}
    
    words = text.split()
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    return {
        "word_count": len(words),
        "character_count": len(text),
        "sentence_count": len(sentences)
    }


def log_comparison_metrics(resume_stats: Dict, job_stats: Dict, match_score: float):
    """Log metrics for monitoring and analytics"""
    logger.info(f"Comparison completed - Match Score: {match_score}%")
    logger.info(f"Resume Stats: {resume_stats}")
    logger.info(f"Job Stats: {job_stats}")


def generate_comparison_id() -> str:
    """Generate a unique comparison ID for tracking"""
    import uuid
    return str(uuid.uuid4())[:8]