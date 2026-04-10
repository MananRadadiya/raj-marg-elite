import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import driverTiers from '../data/drivers';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function DriverLeaderboard() {
  const { drivers } = useSelector((s) => s.driver);
  const { ratings } = useSelector((s) => s.rating);

  const ranked = useMemo(() => {
    return [...drivers]
      .map((d) => {
        const tier = driverTiers.find((t) => t.id === d.tier);
        const driverRatings = ratings.filter((r) => r.driverId === d.id);
        return { ...d, tier, recentRatings: driverRatings };
      })
      .sort((a, b) => b.rating - a.rating);
  }, [drivers, ratings]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden hero-gradient">
        <div className="hero-overlay absolute inset-0" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold tracking-widest uppercase mb-6">
              🏆 Top Performers
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              Driver <span className="text-gold">Leaderboard</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Meet our top-rated drivers — verified, experienced, and committed to premium service.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Top 3 Podium */}
          <motion.div {...fadeUp} className="flex justify-center items-end gap-4 mb-12">
            {[1, 0, 2].map((idx) => {
              const d = ranked[idx];
              if (!d) return null;
              const isFirst = idx === 0;
              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className={`glass-card rounded-2xl p-6 text-center transition-all group ${
                    isFirst ? 'w-48 shadow-xl glow-gold' : 'w-40'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${isFirst ? 'text-4xl' : ''}`}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </div>
                  <img
                    src={d.photo}
                    alt={d.name}
                    className={`mx-auto rounded-full object-cover ring-2 mb-3 group-hover:scale-105 transition-transform ${
                      isFirst
                        ? 'w-20 h-20 ring-gold shadow-lg shadow-gold/20'
                        : 'w-16 h-16 ring-saffron/30'
                    }`}
                  />
                  <div className={`font-bold text-charcoal dark:text-white ${isFirst ? 'text-lg' : 'text-sm'}`}>
                    {d.name}
                  </div>
                  <div className="text-xs text-charcoal/50 dark:text-slate-text mt-0.5">
                    {d.tier?.icon} {d.tier?.name}
                  </div>
                  <div className="text-lg font-bold text-saffron dark:text-gold mt-2">
                    ⭐ {d.rating}
                  </div>
                  <div className="text-[10px] text-charcoal/40 dark:text-slate-text">
                    {d.totalRatings} rides
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Full Ranking List */}
          <div className="space-y-3">
            {ranked.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-all group"
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  i === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' :
                  i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                  i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                  'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/60 dark:text-slate-text'
                }`}>
                  #{i + 1}
                </div>

                {/* Photo */}
                <img
                  src={d.photo}
                  alt={d.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-charcoal/10 dark:ring-white/10 group-hover:ring-saffron/30 transition-all"
                />

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-charcoal dark:text-white">{d.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                      style={{ backgroundColor: (d.tier?.color || '#ccc') + '20', color: d.tier?.color }}>
                      {d.tier?.icon} {d.tier?.name}
                    </span>
                  </div>
                  <div className="text-xs text-charcoal/50 dark:text-slate-text mt-0.5">
                    {d.vehicle} · {d.languages?.join(', ')}
                  </div>
                </div>

                {/* Rating */}
                <div className="text-right">
                  <div className="text-lg font-bold text-saffron dark:text-gold">⭐ {d.rating}</div>
                  <div className="text-[10px] text-charcoal/40 dark:text-slate-text">{d.totalRatings} rides</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Driver Tiers Info */}
          <motion.div {...fadeUp} className="mt-12">
            <h2 className="font-display text-2xl font-bold mb-6 text-center text-charcoal dark:text-white">
              Driver <span className="text-saffron dark:text-gold">Tiers</span>
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {driverTiers.map((tier, i) => (
                <motion.div key={tier.id} {...fadeUp} transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl p-5 text-center group hover:shadow-xl transition-all"
                >
                  <div className="text-3xl mb-2">{tier.icon}</div>
                  <div className="font-bold text-sm text-charcoal dark:text-white">{tier.name}</div>
                  <div className="text-xs text-charcoal/50 dark:text-slate-text mt-1 mb-3">{tier.description}</div>
                  <div className="text-lg font-bold" style={{ color: tier.color }}>{tier.multiplier}x</div>
                  <div className="text-[10px] text-charcoal/40 dark:text-slate-text">fare multiplier</div>
                  <div className="mt-3 pt-3 border-t border-charcoal/10 dark:border-white/10 space-y-1">
                    {tier.benefits.slice(0, 3).map((b, j) => (
                      <div key={j} className="text-[10px] text-charcoal/50 dark:text-slate-text flex items-center gap-1 justify-center">
                        <span className="text-green-500">✓</span> {b}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
