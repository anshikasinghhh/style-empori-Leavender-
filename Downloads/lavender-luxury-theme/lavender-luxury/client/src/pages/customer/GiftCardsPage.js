import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Gift, Calendar, Mail, CheckCircle, Coins, Ruler, ArrowRight,
  ShoppingCart, MailOpen, Share2, CreditCard, Building2, Send,
  ChevronDown, Sparkles, Heart, PartyPopper, GraduationCap, Star,
  Baby, Briefcase, Users, Crown, XCircle, Globe, Banknote, AlertTriangle
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import bgcards from '../../assets/bgcards.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const DEFAULT_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const WHY_CARDS = [
  { icon: Heart, title: 'Recipient Chooses What They Love', desc: 'Let them pick the perfect style from our entire collection.' },
  { icon: Calendar, title: 'Perfect for Every Occasion', desc: 'Birthdays, anniversaries, festivals — always the right gift.' },
  { icon: Mail, title: 'Digital Delivery', desc: 'Instantly delivered to their email with a personal message.' },
  { icon: CheckCircle, title: 'Easy Checkout Redemption', desc: 'Simple code entry at checkout to apply the balance.' },
  { icon: Coins, title: 'Multiple Gift Values', desc: 'Choose from ₹500 to ₹10,000 to suit every budget.' },
  { icon: Ruler, title: 'No Size Guessing', desc: 'No more worrying about sizes — they choose what fits.' },
];

const OCCASIONS = [
  'Birthdays', 'Anniversary', 'Wedding', 'Diwali', 'Christmas', 'Graduation',
  "Mother's Day", "Father's Day", 'Baby Shower', "Valentine's Day", 'Corporate Gifts',
  'Employee Rewards', 'Housewarming', 'Thank You', 'Retirement', 'New Year', 'Events',
];

const TIMELINE = [
  { icon: ShoppingCart, title: 'Purchase', desc: 'Select an amount and buy a gift card' },
  { icon: MailOpen, title: 'Receive Email', desc: 'Recipient gets the code via email' },
  { icon: Share2, title: 'Share', desc: 'Share the joy of choosing their own style' },
  { icon: CreditCard, title: 'Redeem', desc: 'Apply the code at checkout to pay' },
];

const TERMS = [
  { title: 'Non-Refundable', desc: 'Gift cards are non-refundable and cannot be returned for cash or credit once purchased.' },
  { title: 'Website Only', desc: 'Gift cards can only be redeemed on our website during the checkout process.' },
  { title: 'Balance Remains Valid', desc: 'If the gift card value exceeds the order amount, the remaining balance stays on the card for future use until expiry.' },
  { title: 'Cannot Exchange for Cash', desc: 'Gift cards cannot be exchanged for cash, transferred to another card, or used as payment outside our platform.' },
  { title: 'Lost or Stolen Cards', desc: 'We are not responsible for lost or stolen gift card codes. Please keep your code secure. Contact support if you believe your card has been compromised.' },
];

/* ═══════════════════════════════════════════════════════════
   SECTION 1 — HERO
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  const scrollToPurchase = () => {
    document.getElementById('gift-card-purchase')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section
      className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20 mt-16 lg:mt-20"
      style={{ backgroundImage: `url(${bgcards})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#efe4ff]/70 via-[#f7ebff]/55 to-white/65" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {/* Gift box illustration */}
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/15">
            <Gift size={36} className="text-primary" />
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={13} className="text-primary" />
            <span className="font-accent text-primary text-sm italic tracking-wide">Gift Cards</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-snug mb-3">
            Lavender Gift Cards
          </h1>
          <p className="font-display text-xl md:text-2xl text-primary/80 font-semibold mb-5">
            The Perfect Gift, Every Time
          </p>
          <p className="font-body text-gray-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Give your loved ones the freedom to choose the styles they truly love with a Lavender Gift Card.
          </p>
          <button onClick={scrollToPurchase}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-body font-bold text-base hover:bg-primary-dark transition-all hover:scale-105 shadow-lg">
            Buy Gift Card <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 2 — WHY CHOOSE
   ═══════════════════════════════════════════════════════════ */
function WhySection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <p className="section-tag mb-2">Benefits</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">Why Choose Lavender Gift Cards</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_CARDS.map((item, i) => (
            <motion.div key={item.title} variants={fadeUp} custom={i}
              className="group bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 hover:shadow-hover hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="w-14 h-14 rounded-2xl bg-champagne-light/80 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                <item.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 text-base mb-2">{item.title}</h3>
              <p className="font-body text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 3 — GIFT CARD VALUES (TIERS)
   ═══════════════════════════════════════════════════════════ */
function ValuesSection({ tiers, selectedAmount, setSelectedAmount, selectedTier }) {
  return (
    <section className="py-16 md:py-20 bg-primary-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <p className="section-tag mb-2">Pricing</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">Gift Card Tiers</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier, i) => {
            const isSelected = selectedAmount === tier.amount;
            return (
              <motion.button key={tier._id || tier.amount} variants={fadeUp} custom={i}
                onClick={() => setSelectedAmount(tier.amount)}
                className={`rounded-2xl p-6 text-left transition-all duration-300 border-2 ${
                  isSelected
                    ? 'text-white shadow-lg scale-[1.02]'
                    : 'bg-white border-gold-pale/60 shadow-card hover:border-primary/40 hover:shadow-hover'
                }`}
                style={isSelected ? { backgroundColor: tier.color || '#6B21A8', borderColor: tier.color || '#6B21A8' } : {}}>
                <p className={`font-display text-3xl font-bold mb-0.5 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  ₹{tier.amount.toLocaleString('en-IN')}
                </p>
                <p className={`font-body text-sm font-semibold mb-1 ${isSelected ? 'text-white/90' : 'text-gray-700'}`}>
                  {tier.name}
                </p>
                {tier.bonusAmount > 0 && (
                  <p className={`font-body text-xs font-bold mb-3 ${isSelected ? 'text-white/80' : 'text-emerald-600'}`}>
                    + ₹{tier.bonusAmount.toLocaleString('en-IN')} Bonus (Worth ₹{(tier.amount + tier.bonusAmount).toLocaleString('en-IN')})
                  </p>
                )}
                {tier.benefits?.length > 0 && (
                  <ul className="space-y-1.5 mt-2">
                    {tier.benefits.map((b, j) => (
                      <li key={j} className={`flex items-start gap-2 text-xs font-body ${isSelected ? 'text-white/85' : 'text-gray-500'}`}>
                        <CheckCircle size={12} className={`mt-0.5 shrink-0 ${isSelected ? 'text-white/70' : 'text-primary'}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 4 — PURCHASE FORM
   ═══════════════════════════════════════════════════════════ */
function PurchaseSection({ tiers, selectedAmount, setSelectedAmount }) {
  const { user, token } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({ recipientName: '', recipientEmail: '', senderName: user?.name || '', personalMessage: '', deliveryDate: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePurchase = async () => {
    if (!selectedAmount) { toast.error('Please select a gift card amount'); return; }
    if (!form.recipientName || !form.recipientEmail || !form.senderName) {
      toast.error('Please fill in all required fields'); return;
    }
    if (!user || !token) {
      toast.error('Please login to purchase a gift card');
      navigate('/login?redirect=/gift-cards');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Razorpay order — use raw axios to avoid 401 interceptor redirect
      const baseURL = process.env.REACT_APP_API_URL || '/api';
      const { data: orderRes } = await axios.post(`${baseURL}/giftcards/create-order`, {
        amount: selectedAmount,
        recipientName: form.recipientName,
        recipientEmail: form.recipientEmail,
        senderName: form.senderName,
        personalMessage: form.personalMessage,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!orderRes.success) throw new Error(orderRes.message);

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error('Failed to load Razorpay SDK');

      const { order: rzpOrder, key } = orderRes;

      const options = {
        key,
        amount: rzpOrder.amount,
        currency: 'INR',
        name: 'Lavender',
        description: `Gift Card — ₹${selectedAmount.toLocaleString('en-IN')}`,
        order_id: rzpOrder.id,
        handler: async function (response) {
          try {
            // Use raw axios (not api instance) to avoid 401 interceptor redirect during payment
            const baseURL = process.env.REACT_APP_API_URL || '/api';
            const { data: verifyRes } = await axios.post(`${baseURL}/giftcards/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: selectedAmount,
              recipientName: form.recipientName,
              recipientEmail: form.recipientEmail,
              senderName: form.senderName,
              personalMessage: form.personalMessage,
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });

            if (verifyRes.success) {
              setSuccess(verifyRes.giftCard);
              toast.success('Gift card purchased successfully!');
              setForm({ recipientName: '', recipientEmail: '', senderName: user?.name || '', personalMessage: '', deliveryDate: '' });
              setSelectedAmount(null);
            } else {
              throw new Error(verifyRes.message);
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            if (err.response?.status === 401) {
              toast.error('Session expired. Please login again to complete your purchase.');
              navigate('/login?redirect=/gift-cards');
            } else {
              toast.error(err.response?.data?.message || err.message || 'Payment verification failed');
            }
            setLoading(false);
          }
        },
        prefill: { name: form.senderName, email: user?.email || '', contact: '' },
        theme: { color: '#6B21A8' },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
          onerror: (err) => {
            console.error('Razorpay error:', err);
            setLoading(false);
            toast.error(err?.reason || 'Payment failed. Please try again.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        setLoading(false);
        toast.error(response.error?.description || 'Payment failed');
      });
      rzp.open();
    } catch (err) {
      console.error('Purchase error:', err);
      if (err.response?.status === 503) {
        toast.error('Payment service is not configured. Please contact support.');
      } else if (err.response?.status === 401) {
        toast.error('Please login to continue');
        navigate('/login?redirect=/gift-cards');
      } else {
        toast.error(err.response?.data?.message || err.message || 'Purchase failed');
      }
      setLoading(false);
    }
  };

  return (
    <section id="gift-card-purchase" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <p className="section-tag mb-2">Purchase</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">Buy a Gift Card</h2>
          </motion.div>

          {/* Success message */}
          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6 text-center">
                <CheckCircle size={32} className="text-emerald-500 mx-auto mb-3" />
                <h3 className="font-display font-bold text-emerald-800 text-lg mb-2">Gift Card Purchased!</h3>
                <p className="font-body text-emerald-700 text-sm mb-2">Code: <span className="font-mono font-bold text-base">{success.giftCode}</span></p>
                <p className="font-body text-emerald-600 text-xs">An email has been sent to {success.recipientEmail}</p>
                <button onClick={() => setSuccess(null)} className="mt-3 text-xs text-emerald-600 underline">Dismiss</button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gold-pale/60">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-body text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Recipient Name *</label>
                <input value={form.recipientName} onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
                  placeholder="Who is this for?" className="input-field text-sm" />
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Recipient Email *</label>
                <input type="email" value={form.recipientEmail} onChange={e => setForm(f => ({ ...f, recipientEmail: e.target.value }))}
                  placeholder="their@email.com" className="input-field text-sm" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-body text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Your Name *</label>
                <input value={form.senderName} onChange={e => setForm(f => ({ ...f, senderName: e.target.value }))}
                  placeholder="Your name" className="input-field text-sm" />
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Delivery Date</label>
                <input type="date" value={form.deliveryDate} onChange={e => setForm(f => ({ ...f, deliveryDate: e.target.value }))}
                  className="input-field text-sm" />
              </div>
            </div>
            <div className="mb-4">
              <label className="font-body text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Personal Message</label>
              <textarea value={form.personalMessage} onChange={e => setForm(f => ({ ...f, personalMessage: e.target.value }))}
                placeholder="Add a personal touch..." rows={3} maxLength={500} className="input-field text-sm resize-none" />
            </div>
            <div className="mb-6">
              <label className="font-body text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Selected Amount</label>
              <div className="flex flex-wrap gap-2">
                {tiers.map(tier => (
                  <button key={tier._id || tier.amount} type="button" onClick={() => setSelectedAmount(tier.amount)}
                    className={`px-4 py-2 rounded-xl text-sm font-body font-semibold border-2 transition-all ${
                      selectedAmount === tier.amount ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600 hover:border-primary/40'
                    }`}>₹{tier.amount.toLocaleString('en-IN')}</button>
                ))}
              </div>
            </div>
            <button onClick={handlePurchase} disabled={loading}
              className="w-full btn-primary py-4 text-base gap-2 justify-center">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Purchase Gift Card {selectedAmount && <span>· ₹{selectedAmount.toLocaleString('en-IN')}</span>}</>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 5 — HOW IT WORKS
   ═══════════════════════════════════════════════════════════ */
function HowItWorksSection() {
  return (
    <section className="py-16 md:py-20 bg-primary-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <p className="section-tag mb-2">Process</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIMELINE.map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-card border border-gold-pale/60 flex items-center justify-center mx-auto mb-4">
                <step.icon size={28} className="text-primary" />
              </div>
              <div className="w-7 h-7 rounded-full bg-primary text-white font-body font-bold text-xs flex items-center justify-center mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-display font-semibold text-gray-900 text-base mb-1">{step.title}</h3>
              <p className="font-body text-sm text-gray-500">{step.desc}</p>
              {i < TIMELINE.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-primary/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 6 — CORPORATE CTA
   ═══════════════════════════════════════════════════════════ */
function CorporateSection() {
  return (
    <section className="py-6 md:py-8 bg-[#f7efff] -mb-20 relative z-30 mx-8 sm:mx-12 lg:mx-24 rounded-2xl shadow-sm border border-[#e7d4ff]/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto">
          <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4 border border-primary/10">
            <Building2 size={20} className="text-primary" />
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Corporate Gift Cards
          </h2>
          <p className="font-body text-gray-500 text-xs leading-relaxed mb-4 max-w-sm mx-auto">
            Bulk orders, employee rewards, corporate gifting, and business promotions.
            Custom solutions tailored to your needs.
          </p>
          <a href="mailto:corporate@yourlavenderdomain.com"
            className="btn-primary px-6 py-2.5 text-xs">
            Contact Sales <Send size={13} />
          </a>
          <p className="font-body text-gray-400 text-[10px] mt-2">corporate@yourlavenderdomain.com</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION 7 — TERMS ACCORDION
   ═══════════════════════════════════════════════════════════ */
function TermsSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <p className="section-tag mb-2">Terms</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">Gift Card Terms</h2>
          </motion.div>
          <div className="space-y-3">
            {TERMS.map((term, i) => (
              <motion.div key={term.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white/95 rounded-2xl border border-[#e9dcf8]/70 shadow-sm overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-display font-semibold text-gray-900 text-sm">{term.title}</span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="px-5 pb-5">
                        <p className="font-body text-sm text-gray-500 leading-relaxed">{term.desc}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    api.get('/giftcards/tiers').then(res => {
      if (res.data?.success && res.data.tiers?.length) {
        setTiers(res.data.tiers);
      } else {
        // Fallback to default amounts if no tiers configured
        setTiers(DEFAULT_AMOUNTS.map((a, i) => ({ _id: String(i), amount: a, name: `₹${a.toLocaleString('en-IN')}`, bonusAmount: 0, benefits: [] })));
      }
    }).catch(() => {
      setTiers(DEFAULT_AMOUNTS.map((a, i) => ({ _id: String(i), amount: a, name: `₹${a.toLocaleString('en-IN')}`, bonusAmount: 0, benefits: [] })));
    });
  }, []);

  const selectedTier = tiers.find(t => t.amount === selectedAmount);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhySection />
      <ValuesSection tiers={tiers} selectedAmount={selectedAmount} setSelectedAmount={setSelectedAmount} selectedTier={selectedTier} />
      <PurchaseSection tiers={tiers} selectedAmount={selectedAmount} setSelectedAmount={setSelectedAmount} />
      <HowItWorksSection />
      <TermsSection />
      <CorporateSection />
    </div>
  );
}
