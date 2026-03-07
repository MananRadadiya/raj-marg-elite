import { motion } from 'framer-motion';

export default function MobileAppPromo() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 hero-overlay" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative px-8 py-16 md:px-16 md:py-20 flex flex-col md:flex-row items-center gap-12">
            {/* Left — Phone Mockup Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="shrink-0"
            >
              <div className="relative w-56 h-96 md:w-64 md:h-112">
                {/* Phone frame */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
                  {/* Screen content mockup */}
                  <div className="absolute inset-3 rounded-4xl bg-charcoal-light overflow-hidden">
                    {/* Status bar */}
                    <div className="h-8 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-1 rounded-full bg-white/30" />
                    </div>
                    {/* App mockup */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded bg-linear-to-br from-saffron to-gold" />
                        <span className="text-white text-xs font-display font-semibold tracking-wider">RAJ MARG</span>
                      </div>
                      {/* Search bar mockup */}
                      <div className="w-full h-8 rounded-lg bg-white/5 mb-3 border border-white/10" />
                      {/* Map area mockup */}
                      <div className="w-full h-28 rounded-xl bg-linear-to-br from-white/5 to-white/[0.02] border border-white/5 mb-3 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                        </svg>
                      </div>
                      {/* Card mockups */}
                      <div className="space-y-2">
                        <div className="w-full h-10 rounded-lg bg-white/5 border border-white/5" />
                        <div className="w-full h-8 rounded-lg bg-linear-to-r from-saffron/30 to-gold/30" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow behind phone */}
                <div className="absolute -inset-8 bg-linear-to-br from-saffron/15 to-gold/10 rounded-full blur-3xl -z-10" />
              </div>
            </motion.div>

            {/* Right — Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex-1 text-center md:text-left"
            >
              <span className="inline-block text-[11px] font-medium tracking-[0.3em] uppercase text-gold mb-4">
                Mobile App
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Raj Marg in{' '}
                <span className="bg-linear-to-r from-saffron via-gold to-gold-light bg-clip-text text-transparent">
                  Your Pocket
                </span>
              </h2>
              <p className="text-white/50 text-lg font-light leading-relaxed mb-8 max-w-lg">
                Book rides, track your driver in real-time, and manage all your trips from one beautiful app. Designed for speed and simplicity.
              </p>

              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-sm font-medium text-white/70 tracking-wide">
                  Coming Soon — iOS & Android
                </span>
              </div>

              {/* Feature list */}
              <div className="mt-8 grid grid-cols-2 gap-3 max-w-md mx-auto md:mx-0">
                {[
                  'Instant Booking',
                  'Live Tracking',
                  'Fare Calculator',
                  'Ride History',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white/40">
                    <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
