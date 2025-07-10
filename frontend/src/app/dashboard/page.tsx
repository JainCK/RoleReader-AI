import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Track your resume optimization progress
            </p>
          </div>
          <Link href="/">
            <Button className="gap-2">
              <Target className="w-4 h-4" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-blue-500">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  +12%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 mb-1">8</div>
              <p className="text-blue-700 text-sm font-medium">
                Total Analyses
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-green-500">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  +8.5%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 mb-1">
                78.5%
              </div>
              <p className="text-green-700 text-sm font-medium">
                Average Score
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-purple-500">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700"
                >
                  Best
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 mb-1">
                92.3%
              </div>
              <p className="text-purple-700 text-sm font-medium">
                Highest Score
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-amber-500">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-700"
                >
                  Recent
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900 mb-1">2</div>
              <p className="text-amber-700 text-sm font-medium">This Week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Quick Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Start a new resume analysis to improve your job match score
              </p>
              <Link href="/">
                <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Sparkles className="w-4 h-4" />
                  Analyze Resume
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                View detailed analytics and track your improvement over time
              </p>
              <Button variant="outline" className="w-full gap-2">
                <BarChart3 className="w-4 h-4" />
                View Analytics
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                <Clock className="h-5 w-5 text-white" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Resume analysis completed
                    </p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">92.3%</Badge>
                </div>

                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      New job description analyzed
                    </p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                  <Badge variant="secondary">75.8%</Badge>
                </div>

                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      AI recommendations generated
                    </p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                  <Badge variant="outline">4 tips</Badge>
                </div>
              </div>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
