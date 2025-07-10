"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api";
import { ComparisonHistoryResponse } from "@/types/api";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Calendar,
  Target,
  RefreshCw,
} from "lucide-react";

export default function ComparisonHistory() {
  const [history, setHistory] = useState<ComparisonHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getComparisonHistory(20);
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous)
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous)
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAverageScore = () => {
    if (history.length === 0) return 0;
    return (
      history.reduce((sum, item) => sum + item.match_score, 0) / history.length
    );
  };

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50/50">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Analysis History</CardTitle>
              <CardDescription className="text-base">
                Track your resume optimization progress
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-xl"
              >
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50/50">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Analysis History</CardTitle>
              <CardDescription className="text-base">
                Track your resume optimization progress
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <p className="text-red-600 font-medium mb-2">
                Failed to Load History
              </p>
              <p className="text-sm text-gray-500 mb-4">{error}</p>
              <Button onClick={loadHistory} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50/50">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Analysis History</CardTitle>
              <CardDescription className="text-base">
                Track your resume optimization progress
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={loadHistory}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-700 mb-1">
                {history.length}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Total Analyses
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div
                className={`text-2xl font-bold mb-1 bg-gradient-to-r ${getScoreGradient(
                  getAverageScore()
                )} bg-clip-text text-transparent`}
              >
                {getAverageScore().toFixed(1)}%
              </div>
              <div className="text-sm text-purple-600 font-medium">
                Average Score
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-700 mb-1">
                {Math.max(...history.map((h) => h.match_score)).toFixed(1)}%
              </div>
              <div className="text-sm text-green-600 font-medium">
                Best Score
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-600 mb-2">
                No Analysis History
              </p>
              <p className="text-sm text-gray-500">
                Complete your first resume analysis to see results here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="group flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-gradient-to-r hover:from-white hover:to-indigo-50/50 transition-all duration-200"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-indigo-500" />
                      <span className="font-semibold text-gray-900">
                        Analysis #{item.id}
                      </span>
                    </div>
                    {index > 0 && (
                      <div className="flex items-center gap-1">
                        {getTrendIcon(
                          item.match_score,
                          history[index - 1].match_score
                        )}
                        <span className="text-xs text-gray-500">
                          {(
                            item.match_score - history[index - 1].match_score
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-600 font-medium">
                        {item.found_keywords_count} found
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-red-600 font-medium">
                        {item.missing_keywords_count} missing
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    variant={getScoreBadgeVariant(item.match_score)}
                    className="text-sm font-bold px-3 py-1"
                  >
                    {item.match_score.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
