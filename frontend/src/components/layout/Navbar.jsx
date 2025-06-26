// src/components/layout/Navbar.jsx

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Sun, Moon, User, LogOut, LayoutGrid, Newspaper, Info } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
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

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <motion.button 
      onClick={toggleTheme} 
      className="flex-shrink-0 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center justify-center w-10 h-10" 
      aria-label="Toggle theme" 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div 
          key={theme} 
          initial={{ y: -20, opacity: 0, rotate: -90 }} 
          animate={{ y: 0, opacity: 1, rotate: 0 }} 
          exit={{ y: 20, opacity: 0, rotate: 90 }} 
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

const UserAvatar = ({ user }) => {
  if (!user || !user.username) return <div className="w-10 h-10 rounded-full bg-secondary" />;
  const imageUrl = user.profilePicture?.url || null;
  const [isImageBroken, setImageBroken] = useState(false);
  
  if (imageUrl && !isImageBroken) {
    return (
      <img 
        src={imageUrl} 
        alt={user.username} 
        className="w-10 h-10 rounded-full object-cover" 
        onError={() => setImageBroken(true)} 
      />
    );
  }
  
  const getInitials = (name = '') => {
    const words = name.trim().split(' ').filter(Boolean);
    if (words.length > 1) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div 
      className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-base" 
      title={user.username}
    >
      {getInitials(user.username)}
    </div>
  );
};

const UserMenu = ({ user, onLogout, navigate }) => (
  <div className="flex-shrink-0">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button 
          className="focus:outline-none rounded-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2" 
          whileTap={{ scale: 0.95 }}
        >
          <UserAvatar user={user} />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-popover/80 backdrop-blur-md border-border/20 shadow-lg" 
        align="end"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Hi, {user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/20" />
        <DropdownMenuItem 
          onSelect={() => navigate('/news')} 
          className="cursor-pointer hover:bg-accent/50"
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onSelect={() => navigate(`/news/user/${user.username}`)} 
          className="cursor-pointer hover:bg-accent/50"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/20" />
        <DropdownMenuItem 
          onSelect={onLogout} 
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

const AuthButtons = () => (
  <div className="flex-shrink-0 flex items-center gap-2 whitespace-nowrap">
    <Link 
      to="/login" 
      className="text-muted-foreground hover:text-foreground font-medium transition-colors py-2 px-4 rounded-md text-sm hover:bg-accent/50"
    >
      Login
    </Link>
    <Link 
      to="/register" 
      className="relative inline-flex items-center justify-center rounded-md px-5 py-2.5 overflow-hidden font-medium text-sm text-white bg-gradient-to-br from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 transition-all"
    >
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
      <span className="relative">Sign Up</span>
    </Link>
  </div>
);

export const Navbar = () => {
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => 
    `relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
      isActive ? 'text-primary' : 'text-muted-foreground'
    }`;

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-border/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left Side: Logo */}
        <div className="flex-shrink-0">
          <Link to={isLoggedIn ? "/news" : "/"} className="flex items-center gap-2">
            <Logo />
            <div className="hidden sm:block text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">AI</span>
              <span className="text-slate-800 dark:text-slate-100">NewsBuzz</span>
            </div>
          </Link>
        </div>

        {/* Right Side: Scrollable Continuum */}
        <div className="flex-1 flex justify-end items-center relative overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4 -my-4">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-2 border-r border-border/80 pr-4 mr-2">
              <NavLink to="/news" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-1">
                      <Newspaper size={16} className="shrink-0" />
                      News
                    </span>
                    {isActive && (
                      <motion.div 
                        className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary rounded-full" 
                        layoutId="active-nav-underline" 
                      />
                    )}
                  </>
                )}
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-1">
                      <Info size={16} className="shrink-0" />
                      About
                    </span>
                    {isActive && (
                      <motion.div 
                        className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary rounded-full" 
                        layoutId="active-nav-underline" 
                      />
                    )}
                  </>
                )}
              </NavLink>
            </nav>

            {/* Always Visible Action Items */}
            <div className="flex-shrink-0">
              <WeatherWidget />
            </div>
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
            
            {isLoggedIn && user ? (
              <UserMenu user={user} onLogout={handleLogout} navigate={navigate} />
            ) : (
              <AuthButtons />
            )}
          </div>
          {/* Edge Fade Effect */}
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </header>
  );
};