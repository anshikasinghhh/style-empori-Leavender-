import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import bgcrafts from '../../assets/bgcrafts.png';

export default function Header() {
  return (
    <section
      className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20"
      style={{ backgroundImage: `url(${bgcrafts})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7efff]/70 via-[#f9f3ff]/60 to-white/50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Small label */}
          <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={13} className="text-primary" />
            <span className="font-accent text-primary text-sm italic tracking-wide">
              Our Artisans & Craftsmanship
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-snug">
            Celebrating the People Behind<br className="hidden sm:block" /> Every Piece
          </h1>

          {/* Description */}
          <p className="font-body text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            At Lavender, every garment is the result of creativity, dedication, and attention to detail.
            From designers and pattern makers to fabric specialists and production partners, every piece
            reflects the craftsmanship that defines our brand.
          </p>

          {/* Elegant divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-12 h-px bg-primary/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
