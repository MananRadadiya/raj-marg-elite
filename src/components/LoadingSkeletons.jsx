import { motion } from 'framer-motion';

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`glass-card rounded-2xl p-6 animate-pulse ${className}`}>
      <div className="h-4 bg-charcoal/10 dark:bg-white/10 rounded w-3/4 mb-4" />
      <div className="h-3 bg-charcoal/10 dark:bg-white/10 rounded w-full mb-2" />
      <div className="h-3 bg-charcoal/10 dark:bg-white/10 rounded w-5/6 mb-2" />
      <div className="h-3 bg-charcoal/10 dark:bg-white/10 rounded w-2/3" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-charcoal/5 dark:border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-3 bg-charcoal/10 dark:bg-white/10 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export function StatSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-charcoal/10 dark:bg-white/10" />
        <div className="flex-1">
          <div className="h-2.5 bg-charcoal/10 dark:bg-white/10 rounded w-16 mb-2" />
          <div className="h-5 bg-charcoal/10 dark:bg-white/10 rounded w-10" />
        </div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        className="w-12 h-12 border-4 border-saffron/30 dark:border-gold/30 border-t-saffron dark:border-t-gold rounded-full"
      />
    </div>
  );
}

export function ProgressBar({ progress = 0, label = '' }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-charcoal/60 dark:text-slate-text">{label}</span>
          <span className="font-semibold text-saffron dark:text-gold">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full h-2 rounded-full bg-charcoal/10 dark:bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full premium-gradient"
        />
      </div>
    </div>
  );
}
