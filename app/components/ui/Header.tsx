"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  MenuIcon,
  XIcon,
  LayoutDashboard,
  LineChart,
  LogOut,
  User,
  Bell,
  Wallet,
  BarChart3,
  Newspaper,
  Settings,
  ChevronDown,
  HelpCircle,
  LogIn,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  isMobile?: boolean;
  icon?: React.ReactNode;
}

function NavLink({ href, children, onClick, isMobile = false, icon }: NavLinkProps) {
  const pathname = usePathname();
  // Check if the current path starts with the href (for nested routes)
  const isActive = pathname === href ||
    (href !== '/' && href !== '/landing' && pathname.startsWith(href));

  // For desktop nav links
  if (!isMobile) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        <Link
          href={href}
          className={`${isActive
            ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-medium'
            : 'border-transparent text-gray-600 dark:text-gray-300 hover:border-indigo-400/70 hover:text-indigo-600 dark:hover:text-indigo-400'
          } inline-flex items-center gap-1.5 px-3 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
          onClick={onClick}
        >
          {icon && <span className="text-lg">{icon}</span>}
          {children}
        </Link>
      </motion.div>
    );
  }

  // For mobile nav links
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <Link
        href={href}
        className={`${isActive
          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 text-indigo-700 dark:text-indigo-400 font-medium'
          : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-indigo-400/50 hover:text-indigo-600 dark:hover:text-indigo-400'
        } flex items-center gap-3 pl-4 pr-5 py-3 border-l-4 text-base transition-colors duration-200`}
        onClick={onClick}
      >
        {icon && <span>{icon}</span>}
        {children}
      </Link>
    </motion.div>
  );
}

interface HeaderProps {
  // You can add the isAuthenticated prop once you add authentication
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated: propIsAuthenticated }: HeaderProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const isAuthenticated = propIsAuthenticated || !!user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Force re-render when authentication state changes
  const [forceUpdate, setForceUpdate] = useState(0);

  // Listen for authentication changes and force re-render
  useEffect(() => {
    console.log("Auth state changed:", !!user);
    setForceUpdate(prev => prev + 1);
  }, [user]);

  // Define page types for better navigation control
  const pageType = {
    isLandingPage: pathname === '/' || pathname === '/landing',
    isAuthPage: pathname.startsWith('/auth/'),
    isDashboardPage: pathname === '/dashboard',
    isPortfolioPage: pathname.startsWith('/portfolio'),
    isMarketPage: pathname.startsWith('/market'),
    isNewsPage: pathname.startsWith('/news'),
    isProfilePage: pathname.startsWith('/profile'),
    isAboutPage: pathname === '/about'
  };

  // Check if we're on any public page (landing or auth)
  const isPublicPage = pageType.isLandingPage || pageType.isAuthPage;

  // Check if we're on any authenticated app page
  const isAppPage =
    pageType.isDashboardPage ||
    pageType.isPortfolioPage ||
    pageType.isMarketPage ||
    pageType.isNewsPage ||
    pageType.isProfilePage;

  // Debug authentication state
  useEffect(() => {
    if (user) {
      console.log('User authenticated:', user.email);
      console.log('Current path:', pathname);
      console.log('Is app page:', isAppPage);
    }
  }, [user, pathname, isAppPage]);

  // Define navigation items with icons for each page type
  const landingNavItems = [
    { href: "/landing", label: "Home" },
    { href: "/landing#features", label: "Features" },
    { href: "/landing#pricing", label: "Pricing" },
    { href: "/landing#about", label: "About" }
  ];

  const appNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/portfolio", label: "Portfolio", icon: <Wallet size={18} /> },
    { href: "/staking", label: "Staking", icon: <TrendingUp size={18} /> },
    { href: "/market", label: "Market", icon: <BarChart3 size={18} /> },
    { href: "/news", label: "News", icon: <Newspaper size={18} /> },
    { href: "/profile", label: "Profile", icon: <User size={18} /> }
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close user menu if it's open
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    // Close mobile menu if it's open
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/signin');
    if (isMenuOpen) toggleMenu();
    if (isUserMenuOpen) toggleUserMenu();
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Only close if clicking outside the menus
      const target = e.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.user-menu-button')) {
        if (isMenuOpen) setIsMenuOpen(false);
        if (isUserMenuOpen) setIsUserMenuOpen(false);
      }
    };

    // Add event listener only when a menu is open
    if (isMenuOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isUserMenuOpen]);

  // Animation variants
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        delay: 0.2
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + (i * 0.1),
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    })
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const dropdownMenuVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.header
      className="bg-[var(--header-bg)] backdrop-blur-sm border-b border-[var(--header-border)] sticky top-0 z-50 py-2"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <motion.div
              className="flex-shrink-0 flex items-center mr-8"
              variants={logoVariants}
            >
              <Link href={isAppPage ? '/dashboard' : '/landing'} className="flex items-center">
                <motion.img
                  src="/logo.png"
                  alt="CryptoNested Logo"
                  className="h-9 w-auto mr-3"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
                <motion.span
                  className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  CryptoNested
                </motion.span>
              </Link>
            </motion.div>

            {/* Always show app navigation when user is authenticated, regardless of current page */}
            {isAuthenticated && (
              <motion.nav className="hidden sm:flex sm:space-x-8">
                {appNavItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    custom={index}
                    variants={navItemVariants}
                  >
                    <NavLink href={item.href} icon={item.icon}>{item.label}</NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            )}

            {/* Show landing page nav for unauthenticated users on non-public pages */}
            {!isAppPage && !isPublicPage && (
              <motion.nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {landingNavItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    custom={index}
                    variants={navItemVariants}
                  >
                    <NavLink href={item.href}>{item.label}</NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            >
              {theme === 'dark' ?
                <motion.div
                  key="sun-icon"
                  initial={{ scale: 0.5, opacity: 0, rotate: 180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: -180 }}
                  transition={{ duration: 0.3 }}
                >
                  <SunIcon className="h-5 w-5" />
                </motion.div> :
                <motion.div
                  key="moon-icon"
                  initial={{ scale: 0.5, opacity: 0, rotate: 180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: -180 }}
                  transition={{ duration: 0.3 }}
                >
                  <MoonIcon className="h-5 w-5" />
                </motion.div>
              }
            </motion.button>

            {/* Login/Register buttons for public pages */}
            {!isAuthenticated && isPublicPage && (
              <div className="hidden sm:flex sm:items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-2 text-sm font-medium transition-colors"
                >
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-200"
                >
                  Get started
                </Link>
              </div>
            )}

            {/* User dropdown for authenticated users */}
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                {/* Notifications button */}
                <button
                  type="button"
                  className="p-2 rounded-full text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="user-menu-button flex items-center space-x-1 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>

                  {/* User dropdown menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50"
                        variants={dropdownMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={toggleUserMenu}
                        >
                          <User className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          Your Profile
                        </Link>
                        <Link
                          href="/profile?tab=settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={toggleUserMenu}
                        >
                          <Settings className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          Settings
                        </Link>
                        <Link
                          href="/help"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={toggleUserMenu}
                        >
                          <HelpCircle className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          Help
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={toggleMenu}
                className="mobile-menu inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-expanded={isMenuOpen}
                aria-label="Main menu"
              >
                <span className="sr-only">Open main menu</span>
                <AnimatePresence mode="wait" initial={false}>
                  {isMenuOpen ? (
                    <motion.div
                      key="close-icon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <XIcon className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu-icon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MenuIcon className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu sm:hidden fixed inset-0 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />

            {/* Menu content */}
            <motion.div
              className="relative mt-16 flex-1 bg-white dark:bg-gray-900 overflow-y-auto"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-4 pt-6 pb-8 space-y-6">
                {/* User info for authenticated users */}
                {isAuthenticated && (
                  <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user?.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation links */}
                <nav className="space-y-1.5">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {isAuthenticated ? 'Dashboard' : 'Menu'}
                  </h3>

                  {isAuthenticated ? (
                    // Mobile nav for authenticated users - always show app navigation
                    <div className="space-y-1">
                      {appNavItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          variants={navItemVariants}
                          custom={index}
                        >
                          <NavLink href={item.href} icon={item.icon} isMobile onClick={toggleMenu}>{item.label}</NavLink>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    // Mobile nav for landing pages
                    <div className="space-y-1">
                      {landingNavItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          variants={navItemVariants}
                          custom={index}
                        >
                          <NavLink href={item.href} isMobile onClick={toggleMenu}>{item.label}</NavLink>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </nav>

                {/* Auth buttons */}
                <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-800">
                  {!isAuthenticated ? (
                    <div className="flex flex-col space-y-3">
                      <motion.div
                        variants={navItemVariants}
                        custom={0}
                      >
                        <Link
                          href="/auth/signin"
                          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={toggleMenu}
                        >
                          <LogIn className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                          Sign in
                        </Link>
                      </motion.div>
                      <motion.div
                        variants={navItemVariants}
                        custom={1}
                      >
                        <Link
                          href="/auth/signup"
                          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-sm transition-colors"
                          onClick={toggleMenu}
                        >
                          Get started
                        </Link>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <motion.div
                        variants={navItemVariants}
                        custom={0}
                      >
                        <Link
                          href="/profile?tab=settings"
                          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={toggleMenu}
                        >
                          <Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                          Settings
                        </Link>
                      </motion.div>
                      <motion.div
                        variants={navItemVariants}
                        custom={1}
                      >
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Sign out
                        </button>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Theme toggle */}
                <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {theme === 'dark' ? (
                      <>
                        <SunIcon className="mr-3 h-5 w-5 text-yellow-500" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <MoonIcon className="mr-3 h-5 w-5 text-indigo-500" />
                        Dark Mode
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

