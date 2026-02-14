import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  BrainCircuitIcon, 
  PlusIcon, 
  HomeIcon, 
  LogOutIcon, 
  SunIcon, 
  MoonIcon,
  UserIcon
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <BrainCircuitIcon className="h-8 w-8" />
            <span className="font-bold text-xl">Second Brain</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/add"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/add'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Item</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <UserIcon className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOutIcon className="h-4 w-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;