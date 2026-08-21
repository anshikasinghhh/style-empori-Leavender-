import React from 'react';
import { motion } from 'framer-motion';
import { Award, HeartHandshake, TrendingUp } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const CARDS = [
  {
    icon: Award,
    title: 'Quality First',
    desc: 'Every product is carefully reviewed before becoming part of our collection.',
  },
  {
    icon: HeartHandshake,
    title: 'Trusted Partnerships',
    desc: 'We work with trusted manufacturing and sourcing partners who share our commitment to quality.',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Improvement',
    desc: 'We continue refining our products and processes to deliver the best experience for our customers.',
  },
];

export default function Purpose() {
  return (
    <section className="py-16 md:py-20 bg-[#f7efff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-5">
            Designed with Purpose
          </h2>
          <p className="font-body text-gray-500 text-base leading-relaxed">
            Fashion is more than following trends. Every Lavender collection is created with the goal
            of combining timeless style, comfort, and practicality to make clothing customers love
            wearing every day.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid sm:grid-cols-3 gap-5"
        >
          {CARDS.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              custom={i}
              className="group bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 hover:shadow-hover hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-champagne-light/80 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                <item.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 text-base mb-2">{item.title}</h3>
              <p className="font-body text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
