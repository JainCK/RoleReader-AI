import re
import asyncio
import aiohttp
from typing import List, Dict, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fuzzywuzzy import fuzz
from sqlalchemy.orm import Session

from .config import settings
from .database import ComparisonHistory
from .models import ComparisonResponse, SkillMatch

class NLPProcessor:
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.tech_skills = self._load_tech_skills()
        self.soft_skills = self._load_soft_skills()
        self.tfidf = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.initialized = False
        
    async def initialize(self):
        """Initialize async session"""
        if not self.initialized:
            self.session = aiohttp.ClientSession()
            self.initialized = True
    
    async def close(self):
        """Close async session"""
        if self.session:
            await self.session.close()
            self.session = None
            self.initialized = False
    
    def _load_tech_skills(self) -> List[str]:
        return [
            "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
            "ruby", "php", "html", "css", "react", "angular", "vue", "node.js",
            "django", "flask", "fastapi", "spring", "mysql", "postgresql", "mongodb",
            "redis", "aws", "azure", "docker", "kubernetes", "git", "linux"
        ]
    
    def _load_soft_skills(self) -> List[str]:
        return [
            "leadership", "communication", "teamwork", "problem solving",
            "critical thinking", "creativity", "adaptability", "time management",
            "project management", "analytical thinking", "collaboration"
        ]
    
    def _preprocess_text(self, text: str) -> str:
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text.lower().strip()
    
    def _find_skill_matches(self, text: str, skills_list: List[str]) -> List[str]:
        found_skills = []
        processed_text = self._preprocess_text(text)
        
        for skill in skills_list:
            if skill.lower() in processed_text:
                found_skills.append(skill)
            elif any(fuzz.ratio(skill.lower(), word) > 85 
                    for word in processed_text.split()):
                found_skills.append(skill)
        
        return list(set(found_skills))
    
    def _calculate_similarity(self, resume_text: str, job_text: str) -> Tuple[float, Dict]:
        try:
            processed_resume = self._preprocess_text(resume_text)
            processed_job = self._preprocess_text(job_text)
            
            tfidf_matrix = self.tfidf.fit_transform([processed_resume, processed_job])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            score = float(similarity * 100)
            
            return max(0.0, min(100.0, score)), {"method": "tfidf", "score": score}
        except Exception as e:
            return 0.0, {"method": "fallback", "error": str(e)}
    
    def _generate_suggestions(self, missing_keywords: List[str]) -> List[str]:
        suggestions = []
        
        if missing_keywords:
            suggestions.append(
                f"Add these key skills: {', '.join(missing_keywords[:5])}"
            )
        
        suggestions.extend([
            "Use specific metrics and numbers to quantify achievements",
            "Include relevant action verbs in job descriptions",
            "Tailor your summary to match the job requirements",
            "Add relevant certifications or training"
        ])
        
        return suggestions[:5]
    
    async def compare_resume_to_job(self, resume_text: str, job_description: str, 
                                  db: Session) -> ComparisonResponse:
        # Extract skills
        resume_tech_skills = self._find_skill_matches(resume_text, self.tech_skills)
        job_tech_skills = self._find_skill_matches(job_description, self.tech_skills)
        
        resume_soft_skills = self._find_skill_matches(resume_text, self.soft_skills)
        job_soft_skills = self._find_skill_matches(job_description, self.soft_skills)
        
        # Combine skills
        all_resume_skills = list(set(resume_tech_skills + resume_soft_skills))
        all_job_skills = list(set(job_tech_skills + job_soft_skills))
        
        # Find matches
        found_keywords = list(set(all_resume_skills) & set(all_job_skills))
        missing_keywords = list(set(all_job_skills) - set(all_resume_skills))
        
        # Calculate similarity
        match_score, similarity_details = self._calculate_similarity(
            resume_text, job_description
        )
        
        # Create skill matches
        required_skills = []
        for skill in all_job_skills:
            required_skills.append(SkillMatch(
                skill=skill,
                found=skill in all_resume_skills,
                importance=1.0 if skill in job_tech_skills else 0.7
            ))
        
        # Generate suggestions
        suggestions = self._generate_suggestions(missing_keywords)
        
        # Save to database
        comparison_record = ComparisonHistory(
            resume_text=resume_text[:1000],
            job_description=job_description[:1000],
            match_score=match_score,
            found_keywords=found_keywords,
            missing_keywords=missing_keywords,
            suggestions=suggestions
        )
        
        db.add(comparison_record)
        db.commit()
        db.refresh(comparison_record)
        
        return ComparisonResponse(
            id=comparison_record.id,
            match_score=match_score,
            required_skills=required_skills,
            found_keywords=found_keywords,
            missing_keywords=missing_keywords,
            suggestions=suggestions,
            similarity_details=similarity_details
        )