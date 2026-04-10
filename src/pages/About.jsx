import { motion } from 'framer-motion';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const HIGHLIGHTS = [
  { icon: '🛡️', title: 'Verified Drivers', desc: '7-point verification including background check, medical fitness, and driving test.' },
  { icon: '🚗', title: 'Premium Fleet', desc: '5 car categories from budget Mini to chauffeur-driven Luxury — all maintained to showroom standards.' },
  { icon: '📍', title: 'GPS Tracked', desc: 'Every ride is live-tracked for safety. Share your trip with family in one tap.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges. See full fare breakdown before you book.' },
  { icon: '🕐', title: '24/7 Available', desc: 'Book anytime, travel anytime. Early morning or late night — we\'re always ready.' },
  { icon: '🏆', title: 'Top-Rated Service', desc: '4.8★ average rating across 50,000+ completed rides.' },
];

const SAFETY = [
  'Background-verified drivers with government ID',
  'Vehicle fitness certification every 6 months',
  'Real-time GPS tracking on every ride',
  'In-app SOS emergency button',
  '24/7 customer support helpline',
  'Post-ride sanitization for all vehicles',
  'Insurance coverage for all passengers',
  'Female-friendly safety protocols',
];

const FLEET = [
  { name: 'Mini', emoji: '🚗', desc: 'Swift Dzire, WagonR', seats: 4 },
  { name: 'Sedan', emoji: '🚙', desc: 'Honda City, Ciaz', seats: 4 },
  { name: 'SUV', emoji: '🚐', desc: 'Innova, Ertiga', seats: 6 },
  { name: 'Premium SUV', emoji: '🏎️', desc: 'Innova Crysta, XUV700', seats: 6 },
  { name: 'Luxury', emoji: '👑', desc: 'Mercedes E-Class, BMW 5', seats: 4 },
];

const TEAM = [
  { name: 'Rajesh Patel', role: 'Founder & CEO', photo: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { name: 'Priya Shah', role: 'Head of Operations', photo: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { name: 'Amit Desai', role: 'Chief Technology Officer', photo: 'https://randomuser.me/api/portraits/men/42.jpg' },
  { name: 'Neha Joshi', role: 'Customer Experience Lead', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden hero-gradient">
        <div className="hero-overlay absolute inset-0" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold tracking-widest uppercase mb-6">
              ✦ Est. 2020 — Gujarat
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              About <span className="text-gold">RajMarg Elite</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Born from the vision of making Gujarat travel luxurious, safe, and effortless.
              We connect travelers with verified drivers and premium vehicles for intercity journeys across the state.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 gujarati-pattern">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp} className="glass-card rounded-2xl p-8">
              <div className="text-3xl mb-4">🎯</div>
              <h2 className="font-display text-2xl font-bold mb-3 text-charcoal dark:text-white">Our Mission</h2>
              <p className="text-charcoal/60 dark:text-slate-text leading-relaxed">
                To provide Gujarat&apos;s most reliable, comfortable, and safe intercity taxi service —
                making premium travel accessible to everyone from Kutch to South Gujarat.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8">
              <div className="text-3xl mb-4">🔭</div>
              <h2 className="font-display text-2xl font-bold mb-3 text-charcoal dark:text-white">Our Vision</h2>
              <p className="text-charcoal/60 dark:text-slate-text leading-relaxed">
                To become India&apos;s most-loved regional taxi brand by 2027 — expanding across
                Rajasthan, Maharashtra, and beyond while maintaining our luxury-first approach.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl mx-auto" />

      {/* Highlights */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-2 text-charcoal dark:text-white">
              Why <span className="text-saffron dark:text-gold">RajMarg Elite</span>
            </h2>
            <p className="text-charcoal/50 dark:text-slate-text">What sets us apart from the rest</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{h.icon}</div>
                <h3 className="font-semibold text-charcoal dark:text-white mb-1.5">{h.title}</h3>
                <p className="text-sm text-charcoal/50 dark:text-slate-text leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl mx-auto" />

      {/* Safety */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold mb-4">
                🛡️ Safety First
              </div>
              <h2 className="font-display text-3xl font-bold mb-4 text-charcoal dark:text-white">
                Your Safety, Our <span className="text-saffron dark:text-gold">Promise</span>
              </h2>
              <p className="text-charcoal/60 dark:text-slate-text mb-6 leading-relaxed">
                Every aspect of RajMarg Elite is designed with your safety in mind.
                From driver verification to real-time tracking, we leave nothing to chance.
              </p>
              <div className="space-y-3">
                {SAFETY.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-sm text-charcoal/70 dark:text-slate-text">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-saffron/10 to-gold/10 flex items-center justify-center"
            >
              <div className="text-[120px]">🛡️</div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl mx-auto" />

      {/* Fleet */}
      <section className="py-16 gujarati-pattern">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-2 text-charcoal dark:text-white">
              Our <span className="text-saffron dark:text-gold">Fleet</span>
            </h2>
            <p className="text-charcoal/50 dark:text-slate-text">From budget-friendly to ultra-luxury</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {FLEET.map((car, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5 text-center group hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">{car.emoji}</div>
                <div className="font-semibold text-sm text-charcoal dark:text-white">{car.name}</div>
                <div className="text-[11px] text-charcoal/50 dark:text-slate-text mt-1">{car.desc}</div>
                <div className="text-[10px] mt-2 text-saffron dark:text-gold font-semibold">{car.seats} seats</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl mx-auto" />

      {/* Team */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-2 text-charcoal dark:text-white">
              Meet the <span className="text-saffron dark:text-gold">Team</span>
            </h2>
            <p className="text-charcoal/50 dark:text-slate-text">The people behind your premium ride</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {TEAM.map((member, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5 text-center group"
              >
                <img src={member.photo} alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-2 ring-saffron/30 group-hover:ring-saffron transition-all"
                />
                <div className="font-semibold text-sm text-charcoal dark:text-white">{member.name}</div>
                <div className="text-[11px] text-saffron dark:text-gold font-medium mt-0.5">{member.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-charcoal to-royal-navy">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '50K+', label: 'Rides Completed' },
              { value: '22+', label: 'Cities Covered' },
              { value: '500+', label: 'Verified Drivers' },
              { value: '4.8★', label: 'Average Rating' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl font-bold text-gold mb-1">{stat.value}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
