// src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useNotificationStore } from '../../store/notification.store'; // Import notification store
import { Bell, User as UserIcon } from 'lucide-react'; // Import icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Assuming shadcn/ui setup

export const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore(); // Get unread count
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          AI NewsBuzz
        </Link>
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              {/* Notification Bell */}
              <div className="relative cursor-pointer">
                <Bell className="text-gray-400 hover:text-white transition-colors" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full">
                    <img 
                      src={user.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'} 
                      alt={user.username} 
                      className="w-9 h-9 rounded-full object-cover" 
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white w-48" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onSelect={() => navigate(`/user/${user.username}`)} className="cursor-pointer focus:bg-gray-700">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer focus:bg-red-500/50">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors py-2 px-4">Login</Link>
              <Link to="/register" className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};