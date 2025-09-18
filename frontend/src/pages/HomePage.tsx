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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-accent-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-3000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* 3D Floating Sweets */}
          <div className="relative mb-16">
            <div className="flex justify-center items-center space-x-8 mb-12">
              {/* 3D Cake */}
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full shadow-large transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-float">
                  <div className="absolute inset-2 bg-gradient-to-br from-accent-300 to-accent-500 rounded-full"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-accent-200 to-accent-400 rounded-full flex items-center justify-center text-2xl">🎂</div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning-400 rounded-full animate-pulse-soft"></div>
              </div>

              {/* 3D Donut */}
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-warning-400 to-accent-500 rounded-full shadow-large transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 animate-float animation-delay-1000">
                  <div className="absolute inset-2 bg-gradient-to-br from-warning-300 to-accent-400 rounded-full"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-warning-200 to-accent-300 rounded-full flex items-center justify-center text-2xl">🍩</div>
                </div>
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-secondary-400 rounded-full animate-pulse-soft"></div>
              </div>

              {/* 3D Ice Cream */}
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full shadow-large transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-float animation-delay-2000">
                  <div className="absolute inset-2 bg-gradient-to-br from-primary-300 to-secondary-400 rounded-full"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-primary-200 to-secondary-300 rounded-full flex items-center justify-center text-2xl">🍦</div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success-400 rounded-full animate-pulse-soft"></div>
              </div>

              {/* 3D Cupcake */}
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-success-400 to-secondary-500 rounded-full shadow-large transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 animate-float animation-delay-3000">
                  <div className="absolute inset-2 bg-gradient-to-br from-success-300 to-secondary-400 rounded-full"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-success-200 to-secondary-300 rounded-full flex items-center justify-center text-2xl">🧁</div>
                </div>
                <div className="absolute -top-2 -left-2 w-3 h-3 bg-accent-400 rounded-full animate-pulse-soft"></div>
              </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-1/4 w-2 h-2 bg-primary-400 rounded-full animate-float animation-delay-500"></div>
              <div className="absolute top-20 right-1/3 w-1 h-1 bg-secondary-400 rounded-full animate-float animation-delay-1500"></div>
              <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-accent-400 rounded-full animate-float animation-delay-2500"></div>
              <div className="absolute bottom-10 right-1/4 w-1 h-1 bg-success-400 rounded-full animate-float animation-delay-3000"></div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in-up">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              Sweet Shop
            </span>
            <span className="block text-4xl md:text-5xl mt-4 bg-gradient-to-r from-neutral-700 to-neutral-900 bg-clip-text text-transparent">
              Management System
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
            Discover and manage the finest collection of 
            <span className="font-semibold text-primary-600"> sweets</span>,
            <span className="font-semibold text-secondary-600"> cakes</span>, and
            <span className="font-semibold text-accent-600"> confections</span>.
            Your professional solution for sweet shop management.
          </p>

          {/* Enhanced Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-500`}>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn-primary text-lg px-8 py-4"
                >
                  View Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary text-lg px-8 py-4"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="btn-outline text-lg px-8 py-4"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className={`mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-700`}>
          <div className="card-hover p-8 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300 shadow-medium">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Easy Shopping</h3>
            <p className="text-neutral-600 leading-relaxed">
              Browse and purchase your favorite sweets with our intuitive and delightful shopping experience.
            </p>
          </div>

          <div className="card-hover p-8 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300 shadow-medium">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Smart Search</h3>
            <p className="text-neutral-600 leading-relaxed">
              Find exactly what you're looking for with our advanced search and filter options.
            </p>
          </div>

          <div className="card-hover p-8 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300 shadow-medium">
              <span className="text-2xl">👨‍💼</span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Admin Control</h3>
            <p className="text-neutral-600 leading-relaxed">
              Complete management system for administrators to handle inventory, products, and analytics.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className={`mt-24 text-center animate-fade-in-up animation-delay-1000`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                100+
              </div>
              <div className="text-neutral-600 font-medium">Sweet Varieties</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-neutral-600 font-medium">Service</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                1000+
              </div>
              <div className="text-neutral-600 font-medium">Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                5★
              </div>
              <div className="text-neutral-600 font-medium">Rating</div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className={`mt-32 text-center animate-fade-in-up animation-delay-1500`}>
          <div className="relative p-12 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 rounded-3xl shadow-large overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
              <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-1000"></div>
              <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-2000"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float animation-delay-3000"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of sweet lovers and discover your new favorite management system today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-medium hover:shadow-large transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  Explore Dashboard
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  Sign In
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