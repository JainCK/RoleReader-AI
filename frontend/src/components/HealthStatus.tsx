"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { HealthResponse } from "@/types/api";
import {
  Server,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wifi,
  Zap,
} from "lucide-react";

export default function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.healthCheck();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Health check failed");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (loading)
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    if (error) return <XCircle className="h-4 w-4 text-red-500" />;
    if (health?.status === "healthy" && health?.nlp_ready) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (loading) return "Checking...";
    if (error) return "Offline";
    if (health?.status === "healthy" && health?.nlp_ready) return "Online";
    return "Partial";
  };

  const getStatusColor = () => {
    if (loading) return "secondary";
    if (error) return "destructive";
    if (health?.status === "healthy" && health?.nlp_ready) return "default";
    return "secondary";
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 border-white/20 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Server className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold">System Status</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkHealth}
            disabled={loading}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-3 w-3 text-gray-500" />
            <span className="text-xs font-medium">API Connection</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant={getStatusColor()} className="text-xs px-2 py-0.5">
              {getStatusText()}
            </Badge>
          </div>
        </div>

        {health && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium">NLP Service</span>
              </div>
              <Badge
                variant={health.nlp_ready ? "default" : "secondary"}
                className="text-xs px-2 py-0.5"
              >
                {health.nlp_ready ? "Ready" : "Loading"}
              </Badge>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Version</span>
                <span className="text-xs font-mono text-gray-700">
                  {health.version}
                </span>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
