import { motion } from 'framer-motion';
import { formatINR } from '../utils/fareCalculator';

export default function FareBreakdownCard({ fare, selectedCar, selectedDriver, tripType }) {
  if (!fare) return null;

  const lines = [
    {
      label: `Base Fare (${fare.totalDistance} km × ₹${selectedCar ? Math.round(fare.baseFare / fare.totalDistance) : 0}/km)`,
      value: fare.baseFare,
      show: true,
    },
    {
      label: `Driver Tier — ${selectedDriver?.name} (+${fare.driverMultiplierPercent}%)`,
      value: fare.driverSurcharge,
      show: fare.driverSurcharge > 0,
      plus: true,
    },
    {
      label: 'Toll Estimate',
      value: fare.tollEstimate,
      show: fare.tollEstimate > 0,
      plus: true,
    },
    {
      label: 'Driver Stay Charge (distance > 250km)',
      value: fare.driverStayCharge,
      show: fare.driverStayCharge > 0,
      plus: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fare-glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden"
    >
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 premium-gradient" />

      <h3 className="font-display text-lg font-semibold mb-1 text-charcoal dark:text-white">
        Fare Breakdown
      </h3>
      <p className="text-xs text-charcoal/50 dark:text-slate-text mb-5">
        Transparent pricing — no hidden charges
      </p>

      <div className="space-y-3">
        {lines.map(
          (line, i) =>
            line.show && (
              <motion.div
                key={line.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-charcoal/60 dark:text-slate-text">{line.label}</span>
                <span className="font-medium text-charcoal dark:text-white">
                  {line.plus ? '+' : ''}
                  {formatINR(line.value)}
                </span>
              </motion.div>
            )
        )}
      </div>

      {/* Round trip indicator */}
      {tripType === 'round-trip' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium inline-flex items-center gap-1.5"
        >
          ⇄ Round Trip ({fare.oneWayDistance} km × 2 = {fare.totalDistance} km)
        </motion.div>
      )}

      {/* Grand Total */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="border-t border-saffron/20 dark:border-gold/20 mt-5 pt-4 flex justify-between items-center"
      >
        <span className="font-display text-lg font-bold text-charcoal dark:text-white">
          Grand Total
        </span>
        <motion.span
          key={fare.total}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="font-bold text-3xl text-saffron dark:text-gold"
        >
          {formatINR(fare.total)}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
