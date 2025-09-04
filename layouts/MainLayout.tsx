
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, LogoutIcon, UserCircleIcon } from '../components/Icons';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };
  
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
      isActive
        ? 'bg-sky-500 text-white shadow-lg'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <header className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg shadow-md sticky top-0 z-50 animate-slide-down-fade">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-sky-500">EmotionAI</span>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <NavLink to="/" className={navLinkClasses}>Dashboard</NavLink>
                  <NavLink to="/chat" className={navLinkClasses}>Chat</NavLink>
                  <NavLink to="/profile" className={navLinkClasses}>Profile</NavLink>
                </div>
              </div>
            </div>
            <div className="flex items-center">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all duration-300 mr-4"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
                <div className="flex items-center">
                    <span className="text-gray-300 mr-4 hidden sm:block">Welcome, {auth.user?.name}</span>
                    {auth.user?.profilePicture ? (
                        <img src={auth.user.profilePicture} alt="User" className="h-8 w-8 rounded-full mr-4" />
                    ) : (
                        <UserCircleIcon className="h-8 w-8 text-gray-400 mr-4" />
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all duration-300"
                    aria-label="Logout"
                    title="Logout"
                >
                    <LogoutIcon />
                </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
