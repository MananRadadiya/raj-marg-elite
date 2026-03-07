import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../redux/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';

const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  booking: '🎫',
  driver: '🚗',
  payment: '💳',
  ride: '🏁',
};

const TOAST_COLORS = {
  success: 'border-green-400 bg-green-50 dark:bg-green-900/30 dark:border-green-600',
  error: 'border-red-400 bg-red-50 dark:bg-red-900/30 dark:border-red-600',
  warning: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-600',
  info: 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-600',
  booking: 'border-saffron bg-saffron/10 dark:bg-saffron/20 dark:border-saffron',
  driver: 'border-purple-400 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-600',
  payment: 'border-green-400 bg-green-50 dark:bg-green-900/30 dark:border-green-600',
  ride: 'border-blue-400 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-600',
};

function Toast({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id, toast.duration]);

  const icon = TOAST_ICONS[toast.type] || TOAST_ICONS.info;
  const colorCls = TOAST_COLORS[toast.type] || TOAST_COLORS.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`relative flex items-start gap-3 px-4 py-3 rounded-xl border-l-4 shadow-lg backdrop-blur-md min-w-70 max-w-95 ${colorCls}`}
    >
      <span className="text-lg mt-0.5 shrink-0">{icon}</span>
      <p className="text-sm font-medium text-charcoal dark:text-white leading-snug pr-6">
        {toast.message}
      </p>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full text-xs text-charcoal/40 dark:text-white/40 hover:text-charcoal dark:hover:text-white bg-transparent border-none cursor-pointer transition-colors"
        aria-label="Dismiss"
      >
        ✕
      </button>
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-charcoal/20 dark:bg-white/20 origin-left rounded-b-xl"
      />
    </motion.div>
  );
}

export default function ToastNotification() {
  const { toasts } = useSelector((s) => s.notification);

  return (
    <div className="fixed top-20 right-4 z-100 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
