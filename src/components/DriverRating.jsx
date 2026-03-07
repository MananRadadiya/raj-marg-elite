import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { submitRating } from '../redux/ratingSlice';
import { rateDriver } from '../redux/driverSlice';
import { addToast } from '../redux/notificationSlice';

export default function DriverRating({ bookingId, driverId, driverName, onClose }) {
  const dispatch = useDispatch();
  const { ratings } = useSelector((s) => s.rating);
  const alreadyRated = ratings.find((r) => r.bookingId === bookingId);

  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(alreadyRated?.rating || 0);
  const [comment, setComment] = useState(alreadyRated?.comment || '');
  const [submitted, setSubmitted] = useState(!!alreadyRated);

  const handleSubmit = () => {
    if (selectedStar === 0) return;
    dispatch(submitRating({ bookingId, driverId, driverName, rating: selectedStar, comment }));
    dispatch(rateDriver({ driverId, rating: selectedStar }));
    dispatch(addToast({ message: `Rated ${driverName} ${selectedStar} ⭐`, type: 'success' }));
    setSubmitted(true);
  };

  const starLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="glass-card rounded-2xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="font-display text-xl font-bold mb-2">Thank You!</h3>
              <p className="text-sm text-charcoal/60 dark:text-slate-text mb-4">
                You rated {driverName} {selectedStar} stars
              </p>
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${star <= selectedStar ? 'opacity-100' : 'opacity-20'}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl premium-gradient text-white font-semibold text-sm border-none cursor-pointer"
              >
                Done
              </motion.button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <span className="text-4xl block mb-2">⭐</span>
                <h3 className="font-display text-xl font-bold mb-1">Rate Your Driver</h3>
                <p className="text-sm text-charcoal/60 dark:text-slate-text">{driverName}</p>
              </div>

              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setSelectedStar(star)}
                    className={`text-3xl bg-transparent border-none cursor-pointer transition-all ${
                      star <= (hoveredStar || selectedStar)
                        ? 'opacity-100 drop-shadow-lg'
                        : 'opacity-30 grayscale'
                    }`}
                  >
                    ⭐
                  </motion.button>
                ))}
              </div>
              <p className="text-center text-xs text-saffron dark:text-gold font-medium mb-4 h-4">
                {starLabels[hoveredStar || selectedStar] || ''}
              </p>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment (optional)..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50 mb-6"
              />

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-charcoal/10 dark:bg-white/10 text-charcoal dark:text-white text-sm font-semibold border-none cursor-pointer"
                >
                  Skip
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={selectedStar === 0}
                  className="flex-1 py-2.5 rounded-xl premium-gradient text-white text-sm font-semibold border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Rating
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
