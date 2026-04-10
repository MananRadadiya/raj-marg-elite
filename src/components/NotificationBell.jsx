import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../redux/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell({ isScrolledOrNotHome }) {
  const [open, setOpen] = useState(false);
  const { toasts } = useSelector((s) => s.notification);
  const dispatch = useDispatch();
  const ref = useRef(null);

  // Recent notifications (keep last 20)
  const notifications = toasts.slice(-20).reverse();
  const unread = notifications.length;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen(!open)}
        className={`relative w-9 h-9 rounded-xl border cursor-pointer flex items-center justify-center transition-all duration-300 ${
          isScrolledOrNotHome
            ? 'bg-cream-dark/80 dark:bg-charcoal-mid/80 border-charcoal/5 dark:border-white/10 text-charcoal dark:text-white'
            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
        }`}
      >
        <span className="text-sm">🔔</span>
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {unread > 9 ? '9+' : unread}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 max-h-96 rounded-2xl bg-white/95 dark:bg-charcoal-light/95 backdrop-blur-2xl shadow-2xl border border-charcoal/10 dark:border-white/10 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-charcoal/5 dark:border-white/5">
              <span className="font-semibold text-sm text-charcoal dark:text-white">Notifications</span>
              <span className="text-[10px] text-charcoal/40 dark:text-slate-text">{unread} new</span>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-2xl mb-2">🔕</div>
                  <p className="text-xs text-charcoal/50 dark:text-slate-text">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-3 border-b border-charcoal/5 dark:border-white/5 last:border-none hover:bg-saffron/5 dark:hover:bg-gold/5 transition-colors">
                    <span className="text-lg mt-0.5">
                      {n.type === 'booking' ? '🎫' : n.type === 'driver' ? '🚗' : n.type === 'ride' ? '✅' : '💬'}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs text-charcoal dark:text-white">{n.message}</div>
                      <div className="text-[10px] text-charcoal/30 dark:text-slate-text/50 mt-0.5">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <button onClick={() => dispatch(removeToast(n.id))}
                      className="text-charcoal/20 dark:text-white/20 hover:text-red-400 bg-transparent border-none cursor-pointer text-xs">×</button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
