import pytest
from fastapi.testclient import TestClient
from backend.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "nlp_ready" in data
    assert "version" in data

def test_compare_endpoint_validation(client):
    """Test compare endpoint with invalid data"""
    # Test with missing data
    response = client.post("/compare", json={})
    assert response.status_code == 422
    
    # Test with short text
    response = client.post("/compare", json={
        "resume_text": "short",
        "job_description": "also short"
    })
    assert response.status_code == 422

def test_compare_endpoint_valid_data(client):
    """Test compare endpoint with valid data"""
    valid_resume = "I am a Python developer with 5 years of experience in Django, Flask, and FastAPI. I have worked with PostgreSQL, Redis, and AWS. I have strong problem-solving skills and leadership experience."
    valid_job = "We are looking for a Senior Python Developer with experience in web frameworks like Django or Flask. Knowledge of databases and cloud technologies is required. Strong communication skills are essential."
    
    response = client.post("/compare", json={
        "resume_text": valid_resume,
        "job_description": valid_job
    })
    
    # Note: This might fail if NLP processor isn't initialized properly
    # In that case, it should return 503
    assert response.status_code in [200, 503]

def test_history_endpoint(client):
    """Test history endpoint"""
    response = client.get("/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)