import pytest
import asyncio
from backend.utils.nlp_processor import NLPProcessor
from backend.models.dbModel import ComparisonHistory

@pytest.mark.asyncio
async def test_nlp_processor_initialization():
    """Test NLP processor can be initialized"""
    processor = NLPProcessor()
    await processor.initialize()
    
    assert processor.tech_skills is not None
    assert processor.soft_skills is not None
    assert len(processor.tech_skills) > 0
    assert len(processor.soft_skills) > 0
    
    if processor.session:
        await processor.session.close()

@pytest.mark.asyncio
async def test_preprocess_text():
    """Test text preprocessing"""
    processor = NLPProcessor()
    
    test_text = "Hello, World! This is a TEST with 123 numbers."
    processed = processor._preprocess_text(test_text)
    
    assert processed == "hello world this is a test with 123 numbers"

@pytest.mark.asyncio
async def test_skill_extraction():
    """Test skill matching"""
    processor = NLPProcessor()
    
    text = "I have experience with Python, JavaScript, and React. I also have strong leadership and communication skills."
    
    tech_skills = processor._find_skill_matches(text, processor.tech_skills)
    soft_skills = processor._find_skill_matches(text, processor.soft_skills)
    
    assert "python" in tech_skills
    assert "javascript" in tech_skills
    assert "react" in tech_skills
    assert "leadership" in soft_skills
    assert "communication" in soft_skills

@pytest.mark.asyncio
async def test_keyword_extraction():
    """Test traditional keyword extraction"""
    processor = NLPProcessor()
    
    text = "I am a software engineer with experience in Python development and machine learning projects."
    keywords = processor._extract_keywords_traditional(text)
    
    assert isinstance(keywords, list)
    # Should extract some meaningful keywords

@pytest.mark.asyncio
async def test_compare_resume_to_job(nlp_processor, db_session):
    """Test full comparison workflow"""
    resume_text = "I am a Python developer with 5 years of experience in Django, Flask, and FastAPI. I have worked with PostgreSQL, Redis, and AWS. I have strong problem-solving skills and leadership experience."
    job_description = "We are looking for a Senior Python Developer with experience in web frameworks like Django or Flask. Knowledge of databases and cloud technologies is required. Strong communication skills are essential."
    
    result = await nlp_processor.compare_resume_to_job(
        resume_text=resume_text,
        job_description=job_description,
        db=db_session
    )
    
    assert result.match_score >= 0
    assert result.match_score <= 100
    assert isinstance(result.found_keywords, list)
    assert isinstance(result.missing_keywords, list)
    assert isinstance(result.suggestions, list)
    assert len(result.suggestions) > 0