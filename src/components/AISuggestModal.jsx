import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import cars from '../data/cars';
import driverTiers from '../data/drivers';
import { gujaratCities, formatINR, getSmartDistance, calculateFare } from '../utils/fareCalculator';
import { estimateToll } from '../utils/distanceMatrix';

/* ─── Constants ─── */
const AVG_SPEED_KMH = 55; // Gujarat road average speed
const SPEED_LABELS = {
  mini: 50,
  sedan: 55,
  suv: 52,
  'premium-suv': 54,
  luxury: 58,
};

const DEPARTURE_SUGGESTIONS = [
  { time: '5:00 AM', label: 'Early Bird', reason: 'Empty roads, coolest weather — fastest travel', score: 95 },
  { time: '6:00 AM', label: 'Best Pick', reason: 'Ideal light, low traffic, most comfortable', score: 100 },
  { time: '7:00 AM', label: 'Morning', reason: 'Good visibility, increasing traffic', score: 85 },
  { time: '8:00 AM', label: 'Rush Hour', reason: 'City exits may be congested', score: 60 },
  { time: '4:00 PM', label: 'Afternoon', reason: 'Post-lunch travel, moderate traffic', score: 70 },
  { time: '9:00 PM', label: 'Night Drive', reason: 'Less traffic but reduced visibility', score: 65 },
];

function getBestDeparture(distanceKm) {
  if (distanceKm > 400) return DEPARTURE_SUGGESTIONS[0]; // very long — early bird
  if (distanceKm > 200) return DEPARTURE_SUGGESTIONS[1]; // long — 6 AM
  return DEPARTURE_SUGGESTIONS[2]; // short — 7 AM is fine
}

function formatTravelTime(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/* ─── AI Recommendation Engine ─── */
function getAISuggestions({ from, to, passengers, budget, prices }) {
  const oneWayDist = getSmartDistance(from, to);
  if (!oneWayDist) return null;

  const results = [];

  for (const car of cars) {
    if (car.seats < passengers) continue; // skip cars too small

    for (const tier of driverTiers) {
      const perKm = prices[car.id] || car.perKm;
      const fare = calculateFare({
        distance: oneWayDist,
        perKm,
        driverMultiplier: tier.multiplier,
        tollCharges: estimateToll(oneWayDist),
        isRoundTrip: false,
        oneWayDistance: oneWayDist,
      });

      const avgSpeed = SPEED_LABELS[car.id] || AVG_SPEED_KMH;
      const travelHours = oneWayDist / avgSpeed;
      const bestDeparture = getBestDeparture(oneWayDist);

      // quality score: higher tier + bigger car = better experience
      const tierIndex = driverTiers.indexOf(tier);
      const carIndex = cars.indexOf(car);
      const qualityScore = (tierIndex + 1) * 25 + (carIndex + 1) * 15;

      // budget fit score: how close to budget without exceeding
      const budgetRatio = fare.total / budget;
      const withinBudget = budgetRatio <= 1;
      const budgetScore = withinBudget
        ? Math.round(budgetRatio * 100) // higher = better use of budget
        : -Math.round((budgetRatio - 1) * 100); // penalty for exceeding

      results.push({
        car,
        tier,
        fare,
        perKm,
        travelHours,
        travelTimeStr: formatTravelTime(travelHours),
        bestDeparture,
        distance: oneWayDist,
        qualityScore,
        budgetScore,
        withinBudget,
        budgetRatio,
        totalScore: withinBudget ? qualityScore + budgetScore : budgetScore,
      });
    }
  }

  // Sort: within-budget first → by total score desc
  results.sort((a, b) => {
    if (a.withinBudget && !b.withinBudget) return -1;
    if (!a.withinBudget && b.withinBudget) return 1;
    return b.totalScore - a.totalScore;
  });

  return {
    distance: oneWayDist,
    bestPick: results[0] || null,
    alternatives: results.slice(1, 4),
    allOptions: results,
    cheapest: [...results].filter(r => r.withinBudget).sort((a, b) => a.fare.total - b.fare.total)[0] || null,
    premium: [...results].filter(r => r.withinBudget).sort((a, b) => b.qualityScore - a.qualityScore)[0] || null,
  };
}

/* ─── Typing animation hook ─── */
function useTypingText(text, speed = 30) {
  const [displayText, setDisplayText] = useState('');
  const [done, setDone] = useState(false);

  useState(() => {
    if (!text) return;
    setDisplayText('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayText: displayText || text, done };
}

/* ─── Main Component ─── */
export default function AISuggestModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const prices = useSelector((s) => s.fare.prices);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [budget, setBudget] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const suggestion = useMemo(() => {
    if (!showResult || !from || !to || !budget) return null;
    return getAISuggestions({ from, to, passengers, budget: Number(budget), prices });
  }, [showResult, from, to, passengers, budget, prices]);

  const handleSuggest = () => {
    if (!from || !to || !budget) return;
    setIsThinking(true);
    setShowResult(false);
    // Simulate AI thinking delay
    setTimeout(() => {
      setIsThinking(false);
      setShowResult(true);
    }, 1800);
  };

  const handleBookNow = (pick) => {
    onClose();
    // Navigate to booking with pre-filled data
    navigate('/booking', {
      state: {
        aiPrefill: {
          from,
          to,
          carType: pick.car.id,
          driverTier: pick.tier.id,
          tripType: 'one-way',
        },
      },
    });
  };

  const handleReset = () => {
    setShowResult(false);
    setIsThinking(false);
  };

  const handleClose = () => {
    setFrom('');
    setTo('');
    setPassengers(2);
    setBudget('');
    setShowResult(false);
    setIsThinking(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-charcoal-light border border-charcoal/10 dark:border-white/10 shadow-2xl"
          >
            {/* AI Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-gradient-to-br from-violet-500/20 via-saffron/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative p-6 pb-0">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-charcoal/5 dark:bg-white/5 border-none cursor-pointer flex items-center justify-center text-charcoal/50 dark:text-white/50 hover:bg-charcoal/10 dark:hover:bg-white/10 transition-colors text-lg"
              >
                ×
              </button>

              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-saffron to-cyan-500 flex items-center justify-center shadow-lg shadow-saffron/25">
                  <span className="text-white text-lg">✦</span>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-charcoal dark:text-white m-0">
                    AI Mode
                  </h2>
                  <p className="text-xs text-charcoal/50 dark:text-slate-text m-0">
                    Smart ride recommendation
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {!showResult && !isThinking ? (
                  /* ─── Input Form ─── */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {/* From / To */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal/40 dark:text-slate-text uppercase tracking-widest mb-1.5">
                          From
                        </label>
                        <select
                          value={from}
                          onChange={(e) => { setFrom(e.target.value); setShowResult(false); }}
                          className="w-full px-3 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                        >
                          <option value="">Select</option>
                          {gujaratCities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal/40 dark:text-slate-text uppercase tracking-widest mb-1.5">
                          To
                        </label>
                        <select
                          value={to}
                          onChange={(e) => { setTo(e.target.value); setShowResult(false); }}
                          className="w-full px-3 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                        >
                          <option value="">Select</option>
                          {gujaratCities.filter((c) => c !== from).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Passengers */}
                    <div className="mb-4">
                      <label className="block text-[10px] font-bold text-charcoal/40 dark:text-slate-text uppercase tracking-widest mb-1.5">
                        Passengers
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <button
                            key={n}
                            onClick={() => setPassengers(n)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${
                              passengers === n
                                ? 'bg-gradient-to-r from-violet-500 to-saffron text-white shadow-md shadow-violet-500/20'
                                : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/60 dark:text-slate-text hover:bg-charcoal/10 dark:hover:bg-charcoal-mid/70'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="mb-6">
                      <label className="block text-[10px] font-bold text-charcoal/40 dark:text-slate-text uppercase tracking-widest mb-1.5">
                        Budget (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-slate-text text-sm font-semibold">₹</span>
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => { setBudget(e.target.value); setShowResult(false); }}
                          placeholder="e.g. 10000"
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                        />
                      </div>
                      {/* Quick budget buttons */}
                      <div className="flex gap-2 mt-2">
                        {[3000, 5000, 8000, 10000, 15000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => { setBudget(String(amt)); setShowResult(false); }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border-none cursor-pointer transition-all ${
                              Number(budget) === amt
                                ? 'bg-saffron/20 text-saffron dark:text-gold'
                                : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/50 dark:text-slate-text hover:bg-charcoal/10'
                            }`}
                          >
                            ₹{(amt / 1000).toFixed(0)}K
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Suggest Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSuggest}
                      disabled={!from || !to || !budget}
                      className={`w-full py-3.5 rounded-2xl text-sm font-bold border-none cursor-pointer transition-all flex items-center justify-center gap-2 ${
                        from && to && budget
                          ? 'bg-gradient-to-r from-violet-500 via-saffron to-cyan-500 text-white shadow-xl shadow-saffron/20 hover:shadow-2xl hover:shadow-saffron/30'
                          : 'bg-charcoal/10 dark:bg-charcoal-mid text-charcoal/30 dark:text-white/30 cursor-not-allowed'
                      }`}
                    >
                      <span>✦</span> Get AI Suggestion
                    </motion.button>
                  </motion.div>
                ) : isThinking ? (
                  /* ─── Thinking Animation ─── */
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-saffron to-cyan-500 items-center justify-center mb-5 shadow-xl shadow-saffron/20"
                    >
                      <span className="text-2xl">✦</span>
                    </motion.div>
                    <div className="space-y-2">
                      <ThinkingLine text="Analyzing routes..." delay={0} />
                      <ThinkingLine text="Comparing vehicle options..." delay={0.4} />
                      <ThinkingLine text="Optimizing for your budget..." delay={0.8} />
                      <ThinkingLine text="Finalizing recommendation..." delay={1.2} />
                    </div>
                  </motion.div>
                ) : (
                  /* ─── Results ─── */
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {!suggestion ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-3">🚫</div>
                        <p className="text-charcoal/60 dark:text-slate-text text-sm">
                          Route not found. Try different cities.
                        </p>
                        <button
                          onClick={handleReset}
                          className="mt-4 px-5 py-2 rounded-xl text-sm font-medium bg-charcoal/5 dark:bg-charcoal-mid border-none cursor-pointer text-charcoal dark:text-white hover:bg-charcoal/10"
                        >
                          ← Try Again
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Route Info Bar */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-charcoal/5 dark:bg-charcoal-mid/50 mb-4"
                        >
                          <div className="text-xs text-charcoal/60 dark:text-slate-text">
                            <span className="font-bold text-charcoal dark:text-white">{from}</span> → <span className="font-bold text-charcoal dark:text-white">{to}</span>
                          </div>
                          <div className="text-xs font-bold text-saffron dark:text-gold">
                            {suggestion.distance} km
                          </div>
                        </motion.div>

                        {/* Best Pick Card */}
                        {suggestion.bestPick && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <span>✦</span> AI Recommended
                            </div>
                            <ResultCard
                              pick={suggestion.bestPick}
                              isBest
                              budget={Number(budget)}
                              onBook={() => handleBookNow(suggestion.bestPick)}
                            />
                          </motion.div>
                        )}

                        {/* Alternatives */}
                        {suggestion.alternatives.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4"
                          >
                            <div className="text-[10px] font-bold text-charcoal/40 dark:text-slate-text uppercase tracking-widest mb-2">
                              Other Options
                            </div>
                            <div className="space-y-2">
                              {suggestion.alternatives.map((alt, i) => (
                                <ResultCard
                                  key={`${alt.car.id}-${alt.tier.id}`}
                                  pick={alt}
                                  budget={Number(budget)}
                                  onBook={() => handleBookNow(alt)}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Back button */}
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          onClick={handleReset}
                          className="w-full mt-4 py-2.5 rounded-xl text-xs font-medium bg-charcoal/5 dark:bg-charcoal-mid border-none cursor-pointer text-charcoal/60 dark:text-slate-text hover:bg-charcoal/10 dark:hover:bg-charcoal-mid/70 transition-colors"
                        >
                          ← Change Preferences
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Result Card ─── */
function ResultCard({ pick, isBest, budget, onBook }) {
  const savingsPercent = Math.round((1 - pick.fare.total / budget) * 100);
  const overPercent = Math.round((pick.fare.total / budget - 1) * 100);

  return (
    <div
      className={`relative rounded-2xl border p-4 transition-all ${
        isBest
          ? 'border-violet-500/30 dark:border-violet-400/30 bg-gradient-to-br from-violet-500/5 via-saffron/5 to-cyan-500/5 dark:from-violet-500/10 dark:via-saffron/10 dark:to-cyan-500/10 shadow-lg'
          : 'border-charcoal/10 dark:border-white/10 bg-white/50 dark:bg-charcoal-mid/30 hover:border-saffron/30 dark:hover:border-gold/30'
      }`}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`text-3xl ${isBest ? 'drop-shadow-lg' : ''}`}>
            {pick.car.image}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-charcoal dark:text-white">
                {pick.car.name}
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{
                  backgroundColor: pick.tier.color + '20',
                  color: pick.tier.color,
                }}
              >
                {pick.tier.icon} {pick.tier.name}
              </span>
            </div>
            <div className="text-[11px] text-charcoal/50 dark:text-slate-text mt-0.5">
              {pick.car.seats} seats · {pick.tier.multiplier}x driver multiplier
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${isBest ? 'text-saffron dark:text-gold' : 'text-charcoal dark:text-white'}`}>
            {formatINR(pick.fare.total)}
          </div>
          {pick.withinBudget ? (
            <div className="text-[10px] font-semibold text-green-600 dark:text-green-400">
              Save {savingsPercent}%
            </div>
          ) : (
            <div className="text-[10px] font-semibold text-red-500 dark:text-red-400">
              Over budget +{overPercent}%
            </div>
          )}
        </div>
      </div>

      {/* Info Pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        <InfoPill icon="🕐" label={`Best departure: ${pick.bestDeparture.time}`} />
        <InfoPill icon="⏱" label={`Travel: ${pick.travelTimeStr}`} />
        <InfoPill icon="💰" label={`₹${pick.perKm}/km`} />
        {pick.fare.tollEstimate > 0 && (
          <InfoPill icon="🛣" label={`Toll: ${formatINR(pick.fare.tollEstimate)}`} />
        )}
      </div>

      {/* Best departure reason */}
      {isBest && (
        <div className="text-[11px] text-charcoal/50 dark:text-slate-text mb-3 flex items-start gap-1.5">
          <span className="text-violet-500 mt-0.5">💡</span>
          <span>{pick.bestDeparture.reason}</span>
        </div>
      )}

      {/* Book Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onBook}
        className={`w-full py-2.5 rounded-xl text-xs font-bold border-none cursor-pointer transition-all ${
          isBest
            ? 'bg-gradient-to-r from-violet-500 via-saffron to-cyan-500 text-white shadow-md shadow-saffron/20 hover:shadow-lg'
            : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal dark:text-white hover:bg-charcoal/10 dark:hover:bg-charcoal-mid/70'
        }`}
      >
        {isBest ? '✦ Book This Ride' : 'Book This Option'}
      </motion.button>
    </div>
  );
}

/* ─── Info Pill ─── */
function InfoPill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-charcoal/5 dark:bg-charcoal-mid/50 text-[10px] font-medium text-charcoal/70 dark:text-slate-text">
      <span>{icon}</span> {label}
    </span>
  );
}

/* ─── Thinking Line Animation ─── */
function ThinkingLine({ text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="text-sm text-charcoal/50 dark:text-slate-text flex items-center gap-2 justify-center"
    >
      <motion.span
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5, delay }}
        className="text-saffron"
      >
        ●
      </motion.span>
      {text}
    </motion.div>
  );
}
