import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, GraduationCap, Trophy, ShoppingBag, Laptop, Rocket } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const FEATURES = [
  {
    icon: Lightbulb,
    title: 'Creative & Collaborative Environment',
    desc: 'Work alongside talented designers, marketers, and innovators in a culture that celebrates creativity and teamwork.',
  },
  {
    icon: GraduationCap,
    title: 'Professional Learning & Career Growth',
    desc: 'Access training, mentorship, and development programs to help you grow your skills and advance your career.',
  },
  {
    icon: Trophy,
    title: 'Performance-Based Recognition',
    desc: 'Your hard work is rewarded. We recognize and celebrate outstanding contributions at every level.',
  },
  {
    icon: ShoppingBag,
    title: 'Exciting Fashion Collections & Campaigns',
    desc: 'Be part of creating and launching collections that inspire customers and set new trends in fashion.',
  },
  {
    icon: Laptop,
    title: 'Digital Innovation & E-commerce Exposure',
    desc: 'Gain hands-on experience with modern e-commerce platforms, digital marketing, and tech-driven operations.',
  },
  {
    icon: Rocket,
    title: 'Entrepreneurial Culture & Fresh Ideas',
    desc: 'We encourage entrepreneurial thinking. Your ideas can shape the future direction of the brand.',
  },
];

export default function WhyWork() {
  return (
    <section className="py-16 md:py-20 bg-champagne-light/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-tag mb-2">Why Lavender</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
            Why Work at Lavender
          </h2>
          <p className="font-body text-gray-500 mt-3 max-w-xl mx-auto">
            Discover what makes Lavender a rewarding place to build your career.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              custom={i}
              className="group bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-champagne-light/80 flex items-center justify-center mb-5 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
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
