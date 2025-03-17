import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, ChevronDown, LogOut, User, Settings, Layout, Home, FileText, MessageSquare, Mail, Info, CalendarDays, UserPlus } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Core navigation items for everyone
  const publicNavItems = [
    { label: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-1" /> },
    { label: 'Blog', path: '/blog', icon: <FileText className="h-4 w-4 mr-1" /> },
    { label: 'About', path: '/about', icon: <Info className="h-4 w-4 mr-1" /> },
  ];

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { label: 'Forum', path: '/forum', icon: <MessageSquare className="h-4 w-4 mr-1" /> },
  ];

  // Optional items that can go in the More dropdown if we need to save space
  const secondaryNavItems = [
    { label: 'Contact', path: '/contact', icon: <Mail className="h-4 w-4 mr-1" /> },
  ];

  const getLinkClass = (isDesktop: boolean, isActive: boolean = false) => {
    const baseClass = "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors";
    const activeClass = "text-indigo-600 dark:text-indigo-400 font-medium";
    
    if (isDesktop) {
      return `${isActive ? activeClass : baseClass} px-3 py-2 rounded-md text-sm font-medium flex items-center`;
    } else {
      return `${isActive ? activeClass : baseClass} block px-3 py-2 rounded-md text-base font-medium flex items-center`;
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                CASCSC
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {/* Public Navigation Items */}
              {publicNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClass(true, isActive(item.path))}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {/* Authenticated Navigation Items */}
              {user && authenticatedNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClass(true, isActive(item.path))}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {/* Secondary Items */}
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClass(true, isActive(item.path))}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <div className="ml-2">
                <ThemeToggle />
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative ml-3" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded-md"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="hidden lg:inline">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      )}
                      {(user.role === 'editor' || user.role === 'admin') && (
                        <Link
                          to="/editor"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Layout className="h-4 w-4 mr-2" />
                          Editor Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            {user && (
              <div className="relative mx-2">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Public Navigation Items */}
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={getLinkClass(false, isActive(item.path))}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* Authenticated Navigation Items */}
            {user && authenticatedNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={getLinkClass(false, isActive(item.path))}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* Secondary Items */}
            {secondaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={getLinkClass(false, isActive(item.path))}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* User-specific Items */}
            {user ? (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                  <Link
                    to="/profile"
                    className={getLinkClass(false)}
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={getLinkClass(false)}
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  {(user.role === 'editor' || user.role === 'admin') && (
                    <Link
                      to="/editor"
                      className={getLinkClass(false)}
                      onClick={() => setIsOpen(false)}
                    >
                      <Layout className="h-4 w-4 mr-2" />
                      Editor Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  to="/register"
                  className="block bg-green-600 text-white mx-2 px-3 py-2 rounded-md text-base font-medium hover:bg-green-700 transition-colors flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Link>
                <Link
                  to="/login"
                  className="block bg-indigo-600 text-white mx-2 px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
