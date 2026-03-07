import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import driverTiers from '../data/drivers';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DriverTier() {
  const [activeTier, setActiveTier] = useState(null);

  return (
    <section className="py-16 md:py-24 bg-cream-dark/50 dark:bg-charcoal-light/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Driver <span className="text-saffron dark:text-gold">Tiers</span>
          </h2>
          <p className="text-charcoal/60 dark:text-slate-text max-w-lg mx-auto">
            Every driver is verified. Choose your preferred tier based on experience and rating.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {driverTiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={item}
              whileHover={{ y: -6 }}
              onClick={() => setActiveTier(activeTier === tier.id ? null : tier.id)}
              className="glass-card rounded-2xl p-6 text-center relative overflow-hidden cursor-pointer"
            >
              {/* Accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: tier.color }}
              />
              <div className="text-4xl mb-3">{tier.icon}</div>
              <h3 className="font-display text-xl font-semibold mb-1">{tier.name}</h3>
              <div className="text-2xl font-bold mb-2" style={{ color: tier.color }}>
                {tier.multiplier}x
              </div>
              <p className="text-xs text-charcoal/50 dark:text-slate-text mb-4 leading-relaxed">
                {tier.description}
              </p>
              <ul className="text-left space-y-1.5 mb-4">
                {tier.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-charcoal/70 dark:text-slate-text">
                    <span className="text-saffron dark:text-gold mt-0.5">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Driver Profile Preview */}
              <AnimatePresence>
                {activeTier === tier.id && tier.sampleDriver && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-charcoal/10 dark:border-white/10">
                      <div className="text-[10px] uppercase tracking-wider text-charcoal/40 dark:text-slate-text/60 mb-2">
                        Sample Driver Profile
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={tier.sampleDriver.photo}
                          alt={tier.sampleDriver.name}
                          className="w-12 h-12 rounded-full object-cover border-2"
                          style={{ borderColor: tier.color }}
                        />
                        <div className="text-left">
                          <div className="text-sm font-semibold">{tier.sampleDriver.name}</div>
                          <div className="text-xs text-charcoal/50 dark:text-slate-text">
                            {tier.sampleDriver.experience} experience
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <DriverStat label="Rating" value={`⭐ ${tier.sampleDriver.rating}`} />
                        <DriverStat label="Rides" value={tier.sampleDriver.rides} />
                        <DriverStat label="Cleanliness" value={`${tier.sampleDriver.cleanliness}/5`} />
                        <DriverStat label="Languages" value={tier.sampleDriver.languages.length} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-[10px] text-saffron dark:text-gold mt-2">
                {activeTier === tier.id ? '▲ Hide profile' : '▼ View driver profile'}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DriverStat({ label, value }) {
  return (
    <div className="p-2 rounded-lg bg-cream-dark/50 dark:bg-charcoal-mid/50 text-center">
      <div className="text-[10px] text-charcoal/40 dark:text-slate-text/60 uppercase">{label}</div>
      <div className="text-xs font-bold">{value}</div>
    </div>
  );
}
