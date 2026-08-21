import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Promise() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-plum via-primary to-primary-light text-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gold-shine/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5 backdrop-blur-sm border border-white/15">
            <Heart size={24} className="text-gold-shine" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Our Promise
          </h2>
          <p className="font-body text-white/70 text-base leading-relaxed mb-6 max-w-lg mx-auto">
            Every decision we make is guided by our commitment to creating fashion that customers
            can trust. We strive to deliver products that combine style, comfort, quality, and
            responsibility for today and tomorrow.
          </p>
          <p className="font-accent text-gold-shine/80 text-lg italic">
            "Thank you for supporting Lavender as we continue building a more sustainable future."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
