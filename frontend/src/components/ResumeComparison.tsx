"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { ComparisonRequest, ComparisonResponse } from "@/types/api";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Briefcase,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  RefreshCw,
} from "lucide-react";

export default function ResumeComparison() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
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
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          AI-Powered Analysis
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Compare Your Resume
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get instant feedback on how well your resume matches job requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Input Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Input Documents</CardTitle>
                <CardDescription className="text-base">
                  Paste your resume and job description below
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="resume"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Resume Content
                </Label>
                <Textarea
                  id="resume"
                  placeholder="Paste your complete resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[180px] resize-none border-2 focus:border-blue-500 transition-colors"
                  required
                />
                <p className="text-xs text-gray-500">
                  {resumeText.length} characters
                </p>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="job"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Job Description
                </Label>
                <Textarea
                  id="job"
                  placeholder="Paste the complete job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[180px] resize-none border-2 focus:border-blue-500 transition-colors"
                  required
                />
                <p className="text-xs text-gray-500">
                  {jobDescription.length} characters
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium text-sm">
                      Analysis Failed
                    </p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                disabled={
                  loading || !resumeText.trim() || !jobDescription.trim()
                }
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Analyze Resume Match
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Analysis Results</CardTitle>
                <CardDescription className="text-base">
                  AI-powered insights and recommendations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-32 w-full" />
              </div>
            ) : result ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview" className="font-medium">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="font-medium">
                    Skills Match
                  </TabsTrigger>
                  <TabsTrigger value="suggestions" className="font-medium">
                    Recommendations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div
                        className={`text-5xl font-bold bg-gradient-to-r ${getScoreGradient(
                          result.match_score
                        )} bg-clip-text text-transparent`}
                      >
                        {result.match_score.toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Overall Match Score
                      </p>
                    </div>
                    <Progress
                      value={result.match_score}
                      className="h-4 bg-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-700 mb-1">
                        {result.found_keywords.length}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Matching Skills
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200">
                      <div className="text-2xl font-bold text-red-700 mb-1">
                        {result.missing_keywords.length}
                      </div>
                      <div className="text-sm text-red-600 font-medium">
                        Missing Skills
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-700 text-lg">
                        Found Skills
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.found_keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 text-sm font-medium"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold text-red-700 text-lg">
                        Missing Skills
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="destructive"
                          className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 text-sm font-medium"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="suggestions" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-700 text-lg">
                        AI Recommendations
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {result.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center mt-0.5 flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-sm text-blue-900 leading-relaxed">
                            {suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center text-gray-500 py-12 space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-600 mb-2">
                    Ready for Analysis
                  </p>
                  <p className="text-sm text-gray-500">
                    Enter your resume and job description to see detailed
                    insights
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
