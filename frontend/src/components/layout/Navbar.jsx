// src/components/layout/Navbar.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { 
  Sun, Moon, User, LogOut, LayoutGrid, Newspaper, Info
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

// WeatherWidget remains unchanged (imported from its own file)
import { WeatherWidget } from './WeatherWidget';

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

export const Navbar = () => {
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = "relative text-sm font-semibold text-muted-foreground transition-colors hover:text-primary";

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-border/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Left Section: Logo - Pinned */}
        <div className="flex-shrink-0">
          <Link 
            to={isLoggedIn ? "/news" : "/"} 
            className="flex items-center gap-2"
            aria-label="Home"
          >
            <Logo />
            <div className="hidden sm:block text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">AI</span>
              <span className="text-slate-800 dark:text-slate-100">NewsBuzz</span>
            </div>
          </Link>
        </div>

        {/* Right Section: Scrollable "Continuum" */}
        <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4 overflow-hidden">
          {/* Main Navigation Links */}
          <div className="flex-shrink-0 hidden md:flex items-center gap-4 border-r border-border/80 pr-4 mr-2">
            <NavLink 
              to="/news" 
              className={navLinkClass}
              aria-label="News"
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-2">
                    <Newspaper size={16} className="md:hidden" />
                    <span>News</span>
                  </span>
                  {isActive && (
                    <motion.div 
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary" 
                      layoutId="active-nav-link" 
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink 
              to="/about" 
              className={navLinkClass}
              aria-label="About"
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-2">
                    <Info size={16} className="md:hidden" />
                    <span>About</span>
                  </span>
                  {isActive && (
                    <motion.div 
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary" 
                      layoutId="active-nav-link" 
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </div>

          {/* Action Items - Scrollable */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-4 -my-4 pl-2">
            <WeatherWidget />
            <ThemeToggle />
            
            {isLoggedIn && user ? (
              <UserMenu user={user} onLogout={handleLogout} navigate={navigate} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Helper Components
const UserMenu = ({ user, onLogout, navigate }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <motion.button 
        className="flex-shrink-0 focus:outline-none rounded-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
        whileTap={{ scale: 0.95 }}
        aria-label="User menu"
      >
        <UserAvatar user={user} />
      </motion.button>
    </DropdownMenuTrigger>
    <DropdownMenuContent 
      className="w-56 bg-popover/80 backdrop-blur-md border-border/20 shadow-lg"
      align="end"
      sideOffset={8}
    >
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">Hi, {user.username}</p>
          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-border/20" />
      <DropdownMenuItem 
        onSelect={() => navigate(`/news`)} 
        className="cursor-pointer focus:bg-accent/50"
      >
        <LayoutGrid className="mr-2 h-4 w-4" />
        <span>Dashboard</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        onSelect={() => navigate(`/news/user/${user.username}`)} 
        className="cursor-pointer focus:bg-accent/50"
      >
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-border/20" />
      <DropdownMenuItem 
        onSelect={onLogout} 
        className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const AuthButtons = () => (
  <div className="flex-shrink-0 flex items-center gap-2 whitespace-nowrap">
    <Link 
      to="/login" 
      className="text-muted-foreground hover:text-foreground font-semibold transition-colors py-2 px-4 rounded-md text-sm"
      aria-label="Login"
    >
      Login
    </Link>
    <Link 
      to="/register" 
      className="relative overflow-hidden bg-primary text-primary-foreground font-semibold py-2.5 px-5 rounded-md hover:bg-primary/90 transition-all text-sm"
      aria-label="Sign up"
    >
      <span className="relative z-10">Sign Up</span>
      <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-500/20 opacity-0 hover:opacity-100 transition-opacity" />
    </Link>
  </div>
);