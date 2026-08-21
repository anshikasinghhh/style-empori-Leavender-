import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import bgsustain from '../../assets/bgsustain.png';

export default function Hero() {
  const scrollToCommitment = () => {
    document.getElementById('commitment')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[70vh] flex items-center overflow-hidden mt-16 lg:mt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={bgsustain}
          alt="Sustainable Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-plum/90 via-primary/70 to-primary-light/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,217,138,0.10),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm"
          >
            <Leaf size={13} className="text-gold-shine" />
            <span className="font-accent text-white/90 text-sm italic tracking-wide">
              Sustainability
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white leading-snug mb-5">
            Fashion with<br />Purpose
          </h1>

          {/* Description */}
          <p className="font-body text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            At Lavender, we believe fashion should combine style, quality, comfort, and responsibility.
            As our brand grows, we remain committed to making thoughtful choices that benefit our
            customers, communities, and the environment.
          </p>

          {/* Button */}
          <button
            onClick={scrollToCommitment}
            className="inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full font-body font-bold hover:bg-gold-shine hover:text-gray-900 transition-all hover:scale-105 shadow-lg"
          >
            Learn More <ArrowRight size={17} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
