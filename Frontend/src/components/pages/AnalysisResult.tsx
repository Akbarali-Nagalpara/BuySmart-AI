import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { ArrowLeft, CheckCircle, XCircle, TrendingUp, Award, Shield, Star, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import api from '../../config/api';

interface AnalysisData {
  product: {
    name: string;
    brand: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  overallScore: number;
  verdict: 'BUY' | 'NOT_BUY';
  scores: {
    sentiment: number;
    featureQuality: number;
    brandReliability: number;
    ratingReview: number;
    consistency: number;
  };
  insights: {
    positive: string[];
    negative: string[];
  };
  aiSummary: string;
}

export function AnalysisResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { analysisId } = location.state || {};
        
        if (!analysisId) {
          setError('No analysis data found');
          setIsLoading(false);
          return;
        }

        const response = await api.get(`/analysis/${analysisId}`);
        setAnalysis(response.data);
      } catch (err: any) {
        console.error('Failed to fetch analysis:', err);
        setError(err.response?.data?.message || 'Failed to load analysis results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [location.state]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-slate-700">Loading analysis results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading Results</h2>
            <p className="text-slate-700 mb-6">{error || 'Analysis data not found'}</p>
            <button
              onClick={() => navigate('/analyze')}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/analyze')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Analyze Another Product
        </button>

        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-lg border border-primary-200/50 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Product Image */}
            <div className="lg:col-span-4">
              <img
                src={analysis.product.imageUrl}
                alt={analysis.product.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                }}
                className="w-full aspect-square object-cover rounded-lg border border-slate-200"
              />
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">{analysis.product.category || 'Electronics'}</p>
                <p className="text-lg font-bold text-slate-900">{analysis.product.brand || 'N/A'}</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">
                  {analysis.product.price && analysis.product.price > 0 
                    ? `₹${typeof analysis.product.price === 'number' 
                        ? analysis.product.price.toLocaleString('en-IN', {maximumFractionDigits: 0}) 
                        : analysis.product.price}` 
                    : 'Price N/A'}
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-6">
                {analysis.product.name}
              </h1>

              {/* Overall Score */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-8 mb-6 border border-primary-200">
                <div className="flex items-center gap-6">
                  {analysis.verdict === 'BUY' ? (
                    <CheckCircle className="w-16 h-16 text-primary-600" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-600" />
                  )}
                  <div>
                    <div className="text-6xl font-bold text-slate-900 mb-2">
                      {analysis.overallScore || 0}
                    </div>
                    <div className="text-sm text-slate-600 uppercase tracking-wider mb-3">
                      Overall Score
                    </div>
                    <span
                      className={`px-6 py-2 rounded-full text-lg font-semibold ${
                        analysis.verdict === 'BUY'
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {analysis.verdict || 'N/A'}
                    </span>
                  </div>
                </div>
                <p className="mt-6 text-slate-700 leading-relaxed">
                  {analysis.aiSummary || 'No summary available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-primary-200/50 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Award className="w-7 h-7 text-primary-600" />
            Detailed Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sentiment Score */}
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold text-slate-900">Sentiment</span>
                </div>
                <span className="text-2xl font-bold text-primary-600">{analysis.scores?.sentiment || 0}</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-600 to-primary-700 h-full transition-all duration-1000"
                  style={{ width: `${analysis.scores?.sentiment || 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Customer satisfaction based on review sentiment
              </p>
            </div>

            {/* Feature Quality */}
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent-600" />
                  <span className="font-semibold text-slate-900">Features</span>
                </div>
                <span className="text-2xl font-bold text-accent-600">{analysis.scores?.featureQuality || 0}</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-accent-600 to-accent-700 h-full transition-all duration-1000"
                  style={{ width: `${analysis.scores?.featureQuality || 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Quality and performance of product features
              </p>
            </div>

            {/* Brand Reliability */}
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold text-slate-900">Reliability</span>
                </div>
                <span className="text-2xl font-bold text-primary-600">{analysis.scores?.brandReliability || 0}</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-600 to-primary-700 h-full transition-all duration-1000"
                  style={{ width: `${analysis.scores?.brandReliability || 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Brand reputation and product reliability
              </p>
            </div>

            {/* Rating & Reviews */}
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-slate-900">Ratings</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{analysis.scores?.ratingReview || 0}</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-600 h-full transition-all duration-1000"
                  style={{ width: `${analysis.scores?.ratingReview || 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Aggregate score from ratings and reviews
              </p>
            </div>

            {/* Consistency */}
            <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent-600" />
                  <span className="font-semibold text-slate-900">Consistency</span>
                </div>
                <span className="text-2xl font-bold text-accent-600">{analysis.scores?.consistency || 0}</span>
              </div>
              <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-accent-600 to-accent-700 h-full transition-all duration-1000"
                  style={{ width: `${analysis.scores?.consistency || 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Product quality consistency across batches
              </p>
            </div>
          </div>
        </div>

        {/* Review Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Positive Insights */}
          <div className="bg-white rounded-xl shadow-lg border border-primary-200/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">What Users Like</h3>
            </div>
            {analysis.insights?.positive && analysis.insights.positive.length > 0 ? (
              <ul className="space-y-3">
                {analysis.insights.positive.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-center py-4">No positive insights available</p>
            )}
          </div>

          {/* Negative Insights */}
          <div className="bg-white rounded-xl shadow-lg border border-primary-200/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ThumbsDown className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Common Complaints</h3>
            </div>
            {analysis.insights?.negative && analysis.insights.negative.length > 0 ? (
              <ul className="space-y-3">
                {analysis.insights.negative.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-center py-4">No complaints reported</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
