import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function CTA() {
  const scrollToApply = () => {
    document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-6 md:py-8 bg-primary-50 -mb-20 relative z-30 mx-8 sm:mx-12 lg:mx-24 rounded-2xl shadow-sm border border-primary-100/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
            <Heart size={20} className="text-primary" />
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Let's Build Something Beautiful Together
          </h2>
          <p className="font-body text-gray-500 text-xs leading-relaxed mb-4 max-w-sm mx-auto">
            At Lavender, we're creating more than fashion — we're building a brand people love and trust.
            If you're ready to grow, innovate, and make an impact, we'd love to welcome you.
          </p>
          <button
            onClick={scrollToApply}
            className="btn-primary px-6 py-2.5 text-xs"
          >
            Join Our Team <ArrowRight size={13} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
