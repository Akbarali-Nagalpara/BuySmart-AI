import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { DashboardCardSkeleton } from '../ui/SkeletonLoader';
import { TrendingUp, TrendingDown, Activity, ArrowRight, ShoppingCart } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { StaggerChildren, StaggerItem } from '../animations/StaggerChildren';
import { CountUp } from '../animations/CountUp';
import { GlassCard } from '../ui/GlassCard';
import { AnimatedButton } from '../ui/AnimatedButton';
import { motion } from 'framer-motion';
import api from '../../config/api';

interface DashboardStats {
  totalAnalyses: number;
  buyRecommendations: number;
  notBuyRecommendations: number;
  averageScore: number;
}

interface RecentAnalysis {
  id: string;
  productName: string;
  score: number;
  verdict: 'BUY' | 'NOT_BUY';
  date: string;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    buyRecommendations: 0,
    notBuyRecommendations: 0,
    averageScore: 0
  });
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, recentResponse] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent')
        ]);
        
        setStats(statsResponse.data);
        setRecentAnalyses(recentResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-primary-100 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-primary-50 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back!</h1>
          <p className="text-slate-700 dark:text-slate-400">
            Make smarter purchase decisions with AI-powered product analysis
          </p>
        </div>

        {/* CTA Button */}
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all mb-8 shadow-lg shadow-primary-500/20 animate-bounce-in"
        >
          <ShoppingCart className="w-5 h-5" />
          Analyze New Product
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Analyses */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-6 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-300/70 transition-all animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-400">Total Analyses</span>
              <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalAnalyses}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">All time</p>
          </div>

          {/* Buy Recommendations */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-6 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-300/70 transition-all animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-400">Buy Recommendations</span>
              <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="text-3xl font-bold text-primary-700 dark:text-primary-400">{stats.buyRecommendations}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {Math.round((stats.buyRecommendations / stats.totalAnalyses) * 100)}% of total
            </p>
          </div>

          {/* Not Buy Recommendations */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-6 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-300/70 transition-all animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-400">Not Buy</span>
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-700 dark:text-red-400">{stats.notBuyRecommendations}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {Math.round((stats.notBuyRecommendations / stats.totalAnalyses) * 100)}% of total
            </p>
          </div>

          {/* Average Score */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-6 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-300/70 transition-all animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-400">Average Score</span>
              <div className="text-primary-600 dark:text-primary-400 font-bold text-sm">{stats.averageScore}</div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.averageScore}/100</div>
            <div className="mt-2 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-600 to-primary-700 h-full transition-all duration-500"
                style={{ width: `${stats.averageScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Analyses</h2>
            <Link to="/history" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-semibold transition-colors">
              View all →
            </Link>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-700 dark:text-slate-400 mb-4">No analyses yet</p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
              >
                Start your first analysis →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-primary-200/50 dark:border-slate-700 hover:bg-primary-50/50 dark:hover:bg-slate-700 hover:border-primary-300/70 transition-all cursor-pointer"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-white mb-1">{analysis.productName}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{analysis.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{analysis.score}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Score</div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        analysis.verdict === 'BUY'
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {analysis.verdict}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
