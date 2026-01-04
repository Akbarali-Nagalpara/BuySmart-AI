import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { SearchFilters, FilterState } from '../ui/SearchFilters';
import { useToast } from '../../context/ToastContext';
import { Search, Loader2, Package, ArrowRight } from 'lucide-react';
import api from '../../config/api';

interface SearchResult {
  id: string;
  name: string;
  price: number;
  brand: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

export function AnalyzeProduct() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    minPrice: 0,
    maxPrice: 100000,
    minRating: 0,
    sortBy: 'relevance',
    brands: [],
  });
  const navigate = useNavigate();
  const { success, error: showErrorToast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setError('');
    
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        category: filters.category,
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
        minRating: filters.minRating.toString(),
        sortBy: filters.sortBy,
        brands: filters.brands.join(','),
      });
      
      const response = await api.get(`/products/search?${params}`);
      console.log('✅ Search API Response:', response.data);
      console.log('First product:', response.data[0]);
      console.log('First product name:', response.data[0]?.name);
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        setError('No products found. Try a different search term.');
      } else {
        success(`Found ${response.data.length} products!`);
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.response?.data?.message || 'Failed to search products. Please try again.');
      showErrorToast('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (searchQuery.trim()) {
      // Re-run search with new filters
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handleAnalyze = async (product: SearchResult) => {
    setIsAnalyzing(true);
    setLoadingStatus('Initializing analysis...');
    
    try {
      // Call backend to start analysis
      const response = await api.post('/products/analyze', {
        productId: product.id,
        productName: product.name,
        brand: product.brand
      });

      // Simulate progress updates (you can implement WebSocket or polling for real-time updates)
      const statuses = [
        'Fetching product details...',
        'Analyzing reviews and ratings...',
        'Processing sentiment analysis...',
        'Comparing with similar products...',
        'Generating AI insights...',
        'Finalizing report...'
      ];

      for (const status of statuses) {
        setLoadingStatus(status);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Navigate to results page with analysis data
      navigate('/result', { 
        state: { 
          analysisId: response.data.id,
          product 
        } 
      });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err.response?.data?.message || 'Failed to analyze product. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Search & Analyze Products
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Search for any product and get AI-powered insights in seconds
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-8 mb-8 animate-slide-up">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="searchQuery" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Search for a Product
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="searchQuery"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g., Sony headphones, MacBook Pro, Samsung phone..."
                      disabled={isSearching || isAnalyzing}
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
                      required
                    />
                  </div>
                  <SearchFilters onApplyFilters={handleApplyFilters} />
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Search across multiple retailers for the best products
                </p>
              </div>

              <button
                type="submit"
                disabled={isSearching || isAnalyzing}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Products
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && !isAnalyzing && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-8 mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                Search Results
              </h2>
              <div className="space-y-4">
                {searchResults.slice(0, 1).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 border border-primary-200/50 dark:border-slate-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:shadow-lg transition-all group"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{product.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{product.brand}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          ₹{typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(String(product.price) || '0').toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <span className="text-yellow-500 dark:text-yellow-400">★</span>
                          <span>{typeof product.rating === 'number' && product.rating > 0 ? product.rating.toFixed(1) : 'N/A'}</span>
                          <span className="text-slate-400 dark:text-slate-500">
                            ({typeof product.reviewCount === 'number' ? product.reviewCount.toLocaleString() : '0'} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAnalyze(product)}
                      className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100"
                    >
                      Analyze
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mb-6"></div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Analyzing Product
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-center">{loadingStatus}</p>
                
                {/* Progress Steps */}
                <div className="mt-8 w-full max-w-md space-y-2">
                  {[
                    'Fetching product details',
                    'Analyzing reviews',
                    'Processing sentiment',
                    'Comparing products',
                    'Generating insights'
                  ].map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          loadingStatus.toLowerCase().includes(step.toLowerCase().split(' ')[0])
                            ? 'bg-primary-600 dark:bg-primary-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-sm ${
                          loadingStatus.toLowerCase().includes(step.toLowerCase().split(' ')[0])
                            ? 'text-slate-900 dark:text-white font-medium'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Examples */}
          {!isSearching && !isAnalyzing && searchResults.length === 0 && (
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Try these popular searches:</h3>
              <div className="space-y-2">
                {[
                  'Sony WH-1000XM5 headphones',
                  'MacBook Pro 16 inch',
                  'Samsung Galaxy S24 Ultra',
                  'iPhone 15 Pro Max',
                  'Dell XPS 15 laptop'
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => {
                      setSearchQuery(example);
                      const form = document.querySelector('form');
                      if (form) {
                        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                      }
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800/50 rounded-lg transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
