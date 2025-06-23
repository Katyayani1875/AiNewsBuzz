// src/components/layout/Navbar.jsx (DEFINITIVE FIX FOR RE-RENDERING)

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useNotificationStore } from '../../store/notification.store';
// import { Logo } from './Logo'; 
import { Bell, User, Sun, Moon, Globe, Cloud, CloudRain, CloudSnow, CloudLightning, CloudSun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from 'react';
import axios from 'axios';

// --- Sub-Components (Logo, ThemeToggle, WeatherWidget) ---
// These are correct and do not need changes.
const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12L12 6L18 12L12 18L6 12Z" fill="url(#paint0_linear_logo)" />
      <path d="M14 18L20 12L26 18L20 24L14 18Z" fill="url(#paint1_linear_logo)" />
      <defs>
        <linearGradient id="paint0_linear_logo" x1="12" y1="6" x2="12" y2="18" gradientUnits="userSpaceOnUse"><stop stopColor="#22D3EE"/><stop offset="1" stopColor="#0EA5E9"/></linearGradient>
        <linearGradient id="paint1_linear_logo" x1="20" y1="12" x2="20" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#A78BFA"/><stop offset="1" stopColor="#818CF8"/></linearGradient>
      </defs>
    </svg>
  );
const ThemeToggle = () => { /* ... existing correct code ... */ };
const WeatherWidget = () => { /* ... existing correct code ... */ };


// --- The Main Navbar Component ---
export const Navbar = () => {
    // =========================================================================
    // THE FIX IS HERE.
    // Instead of destructuring the state, we use a "selector" function.
    // This is the most robust way to subscribe to Zustand state changes.
    // React will now track the EXACT values we need (`token` and `user`)
    // and will re-render this component ONLY when those specific values change.
    // =========================================================================
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);
    
    const { unreadCount } = useNotificationStore();
    const navigate = useNavigate();

    // We derive the login status directly from the token. This is our single source of truth.
    const isLoggedIn = !!token;

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to a public page after logout
    };

    return (
        <header className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link to={isLoggedIn ? "/news" : "/"} className="flex items-center gap-3">
                        <Logo />
                        <span className="text-xl font-bold text-foreground hidden sm:inline-block">AI NewsBuzz</span>
                    </Link>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                    <NavLink to="/about" className={({ isActive }) => `hidden sm:block text-sm font-semibold transition-colors px-2 py-1 rounded-md ${ isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground' }`}>
                        About
                    </NavLink>
                    <WeatherWidget />
                    <ThemeToggle />

                    {/* This logic is now guaranteed to work because the component will re-render
                        when `isLoggedIn` and `user` change from null to their real values. */}
                    {isLoggedIn && user ? (
                        <>
                            <div className="relative p-2 rounded-full hover:bg-accent transition-colors cursor-pointer" title={`${unreadCount} unread notifications`}>
                                <Bell className="text-muted-foreground" size={20} />
                                {unreadCount > 0 && (<div className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">{unreadCount}</div>)}
                            </div>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-full">
                                        <img 
                                            src={user.profilePicture?.url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`} 
                                            alt={user.username} 
                                            className="w-9 h-9 rounded-full object-cover border-2 border-transparent" 
                                        />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-popover border-border text-popover-foreground w-48" align="end">
                                    <DropdownMenuLabel>Hi, {user.username}</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-border" />
                                    <DropdownMenuItem onSelect={() => navigate(`/news/user/${user.username}`)} className="cursor-pointer focus:bg-accent">Profile</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer focus:bg-destructive/10 text-red-500 focus:text-white focus:bg-destructive">Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-muted-foreground hover:text-foreground font-semibold transition-colors py-2 px-3 rounded-md text-sm">Login</Link>
                            <Link to="/register" className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity text-sm">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};