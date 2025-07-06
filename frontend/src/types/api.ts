export interface ComparisonRequest {
  resume_text: string;
  job_description: string;
}

export interface SkillMatch {
  skill: string;
  found: boolean;
  importance?: number;
}

export interface ComparisonResponse {
  id: number;
  match_score: number;
  required_skills: SkillMatch[];
  found_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  similarity_details: Record<string, any>;
}

export interface ComparisonHistoryResponse {
  id: number;
  match_score: number;
  created_at: string;
  missing_keywords_count: number;
  found_keywords_count: number;
}

export interface HealthResponse {
  status: string;
  nlp_ready: boolean;
  version: string;
}

export interface ErrorResponse {
  detail: string;
}
