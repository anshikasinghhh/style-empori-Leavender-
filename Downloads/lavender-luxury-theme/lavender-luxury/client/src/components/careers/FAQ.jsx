import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const FAQS = [
  {
    q: 'Do I need prior experience?',
    a: 'Not necessarily. While experience is valued for senior roles, we also welcome freshers and early-career professionals who are passionate, eager to learn, and aligned with our values. Many of our team members started their journey at Lavender with little to no experience.',
  },
  {
    q: 'Can freshers apply?',
    a: 'Absolutely! We encourage freshers to apply. Lavender is a great place to start your career, learn from experienced professionals, and grow within the company. We believe in nurturing talent and providing opportunities regardless of experience level.',
  },
  {
    q: 'Is a portfolio mandatory?',
    a: 'A portfolio is required for creative roles such as Graphic Design, Photography, Videography, and Content Creation. For other roles, it\'s optional but always welcome — it helps us better understand your skills and creative approach.',
  },
  {
    q: 'How long does the hiring process take?',
    a: 'The hiring process typically takes 1–3 weeks depending on the role and number of applicants. After you submit your application, our team will review it and reach out if your profile is shortlisted. We aim to keep candidates informed at every stage.',
  },
  {
    q: 'Can I apply for multiple positions?',
    a: 'Yes, you can express interest in multiple roles in your application. However, we recommend focusing on the positions that best match your skills and experience. During the interview process, we\'ll discuss where you could be the best fit.',
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-gold-pale/60 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-display font-semibold text-gray-900 text-sm md:text-base pr-4 group-hover:text-primary transition-colors">
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 w-8 h-8 rounded-full bg-champagne-light flex items-center justify-center group-hover:bg-primary/10 transition-colors"
        >
          <ChevronDown size={16} className="text-primary" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-gray-500 leading-relaxed pb-5 pr-12">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-12"
        >
          <p className="section-tag mb-2">Got Questions?</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-card border border-gold-pale/60 px-6 md:px-8">
            {FAQS.map((item, i) => (
              <FaqItem
                key={i}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
