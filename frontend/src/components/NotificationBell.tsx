import { useEffect, useState } from 'react';
import { Bell, Megaphone, Calendar, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSocket } from '@/contexts/SocketContext';
import { notificationsAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
  _id: string;
  type: 'appointment' | 'post_reply' | 'broadcast' | 'crisis';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const ICONS: Record<NotificationItem['type'], typeof Bell> = {
  appointment: Calendar,
  post_reply: MessageCircle,
  broadcast: Megaphone,
  crisis: AlertTriangle,
};

const timeAgo = (dateString: string) => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    notificationsAPI.getMyNotifications().then((res) => {
      if (res.success) setNotifications(res.notifications);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNew = (notification: NotificationItem) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on('notification:new', handleNew);
    return () => {
      socket.off('notification:new', handleNew);
    };
  }, [socket]);

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      try {
        await notificationsAPI.markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (error) {
        console.error('Failed to mark notifications read:', error);
      }
    }
  };

  const handleClickNotification = (notification: NotificationItem) => {
    setOpen(false);
    if (notification.link) navigate(notification.link);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-crisis px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No notifications yet</p>
          ) : (
            notifications.map((n) => {
              const Icon = ICONS[n.type] || Bell;
              return (
                <button
                  key={n._id}
                  onClick={() => handleClickNotification(n)}
                  className={`w-full text-left flex items-start gap-3 p-3 border-b border-border/50 hover:bg-muted transition-colors ${
                    !n.read ? 'bg-healing-light/40' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 mt-0.5 shrink-0 text-healing" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
