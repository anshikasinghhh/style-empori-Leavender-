import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  RefreshCw, 
  HelpCircle, 
  AlertOctagon, 
  Maximize2, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  Clock, 
  FileText, 
  Menu, 
  X,
  Sparkles,
  Info,
  DollarSign,
  Truck,
  Ban,
  Scale,
  User
} from 'lucide-react';

// Smooth scroll helper
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 100; // Offset for sticky headers
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export default function ReturnPolicyPage() {
  const [activeSection, setActiveSection] = useState('summary');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // SEO setup
    document.title = "Return, Refund & Exchange Policy | Lavender The Style Emporio";
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (metaDesc) {
      metaDesc.setAttribute("content", "Return, Refund & Exchange Policy for Lavender The Style Emporio. Learn about our 30-day return window, size exchange, and domestic shipping policies.");
    }

    // Scroll listener for top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    // Setup Intersection Observer to track active section
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -75% 0px', // Trigger when section is in upper-middle of viewport
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Register all section elements with observer
    const sections = document.querySelectorAll('.policy-section');
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      document.title = "Lavender | The Style Emporio";
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute("content", originalDesc);
      }
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const sectionsList = [
    { id: "summary", label: "Quick Summary" },
    { id: "commitment", label: "1. Our Commitment" },
    { id: "return-window", label: "2. Return Window" },
    { id: "exchange-window", label: "3. Exchange Window" },
    { id: "change-of-mind", label: "4. Change-of-Mind" },
    { id: "wrong-size", label: "5. Wrong Size Selected" },
    { id: "wrong-product", label: "6. Wrong Product Sent" },
    { id: "damaged-defective", label: "7. Damaged/Defective" },
    { id: "eligibility", label: "8. Return Eligibility" },
    { id: "non-eligible", label: "9. Non-Eligible Products" },
    { id: "categories", label: "10. Product Categories" },
    { id: "hygiene", label: "11. Hygiene Exclusions" },
    { id: "request", label: "12. Request Process" },
    { id: "approval", label: "13. Return Approval" },
    { id: "pickup", label: "14. Return Pickup" },
    { id: "shipping-cost", label: "15. Return Shipping Cost" },
    { id: "exchange-shipping", label: "16. Exchange Shipping" },
    { id: "exchange-availability", label: "17. Exchange Availability" },
    { id: "price-difference", label: "18. Price Differences" },
    { id: "refunds-section", label: "19. Refunds Policy" },
    { id: "cod-refunds", label: "20. COD Refunds" },
    { id: "processing-time", label: "21. Refund Processing Time" },
    { id: "inspection", label: "22. Return Inspection" },
    { id: "international", label: "23. International Orders" },
    { id: "customs-duties", label: "24. Customs & Duties" },
    { id: "refused-orders", label: "25. Refused Deliveries" },
    { id: "sale-promotional", label: "26. Sale & Promo Products" },
    { id: "abuse-fraud", label: "27. Return Abuse & Fraud" },
    { id: "responsibility", label: "28. Customer Responsibility" },
    { id: "consumer-rights", label: "29. Legal Rights" },
    { id: "policy-changes", label: "30. Policy Changes" },
    { id: "contact-us", label: "31. Contact Us" }
  ];

  return (
    <div className="min-h-screen bg-[#FBF8FF] text-gray-900 pb-20">
      
      {/* ─── Hero Banner ─── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-[#f7efff] via-[#f9f3ff] to-[#FBF8FF] border-b border-gold-pale/25">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_top_left,#4A1068,transparent_55%)] bg-cover bg-center" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            {/* Elegant Tag */}
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4.5 py-1.5 mb-5">
              <RefreshCw size={13} className="text-primary animate-spin-slow" />
              <span className="font-accent text-primary text-sm italic tracking-wide">Customer Support Policies</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-955 leading-tight mb-4">
              Return, Refund & Exchange Policy
            </h1>
            
            <p className="font-accent text-lg italic text-gold mb-8">
              Lavender The Style Emporio
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4.5 max-w-3xl mx-auto">
              <span className="bg-primary/5 text-primary text-xs font-semibold px-4.5 py-2 rounded-full border border-primary/10">30-Day Returns</span>
              <span className="bg-primary/5 text-primary text-xs font-semibold px-4.5 py-2 rounded-full border border-primary/10">Free First Exchange</span>
              <span className="bg-rose-50 text-rose-800 text-xs font-semibold px-4.5 py-2 rounded-full border border-rose-200/40">No International Returns</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 max-w-2xl mx-auto mt-8 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Globe size={13} />
                <span>onlinelavender.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={13} />
                <span>Effective Date: <strong>4/1/2023</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={13} />
                <span>Last Updated: <strong>4/1/2023</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Breadcrumbs ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 print:hidden">
        <nav className="flex items-center gap-2 font-body text-xs text-gray-500">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-primary font-semibold">Return & Exchange Policy</span>
        </nav>
      </div>

      {/* ─── Main Content Layout ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ─── Mobile TOC Trigger & Float Dropdown ─── */}
          <div className="lg:hidden w-full sticky top-20 z-30 mb-2 print:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between bg-white border border-gold-pale/60 px-5 py-3.5 rounded-2xl shadow-card text-gray-800 font-body text-sm font-semibold hover:border-primary transition-all"
            >
              <span className="flex items-center gap-2 text-primary">
                <FileText size={16} />
                Table of Contents
              </span>
              <span className="bg-primary/5 text-primary text-xs px-2.5 py-1 rounded-lg border border-primary/10">
                {mobileMenuOpen ? <X size={14} /> : <Menu size={14} />}
              </span>
            </button>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-gold-pale/50 shadow-premium max-h-[60vh] overflow-y-auto p-4 z-40"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {sectionsList.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => {
                          scrollToSection(sec.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-body transition-colors truncate ${
                          activeSection === sec.id
                            ? 'bg-primary text-white font-semibold'
                            : 'text-gray-600 hover:bg-champagne-light/50 hover:text-primary'
                        }`}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Desktop Sticky Sidebar (TOC) ─── */}
          <aside className="hidden lg:block lg:w-72 sticky top-28 shrink-0 print:hidden">
            <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-card border border-gold-pale/40 max-h-[calc(100vh-160px)] flex flex-col">
              <h2 className="font-display text-lg font-bold text-gray-950 mb-4 pb-3 border-b border-gold-pale/25 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <span>Sections</span>
              </h2>
              <div className="overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-gold scrollbar-track-transparent">
                {sectionsList.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-body transition-all flex items-center justify-between group ${
                      activeSection === sec.id
                        ? 'bg-primary text-white font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-champagne-light/40 hover:text-primary'
                    }`}
                  >
                    <span className="truncate">{sec.label}</span>
                    <ChevronRight 
                      size={12} 
                      className={`transition-transform duration-200 shrink-0 ${
                        activeSection === sec.id 
                          ? 'translate-x-0 opacity-100 text-white' 
                          : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-primary'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ─── Main Content Text Column ─── */}
          <main className="flex-1 w-full bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-card border border-gold-pale/35 print:shadow-none print:border-none print:p-0">
            
            {/* ─── QUICK CUSTOMER SUMMARY TABLE ─── */}
            <section id="summary" className="policy-section scroll-mt-28 mb-12">
              <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2.5">
                <Sparkles size={22} className="text-gold" />
                Quick Customer Summary
              </h2>
              <div className="bg-[#FAF6FF] border border-primary/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-primary/5 border-b border-primary/10">
                  <p className="font-body text-xs text-gray-500 uppercase tracking-wider font-bold">Policy Matrix Reference</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-body text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-700">
                        <th className="p-4 w-1/3">Policy Aspect</th>
                        <th className="p-4 w-2/3">Terms & Conditions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      <tr>
                        <td className="p-4 font-semibold bg-gray-50/50">Domestic Returns</td>
                        <td className="p-4">Within 30 days of delivery, subject to eligibility conditions.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold bg-gray-50/50">Change of Mind</td>
                        <td className="p-4 font-semibold text-rose-700">Not accepted under any circumstances.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold bg-gray-50/50">Wrong Size Selection</td>
                        <td className="p-4">Eligible for product exchange only (subject to stock availability).</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold bg-gray-50/50">Defective / Wrong Product</td>
                        <td className="p-4">Return, replacement or refund available after video/photo verification. Lavender bears pickup costs.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold bg-gray-50/50">First Size Exchange</td>
                        <td className="p-4 font-semibold text-primary">Free exchange shipping (Lavender bears the transit cost).</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold bg-gray-50/50">Further Size Exchanges</td>
                        <td className="p-4">Customer pays the applicable shipping charges for subsequent transits.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold bg-gray-50/50">International Returns</td>
                        <td className="p-4 font-semibold text-rose-700">Not accepted. International sales are final.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold bg-gray-50/50">Refund Payment Method</td>
                        <td className="p-4">Original payment method (via Razorpay gateways) where possible. Bank or UPI transfer for COD orders.</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold bg-gray-50/50">Refund Timing</td>
                        <td className="p-4">Initiated immediately upon approval; clearing time depends on your bank / card provider.</td>
                      </tr>
                      <tr className="text-gray-500 bg-gray-50/20">
                        <td className="p-4 font-semibold bg-gray-50/50 text-gray-700">Non-Eligible Items</td>
                        <td className="p-4 text-xs italic">Used, worn, washed, customized items, hygiene-sensitive products, and items without original tags or final sale items.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <div className="space-y-12">

              {/* 1. OUR COMMITMENT */}
              <section id="commitment" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Shield size={20} className="text-primary shrink-0" />
                  1. OUR COMMITMENT
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    At Lavender The Style Emporio, we want you to be happy with your purchase.
                  </p>
                  <p>
                    This Return, Refund & Exchange Policy explains when products purchased through <span className="font-semibold text-primary">onlinelavender.com</span> may be returned or exchanged and how refunds are handled.
                  </p>
                  <p>
                    By placing an order with Lavender, you acknowledge and agree to this policy. This policy should be read together with our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </section>

              {/* 2. RETURN WINDOW */}
              <section id="return-window" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Clock size={20} className="text-primary shrink-0" />
                  2. RETURN WINDOW
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Eligible domestic orders may be returned within <strong className="text-gray-900">30 days</strong> from the date of delivery.
                  </p>
                  <p>
                    The product must satisfy all applicable return conditions described in this policy. A return request submitted after the applicable 30-day period may not be accepted.
                  </p>
                </div>
              </section>

              {/* 3. EXCHANGE WINDOW */}
              <section id="exchange-window" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <RefreshCw size={20} className="text-primary shrink-0" />
                  3. EXCHANGE WINDOW
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Eligible domestic orders may be exchanged within <strong className="text-gray-900">30 days</strong> from the date of delivery.
                  </p>
                  <p>
                    Exchanges are subject to product condition, availability of the requested size/product, applicable product exclusions, verification by Lavender, and the conditions in this policy.
                  </p>
                </div>
              </section>

              {/* 4. CHANGE-OF-MIND RETURNS */}
              <section id="change-of-mind" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Ban size={20} className="text-primary shrink-0" />
                  4. CHANGE-OF-MIND RETURNS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <div className="p-4.5 bg-red-50 text-red-800 rounded-2xl border border-red-150 text-sm font-semibold">
                    Lavender does not accept returns solely because a customer has changed their mind.
                  </div>
                  <p>
                    Examples of change-of-mind requests include, but are not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
                    <li>The customer no longer wants the product;</li>
                    <li>Ordered the item unnecessarily or by mistake;</li>
                    <li>Prefers another styling option or material;</li>
                    <li>Does not like the style or look after receiving it;</li>
                    <li>Purchased the wrong product when the product supplied was completely correct.</li>
                  </ul>
                  <p>
                    Customers should carefully review product descriptions, photographs, size charts, material details, and other store descriptions before finalizing a purchase.
                  </p>
                </div>
              </section>

              {/* 5. WRONG SIZE SELECTED BY CUSTOMER */}
              <section id="wrong-size" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Maximize2 size={20} className="text-primary shrink-0" />
                  5. WRONG SIZE SELECTED BY CUSTOMER
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    If you selected the wrong size during checkout, Lavender may provide an exchange, subject to stock availability and eligibility rules.
                  </p>
                  <p className="font-semibold text-gray-900">
                    A wrong-size exchange does not automatically qualify for a refund.
                  </p>
                  <p>
                    The replacement size must be in-stock and available at the time the exchange is processed. If the size is unavailable, alternate options will be offered.
                  </p>
                </div>
              </section>

              {/* 6. WRONG PRODUCT SENT BY LAVENDER */}
              <section id="wrong-product" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <AlertOctagon size={20} className="text-primary shrink-0" />
                  6. WRONG PRODUCT SENT BY LAVENDER
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    If Lavender sends you a product that is different from the product details ordered in your checkout invoice, please contact Lavender support as soon as possible.
                  </p>
                  <p>
                    After verification, Lavender may arrange a return pickup, replacement with the correct product, or another appropriate remedy.
                  </p>
                  <p className="font-semibold text-primary">
                    For an incorrect product supplied by Lavender, Lavender will bear the applicable return shipping cost.
                  </p>
                </div>
              </section>

              {/* 7. DAMAGED OR DEFECTIVE PRODUCTS */}
              <section id="damaged-defective" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <AlertOctagon size={20} className="text-primary shrink-0" />
                  7. DAMAGED OR DEFECTIVE PRODUCTS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    If your product arrives damaged or exhibits a manufacturing defect, please contact Lavender customer service as soon as reasonably possible.
                  </p>
                  <p>
                    We may request photographs, videos showing the defect, images of the outer transit packaging, order number, delivery labels, and other information reasonably required to verify the issue.
                  </p>
                  <p>
                    After verification, Lavender may offer an appropriate remedy, which may include replacement, exchange, return or refund, depending on the circumstances and applicable law.
                  </p>
                  <p className="font-semibold text-primary">
                    Where the issue is attributable to Lavender or a structural product defect, Lavender will bear the applicable return shipping cost.
                  </p>
                </div>
              </section>

              {/* 8. RETURN ELIGIBILITY */}
              <section id="eligibility" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-primary shrink-0" />
                  8. RETURN ELIGIBILITY
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    To qualify for a domestic return or exchange, the returned product must satisfy all of the following:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Must be unused, unworn, and unwashed;</li>
                    <li>Must be in its original, pristine condition;</li>
                    <li>Must have all original price tags and brand labels attached;</li>
                    <li>Must have the original packaging where applicable (such as brand boxes);</li>
                    <li>Must not show any signs of use, stains, alterations, makeup, perfume or other customer-induced contamination;</li>
                    <li>Must be returned within the applicable 30-day period.</li>
                  </ul>
                  <p className="text-xs text-gray-500 italic">
                    Lavender reserves the right to inspect returned products before approving a return, exchange or refund request.
                  </p>
                </div>
              </section>

              {/* 9. PRODUCTS THAT ARE NOT ELIGIBLE */}
              <section id="non-eligible" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <XCircle size={20} className="text-primary shrink-0" />
                  9. PRODUCTS THAT ARE NOT ELIGIBLE
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    The following products do not qualify for returns or exchanges under any circumstances:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <p className="font-semibold text-gray-900 text-xs uppercase tracking-wide mb-1">Used or Worn Products</p>
                      <p className="text-xs text-gray-600">Products that have been worn or used beyond reasonable fitting and inspection are not eligible.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <p className="font-semibold text-gray-900 text-xs uppercase tracking-wide mb-1">Washed or Laundered Items</p>
                      <p className="text-xs text-gray-600">Products that have been washed, dry-cleaned, ironed, or laundered are rejected.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <p className="font-semibold text-gray-900 text-xs uppercase tracking-wide mb-1">Products Without Original Tags</p>
                      <p className="text-xs text-gray-600">Items returned with cut, missing, or altered price tags and brand labels.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <p className="font-semibold text-gray-900 text-xs uppercase tracking-wide mb-1">Missing Packaging</p>
                      <p className="text-xs text-gray-600">Where original bags or protective boxes are missing, the return will be rejected.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <p className="font-semibold text-gray-900 text-xs uppercase tracking-wide mb-1">Customized / Altered Wear</p>
                      <p className="text-xs text-gray-600">Products customized, personalized, altered, embroidered, or printed specifically for a customer invoice.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <p className="font-semibold text-gray-900 text-xs uppercase tracking-wide mb-1">Final-Sale Items</p>
                      <p className="text-xs text-gray-600">Products clearly marked &ldquo;Final Sale&rdquo; or &ldquo;Non-Returnable&rdquo; at purchase, unless mandated by local law.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 10. PRODUCT CATEGORIES */}
              <section id="categories" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <FileText size={20} className="text-primary shrink-0" />
                  10. PRODUCT CATEGORIES
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Return and exchange rules vary based on product category, including women's ethnic wear, women's fashion wear, pants, bags, kidswear, infantwear, nightwear, and accessories.
                  </p>
                  <p>
                    Where a specific product category or seasonal collection has different return parameters, the specific conditions will be displayed on the product details page or at the checkout summary.
                  </p>
                </div>
              </section>

              {/* 11. HYGIENE-SENSITIVE PRODUCTS */}
              <section id="hygiene" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Ban size={20} className="text-primary shrink-0" />
                  11. HYGIENE-SENSITIVE PRODUCTS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Certain hygiene-sensitive products (such as underwear, personal masks, jewelry, or specific infantwear) may not be eligible for returns or exchanges where permitted by applicable law.
                  </p>
                  <p>
                    Any such exclusion will be clearly communicated on the relevant product details page or at checkout prior to processing payment.
                  </p>
                </div>
              </section>

              {/* 12. HOW TO REQUEST A RETURN OR EXCHANGE */}
              <section id="request" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <HelpCircle size={20} className="text-primary shrink-0" />
                  12. HOW TO REQUEST A RETURN OR EXCHANGE
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    To request a return or size exchange, contact Lavender using our official customer-service channels.
                  </p>
                  <p className="mb-2 font-semibold">Please provide the following information:</p>
                  <ul className="list-disc pl-6 space-y-1.5 text-gray-600">
                    <li>Original order number;</li>
                    <li>Customer name and registered mobile number;</li>
                    <li>Registered email address;</li>
                    <li>Product name(s) to be returned or exchanged;</li>
                    <li>Clear reason for return/exchange;</li>
                    <li>Photographs/videos (mandatory where item is damaged, defective, or incorrect);</li>
                    <li>Any other details requested by our customer-service team.</li>
                  </ul>
                  <p className="text-xs text-gray-500 italic">
                    Lavender will verify order records and details before approving the request.
                  </p>
                </div>
              </section>

              {/* 13. RETURN APPROVAL */}
              <section id="approval" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-primary shrink-0" />
                  13. RETURN APPROVAL
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Submitting a return request does not automatically guarantee return approval.
                  </p>
                  <p>
                    Lavender reviews order history details, delivery date timestamps, product conditions, return reasons, photograph/video verification, product category, and previous customer return logs where necessary.
                  </p>
                  <p>
                    Once a return is formally approved, Lavender will provide instructions for return pickup or return shipment.
                  </p>
                </div>
              </section>

              {/* 14. RETURN PICKUP */}
              <section id="pickup" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Truck size={20} className="text-primary shrink-0" />
                  14. RETURN PICKUP
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Where return pickup is available in the customer's pincode area, Lavender may arrange pickup through its logistics partners.
                  </p>
                  <div className="p-4 bg-[#FAF6FF] border border-primary/10 rounded-2xl text-xs text-gray-600">
                    Lavender utilizes **Shiprocket** and allied third-party courier services. The courier chosen for a particular return is selected automatically through our logistics fulfillment portal.
                  </div>
                  <p className="mt-2 font-semibold">
                    Customers must ensure that the product is securely packed in a shipping bag or box to avoid damage during transit.
                  </p>
                </div>
              </section>

              {/* 15. RETURN SHIPPING COST */}
              <section id="shipping-cost" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Truck size={20} className="text-primary shrink-0" />
                  15. RETURN SHIPPING COST
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Defective or Incorrect Product:</h4>
                      <p className="text-gray-600">Where the return is caused by a damaged, defective, or incorrect product sent by Lavender, Lavender will bear the return pickup/shipping charges, subject to verification.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Customer-Initiated Return / Exchange:</h4>
                      <p className="text-gray-600">Where the return/exchange is requested due to customer preference, change of size preference, or color preference, the applicable shipping charges may be borne by the customer.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 16. EXCHANGE SHIPPING */}
              <section id="exchange-shipping" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Truck size={20} className="text-primary shrink-0" />
                  16. EXCHANGE SHIPPING
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p className="font-semibold text-primary">
                    Lavender provides one first exchange without charging the customer for the exchange shipping cost, subject to eligibility.
                  </p>
                  <p>
                    For subsequent exchanges relating to the same order invoice, the customer will be required to bear all applicable shipping and logistics charges.
                  </p>
                  <p>
                    Any additional price differences between products must be settled or refunded prior to shipment of the exchanged product.
                  </p>
                </div>
              </section>

              {/* 17. EXCHANGE AVAILABILITY */}
              <section id="exchange-availability" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <RefreshCw size={20} className="text-primary shrink-0" />
                  17. EXCHANGE AVAILABILITY
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    All exchanges are strictly subject to stock availability.
                  </p>
                  <p>
                    If the requested size or replacement item is sold out, Lavender may offer another available product design of equivalent value, store credit, or process an eligible refund in accordance with the circumstances.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    An exchange is not guaranteed solely because a request is submitted.
                  </p>
                </div>
              </section>

              {/* 18. PRICE DIFFERENCE ON EXCHANGE */}
              <section id="price-difference" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <DollarSign size={20} className="text-primary shrink-0" />
                  18. PRICE DIFFERENCE ON EXCHANGE
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    If the replacement product has a higher price than the returned product, the customer must pay the price difference before the new item is shipped.
                  </p>
                  <p>
                    If the replacement product has a lower price, Lavender may process the difference according to its refund guidelines.
                  </p>
                  <p>
                    Any applicable shipping charges will be communicated during the exchange process.
                  </p>
                </div>
              </section>

              {/* 19. REFUNDS */}
              <section id="refunds-section" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <DollarSign size={20} className="text-primary shrink-0" />
                  19. REFUNDS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Where a refund is approved, Lavender will generally attempt to refund the amount through the original payment method (via the Razorpay gateway).
                  </p>
                  <p>
                    Where refunding the original payment method is not reasonably possible due to gateway limitations or card expiration, Lavender may request appropriate bank-account or UPI information to process the transit.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Lavender may verify account ownership or payment details before processing a refund.
                  </p>
                </div>
              </section>

              {/* 20. COD REFUNDS */}
              <section id="cod-refunds" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <DollarSign size={20} className="text-primary shrink-0" />
                  20. COD REFUNDS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    For Cash on Delivery (COD) orders, refunds require the customer to provide appropriate bank account details (Holder name, Account number, IFSC) or a valid UPI ID.
                  </p>
                  <p className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-150 text-xs font-semibold">
                    Customers must provide refund bank details only through official Lavender communication channels. Lavender will never ask customers to disclose passwords, OTPs, CVVs or complete card credentials for processing a legitimate refund.
                  </p>
                </div>
              </section>

              {/* 21. REFUND PROCESSING TIME */}
              <section id="processing-time" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Clock size={20} className="text-primary shrink-0" />
                  21. REFUND PROCESSING TIME
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender does not guarantee a fixed number of business days for every refund.
                  </p>
                  <p>
                    Once a refund is approved, processing time depends on the customer's payment method, payment gateway systems, bank processing timelines, credit card providers, and other external factors. Lavender will initiate the refund process immediately after approval.
                  </p>
                </div>
              </section>

              {/* 22. RETURN INSPECTION */}
              <section id="inspection" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-primary shrink-0" />
                  22. RETURN INSPECTION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Returned products undergo quality control inspection at our warehouse before a refund or exchange is finalized.
                  </p>
                  <p>
                    If the returned product does not meet the eligibility requirements (e.g. shows wear, lacks tags, has stains), Lavender may reject the return or exchange.
                  </p>
                  <p>
                    If a return is rejected, Lavender will contact the customer to arrange shipping the product back to the customer's address at the customer's expense.
                  </p>
                </div>
              </section>

              {/* 23. INTERNATIONAL ORDERS */}
              <section id="international" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Globe size={20} className="text-primary shrink-0" />
                  23. INTERNATIONAL ORDERS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200/40 rounded-2xl font-semibold">
                    International orders are currently not eligible for returns or exchanges under any circumstances.
                  </div>
                  <p>
                    Customers ordering from outside India must carefully check size measurements, sizing charts, fabric details, product descriptions, colors, and product photos before completing an international purchase.
                  </p>
                </div>
              </section>

              {/* 24. INTERNATIONAL CUSTOMS, TAXES AND DUTIES */}
              <section id="customs-duties" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Globe size={20} className="text-primary shrink-0" />
                  24. INTERNATIONAL CUSTOMS, TAXES AND DUTIES
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    International shipments may be subject to import customs duties, local VAT, local taxes, customs clearance brokerage fees, and administrative charges levied by the destination country.
                  </p>
                  <p className="font-semibold text-gray-900">
                    All such import charges are the customer's sole responsibility.
                  </p>
                  <p>
                    Lavender does not guarantee that customs authorities will release an international shipment without additional duties, charges, or localized documentation.
                  </p>
                </div>
              </section>

              {/* 25. REFUSED OR UNDELIVERED ORDERS */}
              <section id="refused-orders" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <AlertOctagon size={20} className="text-primary shrink-0" />
                  25. REFUSED OR UNDELIVERED ORDERS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    If an order is undeliverable due to an incorrect shipping address, incorrect phone number, customer unavailability, refusal of delivery, or failure to clear customs documentation, Lavender may deduct all applicable return-to-origin (RTO) shipping fees and logistics costs from any eligible refund.
                  </p>
                </div>
              </section>

              {/* 26. SALE AND PROMOTIONAL PRODUCTS */}
              <section id="sale-promotional" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <FileText size={20} className="text-primary shrink-0" />
                  26. SALE AND PROMOTIONAL PRODUCTS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Products purchased during clearance sales, promotional events, or seasonal campaigns may be subject to customized return guidelines.
                  </p>
                  <p>
                    Where special parameters apply, Lavender will communicate exclusions clearly on the product page or during checkout. Items designated as &ldquo;Final Sale&rdquo; or &ldquo;Non-Returnable&rdquo; will not qualify for return, subject to local laws.
                  </p>
                </div>
              </section>

              {/* 27. RETURN ABUSE AND FRAUD */}
              <section id="abuse-fraud" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <AlertOctagon size={20} className="text-primary shrink-0" />
                  27. RETURN ABUSE AND FRAUD
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender reserves the right to audit and investigate suspicious return patterns, including repeated excessive returns, false claims of damage, returning different products, returning counterfeit products, substituting tags, or manipulating promotions.
                  </p>
                  <p>
                    Where permitted by law, Lavender may suspend or terminate return privileges and customer accounts found to engage in fraudulent return behavior.
                  </p>
                </div>
              </section>

              {/* 28. CUSTOMER RESPONSIBILITY */}
              <section id="responsibility" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <User size={20} className="text-primary shrink-0" />
                  28. CUSTOMER RESPONSIBILITY
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Customers are responsible for selecting correct garment sizes, verifying fabric care details before checkout, providing accurate delivery coordinates, returning products in secure outer packaging, and reporting details honestly.
                  </p>
                </div>
              </section>

              {/* 29. NO EFFECT ON LEGAL CONSUMER RIGHTS */}
              <section id="consumer-rights" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Scale size={20} className="text-primary shrink-0" />
                  29. NO EFFECT ON LEGAL CONSUMER RIGHTS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Nothing in this policy is intended to restrict or override mandatory statutory rights available to consumers under applicable consumer protection laws in India or other destination states. Legal consumer rights continue to apply as mandated.
                  </p>
                </div>
              </section>

              {/* 30. POLICY CHANGES */}
              <section id="policy-changes" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Clock size={20} className="text-primary shrink-0" />
                  30. POLICY CHANGES
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender may update this Return, Refund & Exchange Policy from time to time to align with shipping partner procedures, payment gateway updates, or modifications in trade laws. The current active version is published on <span className="font-semibold text-primary">onlinelavender.com</span>.
                  </p>
                </div>
              </section>

              {/* 31. CONTACT US */}
              <section id="contact-us" className="policy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20 flex items-center gap-2">
                  <Mail size={20} className="text-primary shrink-0" />
                  31. CONTACT US
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-6">
                  <p>
                    If you have questions, need to initiate a return, or require size exchanges, please contact our support desk:
                  </p>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="bg-[#FAF6FF] border border-primary/10 rounded-2xl p-5 flex items-start gap-4">
                      <MapPin className="text-primary shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="font-display font-semibold text-gray-950 text-sm mb-1">Headquarters</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Lavender The Style Emporio<br />
                          Kazhakootam, Kulathoor,<br />
                          Thiruvananthapuram, Kerala, India<br />
                          <span className="text-primary font-medium font-accent">Opposite Technopark Phase 3</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#FAF6FF] border border-primary/10 rounded-2xl p-5 flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <Mail className="text-primary shrink-0 mt-0.5" size={18} />
                        <div>
                          <h4 className="font-display font-semibold text-gray-950 text-sm mb-1">Email</h4>
                          <a href="mailto:lavendertsetrading@gmail.com" className="text-xs text-primary hover:underline font-semibold font-body">lavendertsetrading@gmail.com</a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Phone className="text-primary shrink-0 mt-0.5" size={18} />
                        <div>
                          <h4 className="font-display font-semibold text-gray-950 text-sm mb-1">Phone</h4>
                          <a href="tel:8921418188" className="text-xs text-gray-600 hover:text-primary transition-colors font-medium">8921418188</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </main>

        </div>
      </div>

      {/* ─── Back to Top Button ─── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-40 bg-primary text-white p-3 rounded-full shadow-premium hover:bg-primary-dark transition-all hover:scale-110 active:scale-95 print:hidden"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
      
    </div>
  );
}
