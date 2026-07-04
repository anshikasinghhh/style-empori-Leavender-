import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, ShoppingCart, ClipboardList, AlertTriangle, XCircle, TrendingUp, Package, Tag, Info } from 'lucide-react';
import { fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } from '../../slices/notificationSlice';

const NOTIF_ICONS = {
  task_assigned: { icon: ClipboardList, color: 'text-primary' },
  task_completed: { icon: Check, color: 'text-green-600' },
  task_overdue: { icon: AlertTriangle, color: 'text-amber-500' },
  order_placed: { icon: ShoppingCart, color: 'text-primary' },
  order_status: { icon: Package, color: 'text-blue-500' },
  low_stock: { icon: TrendingUp, color: 'text-amber-500' },
  out_of_stock: { icon: XCircle, color: 'text-rose' },
  selling_fast: { icon: Tag, color: 'text-rose' },
  general: { icon: Info, color: 'text-gray-500' }
};

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, loading } = useSelector(s => s.notifications);
  const dropdownRef = useRef(null);

  // Fetch unread count on mount
  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open) {
      dispatch(fetchNotifications());
    }
  }, [open, dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotifClick = (notif) => {
    if (!notif.isRead) {
      dispatch(markAsRead(notif._id));
    }
    setOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    dispatch(markAllAsRead());
  };

  const displayNotifs = notifications.slice(0, 20);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-full text-gray-600 hover:text-primary hover:bg-champagne-light/80 transition-all"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-hover border border-gold-pale/60 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-display font-semibold text-gray-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs font-body text-primary hover:text-primary-dark transition-colors"
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {loading && displayNotifs.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                  <p className="font-body text-xs text-gray-400">Loading...</p>
                </div>
              ) : displayNotifs.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="font-body text-xs text-gray-400">No notifications yet</p>
                </div>
              ) : (
                displayNotifs.map((notif) => {
                  const { icon: Icon, color } = NOTIF_ICONS[notif.type] || NOTIF_ICONS.general;
                  return (
                    <button
                      key={notif._id}
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-champagne-light/40 transition-colors flex gap-3 ${
                        !notif.isRead ? 'bg-primary-50/30' : ''
                      }`}
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center mt-0.5`}>
                        <Icon size={15} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-body text-xs leading-snug ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {notif.title}
                        </p>
                        <p className="font-body text-[11px] text-gray-500 leading-snug mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="font-body text-[10px] text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
                      </div>
                      {!notif.isRead && (
                        <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
