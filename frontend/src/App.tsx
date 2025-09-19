import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import Header from './components/common/Header';
import ToastContainer from './components/common/ToastContainer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './components/admin/AdminDashboard';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
            <Header />
            
            <main className="container mx-auto px-4 py-6">
              <Routes>
                {/* Public Routes - redirect to dashboard if authenticated */}
                <Route 
                  path="/" 
                  element={
                    <PublicRoute>
                      <HomePage />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  } 
                />
                
                {/* Protected Routes - require authentication */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes - require admin authentication */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            <ToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;