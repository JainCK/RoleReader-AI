'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api';
import { ComparisonRequest, ComparisonResponse } from '@/types/api';
import { CheckCircle, XCircle, AlertCircle, FileText, Briefcase } from 'lucide-react';

export default function ResumeComparison() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const request: ComparisonRequest = {
        resume_text: resumeText,
        job_description: jobDescription,
      };

      const response = await apiClient.compareResume(request);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          AI Resume Comparison Tool
        </h1>
        <p className="text-lg text-gray-600">
          Compare your resume against job descriptions using AI-powered analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Input Documents
            </CardTitle>
            <CardDescription>
              Paste your resume and the job description to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume Text</Label>
                <Textarea
                  id="resume"
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job">Job Description</Label>
                <Textarea
                  id="job"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[150px]"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 border border-red-200 bg-red-50 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !resumeText.trim() || !jobDescription.trim()}
              >
                {loading ? 'Analyzing...' : 'Compare Resume'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              AI-powered comparison insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : result ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="suggestions">Tips</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(result.match_score)}`}>
                      {result.match_score.toFixed(1)}%
                    </div>
                    <Progress 
                      value={result.match_score} 
                      className="h-3 mb-4"
                    />
                    <p className="text-sm text-gray-600">Match Score</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-700">
                        {result.found_keywords.length}
                      </div>
                      <div className="text-sm text-green-600">Found Keywords</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-semibold text-red-700">
                        {result.missing_keywords.length}
                      </div>
                      <div className="text-sm text-red-600">Missing Keywords</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-700 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Found Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.found_keywords.map((keyword, index) => (
                        <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-700 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords.map((keyword, index) => (
                        <Badge key={index} variant="destructive" className="bg-red-100 text-red-800">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="suggestions" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-700">Recommendations</h4>
                    <ul className="space-y-2">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your resume and job description to see the analysis results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
