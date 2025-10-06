import { Target, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white/80 dark:bg-white/10 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/20 sticky top-0 z-50 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group">
            <div className="relative">
              <Target className="h-8 w-8 text-blue-600 dark:text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-blue-600 dark:bg-emerald-400 rounded-full opacity-20 scale-0 group-hover:scale-150 transition-all duration-300" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">ResumeRanker Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-semibold transition-all duration-300 px-3 py-2 rounded-lg ${
                isActive('/') 
                  ? 'text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-emerald-500/20' 
                  : 'text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className={`font-semibold transition-all duration-300 px-3 py-2 rounded-lg ${
                isActive('/upload') 
                  ? 'text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-emerald-500/20' 
                  : 'text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            >
              Upload
            </Link>
            <Link 
              to="/results" 
              className={`font-semibold transition-all duration-300 px-3 py-2 rounded-lg ${
                isActive('/results') 
                  ? 'text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-emerald-500/20' 
                  : 'text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            >
              Results
            </Link>
            <Link 
              to="/analytics" 
              className={`font-semibold transition-all duration-300 px-3 py-2 rounded-lg ${
                isActive('/analytics') 
                  ? 'text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-emerald-500/20' 
                  : 'text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            >
              Analytics
            </Link>
            
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-2xl mt-2 border border-gray-200/50 dark:border-white/20 animate-slide-in-up">
              <Link
                to="/"
                className={`block px-4 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  isActive('/') 
                    ? 'text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-emerald-500/20' 
                    : 'text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/upload"
                className={`block px-4 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  isActive('/upload') 
                    ? 'text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-emerald-500/20' 
                    : 'text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Upload
              </Link>
              <Link
                to="/results"
                className={`block px-4 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  isActive('/results') 
                    ? 'text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-emerald-500/20' 
                    : 'text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Results
              </Link>
              <Link
                to="/analytics"
                className={`block px-4 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  isActive('/analytics') 
                    ? 'text-blue-600 dark:text-emerald-400 bg-blue-50 dark:bg-emerald-500/20' 
                    : 'text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}