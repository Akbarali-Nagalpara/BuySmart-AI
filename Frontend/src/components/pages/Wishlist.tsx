import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { Heart, Trash2, ShoppingCart, TrendingDown, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../config/api';

interface WishlistItem {
  id: string;
  productName: string;
  brand: string;
  currentPrice: number;
  originalPrice: number;
  imageUrl: string;
  rating: number;
  score?: number;
  addedDate: string;
}

export function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      await api.delete(`/wishlist/${itemId}`);
      setWishlist(wishlist.filter((item) => item.id !== itemId));
      success('Removed from wishlist');
    } catch (error) {
      showError('Failed to remove item');
    }
  };

  const analyzeProduct = (item: WishlistItem) => {
    navigate('/analyze', { state: { productName: item.productName } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your favorite products and get price alerts
          </p>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-12 text-center">
            <Heart className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-slate-700 dark:text-slate-400 mb-6">
              Start adding products you love to track prices and get recommendations
            </p>
            <button
              onClick={() => navigate('/analyze')}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const priceDropPercent = item.originalPrice
                ? Math.round(((item.originalPrice - item.currentPrice) / item.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-primary-300 transition-all group"
                >
                  <div className="relative">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-48 object-cover"
                    />
                    {priceDropPercent > 0 && (
                      <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <TrendingDown className="w-4 h-4" />
                        {priceDropPercent}% OFF
                      </div>
                    )}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors group/btn"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-red-500 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-1">
                      {item.brand}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2">
                      {item.productName}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          ₹{item.currentPrice.toFixed(2)}
                        </div>
                        {item.originalPrice > item.currentPrice && (
                          <div className="text-sm text-slate-500 line-through">
                            ₹{item.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {item.score && (
                      <div className="mb-4 p-3 bg-primary-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            AI Score
                          </span>
                          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                            {item.score}/100
                          </span>
                        </div>
                        <div className="bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary-600 to-primary-700 h-full transition-all"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => analyzeProduct(item)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Analyze
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                      Added {new Date(item.addedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
