import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Ankit Patel',
    location: 'Ahmedabad',
    rating: 5,
    text: 'Raj Marg redefined my travel experience in Gujarat. The driver was punctual, the car was immaculate, and the pricing was exactly what was quoted. No surprises.',
    avatar: 'AP',
  },
  {
    name: 'Priya Mehta',
    location: 'Surat',
    rating: 5,
    text: 'We used Raj Marg for our family trip to Statue of Unity. Premium SUV, professional driver, and very reasonable pricing. Highly recommend!',
    avatar: 'PM',
  },
  {
    name: 'Rajesh Shah',
    location: 'Vadodara',
    rating: 5,
    text: 'As a corporate traveller, I need reliability. Raj Marg delivers every single time — clean cars, courteous drivers, and transparent billing.',
    avatar: 'RS',
  },
  {
    name: 'Nisha Desai',
    location: 'Rajkot',
    rating: 4,
    text: 'Booked a sedan for Rajkot to Ahmedabad. The entire experience was smooth — from instant booking to a comfortable ride. Will use again.',
    avatar: 'ND',
  },
  {
    name: 'Karan Joshi',
    location: 'Gandhinagar',
    rating: 5,
    text: 'The luxury tier is genuinely luxury. Leather seats, complimentary refreshments, and a chauffeur who knew every shortcut. Worth every rupee.',
    avatar: 'KJ',
  },
  {
    name: 'Meera Trivedi',
    location: 'Bhavnagar',
    rating: 5,
    text: 'I love the transparent fare breakdown. You see exactly what you are paying for — base fare, toll, driver tier. No hidden charges whatsoever.',
    avatar: 'MT',
  },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-gold' : 'text-charcoal/10 dark:text-white/10'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-125 h-125 bg-saffron/3 dark:bg-gold/3 rounded-full blur-[200px]" />
      </div>

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
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our{' '}
            <span className="bg-linear-to-r from-saffron to-gold bg-clip-text text-transparent">
              Riders Say
            </span>
          </h2>
          <p className="text-charcoal/50 dark:text-slate-text max-w-xl mx-auto text-lg font-light leading-relaxed">
            Trusted by thousands of travellers across Gujarat
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl p-6 bg-white/50 dark:bg-white/3 backdrop-blur-xl border border-charcoal/5 dark:border-white/5 hover:border-saffron/10 dark:hover:border-gold/10 transition-all duration-500"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-5 text-4xl font-display text-saffron/10 dark:text-gold/10 leading-none">
                "
              </div>

              <div className="flex items-center gap-3 mb-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-saffron/20 to-gold/10 dark:from-saffron/10 dark:to-gold/5 flex items-center justify-center text-sm font-bold text-saffron dark:text-gold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-charcoal/40 dark:text-slate-text">{t.location}</div>
                </div>
              </div>

              <StarRating count={t.rating} />

              <p className="mt-4 text-sm text-charcoal/60 dark:text-slate-text leading-relaxed">
                {t.text}
              </p>

              {/* Bottom glow */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-saffron/20 dark:via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
