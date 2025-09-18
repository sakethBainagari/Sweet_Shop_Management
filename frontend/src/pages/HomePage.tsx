import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* 3D Floating Sweets */}
          <div className="relative mb-12">
            <div className="flex justify-center items-center space-x-8 mb-8">
              {/* 3D Cake */}
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-float">
                  <div className="absolute inset-2 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-pink-200 to-pink-400 rounded-full flex items-center justify-center text-2xl">🎂</div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              </div>

              {/* 3D Donut */}
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 animate-float animation-delay-1000">
                  <div className="absolute inset-2 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full flex items-center justify-center text-2xl">🎂</div>
                </div>
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
              </div>

              {/* 3D Ice Cream */}
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-float animation-delay-2000">
                  <div className="absolute inset-2 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-blue-200 to-purple-300 rounded-full flex items-center justify-center text-2xl">🧁</div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-bounce"></div>
              </div>

              {/* 3D Cupcake */}
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full shadow-2xl transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 animate-float animation-delay-3000">
                  <div className="absolute inset-2 bg-gradient-to-br from-green-300 to-teal-400 rounded-full"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-green-200 to-teal-300 rounded-full flex items-center justify-center text-2xl">🧁</div>
                </div>
                <div className="absolute -top-2 -left-2 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-float animation-delay-500"></div>
              <div className="absolute top-20 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float animation-delay-1500"></div>
              <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-float animation-delay-2500"></div>
              <div className="absolute bottom-10 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-float animation-delay-3500"></div>
            </div>
          </div>

          {/* Main Title with Gradient */}
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 animate-fade-in-up">
            Sweet Shop
            <span className="block text-4xl md:text-5xl mt-2">Management</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500">
            Discover and manage the finest collection of <span className="font-semibold text-pink-600">sweets</span>,
            <span className="font-semibold text-purple-600"> cakes</span>, and
            <span className="font-semibold text-indigo-600"> confections</span>.
            Your one-stop destination for all things sweet and delicious!
          </p>

          {/* Enhanced Action Buttons */}
          <div className={`space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center animate-fade-in-up animation-delay-1000`}>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="group relative inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="relative z-10">View Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="group relative inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <span className="relative z-10">Admin Panel</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group relative inline-block bg-gradient-to-r from-pink-600 to-rose-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/login"
                  className="group relative inline-block bg-white text-gray-800 px-10 py-4 rounded-full text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className={`mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-1500`}>
          <div className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Easy Shopping</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Browse and purchase your favorite sweets with our intuitive and delightful shopping experience.
              </p>
            </div>
          </div>

          <div className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Smart Search</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Find exactly what you're looking for with our advanced search and filter options powered by AI.
              </p>
            </div>
          </div>

          <div className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Admin Control</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Complete management system for administrators to handle inventory, products, and analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className={`mt-20 text-center animate-fade-in-up animation-delay-2000`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                100+
              </div>
              <div className="text-gray-600 font-medium">Sweet Varieties</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-gray-600 font-medium">Service</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                1000+
              </div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                5★
              </div>
              <div className="text-gray-600 font-medium">Rating</div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className={`mt-24 text-center animate-fade-in-up animation-delay-3000`}>
          <div className="relative p-12 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
              <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-1000"></div>
              <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-2000"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float animation-delay-3000"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Indulge?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of sweet lovers and discover your new favorite treats today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="group relative px-8 py-4 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <span className="relative z-10">Start Shopping</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/login"
                  className="group relative px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <span className="relative z-10">Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;