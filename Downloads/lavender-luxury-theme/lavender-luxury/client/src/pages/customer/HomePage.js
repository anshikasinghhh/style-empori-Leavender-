import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../utils/api";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Star, Truck, Shield, RefreshCw, Gift } from 'lucide-react';
import { ProductCard, SkeletonCard, SectionHeader } from '../../components/common/LoadingSpinner';
import { CATEGORIES, PRODUCTS, TESTIMONIALS, HERO_BANNERS, TRUST_BADGES, formatPrice } from '../../utils/data';
// import aboutStory from "../../images/about-story.png";
/* ─── Hero Carousel ──────────────────────────────────────────── */
function HeroCarousel() {
  const [cur, setCur] = useState(0);
  useEffect(() => { const t = setInterval(() => setCur(c => (c+1) % HERO_BANNERS.length), 5500); return () => clearInterval(t); }, []);
  const prev = () => setCur(c => (c-1+HERO_BANNERS.length) % HERO_BANNERS.length);
  const next = () => setCur(c => (c+1) % HERO_BANNERS.length);
  const b = HERO_BANNERS[cur];
  const [products, setProducts] = useState([]);
  useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  try {
    const res = await api.get("/products");

    if (res.data.success) {
      setProducts(res.data.products);
    }
  } catch (err) {
    console.error("Failed to load products", err);
  }
};

  return (
    <div className="relative overflow-hidden rounded-3xl mx-3 sm:mx-6 mt-20 lg:mt-24 mb-8 h-[420px] md:h-[560px] lg:h-[600px] shadow-premium">
      <AnimatePresence mode="wait">
        <motion.div key={b.id} initial={{ opacity:0, scale:1.04 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} transition={{ duration:0.75 }} className="absolute inset-0">
          <img src={b.image} alt={b.title} className="w-full h-full object-cover object-top"/>
          <div className={`absolute inset-0 bg-gradient-to-r ${b.gradient}`}/>
          <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24">
            <motion.div initial={{ x:-40, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ delay:0.25, duration:0.6 }} className="max-w-xl">
              <div className="mb-4">
                <span className="font-accent text-white/90 text-sm italic">{b.subtitle}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">{b.title}</h1>
              <p className="font-body text-white/80 text-base md:text-lg leading-relaxed max-w-md">{b.description}</p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"><ChevronLeft size={20}/></button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"><ChevronRight size={20}/></button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_BANNERS.map((_,i) => <button key={i} onClick={() => setCur(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i===cur ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}/>)}
      </div>
    </div>
  );
}

/* ─── Trust Banner ───────────────────────────────────────────── */
function TrustBanner() {
  return (
    <div className="bg-gradient-to-r from-champagne-light via-champagne to-champagne-light border-y border-gold-pale overflow-hidden">
      <div className="flex items-center py-3">
        <div className="flex gap-10 px-6 marquee-track">
          {[...TRUST_BADGES, ...TRUST_BADGES].map((b, i) => (
            <div key={i} className="flex items-center gap-2.5 shrink-0">
              <span className="text-xl">{b.icon}</span>
              <div>
                <p className="font-body font-semibold text-gray-800 text-xs whitespace-nowrap">{b.title}</p>
                <p className="font-body text-gray-500 text-[10px] whitespace-nowrap">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Flash Sale Timer ───────────────────────────────────────── */
function FlashSaleTimer() {
  const [sale, setSale] = useState(null);
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    api.get('/flash-sales/active').then(res => {
      if (res.data) setSale(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!sale?.endDate) return;
    const update = () => {
      const diff = new Date(sale.endDate) - new Date();
      if (diff <= 0) { setT({ h: 0, m: 0, s: 0 }); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setT({ h, m, s });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [sale]);

  const pad = n => String(n).padStart(2, '0');
  const Block = ({ v, l }) => (
    <div className="text-center">
      <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-md border border-gold-shine/30 rounded-xl flex items-center justify-center shadow-[0_8px_30px_rgba(45,8,69,0.35)]">
        <span className="font-display text-2xl md:text-3xl font-bold text-gold-shine">{pad(v)}</span>
      </div>
      <p className="font-body text-white/80 text-[10px] mt-1 uppercase tracking-widest">{l}</p>
    </div>
  );
  return (
    <section className="mx-3 sm:mx-6 my-12">
      <div className="relative overflow-hidden rounded-3xl shadow-premium">
        <div className="absolute inset-0 bg-gradient-to-br from-plum via-primary to-primary-light" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,192,106,0.14),transparent_45%)]" />
        <div className="absolute inset-0 opacity-15">
          {[...Array(4)].map((_, i) => <div key={i} className="absolute rounded-full border border-gold-shine/20" style={{ width: `${(i + 1) * 200}px`, height: `${(i + 1) * 200}px`, top: '50%', left: '30%', transform: 'translate(-50%,-50%)' }} />)}
        </div>
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 p-8 md:p-12">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-gold-shine/25 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
              <Zap size={14} className="text-gold-shine fill-gold-shine" /><span className="font-body text-white/90 text-sm font-semibold">Limited Time Only</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">{sale?.name || 'Flash Sale'}</h2>
            <p className="font-body text-white/80 mb-1">{sale?.bannerText || (sale?.discountPercent ? `Up to ${sale.discountPercent}% off on selected styles` : 'Up to 48% off on selected styles')}</p>
            {sale?.products?.length > 0 && <p className="font-accent text-gold-shine text-lg italic">"{sale.products[0].name}" & more →</p>}
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Block v={t.h} l="Hours" /> <span className="font-display text-3xl font-bold text-white/60 -mt-5">:</span>
            <Block v={t.m} l="Mins" />  <span className="font-display text-3xl font-bold text-white/60 -mt-5">:</span>
            <Block v={t.s} l="Secs" />
          </div>
          <Link to="/products?isFlashSale=true" className="btn-gold whitespace-nowrap text-base">
            Shop Flash Sale <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────── */
function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <SectionHeader title="Stories from Our Family" subtitle="Real reviews, real love"/>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TESTIMONIALS.slice(0,6).map((t,i) => (
          <motion.div key={t.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
            className="bg-white rounded-2xl p-6 shadow-card hover:shadow-hover transition-all border border-gold-pale/60/60">
            <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(s => <Star key={s} size={14} className={s<=t.rating ? 'text-gold-light fill-gold-light':'text-gray-100 fill-gray-100'}/>)}</div>
            <p className="font-accent text-gray-600 text-base leading-relaxed mb-5 italic">"{t.review}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-sm shadow-sm">{t.avatar}</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-body font-semibold text-gray-900 text-sm">{t.name}</p>
                  {t.verified && <span className="badge-emerald text-[10px]">✓ Verified</span>}
                </div>
                <p className="font-body text-gray-400 text-xs">{t.city} · {t.product}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Brand Story ────────────────────────────────────────────── */
function BrandStory() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="relative bg-gradient-to-br from-champagne-light via-champagne-light to-rose-soft rounded-3xl p-10 md:p-16 overflow-hidden">
        <div className="relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-tag mb-3 text-sm font-semibold uppercase tracking-[0.2em]">About Us</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-gray-900 mb-5 leading-tight">Fashion with Purpose,<br/>Style with Confidence</h2>
            <p className="font-body text-gray-600 leading-relaxed mb-4">Founded on 4 January 2023, Lavender is a fashion brand dedicated to offering stylish, comfortable, and premium-quality clothing at affordable prices.</p>
            <p className="font-body text-gray-600 leading-relaxed mb-4">We believe fashion is a reflection of confidence and individuality, which is why every collection is thoughtfully curated to blend modern trends with exceptional craftsmanship.</p>
            <p className="font-body text-gray-600 leading-relaxed mb-8">Serving customers internationally, we offer a growing range of women's wear, kids' wear, and infant essentials, with plans to expand into new lifestyle collections and global markets. As a legally registered business, we are committed to quality, transparency, sustainability, and delivering an outstanding shopping experience. At Lavender, our mission is to create timeless fashion that inspires confidence and builds lasting relationships with our customers.</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[['2023','Founded'],['Global','Serving Customers'],['100%','Committed to Quality']].map(([n,l]) => (
                <div key={l} className="text-center bg-white/60 rounded-xl p-3 shadow-sm">
                  <p className="font-display text-2xl font-bold text-primary">{n}</p>
                  <p className="font-body text-xs text-gray-500 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            <Link to="/products" className="btn-primary gap-2">Explore Collection <ArrowRight size={16}/></Link>
          </div>
          <div className="grid grid-cols-[0.9fr_1fr] gap-3 items-center">
            <img src="/images/about-story.png" alt="Artisan weaving" className="rounded-2xl w-full h-[220px] md:h-[260px] object-cover shadow-card my-3"/>
            <div className="flex flex-col gap-3">
              <img src="/images/photo2.png" alt="Jewelry craft" className="rounded-2xl w-full h-48 object-cover shadow-card"/>
              <img src="/images/photo3.png" alt="Fabric detail" className="rounded-2xl w-full h-48 object-cover shadow-card"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Newsletter ─────────────────────────────────────────────── */
function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); if(email) { setSent(true); } };
  return (
    <section className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-3xl p-10 md:p-14 shadow-card border border-gold-pale/60">
        <div className="w-14 h-14 rounded-2xl bg-champagne-light/80 flex items-center justify-center mx-auto mb-5 shadow-card"><Gift size={26} className="text-primary"/></div>
        <p className="section-tag mb-2">Stay Connected</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">Get 10% Off Your First Order</h2>
        <p className="font-body text-gray-500 text-sm mb-7">Subscribe for exclusive offers, new arrivals and style inspiration.</p>
        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="font-body font-semibold text-emerald-700">🎉 You're in! Check your inbox for your 10% discount code.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 input-field text-sm" required/>
            <button type="submit" className="btn-primary px-6 whitespace-nowrap">Subscribe</button>
          </form>
        )}
        <p className="font-body text-xs text-gray-400 mt-4">No spam, ever. Unsubscribe any time.</p>
      </div>
    </section>
  );
}

/* ─── Main Home Page ─────────────────────────────────────────── */
export default function HomePage() {
  const [products, setProducts] = useState([]);

useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  try {
    const res = await api.get("/products");
     console.log("MongoDB Products:", res.data.products);


    if (res.data.success) {
       console.log("Products from MongoDB:", res.data.products);
      setProducts(res.data.products);
    }
  } catch (err) {
    console.error(err);
  }
};
  // const featured  = PRODUCTS.filter(p => p.isFeatured);
  // const newArrivals = PRODUCTS.filter(p => p.isNewArrival);
  // const bestSellers = PRODUCTS.filter(p => p.isBestSeller);
  // const festive   = PRODUCTS.filter(p => p.isFestival);
const featured = products.filter(p => p.isFeatured);
const newArrivals = products.filter(p => p.isNewArrival);
const bestSellers = products.filter(p => p.isBestSeller);
const festive = products.filter(p => p.isFestival);
  return (
    <div className="min-h-screen">
      <HeroCarousel/>
      <TrustBanner/>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <SectionHeader title="Shop by Category" subtitle="Find your perfect style"/>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3">
          {CATEGORIES.map((cat,i) => (
            <motion.div key={cat._id} initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.04 }} whileHover={{ scale:1.04 }}>
              <Link to={`/products?category=${cat.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all border border-gold-pale/60">
                <div className="aspect-[4/5] overflow-hidden bg-champagne-light">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                </div>
                <div className="px-2.5 py-2 flex items-center gap-1.5" style={{ background: cat.color }}>
                  <span className="text-base leading-none">{cat.icon}</span>
                  <div className="min-w-0">
                    <p className="font-body font-bold text-gray-900 text-[11px] leading-tight truncate">{cat.name}</p>
                    <p className="font-body text-[9px] mt-0.5 hidden sm:block" style={{ color: cat.accent }}>Explore →</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <SectionHeader title="Featured Collection" subtitle="Handpicked for you" center={false}/>
          <Link to="/products?isFeatured=true" className="btn-ghost text-sm hidden md:flex gap-2">View All <ArrowRight size={15}/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i}/>)}
        </div>
      </section>

      <FlashSaleTimer/>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <SectionHeader title="New Arrivals" subtitle="Just landed" center={false}/>
          <Link to="/products?isNewArrival=true" className="btn-ghost text-sm hidden md:flex gap-2">See All <ArrowRight size={15}/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {newArrivals.map((p,i) => <ProductCard key={p._id} product={p} index={i}/>)}
        </div>
      </section>

      {/* Festival Banner */}
      {festive.length > 0 && (
        <section className="mx-3 sm:mx-6 my-12">
          <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 shadow-premium">
            <img src="https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1400&q=90" alt="Festival" className="w-full h-full object-cover object-center"/>
            <div className="absolute inset-0 bg-gradient-to-r from-plum/90 via-primary/60 to-transparent"/>
            <div className="absolute inset-0 flex items-center px-10 md:px-20">
              <div>
                <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-1.5 mb-3"><Sparkles size={13} className="text-gold-shine"/><span className="font-body text-gold-shine text-sm font-semibold">Festival Special</span></div>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">Navratri Collection</h2>
                <p className="font-body text-white/80 mb-6 max-w-sm text-sm md:text-base">Chaniya cholis, mirror work & more — celebrate in style</p>
                <Link to="/products?isFestival=true" className="btn-gold">Shop Festival Wear</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <SectionHeader title="Best Sellers" subtitle="Most loved picks"/>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {bestSellers.map((p,i) => <ProductCard key={p._id} product={p} index={i}/>)}
        </div>
      </section>

      <Testimonials/>
      <BrandStory/>
      <Newsletter/>
    </div>
  );
}
