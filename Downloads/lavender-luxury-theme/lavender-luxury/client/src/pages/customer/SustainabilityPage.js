import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Shield, Sprout, Lightbulb, HeartHandshake, Heart } from 'lucide-react';
import bgsustain from '../../assets/bgsustain.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const COMMITMENTS = [
  { icon: Shield, title: 'Quality That Lasts', desc: 'Designing timeless, durable products made to be enjoyed for longer.' },
  { icon: Sprout, title: 'Responsible Growth', desc: 'Improving operations and reducing waste as we grow.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Continuously exploring smarter and more sustainable ways to serve our customers.' },
  { icon: HeartHandshake, title: 'Trust & Transparency', desc: 'Building long-term relationships through responsible business practices.' },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Section 1 — Intro */}
      <section
        className="relative overflow-hidden py-16 md:py-20 mt-16 lg:mt-20"
        style={{ backgroundImage: `url(${bgsustain})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7efff]/70 via-[#f9f3ff]/60 to-white/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-6">
              <Leaf size={14} className="text-primary" />
              <span className="font-accent text-primary text-sm italic tracking-wide">Sustainability</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Fashion with Purpose
            </h1>
            <p className="font-body text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              At Lavender, we believe fashion should combine style, quality, comfort, and responsibility.
              As our brand grows, we remain committed to making thoughtful choices that benefit our
              customers, communities, and the environment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2 — Our Commitment */}
      <section className="py-16 md:py-20 bg-champagne-light/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {COMMITMENTS.map((item, i) => (
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

      {/* Section 3 — Our Promise */}
      <section className="py-16 md:py-20 bg-primary-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5 border border-primary/10">
              <Heart size={24} className="text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-5">
              Our Promise
            </h2>
            <p className="font-body text-gray-500 text-base leading-relaxed mb-6">
              Every decision we make is guided by our commitment to creating fashion that customers
              can trust. We strive to deliver products that combine style, comfort, quality, and
              responsibility for today and tomorrow.
            </p>
            <p className="font-accent text-gold text-lg italic">
              "Thank you for supporting Lavender as we continue building a more sustainable future."
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
