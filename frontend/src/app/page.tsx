import { Suspense } from "react";
import Hero from "@/components/hero";
import ResumeComparison from "@/components/ResumeComparison";
import ComparisonHistory from "@/components/ComparisonHistory";
import HealthStatus from "@/components/HealthStatus";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <main className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="container mx-auto px-4 py-16 space-y-16">
          {/* Health Status - Floating */}
          <div className="fixed top-4 right-4 z-50 w-80">
            <Suspense
              fallback={
                <Card>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              }
            >
              <HealthStatus />
            </Suspense>
          </div>

          {/* Resume Comparison Section */}
          <section id="compare">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Skeleton className="h-96 w-full" />
                  <Skeleton className="h-96 w-full" />
                </div>
              }
            >
              <ResumeComparison />
            </Suspense>
          </section>

          {/* History Section */}
          <section id="history" className="max-w-4xl mx-auto">
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <ComparisonHistory />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}
