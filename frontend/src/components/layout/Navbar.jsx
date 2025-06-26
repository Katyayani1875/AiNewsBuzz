// src/components/layout/Navbar.jsx

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { 
  Sun, Moon, RefreshCw, CloudOff, Thermometer, Droplets, Wind, MapPin, Star, Cloud, Snowflake,
  Globe, User, LogOut, LayoutGrid, Menu, X, Newspaper, Info
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

// ===================================================================================
// === START: DYNAMIC WEATHER ICON LOGIC ===
// (Keep all your existing weather icon components exactly as they were)
// ===================================================================================

const IconBase = ({ children, ...props }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
    {...props}
  >
    <defs>
      <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f3f4f6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#e5e7eb', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {children}
  </motion.svg>
);

// ... (Keep all your existing weather icon components)

// ===================================================================================
// === END: DYNAMIC WEATHER ICON LOGIC ===
// ===================================================================================

const WeatherWidget = () => {
  // ... (Keep your existing WeatherWidget implementation)
};

const ThemeToggle = () => {
  // ... (Keep your existing ThemeToggle implementation)
};

const UserAvatar = ({ user }) => {
  // ... (Keep your existing UserAvatar implementation)
};

export const Navbar = () => {
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-2 rounded-md ${
      isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
    }`;
  
  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 text-base font-medium p-3 rounded-lg ${
      isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'
    }`;

  return (
    <>
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
          
          {/* Left Section: Logo and Desktop Nav */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to={isLoggedIn ? "/news" : "/"} className="flex items-center gap-2">
              <Logo className="h-8 w-8 sm:h-10 sm:w-10" />
              <span className="hidden sm:block text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">AI</span>
                <span className="text-slate-800 dark:text-slate-100">NewsBuzz</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/news" className={navLinkClass}>
                <Newspaper className="h-4 w-4" />
                <span>News</span>
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                <Info className="h-4 w-4" />
                <span>About</span>
              </NavLink>
            </nav>
          </div>

          {/* Right Section: Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <WeatherWidget />
            <ThemeToggle />
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none rounded-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <UserAvatar user={user} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-popover/80 backdrop-blur-md border-border/20" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Hi, {user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/20" />
                  <DropdownMenuItem onSelect={() => navigate('/news')} className="cursor-pointer">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate(`/news/user/${user?.username}`)} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/20" />
                  <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-red-500 focus:text-white focus:bg-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-muted-foreground hover:text-foreground font-semibold transition-colors py-2 px-4 rounded-md text-sm">
                  Login
                </Link>
                <Link to="/register" className="relative inline-flex items-center justify-center rounded-md px-5 py-2.5 overflow-hidden font-medium text-sm text-indigo-50 group bg-gradient-to-br from-purple-600 to-indigo-500 hover:text-white">
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                  <span className="relative">Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <WeatherWidget mobile />
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:bg-accent"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-lg border-b border-border/80 shadow-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <nav className="flex flex-col p-4">
              <NavLink to="/news" className={mobileNavLinkClass}>
                <Newspaper className="h-5 w-5" />
                <span>News</span>
              </NavLink>
              <NavLink to="/about" className={mobileNavLinkClass}>
                <Info className="h-5 w-5" />
                <span>About</span>
              </NavLink>

              <div className="border-t border-border/50 my-2" />
              
              {isLoggedIn ? (
                <>
                  <Link 
                    to={`/news/user/${user?.username}`} 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent"
                  >
                    <UserAvatar user={user} />
                    <div>
                      <p className="font-semibold">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">View Profile</p>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-500/10 text-left"
                  >
                    <LogOut className="h-5 w-5" /> 
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link 
                    to="/login" 
                    className="w-full text-center py-3 px-4 rounded-lg bg-secondary text-secondary-foreground font-semibold"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="w-full text-center py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};