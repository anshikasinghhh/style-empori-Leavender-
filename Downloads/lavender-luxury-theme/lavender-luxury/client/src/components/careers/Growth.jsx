import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Users, Target } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const STATS = [
  { icon: TrendingUp, label: 'Career Growth', value: 'Unlimited' },
  { icon: Award, label: 'Recognition', value: 'Performance-Based' },
  { icon: Users, label: 'Team Culture', value: 'Collaborative' },
  { icon: Target, label: 'Opportunities', value: 'Expanding' },
];

export default function Growth() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-plum via-primary to-primary-light text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-gold-shine/8 blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="font-accent text-gold-shine text-sm italic mb-3">Your Journey Starts Here</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5">
            Grow With Lavender
          </h2>
          <p className="font-body text-white/70 text-base md:text-lg leading-relaxed mb-10">
            At Lavender, we believe every employee has the potential to become a leader. We invest
            in talent, encourage innovation, and recognize outstanding performance. As our company
            grows, so do the opportunities for our team members to take on greater responsibilities
            and build rewarding careers.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((item) => (
              <div
                key={item.label}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={22} className="text-gold-shine" />
                </div>
                <p className="font-display font-bold text-white text-sm mb-0.5">{item.value}</p>
                <p className="font-body text-[11px] text-white/50">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
