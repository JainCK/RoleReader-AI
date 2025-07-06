'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { HealthResponse } from '@/types/api';
import { Server, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
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
      setError(err instanceof Error ? err.message : 'Health check failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (loading) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (error) return <XCircle className="h-4 w-4 text-red-500" />;
    if (health?.status === 'healthy' && health?.nlp_ready) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Checking...';
    if (error) return 'Offline';
    if (health?.status === 'healthy' && health?.nlp_ready) return 'Online';
    return 'Partial';
  };

  const getStatusColor = () => {
    if (loading) return 'secondary';
    if (error) return 'destructive';
    if (health?.status === 'healthy' && health?.nlp_ready) return 'default';
    return 'secondary';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            API Status
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkHealth}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection</span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
        </div>

        {health && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">NLP Service</span>
              <Badge variant={health.nlp_ready ? 'default' : 'secondary'}>
                {health.nlp_ready ? 'Ready' : 'Not Ready'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Version</span>
              <span className="text-sm text-gray-600">{health.version}</span>
            </div>
          </>
        )}

        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
