import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Star,
  ArrowRight,
  Brain,
  Target,
  Award,
} from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { ScrollReveal } from '../animations/ScrollReveal';
import { CountUp } from '../animations/CountUp';
import { AnimatedButton } from '../ui/AnimatedButton';
import { GlassCard } from '../ui/GlassCard';

export function Landing() {
  return (
    <div className="min-h-screen bg-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-accent-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent-200/30 to-primary-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-primary-100/20 to-accent-100/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl border-b border-primary-200/40 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <FadeIn direction="left" duration={0.6}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  BuySmart AI
                </span>
              </div>
            </FadeIn>
            <FadeIn direction="right" duration={0.6} delay={0.2}>
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link to="/register">
                  <AnimatedButton variant="primary" size="sm">
                    Get Started
                  </AnimatedButton>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <FadeIn delay={0.2}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full mb-6 border border-primary-200 shadow-sm">
              <Sparkles className="w-4 h-4 animate-pulse-slow" />
              <span className="text-sm font-medium">AI-Powered Shopping Intelligence</span>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.4} duration={0.8}>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              Make Smarter{' '}
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 bg-clip-text text-transparent animate-gradient">
                Purchase Decisions
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.6} duration={0.8}>
            <p className="text-xl text-slate-700 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Harness the power of AI to analyze products, read thousands of reviews, and get
              personalized recommendations in seconds.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.8} duration={0.6}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <AnimatedButton variant="primary" size="lg">
                  Start Analyzing Free
                  <ArrowRight className="w-5 h-5" />
                </AnimatedButton>
              </Link>
              <Link to="/login">
                <AnimatedButton variant="outline" size="lg">
                  Watch Demo
                </AnimatedButton>
              </Link>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={1}>
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  <CountUp end={10} suffix="K+" />
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-400">Products Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  <CountUp end={95} suffix="%" />
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-400">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  <CountUp end={5} suffix="K+" />
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-400">Happy Users</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-primary-50/50 to-accent-50/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features for Smart Shopping
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to make informed purchase decisions backed by AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI-Powered Analysis',
                description: 'Advanced machine learning algorithms analyze millions of data points instantly',
                color: 'from-primary-500 to-primary-600',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Smart Recommendations',
                description: 'Get personalized buy/not-buy recommendations based on comprehensive analysis',
                color: 'from-accent-500 to-accent-600',
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Detailed Insights',
                description: 'Visual breakdowns of sentiment, features, reliability, and more',
                color: 'from-primary-600 to-accent-600',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Fake Review Detection',
                description: 'AI identifies suspicious reviews to give you authentic insights',
                color: 'from-orange-500 to-red-600',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Price Tracking',
                description: 'Monitor price history and get alerts on the best deals',
                color: 'from-accent-600 to-primary-600',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Instant Results',
                description: 'Get comprehensive analysis reports in under 30 seconds',
                color: 'from-yellow-500 to-amber-600',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-primary-200/50 dark:border-slate-700 hover:border-primary-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-400">
              Get AI-powered insights in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Search Product',
                description: 'Enter the product name or paste a link from any e-commerce site',
                icon: <Target className="w-6 h-6" />,
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes reviews, ratings, features, and market trends',
                icon: <Brain className="w-6 h-6" />,
              },
              {
                step: '03',
                title: 'Get Insights',
                description: 'Receive detailed reports with buy/not-buy recommendations',
                icon: <Award className="w-6 h-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary-500/30">
                    {item.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 font-bold text-sm px-3 py-1 rounded-full border-2 border-primary-600 dark:border-primary-400 shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-accent-50/50 to-primary-50/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Loved by Smart Shoppers
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-400">
              See what our users have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Tech Enthusiast',
                comment: 'BuySmart AI saved me from buying a phone with terrible battery life. The analysis was spot on!',
                rating: 5,
              },
              {
                name: 'Mike Chen',
                role: 'Online Shopper',
                comment: 'I love how it filters out fake reviews. Finally, honest product insights!',
                rating: 5,
              },
              {
                name: 'Emily Davis',
                role: 'Budget Conscious',
                comment: 'The price tracking feature helped me save $200 on a laptop. Absolutely worth it!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-primary-200/50 dark:border-slate-700 hover:shadow-xl transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 text-center shadow-2xl shadow-primary-500/30">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Shop Smarter?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of smart shoppers making better purchase decisions with AI
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all shadow-lg"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="text-white font-bold text-lg">BuySmart AI</span>
              </div>
              <p className="text-sm">
                AI-powered shopping intelligence for smarter purchase decisions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 BuySmart AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
