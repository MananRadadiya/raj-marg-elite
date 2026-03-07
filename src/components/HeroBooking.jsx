import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentBooking } from '../redux/bookingSlice';
import { motion } from 'framer-motion';
import cars from '../data/cars';
import driverTiers from '../data/drivers';
import { formatINR, gujaratCities } from '../utils/fareCalculator';
import useFareCalculation from '../hooks/useFareCalculation';

/* Animated background particles */
function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 15}s`,
        duration: `${15 + Math.random() * 20}s`,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [from, setFrom] = useState('Ahmedabad');
  const [to, setTo] = useState('');
  const [tripType, setTripType] = useState('one-way');
  const [carType, setCarType] = useState('sedan');
  const [driverTier, setDriverTier] = useState('bronze');

  const { selectedCar, selectedDriver, oneWayDistance, totalDistance, tollEstimate, fare } =
    useFareCalculation({ from, to, tripType, carType, driverTier });

  const handleBook = () => {
    if (!fare) return;
    dispatch(
      setCurrentBooking({
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
        fare,
      }),
    );
    navigate('/booking');
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Deep Royal Background */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Animated Particles */}
      <Particles />

      {/* Subtle Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-125 h-125 bg-saffron/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 -right-32 w-100 h-100 bg-gold/3 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/3 w-75 h-75 bg-saffron/3 rounded-full blur-[120px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-8 border border-white/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs font-medium text-white/60 tracking-[0.2em] uppercase">
                Gujarat's Premium Taxi Service
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.1] mb-6 text-white"
            >
              Travel Gujarat in{' '}
              <span className="bg-linear-to-r from-saffron via-gold to-gold-light bg-clip-text text-transparent">
                Royal Comfort
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-lg md:text-xl text-white/50 max-w-lg mb-10 leading-relaxed font-light"
            >
              Premium rides. Verified drivers. Transparent pricing.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-4 mb-14"
            >
              <Link
                to="/booking"
                className="group relative px-8 py-3.5 rounded-xl btn-royal text-sm tracking-wide no-underline overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
              >
                <span className="relative z-10">Book Now</span>
              </Link>
              <a
                href="#fleet"
                className="px-8 py-3.5 rounded-xl text-sm font-medium text-white/80 border border-white/15 hover:border-white/30 hover:bg-white/5 no-underline transition-all duration-300 tracking-wide"
              >
                Explore Fleet
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-wrap gap-8 text-sm"
            >
              {[
                { label: 'Transparent Pricing', icon: '◆' },
                { label: 'Verified Drivers', icon: '◆' },
                { label: '24/7 Support', icon: '◆' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/40">
                  <span className="text-gold text-[8px]">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Floating Glass Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-linear-to-br from-saffron/10 to-gold/5 rounded-3xl blur-2xl" />

              <div className="relative bg-white/7 dark:bg-white/5 backdrop-blur-2xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold text-white">
                    Book Your Ride
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[11px] font-medium text-gold">
                    Instant Quote
                  </span>
                </div>

                {/* Trip Type */}
                <div className="flex rounded-xl overflow-hidden mb-5 border border-white/10">
                  {['one-way', 'round-trip'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTripType(type)}
                      className={`flex-1 py-2.5 text-sm font-medium transition-all duration-300 border-none cursor-pointer ${
                        tripType === type
                          ? 'bg-linear-to-r from-saffron to-gold text-charcoal'
                          : 'bg-transparent text-white/50 hover:text-white/80 hover:bg-white/5'
                      }`}
                    >
                      {type === 'one-way' ? '→ One Way' : '⇄ Round Trip'}
                    </button>
                  ))}
                </div>

                {/* From / To */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-[11px] font-medium text-white/40 mb-1.5 tracking-[0.15em] uppercase">
                      From
                    </label>
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 text-white border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/30 transition-all"
                    >
                      <option value="" className="bg-charcoal">Select City</option>
                      {gujaratCities.map((c) => (
                        <option key={c} value={c} className="bg-charcoal">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-white/40 mb-1.5 tracking-[0.15em] uppercase">
                      To
                    </label>
                    <select
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 text-white border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/30 transition-all"
                    >
                      <option value="" className="bg-charcoal">Select City</option>
                      {gujaratCities.filter((c) => c !== from).map((c) => (
                        <option key={c} value={c} className="bg-charcoal">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Distance Badge */}
                {oneWayDistance > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 px-4 py-2.5 rounded-xl bg-gold/5 border border-gold/15 flex items-center justify-between"
                  >
                    <span className="text-xs text-white/50">
                      📍 {from} → {to}
                    </span>
                    <span className="text-sm font-bold text-gold">
                      {totalDistance} km
                      {tripType === 'round-trip' && (
                        <span className="text-xs font-normal ml-1 text-white/40">({oneWayDistance} × 2)</span>
                      )}
                    </span>
                  </motion.div>
                )}

                {/* Car + Driver */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <div>
                    <label className="block text-[11px] font-medium text-white/40 mb-1.5 tracking-[0.15em] uppercase">
                      Vehicle
                    </label>
                    <select
                      value={carType}
                      onChange={(e) => setCarType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 text-white border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/30 transition-all"
                    >
                      {cars.map((c) => (
                        <option key={c.id} value={c.id} className="bg-charcoal">
                          {c.name} — ₹{c.perKm}/km
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-white/40 mb-1.5 tracking-[0.15em] uppercase">
                      Driver Tier
                    </label>
                    <select
                      value={driverTier}
                      onChange={(e) => setDriverTier(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 text-white border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/30 transition-all"
                    >
                      {driverTiers.map((d) => (
                        <option key={d.id} value={d.id} className="bg-charcoal">
                          {d.name} ({d.multiplier}x)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fare Preview */}
                {fare && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 p-4 rounded-xl bg-white/3 border border-white/5"
                  >
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/40">Base Fare</span>
                        <span className="font-medium text-white/80">{formatINR(fare.baseFare)}</span>
                      </div>
                      {fare.driverSurcharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-white/40">Driver Tier (+{fare.driverMultiplierPercent}%)</span>
                          <span className="font-medium text-white/80">+{formatINR(fare.driverSurcharge)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-white/40">Toll Estimate</span>
                        <span className="font-medium text-white/80">+{formatINR(fare.tollEstimate)}</span>
                      </div>
                      {fare.driverStayCharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-white/40">Driver Stay</span>
                          <span className="font-medium text-white/80">+{formatINR(fare.driverStayCharge)}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 mt-2 pt-2 flex justify-between">
                        <span className="font-semibold text-white">Estimated Total</span>
                        <span className="font-bold text-lg bg-linear-to-r from-saffron to-gold bg-clip-text text-transparent">
                          {formatINR(fare.total)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Book Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleBook}
                  disabled={!fare}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide border-none cursor-pointer transition-all duration-300 ${
                    fare
                      ? 'btn-royal hover:shadow-lg hover:shadow-gold/20'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {fare ? `Book for ${formatINR(fare.total)}` : 'Select route to see fare'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-cream dark:from-charcoal to-transparent" />
    </section>
  );
}
