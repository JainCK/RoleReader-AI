import ResumeComparison from '@/components/ResumeComparison';
import ComparisonHistory from '@/components/ComparisonHistory';
import HealthStatus from '@/components/HealthStatus';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RoleReader AI</h1>
              <p className="text-sm text-gray-600">AI-Powered Resume Analysis</p>
            </div>
            <div className="w-64">
              <HealthStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="space-y-8">
          {/* Resume Comparison Section */}
          <ResumeComparison />
          
          {/* History Section */}
          <div className="container mx-auto px-4 max-w-4xl">
            <ComparisonHistory />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 RoleReader AI. Powered by AI technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
