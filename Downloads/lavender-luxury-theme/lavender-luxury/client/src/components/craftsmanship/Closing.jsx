import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Closing() {
  return (
    <section className="py-16 md:py-20 bg-[#fcf9f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5 border border-primary/10">
            <Heart size={24} className="text-primary" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-5">
            Thank You
          </h2>

          {/* Text */}
          <p className="font-body text-gray-500 text-base leading-relaxed mb-6">
            Every Lavender product represents the combined efforts of talented designers, skilled
            artisans, production partners, and creative minds. Their passion inspires everything we
            create, and we are grateful to every customer who supports the people behind each
            collection.
          </p>

          {/* Tagline */}
          <p className="font-accent text-gold text-xl italic mb-8">
            Wear Confidence. Live Comfort.
          </p>

          {/* CTA Button */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-body font-bold hover:bg-primary-dark transition-all hover:scale-105 shadow-lg"
          >
            Explore Our Collection <ArrowRight size={17} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
