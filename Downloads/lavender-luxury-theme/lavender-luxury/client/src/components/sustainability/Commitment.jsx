import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sprout, Lightbulb, HeartHandshake } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const CARDS = [
  {
    icon: Shield,
    title: 'Quality That Lasts',
    desc: 'Designing timeless, durable products made to be enjoyed for longer.',
  },
  {
    icon: Sprout,
    title: 'Responsible Growth',
    desc: 'Improving operations and reducing waste as we grow.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Continuously exploring smarter and more sustainable ways to serve our customers.',
  },
  {
    icon: HeartHandshake,
    title: 'Trust & Transparency',
    desc: 'Building long-term relationships through responsible business practices.',
  },
];

export default function Commitment() {
  return (
    <section id="commitment" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-tag mb-2">What We Stand For</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
            Our Commitment
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {CARDS.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              custom={i}
              className="group bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 hover:shadow-hover hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-champagne-light/80 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                <item.icon size={24} className="text-primary" />
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
