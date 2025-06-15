import re
import asyncio
from typing import Dict, List, Any, Set
from collections import Counter
import logging
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fuzzywuzzy import fuzz, process
from core.exceptions import NLPProcessorException

logger = logging.getLogger(__name__)


class NLPService:
    """NLP service for text processing and analysis"""
    
    def __init__(self):
        self.is_initialized = False
        self.stemmer = PorterStemmer()
        self.stop_words = set()
        self.tech_skills = self._load_tech_skills()
        self.soft_skills = self._load_soft_skills()
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 3),
            min_df=1,
            max_df=0.8
        )
    
    async def initialize(self):
        """Initialize NLTK resources"""
        try:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)
            nltk.download('averaged_perceptron_tagger', quiet=True)
            nltk.download('wordnet', quiet=True)
            
            self.stop_words = set(stopwords.words('english'))
            self.is_initialized = True
            logger.info("NLP Service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize NLP service: {e}")
            raise NLPProcessorException(f"NLP initialization failed: {e}")
    
    def _load_tech_skills(self) -> Set[str]:
        """Load comprehensive list of technical skills"""
        return {
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
            'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'html', 'css', 'sass', 'less',
            'react', 'angular', 'vue', 'django', 'flask', 'fastapi', 'express', 'node.js', 'spring',
            'laravel', 'rails', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
            'jquery', 'bootstrap', 'tailwind', 'next.js', 'nuxt.js', 'gatsby', 'svelte',
            'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'oracle',
            'sqlite', 'dynamodb', 'firebase', 'neo4j',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github', 'circleci',
            'terraform', 'ansible', 'vagrant', 'nginx', 'apache', 'linux', 'ubuntu', 'centos',
            'git', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'photoshop', 'illustrator',
            'postman', 'swagger', 'rest', 'graphql', 'microservices', 'api', 'json', 'xml',
            'agile', 'scrum', 'kanban', 'ci/cd', 'tdd', 'bdd',
            'tableau', 'power-bi', 'looker', 'spark', 'hadoop', 'kafka', 'airflow', 'jupyter',
            'machine-learning', 'deep-learning', 'data-science', 'big-data', 'etl', 'data-warehouse',
            'ios', 'android', 'react-native', 'flutter', 'xamarin', 'cordova', 'ionic',
            'cybersecurity', 'penetration-testing', 'vulnerability-assessment', 'encryption',
            'oauth', 'jwt', 'ssl', 'tls', 'firewall', 'vpn'
        }
    
    def _load_soft_skills(self) -> Set[str]:
        """Load list of soft skills"""
        return {
            'leadership', 'communication', 'teamwork', 'problem-solving', 'critical-thinking',
            'creativity', 'adaptability', 'time-management', 'organization', 'collaboration',
            'project-management', 'analytical', 'detail-oriented', 'self-motivated', 'initiative',
            'multitasking', 'decision-making', 'interpersonal', 'presentation', 'negotiation',
            'customer-service', 'mentoring', 'coaching', 'strategic-thinking', 'innovation'
        }
    
    def _preprocess_text(self, text: str) -> str:
        """Clean and preprocess text"""
        text = text.lower()
        text = re.sub(r'[^\w\s\-\.]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def _extract_keywords(self, text: str, top_n: int = 50) -> List[str]:
        """Extract keywords using TF-IDF and skill matching"""
        processed_text = self._preprocess_text(text)
        skills_found = set()
        
        for skill in self.tech_skills.union(self.soft_skills):
            if skill.replace('-', ' ') in processed_text or skill.replace('-', '') in processed_text:
                skills_found.add(skill)
            else:
                matches = process.extractOne(skill, processed_text.split(), scorer=fuzz.ratio)
                if matches and matches[1] > 80:
                    skills_found.add(skill)
        
        try:
            tfidf_matrix = self.vectorizer.fit_transform([processed_text])
            feature_names = self.vectorizer.get_feature_names_out()
            tfidf_scores = tfidf_matrix.toarray()[0]
            
            top_indices = np.argsort(tfidf_scores)[::-1][:top_n]
            tfidf_keywords = [feature_names[i] for i in top_indices if tfidf_scores[i] > 0]
            
            filtered_keywords = [kw for kw in tfidf_keywords if kw not in self.stop_words and len(kw) > 2]
            skills_found.update(filtered_keywords[:20])
            
        except Exception as e:
            logger.warning(f"TF-IDF extraction failed: {e}")
        
        return list(skills_found)
    
    def _calculate_similarity(self, resume_text: str, job_text: str) -> float:
        """Calculate text similarity using cosine similarity"""
        try:
            vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
            tfidf_matrix = vectorizer.fit_transform([resume_text, job_text])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(similarity * 100)
        except Exception as e:
            logger.warning(f"Similarity calculation failed: {e}")
            return 0.0
    
    def _generate_suggestions(self, missing_keywords: List[str], found_keywords: List[str]) -> List[str]:
        """Generate actionable suggestions based on analysis"""
        suggestions = []
        
        if missing_keywords:
            high_priority_missing = [kw for kw in missing_keywords if kw in self.tech_skills][:5]
            if high_priority_missing:
                suggestions.append(f"Consider adding experience with: {', '.join(high_priority_missing)}")
        
        if len(found_keywords) < 10:
            suggestions.append("Expand your technical skills section to include more relevant keywords")
        
        if len(missing_keywords) > len(found_keywords):
            suggestions.append("Tailor your resume more closely to the job requirements")
        
        suggestions.extend([
            "Use action verbs to describe your achievements (e.g., 'Developed', 'Implemented', 'Led')",
            "Quantify your accomplishments with specific numbers and metrics",
            "Include relevant certifications and training programs",
            "Highlight transferable skills that match the job requirements",
            "Customize your professional summary to align with the job description"
        ])
        
        return suggestions[:8]
    
    async def compare_texts(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Compare resume against job description and return detailed analysis"""
        if not self.is_initialized:
            raise NLPProcessorException("NLP Service not initialized")
        
        try:
            resume_keywords = set(self._extract_keywords(resume_text))
            job_keywords = set(self._extract_keywords(job_description))
            
            found_keywords = list(resume_keywords.intersection(job_keywords))
            missing_keywords = list(job_keywords - resume_keywords)
            
            if job_keywords:
                keyword_match_score = (len(found_keywords) / len(job_keywords)) * 70
            else:
                keyword_match_score = 0
            
            text_similarity = self._calculate_similarity(resume_text, job_description)
            similarity_score = text_similarity * 0.3
            
            match_score = min(keyword_match_score + similarity_score, 100)
            
            suggestions = self._generate_suggestions(missing_keywords, found_keywords)
            
            required_skills = []
            for keyword in job_keywords:
                required_skills.append({
                    "skill": keyword,
                    "found": keyword in found_keywords,
                    "importance": 1.0 if keyword in self.tech_skills else 0.5
                })
            
            required_skills.sort(key=lambda x: (x["found"], x["importance"]), reverse=True)
            
            return {
                "match_score": round(match_score, 2),
                "required_skills": required_skills,
                "found_keywords": sorted(found_keywords),
                "missing_keywords": sorted(missing_keywords),
                "suggestions": suggestions,
                "similarity_details": {
                    "keyword_match_percentage": round(keyword_match_score, 2),
                    "text_similarity_percentage": round(text_similarity, 2),
                    "total_job_keywords": len(job_keywords),
                    "total_resume_keywords": len(resume_keywords),
                    "matched_keywords_count": len(found_keywords)
                }
            }
            
        except Exception as e:
            logger.error(f"Error in text comparison: {e}")
            raise NLPProcessorException(f"Text comparison failed: {str(e)}")