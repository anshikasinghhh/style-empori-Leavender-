import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import career2 from '../../assets/career2.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function About() {
  return (
    <section className="py-16 md:py-20">
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
              src={career2}
              alt="Lavender Team"
              className="rounded-3xl w-full h-[420px] object-cover shadow-premium"
            />
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60">
              <p className="font-display text-3xl font-bold text-primary">2023</p>
              <p className="font-body text-xs text-gray-500">Founded</p>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="section-tag mb-3">About Lavender</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
              Why Join Lavender?
            </h2>
            <p className="font-body text-gray-600 leading-relaxed mb-4">
              As we continue to expand across India and prepare for future international growth,
              we're looking for talented individuals who are passionate about creativity,
              innovation, and delivering exceptional customer experiences.
            </p>
            <p className="font-body text-gray-600 leading-relaxed mb-6">
              At Lavender, every team member plays a vital role in shaping the future of fashion.
              We value fresh ideas, encourage entrepreneurial thinking, and invest in our people's
              professional development.
            </p>

            {/* Quote Card */}
            <div className="bg-champagne-light/80 border border-gold-pale rounded-2xl p-5 relative">
              <Quote size={24} className="text-primary/30 absolute top-4 right-4" />
              <p className="font-accent text-lg italic text-primary leading-relaxed pr-8">
                "Your ideas matter. Your creativity is valued. Your growth is encouraged."
              </p>
              <div className="mt-3 w-10 h-0.5 bg-gold/40 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
