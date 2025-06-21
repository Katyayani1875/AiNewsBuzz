// src/components/features/notifications/NotificationDropdown.jsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchNotifications, markNotificationsAsRead } from '../../../api/notification.api';
import { useNotificationStore } from '../../../store/notification.store';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NotificationDropdown = () => {
  const { unreadCount, markAllAsRead } = useNotificationStore();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 60 * 1000, // Refetch every minute
  });

  const mutation = useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: () => {
      markAllAsRead(); // Update global state instantly
    },
  });

  const handleOpenChange = (isOpen) => {
    // When the dropdown is opened and there are unread notifications, mark them as read.
    if (isOpen && unreadCount > 0) {
      mutation.mutate();
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className="relative focus:outline-none">
          <Bell className="text-gray-400 hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-gray-900">
              {unreadCount}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        {isLoading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : notifications && notifications.length > 0 ? (
          notifications.slice(0, 5).map(n => ( // Show latest 5
            <Link to={`/article/${n.newsArticle}?commentId=${n.comment}`} key={n._id}>
                <DropdownMenuItem className={`cursor-pointer focus:bg-gray-700 ${!n.isRead ? 'bg-cyan-900/50' : ''}`}>
                    <div className='flex items-start gap-2'>
                        <img src={n.sender.profilePicture?.url} className='w-8 h-8 rounded-full'/>
                        <div>
                            <p className='text-sm'>
                                <span className='font-bold'>{n.sender.username}</span> replied to your comment.
                            </p>
                            <p className='text-xs text-gray-400'>
                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
              </DropdownMenuItem>
            </Link>
          ))
        ) : (
          <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};