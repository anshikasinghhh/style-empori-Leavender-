import React from 'react';
import { motion } from 'framer-motion';
import { Mail, FileText, MessageSquare, Briefcase, FolderOpen, Send, Info } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const REQUIREMENTS = [
  { icon: FileText, label: 'Updated Resume', desc: 'Your latest CV or resume in PDF format' },
  { icon: MessageSquare, label: 'Short Introduction', desc: 'Tell us about yourself and your interests' },
  { icon: Briefcase, label: 'Position Applying For', desc: 'Specify the role or department of interest' },
  { icon: FolderOpen, label: 'Portfolio (Optional)', desc: 'Link to your work samples if applicable' },
];

export default function ApplySection() {
  return (
    <section id="apply-section" className="py-16 md:py-20 bg-champagne-light/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="max-w-3xl mx-auto"
        >
          {/* Glass Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-premium border border-gold-pale/60">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-5 shadow-card">
                <Mail size={28} className="text-white" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Apply to Join Our Team
              </h2>
              <p className="font-body text-gray-500 max-w-lg mx-auto">
                We'd love to hear from passionate individuals who want to help shape the future of Lavender.
              </p>
            </div>

            {/* Requirements */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {REQUIREMENTS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 bg-champagne-light/60 rounded-xl p-4 border border-gold-pale/40"
                >
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <item.icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-gray-800 text-sm">{item.label}</p>
                    <p className="font-body text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-champagne-light border border-gold-pale rounded-full px-5 py-2.5 mb-5">
                <Mail size={15} className="text-primary" />
                <span className="font-body font-semibold text-primary text-sm">
                  careers@yourlavenderdomain.com
                </span>
              </div>

              <div>
                <a
                  href="mailto:careers@yourlavenderdomain.com?subject=Application%20for%20Lavender&body=Hi%20Lavender%20Team%2C%0A%0AI%20would%20like%20to%20apply%20for%20the%20position%20of%20..."
                  className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 rounded-full font-body font-bold text-base hover:bg-gold-shine hover:text-gray-900 transition-all hover:scale-105 shadow-lg border border-gold-pale"
                >
                  Apply via Email <Send size={16} />
                </a>
              </div>

              {/* Note */}
              <div className="flex items-start gap-2 mt-6 bg-ivory-warm rounded-xl p-4 border border-gold-pale/30 max-w-lg mx-auto">
                <Info size={14} className="text-gold mt-0.5 shrink-0" />
                <p className="font-body text-xs text-gray-500 leading-relaxed text-left">
                  If there isn't a current opening that matches your profile, you're still welcome to
                  submit your application. We'll keep it on file for future opportunities.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
