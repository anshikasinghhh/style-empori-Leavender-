import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, Gem, Scissors, Eye, ShieldCheck } from 'lucide-react';
import crafts1 from '../../assets/crafts1.png';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const FEATURES = [
  { icon: Shirt, title: 'Comfortable Designs', desc: 'Every piece is crafted for all-day comfort and effortless style.' },
  { icon: Gem, title: 'Premium Fabrics', desc: 'We source high-quality materials that feel luxurious against the skin.' },
  { icon: Scissors, title: 'Precise Stitching', desc: 'Careful construction ensures clean seams and lasting durability.' },
  { icon: Eye, title: 'Attention to Detail', desc: 'From buttons to finishes, every element is thoughtfully considered.' },
  { icon: ShieldCheck, title: 'Built for Everyday Wear', desc: 'Designed to maintain quality and shape through daily use.' },
];

export default function Craftsmanship() {
  return (
    <section className="py-16 md:py-20 bg-[#fdf8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative overflow-hidden rounded-[24px] p-2.5 bg-gradient-to-br from-[#f5eaff] via-[#ffffff] to-[#efe4ff] shadow-[0_18px_45px_rgba(96,53,151,0.18)] ring-1 ring-[#d8bfdc]/70">
              <img
                src={crafts1}
                alt="Lavender craftsmanship"
                className="w-full h-[400px] lg:h-[480px] object-cover rounded-[20px] shadow-[0_10px_30px_rgba(76,42,112,0.16)] brightness-[1.02] contrast-[1.03] transition-transform duration-500 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 rounded-[20px] border border-[#caaef7]/80 pointer-events-none" />
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-5">
              Craftsmanship Matters
            </h2>
            <p className="font-body text-gray-500 text-base leading-relaxed mb-8">
              Quality is at the heart of everything we do. Every product is thoughtfully developed
              with comfortable designs, quality fabrics, careful stitching, refined details, and
              durability for everyday wear.
            </p>

            {/* Feature rows */}
            <div className="space-y-4">
              {FEATURES.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-gray-900 text-sm mb-0.5">{item.title}</h4>
                    <p className="font-body text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
