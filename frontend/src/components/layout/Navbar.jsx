// src/components/layout/Navbar.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useNotificationStore } from '../../store/notification.store';
import { 
  Bell, Sun, Moon, RefreshCw, CloudOff, Thermometer, Droplets, Wind ,MapPin,Star,Cloud,Snowflake,
  Globe  
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
import { motion } from 'framer-motion';
const SunVisual = () => (
  <motion.div
    className="absolute top-1 right-1 w-8 h-8 bg-yellow-400 rounded-full"
    animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 10px #fde047', '0 0 20px #fde047', '0 0 10px #fde047'] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  />
);

const MoonVisual = () => (
  <>
    <motion.div
      className="absolute top-1 right-2 w-7 h-7 bg-slate-200 rounded-full"
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute top-8 left-2"
      animate={{ opacity: [0.5, 1, 0.5]}}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
    ><Star size={8} className="text-yellow-200 fill-yellow-200" /></motion.div>
    <motion.div 
      className="absolute top-3 left-8"
      animate={{ opacity: [1, 0.5, 1]}}
      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
    ><Star size={6} className="text-yellow-200 fill-yellow-200" /></motion.div>
  </>
);

const CloudVisual = ({ children }) => (
  <motion.div
    className="absolute -top-1 -left-4"
    animate={{ x: [-5, 5, -5] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  >
    <Cloud size={60} className="text-white/80 fill-white/80" />
    {children}
  </motion.div>
);

const RainVisual = () => (
  <CloudVisual>
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute top-10 w-0.5 h-2 bg-blue-300 rounded-full"
        style={{ left: `${20 + i * 15}%` }}
        animate={{ y: [0, 20], opacity: [1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
      />
    ))}
  </CloudVisual>
);

const SnowVisual = () => (
  <CloudVisual>
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute top-10"
        style={{ left: `${20 + i * 15}%` }}
        animate={{ y: [0, 20], x: [0, (i%2 === 0 ? 5 : -5), 0], rotate: [0, 180], opacity: [1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
      >
        <Snowflake size={8} className="text-white"/>
      </motion.div>
    ))}
  </CloudVisual>
);

// --- HELPER TO DETERMINE VISUALS BASED ON WEATHER ---
const getWeatherVisuals = (weather) => {
  if (!weather || !weather.current) {
    return { background: 'bg-secondary', VisualComponent: null };
  }

  const code = weather.current.condition.code;
  const isDay = weather.current.is_day;

  // Sunny / Clear
  if (code === 1000) {
    return isDay
      ? { background: 'bg-gradient-to-br from-sky-400 to-blue-500', VisualComponent: SunVisual }
      : { background: 'bg-gradient-to-br from-slate-800 to-indigo-900', VisualComponent: MoonVisual };
  }
  // Cloudy
  if ([1003, 1006, 1009, 1030].includes(code)) {
    return { background: 'bg-gradient-to-br from-slate-400 to-gray-500', VisualComponent: CloudVisual };
  }
  // Rain
  if (code >= 1150 && code <= 1201 || [1063, 1087].includes(code)) {
     return { background: 'bg-gradient-to-br from-slate-500 to-gray-600', VisualComponent: RainVisual };
  }
  // Snow
  if (code >= 1204 && code <= 1237 || [1066, 1114, 1117].includes(code)) {
     return { background: 'bg-gradient-to-br from-slate-500 to-blue-700', VisualComponent: SnowVisual };
  }
  // Default (similar to clear)
  return isDay
    ? { background: 'bg-gradient-to-br from-sky-400 to-blue-500', VisualComponent: SunVisual }
    : { background: 'bg-gradient-to-br from-slate-800 to-indigo-900', VisualComponent: MoonVisual };
};


// --- THE MAIN WEATHER WIDGET ---
const WeatherWidget = () => {
  const [weather, setWeather] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(null); const [isRefreshing, setIsRefreshing] = useState(false); const [locationSource, setLocationSource] = useState(null);
  const fetchWeather = async (isManualRefresh = false) => {
    if (!isManualRefresh) setLoading(true); setError(null);
    try {
      const apiKey = import.meta.env.VITE_WEATHERAPI_KEY; if (!apiKey) throw new Error("WeatherAPI key not configured");
      const locationQuery = await new Promise((resolve) => {
        if (!navigator.geolocation) { setLocationSource('ip'); resolve('auto:ip'); return; }
        navigator.geolocation.getCurrentPosition( (pos) => { setLocationSource('precise'); resolve(`${pos.coords.latitude},${pos.coords.longitude}`); }, () => { setLocationSource('ip'); resolve('auto:ip'); }, { timeout: 5000 });
      });
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${locationQuery}`); if (!response.ok) throw new Error(`WeatherAPI error: ${response.status}`);
      const data = await response.json(); setWeather(data);
    } catch (err) { console.error("Weather fetch error:", err); setError(err.message); } finally { if (!isManualRefresh) setLoading(false); }
  };
  const handleRefreshClick = () => { if (isRefreshing) return; setIsRefreshing(true); fetchWeather(true).finally(() => setIsRefreshing(false)); };
  useEffect(() => { fetchWeather(); const interval = setInterval(() => fetchWeather(true), 15 * 60 * 1000); return () => clearInterval(interval); }, []);
  const { background, VisualComponent } = getWeatherVisuals(weather);
  if (loading && !weather) return <div className="h-9 w-24 bg-secondary/50 rounded-full animate-pulse" />;
  if (error) return (<button className="group flex items-center gap-2 px-3 py-1.5 h-9 rounded-full text-sm text-destructive cursor-pointer bg-destructive/10 hover:bg-destructive/20 transition-colors" onClick={() => fetchWeather()} title="Weather unavailable. Click to retry."><CloudOff size={16} /><span>Retry</span></button>);
  if (!weather?.current) return null;
  const LocationIndicator = () => { if (locationSource === 'precise') return <MapPin size={12} className="text-blue-300" title="Using precise location" />; if (locationSource === 'ip') return <Globe size={12} className="text-yellow-300" title="Using approximate location (IP-based)" />; return null; };

  return (
    // The main container that enables the hover interaction
    <div className="group relative">
      {/* The visible weather button */}
      <motion.div
        className={`relative flex items-center justify-center gap-1.5 cursor-pointer h-9 w-24 rounded-full overflow-hidden
                    border border-border/10 text-white shadow-inner
                    transition-all duration-500 ${background}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {VisualComponent && <VisualComponent />}
        <div className="relative z-10 flex items-center" style={{textShadow: '0 1px 3px rgba(0,0,0,0.4)'}}>
          <img 
            src={`https:${weather.current.condition.icon}`} 
            alt={weather.current.condition.text}
            className="w-8 h-8 -ml-1 drop-shadow-lg"
          />
          <span className="text-sm font-bold">
            {Math.round(weather.current.temp_c)}°
          </span>
        </div>
      </motion.div>

      {/* The hidden popover that appears on hover */}
      <div
        className="absolute top-full right-0 mt-2 w-60 origin-top-right
                   opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                   pointer-events-none group-hover:pointer-events-auto
                   transition-all duration-200 ease-in-out z-50"
      >
        <div className="bg-popover text-popover-foreground rounded-xl border border-border shadow-2xl overflow-hidden">
          <div className="flex justify-between items-start p-3">
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-foreground truncate">{weather.location.name}</p>
                <LocationIndicator />
              </div>
              <p className="text-xs text-muted-foreground">{weather.current.condition.text}</p>
            </div>
            <img 
              src={`https:${weather.current.condition.icon}`} 
              alt={weather.current.condition.text}
              className="w-12 h-12 -mt-1 -mr-1 flex-shrink-0"
            />
          </div>
          <div className="h-px bg-border" />
          <div className="p-3 space-y-2.5 text-sm">
             <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><Thermometer size={16}/><span>Feels Like</span></div><span className="font-semibold text-foreground">{Math.round(weather.current.feelslike_c)}°C</span></div>
             <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><Droplets size={16}/><span>Humidity</span></div><span className="font-semibold text-foreground">{weather.current.humidity}%</span></div>
             <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-muted-foreground"><Wind size={16}/><span>Wind</span></div><span className="font-semibold text-foreground">{weather.current.wind_kph} km/h</span></div>
          </div>
          <div className="h-px bg-border" />
          <button onClick={handleRefreshClick} disabled={isRefreshing} className="w-full text-xs text-muted-foreground flex items-center justify-center gap-1.5 p-2 hover:bg-accent transition-colors disabled:opacity-50">
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Updating...' : `Last updated: ${new Date(weather.current.last_updated_epoch * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
          </button>
        </div>
      </div>
    </div>
  );
};
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

const UserAvatar = ({ user }) => {
  if (!user || !user.username) {
    return <div className="w-9 h-9 rounded-full bg-secondary" />;
  }

  const imageUrl =
    typeof user.profilePicture === 'string' && user.profilePicture
      ? user.profilePicture
      : user.profilePicture?.url || null;

  const [isImageBroken, setImageBroken] = useState(false);

  if (imageUrl && !isImageBroken) {
    return (
      <img
        src={imageUrl}
        alt={user.username}
        className="w-9 h-9 rounded-full object-cover border-2 border-transparent"
        onError={() => setImageBroken(true)}
      />
    );
  }

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
        <div className="flex items-center gap-6">
          <Link to={isLoggedIn ? "/news" : "/"} className="flex items-center">
            <Logo />
            <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 tracking-tight font-[Inter]">
              AI<span className="text-gray-800 dark:text-gray-100">NewsBuzz</span>
            </span>
          </Link>
        </div>

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
          
          <WeatherWidget />
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