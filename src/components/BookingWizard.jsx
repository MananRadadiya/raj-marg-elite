import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { confirmBooking, setCurrentBooking } from '../redux/bookingSlice';
import { setPendingPayment } from '../redux/paymentSlice';
import { motion, AnimatePresence } from 'framer-motion';
import cars from '../data/cars';
import driverTiers from '../data/drivers';
import { formatINR, gujaratCities } from '../utils/fareCalculator';
import useFareCalculation from '../hooks/useFareCalculation';
import FareBreakdownCard from './FareBreakdownCard';

const STEPS = [
  { id: 1, label: 'Route & Trip', icon: '📍' },
  { id: 2, label: 'Vehicle & Driver', icon: '🚗' },
  { id: 3, label: 'Review & Confirm', icon: '✅' },
];

export default function BookingWizard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBooking } = useSelector((s) => s.booking);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const prices = useSelector((s) => s.fare.prices);

  const [step, setStep] = useState(1);
  const [from, setFrom] = useState(currentBooking?.from || '');
  const [to, setTo] = useState(currentBooking?.to || '');
  const [tripType, setTripType] = useState(currentBooking?.tripType || 'one-way');
  const [carType, setCarType] = useState(currentBooking?.carId || 'sedan');
  const [driverTier, setDriverTier] = useState(currentBooking?.driverTierId || 'bronze');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');

  const { selectedCar, selectedDriver, oneWayDistance, totalDistance, tollEstimate, fare } =
    useFareCalculation({ from, to, tripType, carType, driverTier });

  const canNext = () => {
    if (step === 1) return from && to && oneWayDistance > 0;
    if (step === 2) return !!selectedCar && !!selectedDriver;
    return !!fare;
  };

  const handleConfirm = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!fare || !from || !to) return;

    const bookingData = {
      from,
      to,
      tripType,
      carType: selectedCar.name,
      carId: selectedCar.id,
      driverTier: selectedDriver.name,
      driverTierId: selectedDriver.id,
      driverMultiplier: selectedDriver.multiplier,
      distance: totalDistance,
      oneWayDistance,
      perKm: prices[carType] || selectedCar.perKm,
      tollEstimate,
      fare,
      passengerName,
      passengerPhone,
    };

    /* Create the booking in Redux (status: pending) */
    dispatch(confirmBooking(bookingData));
    dispatch(setCurrentBooking(null));

    /* Get the generated booking ID */
    const storedBookings = JSON.parse(localStorage.getItem('rajmarg_bookings') || '[]');
    const latestBooking = storedBookings[0];

    /* Store pending payment data and redirect to Payment page */
    const paymentData = {
      bookingId: latestBooking?.id,
      ...bookingData,
    };
    dispatch(setPendingPayment(paymentData));
    localStorage.setItem('rajmarg_pending_payment', JSON.stringify(paymentData));

    navigate('/payment');
  };

  return (
    <div className="min-h-screen py-10 pt-24">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Book Your <span className="text-saffron dark:text-gold">Ride</span>
          </h1>
          <p className="text-charcoal/60 dark:text-slate-text">
            Complete your booking in 3 easy steps
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <motion.div
                animate={{
                  scale: step === s.id ? 1.05 : 1,
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  step === s.id
                    ? 'premium-gradient text-white shadow-lg'
                    : step > s.id
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/40 dark:text-slate-text/60'
                }`}
                onClick={() => {
                  if (s.id < step) setStep(s.id);
                }}
              >
                <span>{step > s.id ? '✓' : s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </motion.div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 transition-colors ${
                    step > s.id ? 'bg-green-400' : 'bg-charcoal/10 dark:bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            {/* Step 1: Route & Trip Type */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-6">
                  📍 Select Route & Trip Type
                </h2>

                {/* Trip Type */}
                <div className="flex rounded-xl overflow-hidden mb-6 border border-charcoal/10 dark:border-white/10">
                  {['one-way', 'round-trip'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTripType(type)}
                      className={`flex-1 py-3 text-sm font-medium transition-all border-none cursor-pointer ${
                        tripType === type
                          ? 'premium-gradient text-white'
                          : 'bg-transparent text-charcoal/60 dark:text-slate-text hover:bg-saffron/5'
                      }`}
                    >
                      {type === 'one-way' ? '→ One Way' : '⇄ Round Trip'}
                    </button>
                  ))}
                </div>

                {/* Cities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <SelectField label="From" value={from} onChange={setFrom} options={gujaratCities} />
                  <SelectField
                    label="To"
                    value={to}
                    onChange={setTo}
                    options={gujaratCities.filter((c) => c !== from)}
                  />
                </div>

                {/* Distance */}
                {oneWayDistance > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-saffron/5 dark:bg-gold/5 border border-saffron/20 dark:border-gold/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-charcoal dark:text-white">
                          📍 {from} → {to}
                        </div>
                        <div className="text-xs text-charcoal/50 dark:text-slate-text mt-0.5">
                          Auto-calculated from Gujarat distance matrix
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-saffron dark:text-gold">
                          {totalDistance} km
                        </div>
                        {tripType === 'round-trip' && (
                          <div className="text-xs text-charcoal/50 dark:text-slate-text">
                            {oneWayDistance} km × 2
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                {from && to && oneWayDistance === 0 && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                    Route not found in distance matrix. Try different cities.
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Car Type & Driver Tier */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-6">
                  🚗 Choose Vehicle & Driver
                </h2>

                {/* Car Selection */}
                <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-3 uppercase tracking-wider">
                  Select Vehicle
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {cars.map((car) => (
                    <motion.div
                      key={car.id}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCarType(car.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        carType === car.id
                          ? 'border-saffron dark:border-gold bg-saffron/5 dark:bg-gold/5'
                          : 'border-charcoal/10 dark:border-white/10 hover:border-saffron/30'
                      }`}
                    >
                      <div className="text-3xl mb-2">{car.image}</div>
                      <div className="font-semibold text-sm">{car.name}</div>
                      <div className="text-xs text-charcoal/50 dark:text-slate-text">
                        {car.seats} seats · {car.luggage} bags
                      </div>
                      <div className="text-lg font-bold text-saffron dark:text-gold mt-1">
                        ₹{prices[car.id] || car.perKm}/km
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Driver Tier Selection */}
                <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-3 uppercase tracking-wider">
                  Select Driver Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {driverTiers.map((tier) => (
                    <motion.div
                      key={tier.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDriverTier(tier.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                        driverTier === tier.id
                          ? 'border-saffron dark:border-gold bg-saffron/5 dark:bg-gold/5'
                          : 'border-charcoal/10 dark:border-white/10 hover:border-saffron/30'
                      }`}
                    >
                      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: tier.color }} />
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tier.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{tier.name}</div>
                          <div className="text-xs text-charcoal/50 dark:text-slate-text">
                            {tier.multiplier}x multiplier
                          </div>
                        </div>
                      </div>
                      {/* Driver Preview */}
                      {tier.sampleDriver && driverTier === tier.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-charcoal/10 dark:border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={tier.sampleDriver.photo}
                              alt={tier.sampleDriver.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="text-xs font-semibold">{tier.sampleDriver.name}</div>
                              <div className="text-[10px] text-charcoal/50 dark:text-slate-text">
                                ⭐ {tier.sampleDriver.rating} · {tier.sampleDriver.experience} exp · 🧹 {tier.sampleDriver.cleanliness}/5
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-6">
                  ✅ Review & Confirm
                </h2>

                {/* Route Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <SummaryItem label="Route" value={`${from} → ${to}`} />
                  <SummaryItem label="Trip Type" value={tripType === 'one-way' ? 'One Way' : 'Round Trip'} />
                  <SummaryItem label="Vehicle" value={`${selectedCar?.image} ${selectedCar?.name}`} />
                  <SummaryItem label="Driver Tier" value={`${selectedDriver?.icon} ${selectedDriver?.name}`} />
                  <SummaryItem label="Distance" value={`${totalDistance} km`} />
                  <SummaryItem label="Per KM" value={`₹${prices[carType] || selectedCar?.perKm}`} />
                </div>

                {/* Passenger Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50"
                    />
                  </div>
                </div>

                {/* Fare Breakdown */}
                <FareBreakdownCard
                  fare={fare}
                  selectedCar={selectedCar}
                  selectedDriver={selectedDriver}
                  tripType={tripType}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-6 py-3 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
              step === 1
                ? 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/30 dark:text-white/30 cursor-not-allowed'
                : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal dark:text-white hover:bg-charcoal/10'
            }`}
          >
            ← Back
          </motion.button>

          {step < 3 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(Math.min(3, step + 1))}
              disabled={!canNext()}
              className={`px-6 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${
                canNext()
                  ? 'premium-gradient text-white hover:shadow-lg hover:shadow-saffron/25'
                  : 'bg-charcoal/20 dark:bg-charcoal-mid text-charcoal/40 dark:text-white/40 cursor-not-allowed'
              }`}
            >
              Next →
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              disabled={!fare || !from || !to}
              className={`px-8 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${
                fare
                  ? 'premium-gradient text-white hover:shadow-lg hover:shadow-saffron/25'
                  : 'bg-charcoal/20 dark:bg-charcoal-mid text-charcoal/40 cursor-not-allowed'
              }`}
            >
              {!isAuthenticated
                ? 'Login to Confirm'
                : fare
                ? `Proceed to Payment — ${formatINR(fare.total)}`
                : 'Select route'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50"
      >
        <option value="">Select City</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-cream-dark/50 dark:bg-charcoal-mid/50">
      <div className="text-[10px] uppercase tracking-wider text-charcoal/40 dark:text-slate-text/60 mb-0.5">
        {label}
      </div>
      <div className="text-sm font-semibold text-charcoal dark:text-white">{value}</div>
    </div>
  );
}
