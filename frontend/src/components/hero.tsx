"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Sparkles, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.6))]" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="text-center space-y-8">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Resume Analysis
          </Badge>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                RoleReader
              </span>
              <br />
              <span className="text-white">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Transform your job search with AI-powered resume analysis. Get
              instant insights, match scores, and personalized recommendations.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-200 text-sm">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-200 text-sm">Resumes Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">2.5x</div>
              <div className="text-blue-200 text-sm">Better Match Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-indigo-900 hover:bg-blue-50 font-semibold px-8 py-3 text-lg"
              onClick={() =>
                document
                  .getElementById("compare")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Target className="w-5 h-5 mr-2" />
              Start Analysis
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 text-lg"
              onClick={() =>
                document
                  .getElementById("history")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View History
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-8">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white animate-bounce"
              onClick={() =>
                document
                  .getElementById("compare")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ArrowDown className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
