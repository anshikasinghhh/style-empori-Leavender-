import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, MessageSquare, CheckCircle, PartyPopper } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' },
  }),
};

const STEPS = [
  { icon: FileText, step: 'Step 1', title: 'Submit Resume', desc: 'Send your resume and introduction via email' },
  { icon: Search, step: 'Step 2', title: 'Application Review', desc: 'Our team reviews your profile and qualifications' },
  { icon: MessageSquare, step: 'Step 3', title: 'Interview Process', desc: 'Shortlisted candidates are invited for interviews' },
  { icon: CheckCircle, step: 'Step 4', title: 'Final Selection', desc: 'Final evaluation and offer discussion' },
  { icon: PartyPopper, step: 'Step 5', title: 'Welcome to Lavender', desc: 'Onboarding and beginning your journey with us' },
];

export default function HiringProcess() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="section-tag mb-2">How It Works</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
            Application Process
          </h2>
          <p className="font-body text-gray-500 mt-3 max-w-lg mx-auto">
            A simple and transparent hiring process designed to help us find the best fit for both you and Lavender.
          </p>
        </motion.div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-gold-pale via-primary/30 to-gold-pale" />

            <div className="grid grid-cols-5 gap-4 relative">
              {STEPS.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step circle */}
                  <div className="w-24 h-24 rounded-full bg-white shadow-card border-2 border-gold-pale flex flex-col items-center justify-center mb-4 relative z-10 group hover:border-primary/40 hover:shadow-hover transition-all duration-300">
                    <item.icon size={28} className="text-primary" />
                  </div>
                  <span className="font-accent text-xs text-gold italic mb-1">{item.step}</span>
                  <h4 className="font-display font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="font-body text-[11px] text-gray-500 leading-relaxed px-2">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Vertical Timeline */}
        <div className="lg:hidden">
          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-pale via-primary/30 to-gold-pale" />

            {STEPS.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="relative flex items-start gap-4 mb-8 last:mb-0"
              >
                {/* Step dot */}
                <div className="absolute -left-8 w-8 h-8 rounded-full bg-white shadow-card border-2 border-gold-pale flex items-center justify-center z-10">
                  <item.icon size={14} className="text-primary" />
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-card border border-gold-pale/60 flex-1 ml-4">
                  <span className="font-accent text-xs text-gold italic">{item.step}</span>
                  <h4 className="font-display font-semibold text-gray-900 text-sm mt-1">{item.title}</h4>
                  <p className="font-body text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
