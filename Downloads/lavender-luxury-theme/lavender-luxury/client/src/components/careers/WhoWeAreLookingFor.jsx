import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const TRAITS = [
  'Creative and innovative',
  'Passionate about fashion',
  'Customer-focused',
  'Self-motivated',
  'Eager to learn',
  'Team player',
  'Strong communication',
  'Responsible',
  'Adaptable',
  'Solution-oriented',
  'Committed to excellence',
];

export default function WhoWeAreLookingFor() {
  return (
    <section className="py-16 md:py-20 bg-champagne-light/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=85"
              alt="Lavender Team"
              className="rounded-3xl w-full h-[480px] object-cover shadow-premium"
            />
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-card border border-gold-pale/60">
              <p className="font-body text-xs text-gray-500 mb-1">We're hiring</p>
              <p className="font-display text-lg font-bold text-primary">Join Our Team</p>
            </div>
          </motion.div>

          {/* Right: Checklist */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="section-tag mb-3">Ideal Candidates</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Who We're Looking For
            </h2>
            <p className="font-body text-gray-600 leading-relaxed mb-6">
              We believe great talent comes in many forms. If you resonate with these qualities,
              you could be the perfect fit for Lavender.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {TRAITS.map((trait) => (
                <div
                  key={trait}
                  className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 shadow-sm border border-gold-pale/40"
                >
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span className="font-body text-sm text-gray-700">{trait}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
