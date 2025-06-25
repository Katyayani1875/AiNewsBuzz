// src/components/layout/Navbar.jsx

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { 
  Sun, Moon, RefreshCw, CloudOff, Thermometer, Droplets, Wind, MapPin, Star, Cloud, Snowflake,
  Globe, Zap, Rss, User, LogOut, LayoutGrid
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
// === START: DYNAMIC WEATHER ICON LOGIC (MOVED FROM SEPARATE FILE) ===
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

const SunIcon = () => (
  <g>
    <motion.circle 
      cx="32" cy="32" r="10" fill="#FFD700" stroke="#FDB813" strokeWidth="1.5"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
    {[...Array(8)].map((_, i) => (
      <motion.line
        key={i}
        x1="32" y1="32" x2="32" y2="14"
        stroke="#FFD700" strokeWidth="2" strokeLinecap="round"
        style={{ transformOrigin: '32px 32px', rotate: i * 45 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
      />
    ))}
  </g>
);

const MoonIcon = () => (
  <g>
    <circle cx="32" cy="32" r="12" fill="#F5F3FF" stroke="#E0DDF3" strokeWidth="1.5" />
    <motion.circle 
      cx="26" cy="28" r="2" fill="#E0DDF3"
      animate={{ opacity: [0.6, 0.9, 0.6]}}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle 
      cx="36" cy="38" r="1.5" fill="#E0DDF3"
      animate={{ opacity: [0.8, 0.5, 0.8]}}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
  </g>
);

const CloudIcon = ({x=16, y=26}) => (
  <motion.g 
    fill="url(#cloudGradient)" stroke="#D1D5DB" strokeWidth="1.5" strokeLinejoin='round'
    animate={{ x: [-2, 2, -2] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path d={`M ${x+4},${y+14} a 5,5 0 0 1 -10,0 a 7,7 0 0 1 -2,-14 a 6,6 0 0 1 12,0 h 12 a 6,6 0 0 1 0,12 z`} />
  </motion.g>
);

const RainIcon = () => (
  <g>
    {[...Array(3)].map((_, i) => (
       <motion.line
        key={i}
        x1={28 + i * 6} y1="45" x2={26 + i * 6} y2="55"
        stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"
        animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
      />
    ))}
  </g>
);

const SnowIcon = () => (
    <g stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round">
        {[...Array(3)].map((_, i) => (
            <motion.path
                key={i}
                d={`M ${28 + i * 7} 45 l 0 6 M ${25 + i * 7} 48 l 6 0 M ${26.5 + i * 7} 46.5 l 3 3 M ${26.5 + i * 7} 49.5 l 3 -3`}
                animate={{ y: [0, 8], opacity: [1, 0], rotate: [0, 60] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
            />
        ))}
    </g>
);

const ThunderIcon = () => (
    <motion.path
        d="M 36 42 l -8 8 l 4 -6 l -8 8"
        stroke="#FBBF24" strokeWidth="2.5" fill="none" strokeLinejoin='round' strokeLinecap='round'
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
);

const IconSun = (props) => <IconBase {...props}><SunIcon /></IconBase>;
const IconMoon = (props) => <IconBase {...props}><MoonIcon /></IconBase>;
const IconCloudy = (props) => <IconBase {...props}><CloudIcon /></IconBase>;
const IconPartlyCloudyDay = (props) => <IconBase {...props}><g><SunIcon /><CloudIcon y={30} x={22}/></g></IconBase>;
const IconPartlyCloudyNight = (props) => <IconBase {...props}><g><MoonIcon /><CloudIcon y={30} x={22}/></g></IconBase>;
const IconRainy = (props) => <IconBase {...props}><CloudIcon /><RainIcon /></IconBase>;
const IconSnowy = (props) => <IconBase {...props}><CloudIcon /><SnowIcon /></IconBase>;
const IconThunderstorm = (props) => <IconBase {...props}><CloudIcon /><ThunderIcon /></IconBase>;
const IconRainyThunder = (props) => <IconBase {...props}><CloudIcon /><RainIcon /><ThunderIcon /></IconBase>;

const DynamicWeatherIcon = ({ code, isDay, ...props }) => {
  let IconComponent;

  switch (code) {
    case 1000: IconComponent = isDay ? IconSun : IconMoon; break;
    case 1003: IconComponent = isDay ? IconPartlyCloudyDay : IconPartlyCloudyNight; break;
    case 1006: case 1009: case 1030: case 1069: case 1072: case 1135: case 1147:
      IconComponent = IconCloudy; break;
    case 1063: case 1150: case 1153: case 1180: case 1183: case 1186: case 1189: case 1192: case 1195: case 1240: case 1243: case 1246:
      IconComponent = IconRainy; break;
    case 1066: case 1114: case 1117: case 1210: case 1213: case 1216: case 1219: case 1222: case 1225: case 1255: case 1258: case 1279: case 1282:
      IconComponent = IconSnowy; break;
    case 1087: case 1273: case 1276:
      IconComponent = IconRainyThunder; break;
    default: IconComponent = isDay ? IconPartlyCloudyDay : IconPartlyCloudyNight;
  }

  return (
    <AnimatePresence mode="wait">
        <IconComponent key={`${code}-${isDay}`} {...props} />
    </AnimatePresence>
  );
};

// ===================================================================================
// === END: DYNAMIC WEATHER ICON LOGIC ===
// ===================================================================================

const SunVisual = () => (
  <>
    <motion.div className="absolute top-1/2 left-1/2 w-12 h-12 bg-yellow-300/80 rounded-full" style={{ x: '-50%', y: '-50%' }} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}/>
    {[...Array(8)].map((_, i) => (<motion.div key={i} className="absolute top-1/2 left-1/2 w-1 h-12 bg-gradient-to-t from-yellow-300/0 to-yellow-300/70" style={{ originY: 0.5, originX: 0.5, rotate: i * 45 }} initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: [0, 0.7, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}/>))}
  </>
);

const MoonVisual = () => (
  <>
    <motion.div className="absolute top-2 right-3 w-8 h-8 bg-slate-100 rounded-full shadow-lg" animate={{ y: [0, -3, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}/>
    <motion.div className="absolute top-1 right-2 w-8 h-8 rounded-full" style={{ boxShadow: "inset -6px 2px 0 0px #e2e8f0" }} animate={{ rotate: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}/>
    {[...Array(3)].map((_, i) => (<motion.div key={i} className="absolute" style={{ top: `${15 + Math.random() * 40}%`, left: `${10 + Math.random() * 80}%` }} animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7]}} transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}><Star size={6 + Math.random() * 4} className="text-yellow-200 fill-yellow-200" /></motion.div>))}
  </>
);

const CloudVisual = ({ children }) => (
  <>
    <motion.div className="absolute -top-4 -left-8" animate={{ x: [-10, 10, -10] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}><Cloud size={80} className="text-white/30 fill-white/30" /></motion.div>
    <motion.div className="absolute -top-1 -right-10" animate={{ x: [10, -10, 10] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}><Cloud size={60} className="text-white/50 fill-white/50" /></motion.div>
    {children}
  </>
);

const RainVisual = () => (<CloudVisual>{[...Array(5)].map((_, i) => (<motion.div key={i} className="absolute top-12 w-0.5 h-3 bg-blue-300/80 rounded-full" style={{ left: `${10 + i * 18}%` }} animate={{ y: [0, 40], opacity: [1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "linear" }}/>))}</CloudVisual>);
const SnowVisual = () => (<CloudVisual>{[...Array(5)].map((_, i) => (<motion.div key={i} className="absolute top-12" style={{ left: `${10 + i * 18}%` }} animate={{ y: [0, 40], x: [0, (i%2 === 0 ? 8 : -8), 0], rotate: [0, 180, 360], opacity: [1, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.4, ease: "linear" }}><Snowflake size={10} className="text-white"/></motion.div>))}</CloudVisual>);

const getWeatherVisuals = (weather) => {
  if (!weather || !weather.current) return { background: 'bg-slate-400 dark:bg-slate-700', VisualComponent: null };
  const { code, is_day } = weather.current.condition;
  if (code === 1000) return is_day ? { background: 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600', VisualComponent: SunVisual } : { background: 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900', VisualComponent: MoonVisual };
  if ([1003, 1006, 1009, 1030].includes(code)) return { background: 'bg-gradient-to-br from-slate-400 via-gray-500 to-slate-600', VisualComponent: CloudVisual };
  if (code >= 1150 && code <= 1201 || [1063, 1087].includes(code)) return { background: 'bg-gradient-to-br from-slate-600 via-gray-700 to-blue-900', VisualComponent: RainVisual };
  if (code >= 1204 && code <= 1237 || [1066, 1114, 1117].includes(code)) return { background: 'bg-gradient-to-br from-sky-400 via-slate-500 to-blue-700', VisualComponent: SnowVisual };
  return is_day ? { background: 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600', VisualComponent: SunVisual } : { background: 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900', VisualComponent: MoonVisual };
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(null); const [isRefreshing, setIsRefreshing] = useState(false); const [locationSource, setLocationSource] = useState(null); const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
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

    fetchWeather();
    const interval = setInterval(() => fetchWeather(true), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshClick = (e) => { e.stopPropagation(); if (isRefreshing) return; setIsRefreshing(true); fetchWeather(true).finally(() => setIsRefreshing(false)); };

  const { background, VisualComponent } = getWeatherVisuals(weather);
  if (loading && !weather) return <div className="h-10 w-24 bg-secondary/50 rounded-full animate-pulse" />;
  if (error) return (<button className="flex items-center gap-2 px-3 py-1.5 h-10 rounded-full text-sm text-destructive cursor-pointer bg-destructive/10 hover:bg-destructive/20 transition-colors" onClick={() => fetchWeather()} title="Weather unavailable. Click to retry."><CloudOff size={16} /><span>Retry</span></button>);
  if (!weather?.current) return null;
  
  const LocationIndicator = () => { if (locationSource === 'precise') return <MapPin size={12} className="text-blue-300" title="Using precise location" />; if (locationSource === 'ip') return <Globe size={12} className="text-yellow-300" title="Using approximate location (IP-based)" />; return null; };

  const popoverVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
  };
  
  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div className={`relative flex items-center justify-center gap-1.5 cursor-pointer h-10 w-24 rounded-full overflow-hidden text-white shadow-lg`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <div className={`absolute inset-0 transition-all duration-500 ${background}`} />
        {VisualComponent && <VisualComponent />}
        <div className="relative z-10 flex items-center" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
          <div className="w-8 h-8 -ml-1"><DynamicWeatherIcon code={weather.current.condition.code} isDay={weather.current.is_day} /></div>
          <span className="text-lg font-bold">{Math.round(weather.current.temp_c)}°</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div variants={popoverVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full right-0 mt-2 w-64 origin-top-right z-50">
            <div className="bg-popover/70 dark:bg-popover/80 backdrop-blur-lg text-popover-foreground rounded-xl border border-border/20 shadow-2xl overflow-hidden">
              <div className="flex justify-between items-start p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5"><p className="font-bold text-foreground truncate">{weather.location.name}</p><LocationIndicator /></div>
                  <p className="text-sm text-muted-foreground">{weather.current.condition.text}</p>
                </div>
                <div className="w-14 h-14 -mt-2 -mr-2 flex-shrink-0"><DynamicWeatherIcon code={weather.current.condition.code} isDay={weather.current.is_day} /></div>
              </div>
              <div className="h-px bg-border/20" />
              <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Thermometer size={16}/><span className="font-medium">Feels Like</span></div><span className="font-semibold text-foreground text-right">{Math.round(weather.current.feelslike_c)}°C</span>
                <div className="flex items-center gap-2 text-muted-foreground"><Droplets size={16}/><span className="font-medium">Humidity</span></div><span className="font-semibold text-foreground text-right">{weather.current.humidity}%</span>
                <div className="flex items-center gap-2 text-muted-foreground"><Wind size={16}/><span className="font-medium">Wind</span></div><span className="font-semibold text-foreground text-right">{weather.current.wind_kph} km/h</span>
              </div>
              <div className="h-px bg-border/20" />
              <button onClick={handleRefreshClick} disabled={isRefreshing} className="w-full text-xs text-muted-foreground flex items-center justify-center gap-1.5 p-2.5 hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Updating...' : `Updated: ${new Date(weather.current.last_updated_epoch * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <motion.button onClick={toggleTheme} className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center justify-center w-10 h-10" aria-label="Toggle theme" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={theme} initial={{ y: -20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: 90 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
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
  if (imageUrl && !isImageBroken) return <img src={imageUrl} alt={user.username} className="w-10 h-10 rounded-full object-cover" onError={() => setImageBroken(true)} />;
  const getInitials = (name = '') => { const words = name.trim().split(' ').filter(Boolean); if (words.length > 1) return (words[0][0] + words[words.length - 1][0]).toUpperCase(); return name.substring(0, 2).toUpperCase(); };
  return <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-base" title={user.username}>{getInitials(user.username)}</div>;
};

export const Navbar = () => {
  const { user, token, logout } = useAuthStore();
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-border/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to={isLoggedIn ? "/news" : "/"} className="flex items-center gap-2">
            <Logo />
            <span className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">AI</span>
              <span className="text-slate-800 dark:text-slate-100">NewsBuzz</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
             <NavLink to="/news" className={({ isActive }) => `flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-2 rounded-md ${ isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent' }`}>News</NavLink>
             <NavLink to="/about" className={({ isActive }) => `flex items-center gap-2 text-sm font-semibold transition-colors px-3 py-2 rounded-md ${ isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent' }`}>About</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <WeatherWidget />
          <ThemeToggle />
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><button className="focus:outline-none rounded-full ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"><UserAvatar user={user} /></button></DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover/80 backdrop-blur-md border-border/20" align="end">
                <DropdownMenuLabel className="font-normal"><div className="flex flex-col space-y-1"><p className="text-sm font-medium leading-none">Hi, {user.username}</p><p className="text-xs leading-none text-muted-foreground">{user.email}</p></div></DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/20" />
                <DropdownMenuItem onSelect={() => navigate(`/news`)} className="cursor-pointer"><LayoutGrid className="mr-2 h-4 w-4" /><span>Dashboard</span></DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate(`/news/user/${user.username}`)} className="cursor-pointer"><User className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/20" />
                <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-red-500 focus:text-white focus:bg-destructive"><LogOut className="mr-2 h-4 w-4" /><span>Logout</span></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="text-muted-foreground hover:text-foreground font-semibold transition-colors py-2 px-4 rounded-md text-sm">Login</Link>
              <Link to="/register" className="relative inline-flex items-center justify-center rounded-md px-5 py-2.5 overflow-hidden font-medium text-sm text-indigo-50 group bg-gradient-to-br from-purple-600 to-indigo-500 hover:text-white"><span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span><span className="relative">Sign Up</span></Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};