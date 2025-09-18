import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-8">🍭🍰🍪</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sweet Shop Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover and manage the finest collection of sweets, cakes, and confections. 
            Your one-stop destination for all things sweet and delicious!
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Shopping</h3>
            <p className="text-gray-600">
              Browse and purchase your favorite sweets with our intuitive shopping experience.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Search</h3>
            <p className="text-gray-600">
              Find exactly what you're looking for with our advanced search and filter options.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-4">👨‍💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Admin Control</h3>
            <p className="text-gray-600">
              Complete management system for administrators to handle inventory and products.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Built with Modern Technology</h2>
          <div className="flex justify-center items-center space-x-8 text-gray-600">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-blue-600 font-bold">R</span>
              </div>
              <span className="text-sm">React</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-blue-600 font-bold">TS</span>
              </div>
              <span className="text-sm">TypeScript</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-green-600 font-bold">N</span>
              </div>
              <span className="text-sm">Node.js</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-purple-600 font-bold">P</span>
              </div>
              <span className="text-sm">PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;