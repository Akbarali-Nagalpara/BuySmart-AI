import { useState } from 'react';
import { Navigation } from '../layout/Navigation';
import { Plus, X, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  score: number;
  verdict: 'BUY' | 'NOT_BUY';
  features: {
    sentiment: number;
    quality: number;
    reliability: number;
    rating: number;
  };
}

export function Comparison() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { info } = useToast();

  const addProduct = () => {
    if (products.length >= 4) {
      info('Maximum 4 products can be compared');
      return;
    }
    // In real app, this would search and add products
    info('Search functionality will be integrated with backend');
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Compare Products
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Compare up to 4 products side-by-side to make the best decision
          </p>
        </div>

        {/* Add Product Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products to compare..."
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
            <button
              onClick={addProduct}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {products.length}/4 products added
          </p>
        </div>

        {/* Comparison Table */}
        {products.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Start Comparing
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Add products to see a detailed side-by-side comparison
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 w-48">
                    Feature
                  </th>
                  {products.map((product) => (
                    <th key={product.id} className="px-6 py-4 text-center min-w-[250px]">
                      <div className="relative">
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                          {product.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {product.brand}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {/* Price */}
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Price</td>
                  {products.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-center">
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ₹{product.price.toFixed(2)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Overall Score */}
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    AI Score
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-center">
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {product.score}
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-primary-700 h-full"
                          style={{ width: `${product.score}%` }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Verdict */}
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    Recommendation
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                          product.verdict === 'BUY'
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200'
                        }`}
                      >
                        {product.verdict === 'BUY' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                        {product.verdict}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Sentiment */}
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    Sentiment Score
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-center">
                      <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {product.features.sentiment}
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-accent-600 to-accent-700 h-full"
                          style={{ width: `${product.features.sentiment}%` }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Quality */}
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    Feature Quality
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-center">
                      <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {product.features.quality}
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-primary-700 h-full"
                          style={{ width: `${product.features.quality}%` }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Reliability */}
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    Brand Reliability
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-center">
                      <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {product.features.reliability}
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-accent-600 to-accent-700 h-full"
                          style={{ width: `${product.features.reliability}%` }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    User Rating
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-center">
                      <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {product.features.rating}
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-600 h-full"
                          style={{ width: `${product.features.rating}%` }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
