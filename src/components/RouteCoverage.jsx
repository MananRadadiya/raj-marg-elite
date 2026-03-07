import { motion } from 'framer-motion';
import { formatINR } from '../utils/fareCalculator';

const popularRoutes = [
  { from: 'Ahmedabad', to: 'Vadodara', distance: 111, time: '~2h' },
  { from: 'Rajkot', to: 'Surat', distance: 425, time: '~6.5h' },
  { from: 'Ahmedabad', to: 'Udaipur', distance: 262, time: '~4h' },
  { from: 'Ahmedabad', to: 'Surat', distance: 265, time: '~4h' },
  { from: 'Ahmedabad', to: 'Rajkot', distance: 216, time: '~3.5h' },
  { from: 'Surat', to: 'Mumbai', distance: 284, time: '~4.5h' },
  { from: 'Ahmedabad', to: 'Dwarka', distance: 441, time: '~7h' },
  { from: 'Vadodara', to: 'Statue of Unity', distance: 90, time: '~1.5h' },
  { from: 'Ahmedabad', to: 'Somnath', distance: 412, time: '~6.5h' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function RouteCoverage() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden gujarati-pattern">
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-125 h-125 bg-saffron/3 dark:bg-gold/3 rounded-full blur-[200px]" />
      </div>

      {/* Subtle cultural pattern border */}
      <div className="absolute top-12 left-8 w-16 h-16 border border-saffron/10 dark:border-gold/10 rounded-full opacity-30 hidden lg:block" />
      <div className="absolute top-24 left-14 w-8 h-8 border border-saffron/10 dark:border-gold/10 rounded-full opacity-20 hidden lg:block" />
      <div className="absolute bottom-12 right-8 w-16 h-16 border border-saffron/10 dark:border-gold/10 rounded-full opacity-30 hidden lg:block" />
      <div className="absolute bottom-24 right-14 w-8 h-8 border border-saffron/10 dark:border-gold/10 rounded-full opacity-20 hidden lg:block" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[11px] font-medium tracking-[0.3em] uppercase text-saffron dark:text-gold mb-4">
            Route Coverage
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Popular <span className="bg-linear-to-r from-saffron to-gold bg-clip-text text-transparent">Gujarat Routes</span>
          </h2>
          <p className="text-charcoal/50 dark:text-slate-text max-w-xl mx-auto text-lg font-light leading-relaxed">
            Covering every major city, pilgrimage site, and heritage destination
          </p>
        </motion.div>

        {/* Route Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {popularRoutes.map((route, i) => (
            <motion.div
              key={`${route.from}-${route.to}`}
              variants={item}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="group relative rounded-2xl p-5 bg-white/50 dark:bg-white/3 backdrop-blur-xl border border-charcoal/5 dark:border-white/5 hover:border-saffron/15 dark:hover:border-gold/15 transition-all duration-500 cursor-default"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Route dots */}
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-2 h-2 rounded-full bg-saffron dark:bg-gold" />
                      <div className="w-px h-4 bg-linear-to-b from-saffron/60 to-saffron/20 dark:from-gold/60 dark:to-gold/20" />
                      <div className="w-2 h-2 rounded-full border-2 border-saffron dark:border-gold" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{route.from}</div>
                      <div className="text-sm font-semibold text-charcoal/60 dark:text-slate-text">{route.to}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-5 text-xs text-charcoal/40 dark:text-slate-text/60">
                    <span>{route.distance} km</span>
                    <span className="w-1 h-1 rounded-full bg-charcoal/20 dark:bg-white/20" />
                    <span>{route.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold bg-linear-to-r from-saffron to-gold bg-clip-text text-transparent">
                    {formatINR(route.distance * 10)}
                  </div>
                  <div className="text-[10px] text-charcoal/30 dark:text-slate-text/50 font-medium">
                    from Mini
                  </div>
                </div>
              </div>

              {/* Bottom glow */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-saffron/20 dark:via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
