import React from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Scissors, Megaphone, Share2, PenTool, Camera, FileEdit,
  ShoppingCart, LayoutDashboard, BarChart3, Headphones, TrendingUp,
  Package, Calculator, Users, Code, Truck
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: 'easeOut' },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const OPPORTUNITIES = [
  { icon: Palette, title: 'Fashion Design', desc: 'Create stunning collections that set new trends' },
  { icon: Scissors, title: 'Textile & Product Development', desc: 'Develop premium fabrics and refine products' },
  { icon: Megaphone, title: 'Digital Marketing', desc: 'Drive brand visibility through digital campaigns' },
  { icon: Share2, title: 'Social Media Management', desc: 'Build engaging social media presence' },
  { icon: PenTool, title: 'Graphic Design', desc: 'Craft visuals that tell our brand story' },
  { icon: Camera, title: 'Photography & Videography', desc: 'Capture fashion through your lens' },
  { icon: FileEdit, title: 'Content Creation', desc: 'Write compelling stories and content' },
  { icon: ShoppingCart, title: 'E-commerce Operations', desc: 'Manage seamless online shopping experiences' },
  { icon: LayoutDashboard, title: 'Marketplace Management', desc: 'Optimize listings across marketplaces' },
  { icon: BarChart3, title: 'Data Analytics & BI', desc: 'Turn data into actionable business insights' },
  { icon: Headphones, title: 'Customer Experience & Support', desc: 'Deliver exceptional customer journeys' },
  { icon: TrendingUp, title: 'Sales & Business Development', desc: 'Expand our reach and grow revenue' },
  { icon: Package, title: 'Inventory & Supply Chain', desc: 'Ensure efficient supply chain operations' },
  { icon: Calculator, title: 'Finance & Accounting', desc: 'Manage financial planning and compliance' },
  { icon: Users, title: 'Human Resources', desc: 'Build and nurture a thriving team culture' },
  { icon: Code, title: 'IT & Website Development', desc: 'Build cutting-edge digital platforms' },
  { icon: Truck, title: 'Logistics & Operations', desc: 'Streamline delivery and operational efficiency' },
];

export default function CareerGrid() {
  const scrollToApply = () => {
    document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="career-opportunities" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-tag mb-2">Opportunities</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
            Career Opportunities
          </h2>
          <p className="font-body text-gray-500 mt-3 max-w-xl mx-auto">
            Explore the diverse roles and departments where you can make an impact at Lavender.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {OPPORTUNITIES.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              custom={i}
              className="group bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60 hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-champagne-light/80 flex items-center justify-center mb-3 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                <item.icon size={20} className="text-primary" />
              </div>
              <h4 className="font-display font-semibold text-gray-900 text-sm mb-1.5 leading-snug">{item.title}</h4>
              <p className="font-body text-xs text-gray-500 leading-relaxed mb-3">{item.desc}</p>
              <button
                onClick={scrollToApply}
                className="inline-flex items-center gap-1 font-body text-xs font-semibold text-primary hover:text-gold transition-colors"
              >
                Apply Now →
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
