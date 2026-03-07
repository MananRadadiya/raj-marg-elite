import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import cars from '../data/cars';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function CarCategories() {
  const prices = useSelector((s) => s.fare.prices);

  return (
    <section id="fleet" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-125 h-125 bg-saffron/3 dark:bg-gold/3 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-gold/2 dark:bg-saffron/2 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[11px] font-medium tracking-[0.3em] uppercase text-saffron dark:text-gold mb-4">
            Our Fleet
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Premium <span className="bg-linear-to-r from-saffron to-gold bg-clip-text text-transparent">Car Categories</span>
          </h2>
          <p className="text-charcoal/50 dark:text-slate-text max-w-xl mx-auto text-lg font-light leading-relaxed">
            Choose from our curated collection of vehicles — from city-friendly to ultra-luxury
          </p>
        </motion.div>

        {/* Cars Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {cars.map((car) => (
            <motion.div
              key={car.id}
              variants={item}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl overflow-hidden bg-white/60 dark:bg-white/3 backdrop-blur-xl border border-charcoal/5 dark:border-white/5 hover:border-saffron/15 dark:hover:border-gold/15 transition-all duration-500 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 cursor-default"
            >
              {/* Car Image */}
              <div className="relative h-40 overflow-hidden bg-linear-to-br from-cream-dark to-cream dark:from-charcoal-mid dark:to-charcoal-light">
                <img
                  src={car.photo}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Price badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-charcoal/90 backdrop-blur-sm text-xs font-bold text-saffron dark:text-gold border border-white/50 dark:border-white/10">
                  ₹{prices[car.id] || car.perKm}/km
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-display text-lg font-semibold mb-1.5">{car.name}</h3>
                <p className="text-xs text-charcoal/45 dark:text-slate-text mb-4 leading-relaxed">
                  {car.description}
                </p>

                {/* Specs Row */}
                <div className="flex items-center gap-3 mb-4 text-xs text-charcoal/50 dark:text-slate-text">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                    </svg>
                    {car.seats}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    {car.luggage}
                  </div>
                  {car.ac && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      </svg>
                      AC
                    </div>
                  )}
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {car.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-saffron/8 dark:bg-gold/8 text-saffron dark:text-gold border border-saffron/10 dark:border-gold/10"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom glow on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-saffron/30 dark:via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
