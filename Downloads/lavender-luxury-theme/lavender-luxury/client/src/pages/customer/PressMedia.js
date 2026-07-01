import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Mail, FileImage, BookOpen, Camera, Image, Users, UserCircle,
  FileText, Download, Newspaper, Tv, Mic, Star, Sparkles, Heart, Globe,
  Megaphone, Trophy, Award, TrendingUp, PartyPopper, Building2, Palette,
  Scissors, Video, Quote, BarChart3, Calendar, Send, ChevronRight, ExternalLink
} from 'lucide-react';

/* ─── Animation Variants ────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: 'easeOut' } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

/* ─── Reusable Section Wrapper ──────────────────────────────── */
function Section({ children, className = '', dark = false }) {
  return (
    <section className={`py-16 md:py-20 ${dark ? 'bg-gradient-to-br from-plum via-primary to-primary-light text-white' : ''} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function SectionTitle({ tag, title, subtitle, center = true }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
      className={`mb-12 ${center ? 'text-center' : ''}`}>
      {tag && <p className="section-tag mb-2">{tag}</p>}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{title}</h2>
      {subtitle && <p className="font-body text-gray-500 mt-3 max-w-2xl mx-auto">{subtitle}</p>}
    </motion.div>
  );
}

/* ─── 1. Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <div className="relative min-h-[70vh] flex items-center overflow-hidden mt-16 lg:mt-20">
      <div className="absolute inset-0">
        <img src="/images/photo2forbanner.png" alt="Lavender Fashion"
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-plum/90 via-primary/70 to-transparent" />
      </div>
      <div className="relative z-10 w-full px-2 sm:px-4 lg:px-6 py-28 flex justify-start">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="max-w-2xl w-full text-left ml-0 sm:ml-0 md:ml-0 lg:ml-0">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <Sparkles size={13} className="text-gold-shine" />
            <span className="font-accent text-white/90 text-sm italic">Press & Media Center</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            Welcome to the<br />Lavender Press Center
          </h1>
          <p className="font-body text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            Lavender is an emerging fashion brand founded on 4 January 2023, dedicated to offering stylish, comfortable,
            and premium-quality clothing at affordable prices. We're redefining modern fashion with purpose and confidence.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:media@yourlavenderdomain.com"
              className="inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-full font-body font-bold hover:bg-gold-shine hover:text-gray-900 transition-all hover:scale-105 shadow-lg">
              Contact Media Team <ArrowRight size={17} />
            </a>
            <Link to="/products"
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-7 py-3.5 rounded-full font-body font-semibold hover:bg-white/10 transition-all backdrop-blur-sm">
              Explore Collection <ExternalLink size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── 2. About Lavender ─────────────────────────────────────── */
function About() {
  return (
    <Section>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="relative">
          <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=85" alt="Lavender Fashion"
            className="rounded-3xl w-full h-[420px] object-cover shadow-premium" />
          <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60">
            <p className="font-display text-3xl font-bold text-primary">2023</p>
            <p className="font-body text-xs text-gray-500">Founded</p>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="section-tag mb-3">Our Story</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
            Fashion with Purpose,<br />Style with Confidence
          </h2>
          <p className="font-body text-gray-600 leading-relaxed mb-4">
            Founded on 4 January 2023, Lavender is a fashion brand dedicated to offering stylish, comfortable,
            and premium-quality clothing at affordable prices.
          </p>
          <p className="font-body text-gray-600 leading-relaxed mb-4">
            We believe fashion is a reflection of confidence and individuality, which is why every collection is
            thoughtfully curated to blend modern trends with exceptional craftsmanship.
          </p>
          <p className="font-body text-gray-600 leading-relaxed mb-6">
            Serving customers internationally, we offer a growing range of women's wear, kids' wear, and infant
            essentials, with plans to expand into new lifestyle collections and global markets.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[['Global', 'Reach'], ['100%', 'Quality'], ['Premium', 'Craftsmanship']].map(([n, l]) => (
              <div key={l} className="text-center bg-champagne-light/80 rounded-xl p-3 border border-gold-pale/40">
                <p className="font-display text-xl font-bold text-primary">{n}</p>
                <p className="font-body text-[10px] text-gray-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─── 3. Media Inquiries ────────────────────────────────────── */
function MediaInquiries() {
  return (
    <Section className="bg-champagne-light/60">
      <SectionTitle tag="Media Inquiries" title="Let's Work Together"
        subtitle="We welcome inquiries from journalists, editors, influencers, photographers, and media organizations." />
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-card border border-gold-pale/60 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-6 shadow-card">
            <Mail size={28} className="text-white" />
          </div>
          <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">Press & Media Contact</h3>
          <p className="font-body text-gray-600 mb-6 leading-relaxed max-w-lg mx-auto">
            For press releases, interview requests, product reviews, collaboration proposals, or any media-related
            inquiries, please reach out to our dedicated media team.
          </p>
          <div className="inline-flex items-center gap-2 bg-champagne-light/80 border border-gold-pale rounded-full px-6 py-3 mb-6">
            <Mail size={16} className="text-primary" />
            <span className="font-body font-semibold text-primary text-sm">media@yourlavenderdomain.com</span>
          </div>
          <div>
            <a href="mailto:media@yourlavenderdomain.com"
              className="btn-primary text-base px-8 py-4 gap-2">
              Send Email <Send size={16} />
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

/* ─── 4. Brand Assets ───────────────────────────────────────── */
const BRAND_ASSETS = [
  { icon: FileImage, title: 'Official Logo', desc: 'High-res logo files in SVG, PNG, and EPS formats' },
  { icon: BookOpen, title: 'Brand Guidelines', desc: 'Typography, color palette, usage rules and more' },
  { icon: Image, title: 'Product Images', desc: 'Professional product photography for editorial use' },
  { icon: Camera, title: 'Campaign Photography', desc: 'Seasonal campaign and lookbook imagery' },
  { icon: Building2, title: 'Company Profile', desc: 'Overview of our mission, values, and vision' },
  { icon: UserCircle, title: 'Founder Information', desc: 'Founder bio, headshots, and quotes' },
  { icon: FileText, title: 'Press Releases', desc: 'Latest official announcements and updates' },
  { icon: Download, title: 'Media Kit', desc: 'Complete press kit with all brand materials' },
];

function BrandAssets() {
  return (
    <Section>
      <SectionTitle tag="Resources" title="Brand Assets"
        subtitle="Everything you need to feature Lavender in your publication or content." />
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {BRAND_ASSETS.map((item, i) => (
          <motion.div key={item.title} variants={fadeUp} custom={i}
            className="group bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 hover:shadow-hover hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-champagne-light/80 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
              <item.icon size={24} className="text-primary" />
            </div>
            <h4 className="font-display font-semibold text-gray-900 text-sm mb-1.5">{item.title}</h4>
            <p className="font-body text-xs text-gray-500 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ─── 5. Collaboration Opportunities ────────────────────────── */
const COLLABS = [
  { icon: Newspaper, title: 'Fashion Magazines', desc: 'Editorial features and cover stories' },
  { icon: FileText, title: 'Newspapers', desc: 'News coverage and brand profiles' },
  { icon: Tv, title: 'Television', desc: 'TV appearances and fashion segments' },
  { icon: Globe, title: 'Digital Publications', desc: 'Online articles and blog features' },
  { icon: Mic, title: 'Podcasts', desc: 'Founder interviews and fashion talks' },
  { icon: Heart, title: 'Influencers', desc: 'Product collaborations and reviews' },
  { icon: Star, title: 'Brand Ambassadors', desc: 'Long-term partnership programs' },
  { icon: Palette, title: 'Stylists', desc: 'Styling partnerships and lookbooks' },
  { icon: Camera, title: 'Fashion Photographers', desc: 'Campaign and editorial shoots' },
  { icon: PartyPopper, title: 'Event Organizers', desc: 'Fashion shows and pop-up events' },
];

function Collaborations() {
  return (
    <Section className="bg-champagne-light/60">
      <SectionTitle tag="Partnerships" title="Collaboration Opportunities"
        subtitle="We love working with creative minds across the fashion and media industry." />
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {COLLABS.map((item, i) => (
          <motion.div key={item.title} variants={fadeUp} custom={i}
            className="group relative bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60 hover:shadow-hover hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-champagne-light/80 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <item.icon size={20} className="text-primary" />
              </div>
              <h4 className="font-display font-semibold text-gray-900 text-xs mb-1">{item.title}</h4>
              <p className="font-body text-[10px] text-gray-500">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ─── 6. Awards & Recognition ───────────────────────────────── */
const AWARDS = [
  { icon: Trophy, title: 'Industry Awards', desc: 'Recognition for excellence in fashion and design' },
  { icon: TrendingUp, title: 'Business Achievements', desc: 'Growth milestones and business accomplishments' },
  { icon: Award, title: 'Fashion Recognition', desc: 'Acknowledgements from the fashion community' },
  { icon: Heart, title: 'Customer Milestones', desc: 'Celebrating our community and their love for fashion' },
  { icon: Megaphone, title: 'Company Announcements', desc: 'Major updates and strategic developments' },
  { icon: Globe, title: 'International Expansion', desc: 'Updates on our global growth journey' },
];

function Awards() {
  return (
    <Section className="bg-[#fdf7ed] border-y border-gold-pale/70">
      <SectionTitle tag="Recognition" title="Awards & Recognition"
        subtitle="This section will feature our future achievements, milestones, and industry recognition." />
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {AWARDS.map((item, i) => (
          <motion.div key={item.title} variants={fadeUp} custom={i}
            className="group bg-white rounded-2xl p-6 border border-gold-pale/60 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-champagne-light/80 flex items-center justify-center mb-4 group-hover:bg-gold-light/20 transition-colors">
              <item.icon size={22} className="text-primary" />
            </div>
            <h4 className="font-display font-semibold text-gray-900 text-sm mb-1.5">{item.title}</h4>
            <p className="font-body text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            <div className="mt-3 flex items-center gap-1 font-body text-[10px] text-primary/70 font-medium">
              <span>Coming Soon</span>
              <ChevronRight size={10} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ─── 7. Latest News ────────────────────────────────────────── */
const NEWS = [
  { tag: 'Coming Soon', title: 'Stay Tuned for Exciting Updates', desc: 'We\'re preparing something special. Follow us for the latest news and announcements from Lavender.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { tag: 'Product Launch', title: 'New Collections on the Horizon', desc: 'Our design team is crafting stunning new collections that blend tradition with contemporary style.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' },
  { tag: 'Announcement', title: 'Growing Our Global Presence', desc: 'Lavender is expanding internationally, bringing premium ethnic fashion to customers worldwide.', image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600&q=80' },
];

function LatestNews() {
  return (
    <Section>
      <SectionTitle tag="Stay Updated" title="Latest News"
        subtitle="Press releases, product launches, and company updates." />
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-6">
        {NEWS.map((item, i) => (
          <motion.article key={item.title} variants={fadeUp} custom={i}
            className="group bg-white rounded-2xl overflow-hidden shadow-card border border-gold-pale/60 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
            <div className="relative aspect-[16/10] overflow-hidden bg-champagne-light">
              <img src={item.image} alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-3 left-3 bg-primary text-white font-body text-[10px] font-bold px-3 py-1 rounded-full">
                {item.tag}
              </span>
            </div>
            <div className="p-5">
              <h4 className="font-display font-semibold text-gray-900 text-base mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
              <p className="font-body text-sm text-gray-500 leading-relaxed mb-4">{item.desc}</p>
              <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-primary">
                Read More <ArrowRight size={12} />
              </span>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}

/* ─── 8. Press Resources ────────────────────────────────────── */
const RESOURCES = [
  { icon: Building2, title: 'Company Background', desc: 'History, mission, and vision' },
  { icon: Quote, title: 'Executive Quotes', desc: 'Statements from leadership' },
  { icon: Camera, title: 'High-Res Photography', desc: 'Professional product shots' },
  { icon: BookOpen, title: 'Brand Story', desc: 'Our journey and values' },
  { icon: BarChart3, title: 'Company Statistics', desc: 'Key metrics and growth data' },
  { icon: Megaphone, title: 'Official Announcements', desc: 'Press releases and statements' },
  { icon: Palette, title: 'Marketing Materials', desc: 'Banners, ads, and assets' },
  { icon: Calendar, title: 'Event Information', desc: 'Upcoming shows and events' },
];

function PressResources() {
  return (
    <Section className="bg-champagne-light/60">
      <SectionTitle tag="Press Kit" title="Press Resources"
        subtitle="Quick access to essential materials for journalists and content creators." />
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {RESOURCES.map((item, i) => (
          <motion.div key={item.title} variants={fadeUp} custom={i}
            className="group bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60 hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-champagne-light/80 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
              <item.icon size={18} className="text-primary" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-gray-900 text-sm mb-0.5">{item.title}</h4>
              <p className="font-body text-[11px] text-gray-500">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ─── 9. Final CTA ──────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-6 md:py-8 bg-primary-50 -mb-20 relative z-30 mx-8 sm:mx-12 lg:mx-24 rounded-2xl shadow-sm border border-primary-100/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="text-center max-w-md mx-auto">
        <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={20} className="text-primary" />
        </div>
        <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Interested in Covering Lavender?
        </h2>
        <p className="font-body text-gray-500 text-xs leading-relaxed mb-4 max-w-sm mx-auto">
          Whether you're a journalist, blogger, influencer, or content creator — we'd love to collaborate.
          Reach out to our media team for press kits, interviews, and more.
        </p>
        <a href="mailto:media@yourlavenderdomain.com"
          className="btn-primary px-6 py-2.5 text-xs">
          Contact Media Team <ArrowRight size={13} />
        </a>
        <p className="font-body text-gray-400 text-[10px] mt-2">
          media@yourlavenderdomain.com
        </p>
      </motion.div>
      </div>
    </section>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function PressMediaPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <MediaInquiries />
      <BrandAssets />
      <Collaborations />
      <Awards />
      <LatestNews />
      <PressResources />
      <FinalCTA />
    </div>
  );
}
