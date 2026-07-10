import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { CATEGORIES } from '../../utils/data';
import logo from '../../assets/logo.jpeg';

export default function Footer({ className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFooterLinkClick = (e, to) => {
    e.preventDefault();

    const hashIndex = to.indexOf('#');
    const path = hashIndex !== -1 ? to.substring(0, hashIndex) || '/' : to;
    const hash = hashIndex !== -1 ? to.substring(hashIndex + 1) : '';
    const targetHash = hash ? `#${hash}` : '';

    const scrollToTarget = () => {
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    };

    if (location.pathname === path && location.hash === targetHash) {
      scrollToTarget();
      return;
    }

    navigate(path + targetHash);
    setTimeout(scrollToTarget, 80);
  };

  return (
    <footer className={`relative z-20 overflow-hidden bg-gradient-to-br from-plum via-primary to-primary-light text-white ${className}`}>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(232,192,106,0.12),transparent_45%)]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/30 bg-white/15 shadow-[0_0_20px_rgba(255,215,0,0.25)] backdrop-blur-xl">
                <img src={logo} alt="Lavender Logo" className="h-full w-full object-cover" />
              </div>
              <div><p className="font-display font-bold text-white">Lavender <span className="text-gold">✦</span></p><p className="font-accent text-gold/60 text-xs italic tracking-widest">The Style Emporio</p></div>
            </div>
            <p className="font-body text-white/60 text-sm leading-relaxed mb-5">Celebrating rich textile heritage through premium ethnic fashion. Crafted with love, delivered with care worldwide.</p>
            <div className="flex gap-2.5">
              <a href="https://www.instagram.com/accounts/login/?next=%2Flav_ender_thestyle_emporio&source=omni_redirect" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Instagram size={16}/></a>
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><Icon size={16}/></button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', to: '/#about' },
                { label: 'Careers', to: '/careers' },
                { label: 'Press & Media', to: '/press-media' },
                { label: 'Sustainability', to: '/sustainability' },
                { label: 'Gift Cards', to: '/gift-cards' },
                { label: 'Our Artisans & Craftsmanship', to: '/craftsmanship' },
              ].map(item => (
                <li key={item.label}><Link to={item.to} onClick={(e) => handleFooterLinkClick(e, item.to)} className="font-body text-white/60 hover:text-white text-sm transition-colors hover:pl-1.5 inline-block">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map(item => (
                <li key={item.slug}><Link to={`/products?category=${item.slug}`} onClick={(e) => handleFooterLinkClick(e, `/products?category=${item.slug}`)} className="font-body text-white/60 hover:text-white text-sm transition-colors hover:pl-1.5 inline-block">{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Contact</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-white/60 text-sm font-body">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold"/>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Opposite%2C%20Technopark%20Phase%20III%20Main%20Rd%2C%20Mukkolackal%2C%20Kazhakkoottam%2C%20Thiruvananthapuram%2C%20Kerala%20695582"
                  target="_blank"
                  rel="noreferrer"
                  className="font-body text-white/60 hover:text-white text-sm transition-colors"
                >
                  Opposite, Technopark Phase III Main Rd, Mukkolackal, Kazhakkoottam, Thiruvananthapuram, Kerala 695582
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm font-body">
                <Phone size={15} className="shrink-0 text-gold"/>
                <a href="tel:+918921418188" className="font-body text-white/60 hover:text-white text-sm transition-colors">+91 89214 18188</a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm font-body">
                <Mail size={15} className="shrink-0 text-gold"/>
                <a href="mailto:lavendertsetrading@gmail.com" className="font-body text-white/60 hover:text-white text-sm transition-colors">lavendertsetrading@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="font-body text-white/40 text-xs">© 2025 Lavender. All rights reserved.</p>
          <div className="flex items-center gap-1 font-body text-white/40 text-xs">Made with <Heart size={11} className="text-rose fill-rose mx-1"/> for ethnic fashion lovers</div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">{[
            { label: 'Privacy Policy', to: '/press-media' },
            { label: 'Terms of Service', to: '/press-media' },
            { label: 'Returns Policy', to: '/products' },
          ].map(item => <Link key={item.label} to={item.to} onClick={(e) => handleFooterLinkClick(e, item.to)} className="font-body text-white/40 hover:text-white text-xs transition-colors">{item.label}</Link>)}</div>
        </div>
      </div>
    </footer>
  );
}
