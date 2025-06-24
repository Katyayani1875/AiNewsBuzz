// src/components/layout/Navbar.jsx

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useNotificationStore } from '../../store/notification.store';
import { Bell, Sun, Moon } from 'lucide-react';
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

// --- Sub-Components ---

// // 1. Professional SVG Logo Component
// const Logo = () => (
//   <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M6 12L12 6L18 12L12 18L6 12Z" fill="url(#paint0_linear_logo)" />
//     <path d="M14 18L20 12L26 18L20 24L14 18Z" fill="url(#paint1_linear_logo)" />
//     <defs>
//       <linearGradient id="paint0_linear_logo" x1="12" y1="6" x2="12" y2="18" gradientUnits="userSpaceOnUse">
//         <stop stopColor="#22D3EE" />
//         <stop offset="1" stopColor="#0EA5E9" />
//       </linearGradient>
//       <linearGradient id="paint1_linear_logo" x1="20" y1="12" x2="20" y2="24" gradientUnits="userSpaceOnUse">
//         <stop stopColor="#A78BFA" />
//         <stop offset="1" stopColor="#818CF8" />
//       </linearGradient>
//     </defs>
//   </svg>
// );

// 2. Theme Toggle for Light/Dark Mode
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

// 3. Updated UserAvatar Component
const UserAvatar = ({ user }) => {
  if (!user || !user.username) {
    return <div className="w-9 h-9 rounded-full bg-secondary" />;
  }

  // Check for valid profile picture URL
  const imageUrl =
    typeof user.profilePicture === 'string' && user.profilePicture
      ? user.profilePicture
      : user.profilePicture?.url || null;

  // --- Fix: Handle broken image case ---
  const [isImageBroken, setImageBroken] = useState(false);

  if (imageUrl && !isImageBroken) {
    return (
      <img
        src={imageUrl}
        alt={user.username}
        className="w-9 h-9 rounded-full object-cover border-2 border-transparent"
        onError={() => setImageBroken(true)} // Set state if image fails to load
      />
    );
  }

  // --- Fallback to initials ---
  const getInitials = (name = '') => {
    const words = name.trim().split(' ');
    if (words.length > 1) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm"
      title={user.username}
    >
      {getInitials(user.username)}
    </div>
  );
};

// --- The Main Navbar Component ---
export const Navbar = () => {
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = !!token;
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <Link to={isLoggedIn ? "/news" : "/"} className="flex items-center">
            <Logo />
           <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 tracking-tight font-[Inter]">
  AI<span className="text-gray-800 dark:text-gray-100">NewsBuzz</span>
</span>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hidden sm:block text-sm font-semibold transition-colors px-2 py-1 rounded-md ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            About
          </NavLink>
          <ThemeToggle />

          {isLoggedIn && user ? (
            <>
              <div
                className="relative p-2 rounded-full hover:bg-accent transition-colors cursor-pointer"
                title={`${unreadCount} unread notifications`}
              >
                <Bell className="text-muted-foreground" size={20} />
                {unreadCount > 0 && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                    {unreadCount}
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-full">
                    <UserAvatar user={user} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover border-border text-popover-foreground w-48" align="end">
                  <DropdownMenuLabel>Hi, {user.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onSelect={() => navigate(`/news/user/${user.username}`)}
                    className="cursor-pointer focus:bg-accent"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={handleLogout}
                    className="cursor-pointer focus:bg-destructive/10 text-red-500 focus:text-white focus:bg-destructive"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-foreground font-semibold transition-colors py-2 px-3 rounded-md text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
