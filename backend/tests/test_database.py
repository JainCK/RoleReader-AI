import pytest
from database import ComparisonHistory, SessionLocal

def test_comparison_history_creation(db_session):
    """Test creating ComparisonHistory record"""
    
    history = ComparisonHistory(
        resume_text="Test resume",
        job_description="Test job description",
        match_score=85.5,
        found_keywords=["python", "sql"],
        missing_keywords=["java"],
        suggestions=["Learn Java", "Add more projects"]
    )
    
    db_session.add(history)
    db_session.commit()
    db_session.refresh(history)
    
    assert history.id is not None
    assert history.match_score == 85.5
    assert history.found_keywords == ["python", "sql"]
    assert history.missing_keywords == ["java"]
    assert history.created_at is not None

def test_comparison_history_query(db_session):
    """Test querying ComparisonHistory records"""
    
    # Create test records
    for i in range(3):
        history = ComparisonHistory(
            resume_text=f"Test resume {i}",
            job_description=f"Test job {i}",
            match_score=80.0 + i,
            found_keywords=[f"skill{i}"],
            missing_keywords=[f"missing{i}"],
            suggestions=[f"suggestion{i}"]
        )
        db_session.add(history)
    
    db_session.commit()
    
    # Query all records
    all_records = db_session.query(ComparisonHistory).all()
    assert len(all_records) == 3
    
    # Query with limit
    limited_records = db_session.query(ComparisonHistory).limit(2).all()
    assert len(limited_records) == 2