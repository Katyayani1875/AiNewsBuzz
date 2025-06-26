// src/components/layout/Navbar.jsx

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { 
  Sun, Moon, RefreshCw, CloudOff, Thermometer, Droplets, Wind, MapPin, Star, Cloud, Snowflake,
  Globe, Zap, Rss, User, LogOut, LayoutGrid, Newspaper, Info
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
// === DYNAMIC WEATHER ICON LOGIC (Keep all your existing weather components) ===
// ===================================================================================
// [All your existing weather components remain exactly the same]
// IconBase, SunIcon, MoonIcon, CloudIcon, RainIcon, SnowIcon, ThunderIcon
// IconSun, IconMoon, IconCloudy, IconPartlyCloudyDay, IconPartlyCloudyNight
// IconRainy, IconSnowy, IconThunderstorm, IconRainyThunder, DynamicWeatherIcon
// SunVisual, MoonVisual, CloudVisual, RainVisual, SnowVisual, getWeatherVisuals

const WeatherWidget = () => {
  // [Keep your existing WeatherWidget implementation exactly the same]
  // This includes all the state, effects, and rendering logic
};

const ThemeToggle = () => {
  // [Keep your existing ThemeToggle implementation exactly the same]
};

const UserAvatar = ({ user }) => {
  // [Keep your existing UserAvatar implementation exactly the same]
};

// ===================================================================================
// === NEW NAVBAR IMPLEMENTATION WITH RESPONSIVE DESIGN ===
// ===================================================================================

export const Navbar = () => {
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Desktop nav link styling with animated underline
  const navLinkClass = ({ isActive }) => 
    `relative px-3 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    }`;

  return (
    <header className="bg-background/90 backdrop-blur-lg border-b border-border/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link to={isLoggedIn ? "/news" : "/"} className="flex items-center gap-3">
              <Logo />
              <div className="hidden md:block text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">AI</span>
                <span className="text-slate-800 dark:text-slate-100">NewsBuzz</span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-4">
            <NavLink to="/news" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  News
                  {isActive && (
                    <motion.div 
                      className="absolute bottom-1 left-1 right-1 h-[2px] bg-primary rounded-full"
                      layoutId="desktop-nav-underline"
                    />
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  About
                  {isActive && (
                    <motion.div 
                      className="absolute bottom-1 left-1 right-1 h-[2px] bg-primary rounded-full"
                      layoutId="desktop-nav-underline"
                    />
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* Right Side: Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <WeatherWidget />
              <ThemeToggle />
            </div>
            
            {isLoggedIn && user ? (
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
                  className="w-56 bg-popover/80 backdrop-blur-md border-border/20" 
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
                    className="cursor-pointer"
                  >
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => navigate(`/news/user/${user.username}`)} 
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/20" />
                  <DropdownMenuItem 
                    onSelect={handleLogout} 
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="hidden sm:block text-muted-foreground hover:text-foreground font-semibold transition-colors py-2 px-4 rounded-md text-sm"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="relative inline-flex items-center justify-center rounded-md px-5 py-2.5 overflow-hidden font-medium text-sm text-indigo-50 group bg-gradient-to-br from-purple-600 to-indigo-500 hover:text-white"
                >
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                  <span className="relative">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-Bar: Visible only on small screens */}
        <div className="md:hidden flex items-center justify-center gap-4 border-t border-border/80 -mx-4 px-4 py-2">
          <NavLink 
            to="/news" 
            className={({ isActive }) => 
              `flex-1 text-center py-2 text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`
            }
          >
            News
          </NavLink>
          <div className="h-6 w-px bg-border/80" />
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `flex-1 text-center py-2 text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`
            }
          >
            About
          </NavLink>
          <div className="h-6 w-px bg-border/80" />
          <div className="flex-1 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};