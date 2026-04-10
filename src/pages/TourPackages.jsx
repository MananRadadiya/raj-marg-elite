import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import tourPackages, { tourCategories } from '../data/tourPackages';
import cars from '../data/cars';
import { formatINR } from '../utils/fareCalculator';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function TourPackages() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPkg, setSelectedPkg] = useState(null);

  const filtered = activeCategory === 'all' ? tourPackages : tourPackages.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden hero-gradient">
        <div className="hero-overlay absolute inset-0" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold tracking-widest uppercase mb-6">
              🏛️ Curated Experiences
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              Gujarat <span className="text-gold">Tour Packages</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Handcrafted travel packages with premium vehicles and experienced drivers. Explore Gujarat&apos;s finest destinations.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Category Filters */}
          <motion.div {...fadeUp} className="flex flex-wrap gap-2 mb-8 justify-center">
            {tourCategories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
                  activeCategory === cat.id
                    ? 'premium-gradient text-charcoal shadow-md'
                    : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/60 dark:text-slate-text hover:bg-charcoal/10'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Package Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pkg, i) => {
              const recCar = cars.find((c) => c.id === pkg.recommendedCar);
              return (
                <motion.div key={pkg.id} {...fadeUp} transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedPkg(selectedPkg?.id === pkg.id ? null : pkg)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold">
                      {pkg.duration}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-gold/20 backdrop-blur-md text-gold text-[10px] font-bold">
                      ⭐ {pkg.rating} ({pkg.reviews})
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="text-xl font-bold text-white">{formatINR(pkg.estimatedFare)}</div>
                      <div className="text-[10px] text-white/60">estimated fare</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-charcoal dark:text-white mb-1">{pkg.name}</h3>
                    <p className="text-xs text-charcoal/50 dark:text-slate-text mb-3">{pkg.tagline}</p>

                    {/* Route */}
                    <div className="flex items-center gap-1 text-xs text-charcoal/60 dark:text-slate-text mb-3 flex-wrap">
                      {pkg.route.map((city, j) => (
                        <span key={j} className="flex items-center gap-1">
                          {j > 0 && <span className="text-saffron dark:text-gold">→</span>}
                          <span>{city}</span>
                        </span>
                      ))}
                    </div>

                    {/* Info Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2 py-1 rounded-lg bg-charcoal/5 dark:bg-charcoal-mid/50 text-[10px] font-medium text-charcoal/60 dark:text-slate-text">
                        📍 {pkg.distance} km
                      </span>
                      {recCar && (
                        <span className="px-2 py-1 rounded-lg bg-saffron/10 text-[10px] font-medium text-saffron dark:text-gold">
                          {recCar.image} {recCar.name}
                        </span>
                      )}
                    </div>

                    {/* Highlights */}
                    {selectedPkg?.id === pkg.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="mb-4 pt-3 border-t border-charcoal/10 dark:border-white/10"
                      >
                        <div className="text-[10px] font-bold text-charcoal/40 dark:text-slate-text uppercase tracking-widest mb-2">
                          Highlights
                        </div>
                        <div className="space-y-1">
                          {pkg.highlights.map((h, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs text-charcoal/60 dark:text-slate-text">
                              <span className="text-saffron dark:text-gold">✦</span> {h}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Book Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/booking', { state: { aiPrefill: { from: pkg.route[0], to: pkg.route[pkg.route.length - 1], carType: pkg.recommendedCar, driverTier: 'gold', tripType: 'round-trip' } } });
                      }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold premium-gradient text-charcoal border-none cursor-pointer hover:shadow-lg hover:shadow-saffron/20 transition-all"
                    >
                      Book This Package →
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
