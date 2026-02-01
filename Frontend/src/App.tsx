// Main App component with routing and animations
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy load all page components
const Login = lazy(() => import('./components/auth/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./components/auth/Register').then(module => ({ default: module.Register })));
const Landing = lazy(() => import('./components/pages/Landing').then(module => ({ default: module.Landing })));
const Dashboard = lazy(() => import('./components/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const AnalyzeProduct = lazy(() => import('./components/pages/AnalyzeProduct').then(module => ({ default: module.AnalyzeProduct })));
const AnalysisResult = lazy(() => import('./components/pages/AnalysisResult').then(module => ({ default: module.AnalysisResult })));
const History = lazy(() => import('./components/pages/History').then(module => ({ default: module.History })));
const Profile = lazy(() => import('./components/pages/Profile').then(module => ({ default: module.Profile })));
const Settings = lazy(() => import('./components/pages/Settings').then(module => ({ default: module.Settings })));
const Wishlist = lazy(() => import('./components/pages/Wishlist').then(module => ({ default: module.Wishlist })));
const Comparison = lazy(() => import('./components/pages/Comparison').then(module => ({ default: module.Comparison })));
const Help = lazy(() => import('./components/pages/Help').then(module => ({ default: module.Help })));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <PageWrapper><AnalyzeProduct /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <PageWrapper><AnalysisResult /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <PageWrapper><History /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageWrapper><Profile /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageWrapper><Settings /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <PageWrapper><Wishlist /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/comparison"
          element={
            <ProtectedRoute>
              <PageWrapper><Comparison /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <PageWrapper><Help /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <ComparisonProvider>
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </ComparisonProvider>
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

