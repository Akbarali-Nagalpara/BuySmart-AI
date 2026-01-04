import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { Eye, Calendar, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import api from '../../config/api';

interface AnalysisHistory {
  id: string;
  productName: string;
  brand: string;
  score: number;
  verdict: 'BUY' | 'NOT_BUY';
  date: string;
  imageUrl: string;
}

export function History() {
  const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/history');
        setAnalyses(response.data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleView = (analysisId: string) => {
    navigate('/result', { state: { analysisId } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analysis History</h1>
          <p className="text-slate-700">
            View all your previous product analyses
          </p>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl shadow-lg border border-primary-200/50 overflow-hidden">
          {analyses.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-700 mb-4">No analysis history yet</p>
              <a
                href="/analyze"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Start your first analysis →
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-50 border-b border-primary-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Verdict
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {analyses.map((analysis) => (
                    <tr
                      key={analysis.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={analysis.imageUrl}
                            alt={analysis.productName}
                            className="w-10 h-10 rounded object-cover border border-slate-200"
                          />
                          <span className="font-medium text-slate-900 max-w-xs truncate">
                            {analysis.productName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-700">{analysis.brand}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-slate-900">
                            {analysis.score}
                          </span>
                          {analysis.score >= 70 ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            analysis.verdict === 'BUY'
                              ? 'bg-primary-100 text-primary-700 border border-primary-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {analysis.verdict}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-700">
                          {new Date(analysis.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                          onClick={() => handleView(analysis.id)}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {analyses.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing <span className="font-medium">1-{analyses.length}</span> of{' '}
              <span className="font-medium">{analyses.length}</span> analyses
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Previous
              </button>
              <button
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
