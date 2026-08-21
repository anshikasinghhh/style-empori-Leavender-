import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import bgcarrer from '../../assets/bgcarrer.png';

export default function Hero() {
  const scrollToOpportunities = () => {
    document.getElementById('career-opportunities')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToApply = () => {
    document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[80vh] flex items-center overflow-hidden mt-16 lg:mt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2d183d]/80 via-[#4f2b63]/45 to-transparent" />
        <img
          src={bgcarrer}
          alt="Lavender Careers"
          className="w-full h-full object-cover scale-[1.02] blur-[1px] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2d183d]/80 via-[#4f2b63]/45 to-[#7b5c97]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,217,138,0.14),transparent_55%)]" />
      </div>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[15%] w-20 h-20 rounded-full bg-gold-shine/10 blur-2xl animate-float" />
        <div className="absolute bottom-32 right-[30%] w-32 h-32 rounded-full bg-white/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-40 left-[60%] w-16 h-16 rounded-full bg-gold/10 blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl ml-6 sm:ml-10 lg:ml-16 mr-auto px-4 sm:px-6 lg:px-8 py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl text-left"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/90 border border-primary/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm"
          >
            <Sparkles size={13} className="text-primary" />
            <span className="font-accent text-primary text-sm italic tracking-wide">
              Careers at Lavender
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white leading-snug mb-5">
            Build the Future of<br />Fashion With Us
          </h1>

          {/* Description */}
          <p className="font-body text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            At Lavender, we're more than a fashion brand — we're building a community driven by
            creativity, innovation, and purpose. Since our launch on 4 January 2023, our mission
            has been to create stylish, comfortable, and high-quality fashion that inspires
            confidence in everyday life.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToOpportunities}
              className="inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full font-body font-bold hover:bg-gold-shine hover:text-gray-900 transition-all hover:scale-105 shadow-lg"
            >
              Explore Opportunities <ArrowRight size={17} />
            </button>
            <button
              onClick={scrollToApply}
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-7 py-3.5 rounded-full font-body font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Apply Now <Star size={15} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
