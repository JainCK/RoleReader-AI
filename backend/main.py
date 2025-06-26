from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from sqlalchemy.orm import Session

from app.config.settings import Settings
from database import create_tables, get_db, ComparisonHistory
from app.models.schemas import (
    ComparisonRequest, 
    ComparisonResponse, 
    ComparisonHistoryResponse,
    HealthResponse
)
from app.services.nlp_service import NLPProcessor

settings = Settings()

# Global NLP processor
nlp_processor = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global nlp_processor
    create_tables()
    nlp_processor = NLPProcessor()
    await nlp_processor.initialize()
    yield
    # Shutdown
    if nlp_processor:
        await nlp_processor.close()

app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        nlp_ready=nlp_processor is not None and nlp_processor.initialized,
        version=settings.api_version
    )

@app.post("/compare", response_model=ComparisonResponse)
async def compare_resume(
    request: ComparisonRequest,
    db: Session = Depends(get_db)
):
    if not nlp_processor or not nlp_processor.initialized:
        raise HTTPException(status_code=503, detail="NLP processor not ready")
    
    try:
        result = await nlp_processor.compare_resume_to_job(
            resume_text=request.resume_text,
            job_description=request.job_description,
            db=db
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=list[ComparisonHistoryResponse])
async def get_comparison_history(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    history = db.query(ComparisonHistory)\
        .order_by(ComparisonHistory.created_at.desc())\
        .limit(limit)\
        .all()
    
    return [
        ComparisonHistoryResponse(
            id=item.id,
            match_score=item.match_score,
            created_at=item.created_at,
            missing_keywords_count=len(item.missing_keywords or []),
            found_keywords_count=len(item.found_keywords or [])
        )
        for item in history
    ]

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)