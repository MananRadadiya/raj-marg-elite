import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import faqData from '../data/faqData';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let data = activeCategory === 'all' ? faqData : faqData.filter((c) => c.category.toLowerCase() === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.map((cat) => ({
        ...cat,
        questions: cat.questions.filter((faq) => faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)),
      })).filter((cat) => cat.questions.length > 0);
    }
    return data;
  }, [activeCategory, search]);

  const totalQuestions = filtered.reduce((sum, cat) => sum + cat.questions.length, 0);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden hero-gradient">
        <div className="hero-overlay absolute inset-0" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              Frequently Asked <span className="text-gold">Questions</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Everything you need to know about RajMarg Elite
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 placeholder:text-white/30 backdrop-blur-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Category Tabs */}
          <motion.div {...fadeUp} className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
                activeCategory === 'all'
                  ? 'premium-gradient text-charcoal shadow-md'
                  : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/60 dark:text-slate-text hover:bg-charcoal/10'
              }`}
            >
              All ({faqData.reduce((s, c) => s + c.questions.length, 0)})
            </button>
            {faqData.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category.toLowerCase())}
                className={`px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer transition-all ${
                  activeCategory === cat.category.toLowerCase()
                    ? 'premium-gradient text-charcoal shadow-md'
                    : 'bg-charcoal/5 dark:bg-charcoal-mid text-charcoal/60 dark:text-slate-text hover:bg-charcoal/10'
                }`}
              >
                {cat.icon} {cat.category} ({cat.questions.length})
              </button>
            ))}
          </motion.div>

          {/* Results Count */}
          {search && (
            <div className="text-sm text-charcoal/50 dark:text-slate-text mb-4">
              {totalQuestions} result{totalQuestions !== 1 ? 's' : ''} found for &ldquo;{search}&rdquo;
            </div>
          )}

          {/* Accordion */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-charcoal/50 dark:text-slate-text">No questions found. Try a different search.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filtered.map((cat) => (
                <motion.div key={cat.category} {...fadeUp}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{cat.icon}</span>
                    <h2 className="font-display text-xl font-bold text-charcoal dark:text-white">{cat.category}</h2>
                    <span className="text-xs text-charcoal/30 dark:text-slate-text/50">({cat.questions.length})</span>
                  </div>
                  <div className="space-y-2">
                    {cat.questions.map((faq, i) => {
                      const id = `${cat.category}-${i}`;
                      const isOpen = openId === id;
                      return (
                        <motion.div
                          key={id}
                          className="glass-card rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenId(isOpen ? null : id)}
                            className="w-full flex items-center justify-between p-4 text-left bg-transparent border-none cursor-pointer group"
                          >
                            <span className="text-sm font-medium text-charcoal dark:text-white pr-4 group-hover:text-saffron dark:group-hover:text-gold transition-colors">
                              {faq.q}
                            </span>
                            <motion.span
                              animate={{ rotate: isOpen ? 45 : 0 }}
                              className="text-saffron dark:text-gold text-lg flex-shrink-0"
                            >
                              +
                            </motion.span>
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="px-4 pb-4 text-sm text-charcoal/60 dark:text-slate-text leading-relaxed border-t border-charcoal/5 dark:border-white/5 pt-3">
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Still Need Help */}
          <motion.div {...fadeUp} className="mt-12 glass-card rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-display text-xl font-bold mb-2 text-charcoal dark:text-white">
              Still have questions?
            </h3>
            <p className="text-sm text-charcoal/60 dark:text-slate-text mb-4">
              Can&apos;t find what you&apos;re looking for? Our support team is happy to help.
            </p>
            <a href="/contact"
              className="inline-flex px-6 py-2.5 rounded-xl text-sm font-semibold premium-gradient text-charcoal no-underline hover:opacity-90 transition-opacity"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
