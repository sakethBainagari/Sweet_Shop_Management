import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-soft border-b border-neutral-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-2xl">🍭</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Sweet Shop
                </span>
                <span className="text-xs text-neutral-500 font-medium">Management</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActivePath('/dashboard')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                >
                  Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActivePath('/admin')
                        ? 'bg-secondary-100 text-secondary-700'
                        : 'text-neutral-600 hover:text-secondary-600 hover:bg-neutral-50'
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
                
                {/* User Menu */}
                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-neutral-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-900">
                        {user?.name}
                      </span>
                      {user?.role === 'ADMIN' && (
                        <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-error-600 hover:bg-error-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-soft hover:shadow-medium focus:ring-2 focus:ring-error-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActivePath('/login')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 py-4 animate-fade-in-up">
            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActivePath('/dashboard')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link 
                      to="/admin" 
                      className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActivePath('/admin')
                          ? 'bg-secondary-100 text-secondary-700'
                          : 'text-neutral-600 hover:text-secondary-600 hover:bg-neutral-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  {/* Mobile User Info */}
                  <div className="px-4 py-3 border-t border-neutral-100 mt-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">{user?.name}</span>
                        <span className="text-sm text-neutral-500">{user?.email}</span>
                        {user?.role === 'ADMIN' && (
                          <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full mt-1 w-fit">
                            Administrator
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-error-600 hover:bg-error-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActivePath('/login')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all duration-200 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;