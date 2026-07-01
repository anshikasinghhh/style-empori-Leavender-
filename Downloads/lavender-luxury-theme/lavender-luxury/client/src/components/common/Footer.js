import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { CATEGORIES } from '../../utils/data';
import logo from '../../assets/logo.jpeg';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-plum via-primary to-primary-light text-white mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,192,106,0.12),transparent_45%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/30 bg-white/15 shadow-[0_0_20px_rgba(255,215,0,0.25)] backdrop-blur-xl">
                <img src={logo} alt="Lavender Logo" className="h-full w-full object-cover" />
              </div>
              <div><p className="font-display font-bold text-white">Lavender <span className="text-gold">✦</span></p><p className="font-accent text-gold/60 text-xs italic tracking-widest">The Style Emporio</p></div>
            </div>
            <p className="font-body text-white/60 text-sm leading-relaxed mb-5">Celebrating India's rich textile heritage through premium ethnic fashion. Crafted with love, delivered with care.</p>
            <div className="flex gap-2.5">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Icon size={16}/></button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {['About Us','Careers','Press & Media','Sustainability','Gift Cards','Our Artisans'].map(item => (
                <li key={item}><Link to="#" className="font-body text-white/60 hover:text-white text-sm transition-colors hover:pl-1.5 inline-block">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map(item => (
                <li key={item.slug}><Link to={`/products?category=${item.slug}`} className="font-body text-white/60 hover:text-white text-sm transition-colors hover:pl-1.5 inline-block">{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Contact</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-white/60 text-sm font-body"><MapPin size={15} className="mt-0.5 shrink-0 text-gold"/>Fashion District, Bandra, Mumbai 400050</li>
              <li className="flex items-center gap-3 text-white/60 text-sm font-body"><Phone size={15} className="shrink-0 text-gold"/>+91 98765 43210</li>
              <li className="flex items-center gap-3 text-white/60 text-sm font-body"><Mail size={15} className="shrink-0 text-gold"/>hello@lavender-styleemporio.in</li>
            </ul>
            <h4 className="font-display font-semibold text-sm mb-3">Newsletter</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 font-body"/>
              <button className="px-4 py-2.5 bg-primary rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors font-body whitespace-nowrap">Go</button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-white/40 text-xs">© 2025 Lavender. All rights reserved.</p>
          <div className="flex items-center gap-1 font-body text-white/40 text-xs">Made with <Heart size={11} className="text-rose fill-rose mx-1"/> for ethnic fashion lovers</div>
          <div className="flex gap-4">{['Privacy Policy','Terms of Service','Returns Policy'].map(item => <Link key={item} to="#" className="font-body text-white/40 hover:text-white text-xs transition-colors">{item}</Link>)}</div>
        </div>
      </div>
    </footer>
  );
}
