import pytest
from pydantic import ValidationError
from backend.models.textModel import ComparisonRequest, ComparisonResponse, SkillMatch

def test_comparison_request_validation():
    """Test ComparisonRequest validation"""
    
    # Valid request
    valid_request = ComparisonRequest(
        resume_text="This is a valid resume text with more than fifty characters in it to pass validation.",
        job_description="This is a valid job description with more than fifty characters in it to pass validation."
    )
    assert valid_request.resume_text is not None
    assert valid_request.job_description is not None
    
    # Invalid request - too short
    with pytest.raises(ValidationError):
        ComparisonRequest(
            resume_text="short",
            job_description="short"
        )

def test_skill_match_model():
    """Test SkillMatch model"""
    skill = SkillMatch(skill="python", found=True, importance=0.8)
    assert skill.skill == "python"
    assert skill.found is True
    assert skill.importance == 0.8

def test_comparison_response_model():
    """Test ComparisonResponse model"""
    response = ComparisonResponse(
        id=1,
        match_score=75.5,
        required_skills=[SkillMatch(skill="python", found=True)],
        found_keywords=["python", "programming"],
        missing_keywords=["java"],
        suggestions=["Learn Java"],
        similarity_details={"method": "tfidf", "score": 0.75}
    )
    
    assert response.id == 1
    assert response.match_score == 75.5
    assert len(response.required_skills) == 1
    assert "python" in response.found_keywords
