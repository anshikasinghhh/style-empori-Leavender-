import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Journey() {
  return (
    <section className="py-16 md:py-20 bg-champagne-light/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Decorative icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-6 border border-primary/10">
            <Compass size={28} className="text-primary" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-5">
            A Journey of Continuous Improvement
          </h2>
          <p className="font-body text-gray-500 text-base leading-relaxed">
            Sustainability is an ongoing journey. As Lavender grows, we will continue improving
            our products, operations, and business practices while exploring more responsible
            solutions for the future.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
