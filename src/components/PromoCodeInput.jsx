import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { applyPromo, clearPromo } from '../redux/promoSlice';

export default function PromoCodeInput({ fareTotal, carId }) {
  const dispatch = useDispatch();
  const { appliedCode, discount, error } = useSelector((s) => s.promo);
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (!code.trim()) return;
    dispatch(applyPromo({ code: code.trim(), fareTotal, carId }));
  };

  const handleClear = () => {
    dispatch(clearPromo());
    setCode('');
  };

  return (
    <div className="rounded-xl border border-charcoal/10 dark:border-white/10 p-4 bg-cream-dark/30 dark:bg-charcoal-mid/30">
      <div className="text-[10px] font-bold text-charcoal/40 dark:text-slate-text uppercase tracking-widest mb-2">
        🎫 Promo Code
      </div>

      {appliedCode ? (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <div>
            <div className="text-sm font-bold text-green-700 dark:text-green-400">
              ✓ {appliedCode.code} Applied!
            </div>
            <div className="text-xs text-green-600 dark:text-green-500">
              {appliedCode.description} — You save ₹{discount}
            </div>
          </div>
          <button
            onClick={handleClear}
            className="text-xs text-red-500 bg-transparent border-none cursor-pointer hover:text-red-400"
          >
            Remove
          </button>
        </motion.div>
      ) : (
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 uppercase font-mono tracking-wider"
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleApply}
              className="px-4 py-2 rounded-xl text-xs font-bold premium-gradient text-charcoal border-none cursor-pointer hover:shadow-md transition-shadow"
            >
              Apply
            </motion.button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs text-red-500 mt-2">{error}</motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['WELCOME10', 'FIRST50', 'RAJMARG20'].map((c) => (
              <button key={c} onClick={() => { setCode(c); dispatch(applyPromo({ code: c, fareTotal, carId })); }}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-saffron/10 text-saffron dark:text-gold border-none cursor-pointer hover:bg-saffron/20 transition-colors">
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
