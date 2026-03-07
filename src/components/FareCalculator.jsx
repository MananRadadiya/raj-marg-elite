import { useState } from 'react';
import { motion } from 'framer-motion';
import cars from '../data/cars';
import driverTiers from '../data/drivers';
import { formatINR, gujaratCities } from '../utils/fareCalculator';
import useFareCalculation from '../hooks/useFareCalculation';
import FareBreakdownCard from './FareBreakdownCard';

export default function FareCalculator() {
  const [from, setFrom] = useState('Ahmedabad');
  const [to, setTo] = useState('');
  const [tripType, setTripType] = useState('one-way');
  const [carType, setCarType] = useState('sedan');
  const [driverTier, setDriverTier] = useState('bronze');

  const { selectedCar, selectedDriver, oneWayDistance, totalDistance, fare } =
    useFareCalculation({ from, to, tripType, carType, driverTier });

  return (
    <section className="py-16 md:py-24 bg-cream-dark/50 dark:bg-charcoal-light/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Fare <span className="text-saffron dark:text-gold">Calculator</span>
          </h2>
          <p className="text-charcoal/60 dark:text-slate-text">
            Transparent pricing — see exactly what you'll pay
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          {/* Trip Type */}
          <div className="flex rounded-xl overflow-hidden mb-5 border border-charcoal/10 dark:border-white/10">
            {['one-way', 'round-trip'].map((type) => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={`flex-1 py-2.5 text-sm font-medium transition-all border-none cursor-pointer ${
                  tripType === type
                    ? 'premium-gradient text-white'
                    : 'bg-transparent text-charcoal/60 dark:text-slate-text hover:bg-saffron/5 dark:hover:bg-gold/5'
                }`}
              >
                {type === 'one-way' ? '→ One Way' : '⇄ Round Trip'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
                From
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50"
              >
                <option value="">Select City</option>
                {gujaratCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
                To
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50"
              >
                <option value="">Select City</option>
                {gujaratCities.filter((c) => c !== from).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
                Vehicle
              </label>
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50"
              >
                {cars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.image} {c.name} — ₹{c.perKm}/km
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal/50 dark:text-slate-text mb-1.5 uppercase tracking-wider">
                Driver Tier
              </label>
              <select
                value={driverTier}
                onChange={(e) => setDriverTier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-dark dark:bg-charcoal-mid text-charcoal dark:text-white border border-charcoal/10 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 dark:focus:ring-gold/50"
              >
                {driverTiers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.icon} {d.name} ({d.multiplier}x)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Smart Distance Display */}
          {oneWayDistance > 0 && (
            <div className="text-center py-3 mb-4 rounded-lg bg-saffron/5 dark:bg-gold/5 text-xs text-charcoal/60 dark:text-slate-text">
              📍 {from} → {to} = <strong className="text-saffron dark:text-gold">{totalDistance} km</strong>
              {tripType === 'round-trip' && ` (${oneWayDistance} km × 2)`}
              {' · '}Vehicle: {selectedCar?.name} · Driver: {selectedDriver?.name}
            </div>
          )}

          {/* Fare Breakdown */}
          {fare && (
            <FareBreakdownCard
              fare={fare}
              selectedCar={selectedCar}
              selectedDriver={selectedDriver}
              tripType={tripType}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
