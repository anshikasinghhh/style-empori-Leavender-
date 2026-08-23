import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ChevronRight, 
  ArrowUp, 
  Calendar, 
  Clock, 
  FileText, 
  Menu, 
  X,
  CreditCard,
  Truck,
  AlertTriangle,
  Info,
  Cookie,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // SEO setup
    document.title = "Privacy Policy | Lavender The Style Emporio";
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (metaDesc) {
      metaDesc.setAttribute("content", "Privacy Policy for Lavender The Style Emporio. Learn how Lavender collects, uses, protects and processes customer information.");
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
    const sections = document.querySelectorAll('.privacy-section');
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
    { id: "introduction", label: "1. Introduction" },
    { id: "scope-of-this-privacy-policy", label: "2. Scope of Policy" },
    { id: "information-we-collect", label: "3. Information We Collect" },
    { id: "information-collected-during-checkout", label: "4. Checkout Collection" },
    { id: "how-we-collect-information", label: "5. Collection Methods" },
    { id: "information-collected-automatically", label: "6. Automatic Collection" },
    { id: "how-lavender-uses-personal-information", label: "7. Use of Information" },
    { id: "marketing-communications", label: "8. Marketing" },
    { id: "birthday-information", label: "9. Birthday Info" },
    { id: "cookies-and-similar-technologies", label: "10. Cookies & Tech" },
    { id: "google-services-and-analytics", label: "11. Google Services" },
    { id: "meta-facebook-instagram-advertising", label: "12. Meta Advertising" },
    { id: "customer-reviews-and-user-content", label: "13. Reviews & Content" },
    { id: "shipping-and-logistics", label: "14. Shipping & Logistics" },
    { id: "international-orders", label: "15. International Orders" },
    { id: "returns-exchanges-and-refunds", label: "16. Returns & Exchanges" },
    { id: "refunds", label: "17. Refunds Info" },
    { id: "third-party-service-providers", label: "18. Third Parties" },
    { id: "amazon-flipkart-and-other-marketplaces", label: "19. Marketplaces" },
    { id: "social-media", label: "20. Social Media" },
    { id: "childrens-personal-information", label: "21. Children's Privacy" },
    { id: "account-security", label: "22. Account Security" },
    { id: "data-security", label: "23. Data Security" },
    { id: "data-breaches-and-security-incidents", label: "24. Data Breaches" },
    { id: "data-retention", label: "25. Data Retention" },
    { id: "fraud-and-misuse-prevention", label: "26. Fraud Prevention" },
    { id: "legal-disclosures", label: "27. Legal Disclosures" },
    { id: "customer-privacy-rights", label: "28. Privacy Rights" },
    { id: "access-to-personal-information", label: "29. Access to Info" },
    { id: "correction-of-information", label: "30. Correction of Info" },
    { id: "deletion-of-information", label: "31. Deletion of Info" },
    { id: "withdrawal-of-consent-and-marketing-opt-out", label: "32. Consent Withdrawal" },
    { id: "privacy-requests-and-complaints", label: "33. Requests & Complaints" },
    { id: "international-data-processing", label: "34. Int'l Data Processing" },
    { id: "third-party-links", label: "35. Third-Party Links" },
    { id: "business-records", label: "36. Business Records" },
    { id: "business-transfers", label: "37. Business Transfers" },
    { id: "changes-to-this-privacy-policy", label: "38. Policy Changes" },
    { id: "governing-legal-framework", label: "39. Legal Framework" },
    { id: "contact-us", label: "40. Contact Us" },
    { id: "effective-date", label: "41. Effective Date" }
  ];

  return (
    <div className="min-h-screen bg-[#FBF8FF] text-gray-900 pb-20">
      
      {/* ─── Hero Banner ─── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-[#f7efff] via-[#f9f3ff] to-[#FBF8FF] border-b border-gold-pale/25">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_top_left,#4A1068,transparent_55%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Elegant Tag */}
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4.5 py-1.5 mb-5">
              <Shield size={13} className="text-primary" />
              <span className="font-accent text-primary text-sm italic tracking-wide">Legal Information</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-950 leading-tight mb-4">
              Privacy Policy
            </h1>
            
            <p className="font-accent text-lg italic text-gold mb-8">
              Lavender The Style Emporio
            </p>

            <div className="flex flex-wrap justify-center items-center gap-6 max-w-2xl mx-auto">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl px-6 py-3 border border-gold-pale/30 shadow-card flex items-center gap-2.5">
                <Globe size={15} className="text-primary" />
                <span className="font-body text-sm font-semibold text-gray-800">onlinelavender.com</span>
              </div>
              <div className="bg-white/70 backdrop-blur-md rounded-2xl px-6 py-3 border border-gold-pale/30 shadow-card flex items-center gap-2.5">
                <Calendar size={15} className="text-primary" />
                <span className="font-body text-sm text-gray-600">Effective Date: <strong className="text-gray-800">4/1/2023</strong></span>
              </div>
              <div className="bg-white/70 backdrop-blur-md rounded-2xl px-6 py-3 border border-gold-pale/30 shadow-card flex items-center gap-2.5">
                <Clock size={15} className="text-primary" />
                <span className="font-body text-sm text-gray-600">Last Updated: <strong className="text-gray-800">4/1/2023</strong></span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Breadcrumbs ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex items-center gap-2 font-body text-xs text-gray-500">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-primary font-semibold">Privacy Policy</span>
        </nav>
      </div>

      {/* ─── Main Content Layout ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ─── Mobile TOC Trigger & Float Dropdown ─── */}
          <div className="lg:hidden w-full sticky top-20 z-30 mb-2">
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
          <aside className="hidden lg:block lg:w-72 sticky top-28 shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-card border border-gold-pale/40 max-h-[calc(100vh-160px)] flex flex-col">
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
          <main className="flex-1 w-full bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-card border border-gold-pale/35">
            
            {/* Quick Summary Notice */}
            <div className="mb-12 bg-[#FAF6FF] rounded-2xl p-5 border border-primary/10 flex items-start gap-4">
              <Info className="text-primary shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-display font-bold text-sm text-gray-900 mb-1">Business Identity & Context</h4>
                <p className="font-body text-xs text-gray-600 leading-relaxed">
                  <strong>Lavender The Style Emporio</strong> is a proprietorship headquartered in 
                  Kazhakootam, Kulathoor, Thiruvananthapuram, Kerala, India (Opposite Technopark Phase 3). 
                  GSTIN: 32BQZPA7286C1ZN. For data protection inquiries or to exercise your privacy rights, please 
                  contact us at <a href="mailto:lavendertsetrading@gmail.com" className="text-primary hover:underline font-semibold">lavendertsetrading@gmail.com</a>.
                </p>
              </div>
            </div>

            {/* Document Content */}
            <div className="space-y-12">

              {/* 1. INTRODUCTION */}
              <section id="introduction" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  1. INTRODUCTION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender The Style Emporio (&ldquo;Lavender&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) is a fashion and lifestyle retail business offering women's ethnic wear, bags, pants, kidswear, nightwear and other fashion products through our physical store, online store and selected third-party marketplaces.
                  </p>
                  <p>
                    Our online store is available at <span className="font-semibold text-primary">onlinelavender.com</span>.
                  </p>
                  <p>
                    We respect the privacy of our customers, website visitors, account holders and other individuals who interact with Lavender. This Privacy Policy explains how we collect, use, process, store, protect and disclose personal information in connection with our website, products, services and customer interactions.
                  </p>
                  <p>
                    This Privacy Policy is intended to provide transparency about the information Lavender collects and how that information is used.
                  </p>
                </div>
              </section>

              {/* 2. SCOPE OF THIS PRIVACY POLICY */}
              <section id="scope-of-this-privacy-policy" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  2. SCOPE OF THIS PRIVACY POLICY
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    This Privacy Policy applies to personal information collected or processed when you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2.5">
                    <li>Visit or browse onlinelavender.com;</li>
                    <li>Create or use a Lavender account;</li>
                    <li>Place an order;</li>
                    <li>Add products to your cart;</li>
                    <li>Begin but do not complete checkout;</li>
                    <li>Make or attempt to make a payment;</li>
                    <li>Request delivery;</li>
                    <li>Request a return, exchange or refund;</li>
                    <li>Contact customer support;</li>
                    <li>Communicate with us through WhatsApp, email, telephone or social media;</li>
                    <li>Subscribe to marketing communications;</li>
                    <li>Participate in promotions, offers or loyalty programmes;</li>
                    <li>Submit reviews, ratings or other content;</li>
                    <li>Participate in birthday-related offers or experiences;</li>
                    <li>Interact with Lavender advertisements or marketing campaigns; or</li>
                    <li>Otherwise interact with Lavender through our online or offline services.</li>
                  </ul>
                  <p>
                    This Privacy Policy also explains our use of cookies, analytics, advertising and similar technologies where applicable.
                  </p>
                </div>
              </section>

              {/* 3. INFORMATION WE COLLECT */}
              <section id="information-we-collect" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  3. INFORMATION WE COLLECT
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-6">
                  <p>
                    Depending on how you interact with Lavender, we may collect different categories of personal information.
                  </p>

                  {/* 3.1 */}
                  <div>
                    <h3 className="font-display font-semibold text-gray-950 text-base mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                      3.1 Identity Information
                    </h3>
                    <p className="mb-3">This may include:</p>
                    <ul className="list-disc pl-6 space-y-1.5">
                      <li>Full name;</li>
                      <li>Account holder name;</li>
                      <li>Customer identification information;</li>
                      <li>Date of birth;</li>
                      <li>Information necessary to verify account ownership.</li>
                    </ul>
                    <p className="mt-3 text-xs text-gray-500 bg-champagne-light/20 p-3 rounded-xl border border-gold-pale/20">
                      We may collect date-of-birth information to provide birthday-related surprises, offers or customer experiences.
                    </p>
                  </div>

                  {/* 3.2 */}
                  <div>
                    <h3 className="font-display font-semibold text-gray-950 text-base mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                      3.2 Contact Information
                    </h3>
                    <p className="mb-3">This may include:</p>
                    <ul className="list-disc pl-6 space-y-1.5">
                      <li>Mobile number;</li>
                      <li>Email address;</li>
                      <li>WhatsApp number;</li>
                      <li>Billing address;</li>
                      <li>Shipping address;</li>
                      <li>Pickup address for returns;</li>
                      <li>Other contact details provided by you.</li>
                    </ul>
                  </div>

                  {/* 3.3 */}
                  <div>
                    <h3 className="font-display font-semibold text-gray-950 text-base mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                      3.3 Account Information
                    </h3>
                    <p className="mb-3">If you create an account with Lavender, we may collect and retain:</p>
                    <ul className="list-disc pl-6 space-y-1.5">
                      <li>Login/account information;</li>
                      <li>Account details;</li>
                      <li>Order history;</li>
                      <li>Wishlist information;</li>
                      <li>Product preferences;</li>
                      <li>Account activity;</li>
                      <li>Information required to verify ownership of the account.</li>
                    </ul>
                  </div>

                  {/* 3.4 */}
                  <div>
                    <h3 className="font-display font-semibold text-gray-950 text-base mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                      3.4 Order Information
                    </h3>
                    <p className="mb-3">When you purchase from Lavender, we may collect:</p>
                    <ul className="list-disc pl-6 space-y-1.5">
                      <li>Products purchased;</li>
                      <li>Product quantities;</li>
                      <li>Order number;</li>
                      <li>Order date;</li>
                      <li>Order value;</li>
                      <li>Delivery information;</li>
                      <li>Billing information;</li>
                      <li>Payment status;</li>
                      <li>Refund information;</li>
                      <li>Return and exchange information.</li>
                    </ul>
                  </div>

                  {/* 3.5 */}
                  <div className="bg-[#FAF6FF] rounded-2xl p-5 border border-primary/10">
                    <h3 className="font-display font-semibold text-primary text-base mb-3 flex items-center gap-2">
                      <CreditCard size={18} className="text-primary" />
                      3.5 Payment Information
                    </h3>
                    <p className="mb-3">
                      Lavender uses third-party payment service providers, including **Razorpay**, to facilitate payments.
                    </p>
                    <p className="mb-3 font-semibold text-gray-800">
                      Lavender does not intentionally store complete payment-card credentials such as full card numbers, CVV numbers or card expiry information on its own systems.
                    </p>
                    <p className="mb-4">
                      Payment providers process payment credentials in accordance with their own terms and privacy policies. Where a payment provider offers a &ldquo;remember me&rdquo; or similar feature, the relevant payment credentials may be handled by that payment provider rather than being stored directly by Lavender.
                    </p>
                    <p className="mb-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Lavender may retain transaction-related information such as:
                    </p>
                    <ul className="list-disc pl-6 space-y-1.5 text-xs text-gray-600">
                      <li>Transaction identification numbers;</li>
                      <li>Payment status;</li>
                      <li>Amount paid;</li>
                      <li>Payment date;</li>
                      <li>Refund amount;</li>
                      <li>Refund status; and</li>
                      <li>Other information necessary for accounting, customer service, fraud prevention and legal compliance.</li>
                    </ul>
                  </div>

                  {/* 3.6 */}
                  <div>
                    <h3 className="font-display font-semibold text-gray-950 text-base mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                      3.6 Customer Service Information
                    </h3>
                    <p className="mb-3">When you contact Lavender, we may retain information relating to your communication, including:</p>
                    <ul className="list-disc pl-6 space-y-1.5">
                      <li>Customer-service conversations;</li>
                      <li>WhatsApp conversations;</li>
                      <li>Emails;</li>
                      <li>Telephone/customer-service records where applicable;</li>
                      <li>Complaints;</li>
                      <li>Return/exchange communications;</li>
                      <li>Refund communications;</li>
                      <li>Information required to resolve your issue.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 4. INFORMATION COLLECTED DURING CHECKOUT */}
              <section id="information-collected-during-checkout" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  4. INFORMATION COLLECTED DURING CHECKOUT
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender may collect information when you begin or proceed through checkout, including where an order is not ultimately completed (e.g. abandoned carts).
                  </p>
                  <p className="mb-2 font-semibold">This may include information such as:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Name;</li>
                    <li>Mobile number;</li>
                    <li>Email address;</li>
                    <li>Delivery details;</li>
                    <li>Cart information and products selected;</li>
                    <li>Checkout information and progress state;</li>
                    <li>Technical information relating to the checkout process.</li>
                  </ul>
                  <p className="mt-4 font-semibold text-gray-800">We may use this information to:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Help identify and resolve technical or checkout problems;</li>
                    <li>Prevent repeated checkout errors;</li>
                    <li>Improve the website and checkout experience;</li>
                    <li>Assist customers with incomplete orders; and</li>
                    <li>Where permitted and where appropriate consent or another lawful basis exists, send abandoned-cart reminders.</li>
                  </ul>
                </div>
              </section>

              {/* 5. HOW WE COLLECT INFORMATION */}
              <section id="how-we-collect-information" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  5. HOW WE COLLECT INFORMATION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p> Lavender may collect personal information through: </p>
                  <ul className="list-disc pl-6 space-y-2.5">
                    <li>Our website;</li>
                    <li>Customer account registration;</li>
                    <li>Checkout and order forms;</li>
                    <li>Payment processes;</li>
                    <li>Return and exchange forms;</li>
                    <li>Customer-service communications (WhatsApp, Email, Telephone);</li>
                    <li>Social-media interactions, reviews and ratings;</li>
                    <li>Promotions and campaigns;</li>
                    <li>Cookies and similar tracking technologies;</li>
                    <li>Analytics and advertising technologies;</li>
                    <li>Physical-store interactions;</li>
                    <li>Third-party marketplaces and service providers where applicable.</li>
                  </ul>
                </div>
              </section>

              {/* 6. INFORMATION COLLECTED AUTOMATICALLY */}
              <section id="information-collected-automatically" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  6. INFORMATION COLLECTED AUTOMATICALLY
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    When you visit our website, certain information may be collected automatically through cookies, analytics technologies and similar tools.
                  </p>
                  <p className="mb-2 font-semibold">This may include:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>IP address;</li>
                    <li>Browser type and device type;</li>
                    <li>Operating system and device/browser details;</li>
                    <li>Pages visited and products viewed;</li>
                    <li>Website activity and interaction with features;</li>
                    <li>Traffic source and approximate location derived from technical information;</li>
                    <li>Date and time of website visits.</li>
                  </ul>
                  <p>
                    This information may be used for website functionality, analytics, security, advertising, performance measurement and improving the overall customer experience.
                  </p>
                </div>
              </section>

              {/* 7. HOW LAVENDER USES PERSONAL INFORMATION */}
              <section id="how-lavender-uses-personal-information" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  7. HOW LAVENDER USES PERSONAL INFORMATION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p> Lavender may use personal information for purposes including: </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Creating and managing customer accounts;</li>
                    <li>Processing and delivering orders;</li>
                    <li>Processing payments, returns, refunds, and exchanges;</li>
                    <li>Providing customer support and resolving technical problems;</li>
                    <li>Communicating order status, shipping updates, and tracking details;</li>
                    <li>Improving website performance, products, services, and understanding preferences;</li>
                    <li>Managing wishlists and loyalty programmes;</li>
                    <li>Preventing fraud and unauthorized system misuse;</li>
                    <li>Maintaining business records, accounting, and complying with GST and tax laws;</li>
                    <li>Conducting analytics, advertising, and retargeting;</li>
                    <li>Sending promotional communications where permitted;</li>
                    <li>Providing birthday-related surprises or offers;</li>
                    <li>Managing abandoned-cart communications;</li>
                    <li>Protecting Lavender, our customers, and our servers.</li>
                  </ul>
                </div>
              </section>

              {/* 8. MARKETING COMMUNICATIONS */}
              <section id="marketing-communications" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  8. MARKETING COMMUNICATIONS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Where permitted by applicable law and where appropriate consent has been obtained, Lavender may send promotional communications through SMS, WhatsApp, Email, or other electronic communication channels.
                  </p>
                  <p className="mb-2 font-semibold">Marketing communications may include:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>New product announcements;</li>
                    <li>Discounts, offers, and seasonal campaigns;</li>
                    <li>Birthday offers and special events;</li>
                    <li>Loyalty benefits and product recommendations;</li>
                    <li>Abandoned-cart reminders.</li>
                  </ul>
                  <p>
                    Customers may opt out of promotional communications using the unsubscribe or opt-out mechanism provided in the relevant communication or by contacting Lavender.
                  </p>
                  <p className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-200/50 text-xs text-gray-600">
                    *Note: Opting out of marketing communications does not stop essential transactional communications, such as order confirmations, payment receipts, delivery updates, and account security alerts.*
                  </p>
                </div>
              </section>

              {/* 9. BIRTHDAY INFORMATION */}
              <section id="birthday-information" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  9. BIRTHDAY INFORMATION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender may collect date-of-birth information for customers and, where applicable, children associated with an account or purchase.
                  </p>
                  <p className="mb-2 font-semibold">This information may be used to provide:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Birthday surprises;</li>
                    <li>Birthday offers;</li>
                    <li>Birthday-related communications; and</li>
                    <li>Personalized customer experiences.</li>
                  </ul>
                  <p>
                    Lavender will use such information only for appropriate purposes and subject to applicable privacy and consent requirements.
                  </p>
                </div>
              </section>

              {/* 10. COOKIES AND SIMILAR TECHNOLOGIES */}
              <section id="cookies-and-similar-technologies" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  10. COOKIES AND SIMILAR TECHNOLOGIES
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-6">
                  <p>
                    Lavender may use cookies and similar technologies to operate, secure, and improve our website.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gold-pale/30 rounded-2xl p-4 shadow-sm">
                      <h4 className="font-display font-semibold text-primary text-sm mb-2 flex items-center gap-2">
                        <Cookie size={16} />
                        Essential Cookies
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Required for critical website tasks like account sessions, login states, and preserving your shopping cart.
                      </p>
                    </div>
                    <div className="bg-white border border-gold-pale/30 rounded-2xl p-4 shadow-sm">
                      <h4 className="font-display font-semibold text-primary text-sm mb-2 flex items-center gap-2">
                        <Cookie size={16} />
                        Functional Cookies
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Used to remember your preferences (such as size choices or layout settings) to improve ease of use.
                      </p>
                    </div>
                    <div className="bg-white border border-gold-pale/30 rounded-2xl p-4 shadow-sm">
                      <h4 className="font-display font-semibold text-primary text-sm mb-2 flex items-center gap-2">
                        <Cookie size={16} />
                        Analytics Cookies
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Used to compile anonymous data on how visitors interact with the site, helping us optimize pages.
                      </p>
                    </div>
                    <div className="bg-white border border-gold-pale/30 rounded-2xl p-4 shadow-sm">
                      <h4 className="font-display font-semibold text-primary text-sm mb-2 flex items-center gap-2">
                        <Cookie size={16} />
                        Advertising Cookies
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Used to evaluate ad campaigns, track conversions, and, where appropriate, deliver targeted retargeting banners.
                      </p>
                    </div>
                  </div>

                  <p>
                    Where required by applicable law, Lavender will provide appropriate controls for non-essential cookies and tracking technologies.
                  </p>
                </div>
              </section>

              {/* 11. GOOGLE SERVICES AND ANALYTICS */}
              <section id="google-services-and-analytics" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  11. GOOGLE SERVICES AND ANALYTICS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender may use Google services, including **Google Analytics**, **Google Ads**, and **Google Tag Manager** to understand website traffic patterns, measure advertising returns, and refine marketing campaigns.
                  </p>
                  <p>
                    Information collected through these technologies may include website activity logs, device characteristics, traffic acquisition channels, online conversions, and other analytical variables.
                  </p>
                  <p className="text-xs text-gray-500 italic bg-[#FAF6FF] p-3.5 rounded-xl border border-primary/5">
                    *The actual information collected and processing performed depends on the specific Google services active on the website at any given time.*
                  </p>
                </div>
              </section>

              {/* 12. META / FACEBOOK / INSTAGRAM ADVERTISING */}
              <section id="meta-facebook-instagram-advertising" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  12. META / FACEBOOK / INSTAGRAM ADVERTISING
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender may utilize Meta advertising services to showcase relevant ethnic wear on Facebook and Instagram.
                  </p>
                  <p className="mb-2 font-semibold">We may employ tracking tags to:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Measure advertising performance;</li>
                    <li>Analyze interactions with Lavender promotional units;</li>
                    <li>Conduct retargeting to show products you viewed on our site;</li>
                    <li>Improve audience targeting for marketing efficiency.</li>
                  </ul>
                  <p className="text-xs text-gray-500 italic bg-amber-50/50 p-4 rounded-xl border border-amber-200/50">
                    *Lavender is currently verifying the active tracking components installed on the website, including whether the Meta Pixel is active. This policy is written to provide advance transparency regarding these tools.*
                  </p>
                </div>
              </section>

              {/* 13. CUSTOMER REVIEWS AND USER CONTENT */}
              <section id="customer-reviews-and-user-content" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  13. CUSTOMER REVIEWS AND USER CONTENT
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Customers may submit ratings, product reviews, feedback, photographs, or video files. Where such content is explicitly submitted for publication or marketing, Lavender may display it on the website or promotional materials in compliance with the relevant upload consent.
                  </p>
                  <p className="font-semibold text-gray-800">
                    Customers must avoid submitting sensitive personal information, or the personal details of any other individual, without clear authorization.
                  </p>
                </div>
              </section>

              {/* 14. SHIPPING AND LOGISTICS */}
              <section id="shipping-and-logistics" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  14. SHIPPING AND LOGISTICS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <div className="flex items-center gap-3 bg-[#FAF6FF] p-4.5 rounded-2xl border border-primary/10 mb-4">
                    <Truck className="text-primary" size={24} />
                    <div>
                      <p className="font-display font-semibold text-sm text-primary">Integration Details</p>
                      <p className="font-body text-xs text-gray-600">Lavender uses **Shiprocket** and allied courier platforms to execute deliveries.</p>
                    </div>
                  </div>
                  <p className="mb-2 font-semibold">To ship your purchases, we supply logistics agents with:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Customer name and mobile number;</li>
                    <li>Delivery address and postal pincode;</li>
                    <li>Order identification number and package contents;</li>
                    <li>COD (Cash on Delivery) value, where applicable;</li>
                    <li>Pickup parameters for returns and reverse logistics.</li>
                  </ul>
                  <p>
                    Shiprocket selects the appropriate courier service (such as Delhivery, Blue Dart, DTDC, etc.) to fulfill the transit. These couriers handle details according to their respective policies and statutory mandates.
                  </p>
                </div>
              </section>

              {/* 15. INTERNATIONAL ORDERS */}
              <section id="international-orders" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  15. INTERNATIONAL ORDERS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender serves customers in India and internationally. For global order fulfillment, we exchange mandatory details with international couriers, freight consolidators, customs clearing agents, and border authorities.
                  </p>
                  <p>
                    This includes name, phone, invoice values, item descriptions, and destination information. International transits inherently involve processing and transmitting your data across geographical borders, subject to local and international trade laws.
                  </p>
                </div>
              </section>

              {/* 16. RETURNS, EXCHANGES AND REFUNDS */}
              <section id="returns-exchanges-and-refunds" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  16. RETURNS, EXCHANGES AND REFUNDS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    We offer returns and exchanges in accordance with our return guidelines.
                  </p>
                  <div className="bg-champagne-light/35 border border-gold-pale/40 p-4 rounded-xl mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gold">Return Window</p>
                      <p className="font-display font-semibold text-lg text-gray-905">30 Days</p>
                    </div>
                    <div className="w-px h-10 bg-gold-pale/30" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gold">Exchange Window</p>
                      <p className="font-display font-semibold text-lg text-gray-905">30 Days</p>
                    </div>
                  </div>
                  <p className="mb-2 font-semibold">To execute a request, we utilize:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Customer name and purchase history;</li>
                    <li>Contact details, order ID, and reason for return;</li>
                    <li>Verifying photos or videos (where product checks are necessary);</li>
                    <li>Assigned pickup address and refund banking details.</li>
                  </ul>
                  <p>
                    We coordinate with courier firms to handle pickup and verify returned inventory before release of credit.
                  </p>
                </div>
              </section>

              {/* 17. REFUNDS */}
              <section id="refunds" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  17. REFUNDS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Refund payments are normally processed through the initial payment gateway or directly back to the customer's verified bank account.
                  </p>
                  <p className="mb-2 font-semibold">Where manual banking transits are required, we may request:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Account holder name;</li>
                    <li>Bank account number and IFSC code;</li>
                    <li>UPI ID; or</li>
                    <li>Other indicators strictly required to trigger the transaction.</li>
                  </ul>
                  <p className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-150 text-xs flex gap-2">
                    <AlertTriangle className="shrink-0" size={16} />
                    <strong>Security Warning:</strong> Customers must supply financial details only through designated, secure Lavender support channels (like lavendertsetrading@gmail.com) and never post banking details publicly.
                  </p>
                </div>
              </section>

              {/* 18. THIRD-PARTY SERVICE PROVIDERS */}
              <section id="third-party-service-providers" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  18. THIRD-PARTY SERVICE PROVIDERS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender coordinates with select external firms to run web and logistics operations. These include:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Payment processors and banks;</li>
                    <li>Shipping aggregators and logistics partners;</li>
                    <li>Web hosting, server management, and backend platform providers;</li>
                    <li>Analytics and web traffic monitors;</li>
                    <li>Marketing campaign automation tools;</li>
                    <li>Professional advisors, auditors, and legal practitioners.</li>
                  </ul>
                  <p>
                    These third parties are authorized to process data strictly as required to fulfill their specific operational contracts under applicable privacy regulations.
                  </p>
                </div>
              </section>

              {/* 19. AMAZON, FLIPKART AND OTHER MARKETPLACES */}
              <section id="amazon-flipkart-and-other-marketplaces" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  19. AMAZON, FLIPKART AND OTHER MARKETPLACES
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender lists selections on third-party marketplace networks, including **Amazon** and **Flipkart**.
                  </p>
                  <p>
                    When ordering Lavender products through these channels, the respective marketplace collects and governs your personal information under its distinct privacy policy. Lavender receives specific order parameters (like name, delivery location, and items ordered) to perform package packaging, shipping, and after-sale support.
                  </p>
                </div>
              </section>

              {/* 20. SOCIAL MEDIA */}
              <section id="social-media" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  20. SOCIAL MEDIA
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    We operate social media pages, principally on Instagram and Facebook.
                  </p>
                  <p>
                    When you engage with our brand pages, the platform hosts process your metrics independently under their terms. Content or messages you post publicly on our profiles can be seen by other users, subject to your profile privacy preferences. We recommend reading platform policies before publication.
                  </p>
                </div>
              </section>

              {/* 21. CHILDREN'S PERSONAL INFORMATION */}
              <section id="childrens-personal-information" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  21. CHILDREN'S PERSONAL INFORMATION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender retails children's ethnic garments and infantwear. While we process children's profiles, measurements, and preferences to prepare sizing recommendations and orders, we require parental/guardian checkout authorization.
                  </p>
                  <p className="mb-2 font-semibold">We may collect details such as:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Child's first name, age/date of birth;</li>
                    <li>Sizing metrics and product selections;</li>
                    <li>Shipping address and parent/guardian contact parameters.</li>
                  </ul>
                  <p>
                    We do not utilize children's data for promotional targeting. As India's Digital Personal Data Protection (DPDP) Act rules regarding children's data processing come into force, we will update our verification processes accordingly.
                  </p>
                </div>
              </section>

              {/* 22. ACCOUNT SECURITY */}
              <section id="account-security" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  22. ACCOUNT SECURITY
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Registered account holders must maintain password confidentiality.
                  </p>
                  <p className="mb-2 font-semibold">Lavender deploys standard web safeguards to protect accounts, including:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Cryptographic hash storage of passwords;</li>
                    <li>Session timeouts and authentication checkpoints;</li>
                    <li>System activity monitoring and administration access restrictions;</li>
                    <li>Database backup recovery structures.</li>
                  </ul>
                  <p>
                    If you detect unauthorized login attempts on your profile, alert us immediately at lavendertsetrading@gmail.com.
                  </p>
                </div>
              </section>

              {/* 23. DATA SECURITY */}
              <section id="data-security" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  23. DATA SECURITY
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    We deploy appropriate technical, structural, and administrative safeguards designed to protect personal information against unauthorized disclosure, loss, or alteration.
                  </p>
                  <div className="p-4 bg-champagne-light/30 border border-gold-pale/35 rounded-2xl text-xs text-gray-600">
                    Our website is custom-designed and hosted securely on **Hostinger** web servers. Access to databases containing customer parameters is strictly restricted to designated technical staff.
                  </div>
                  <p className="mt-2 text-xs italic text-gray-500">
                    *Please note that no online transmission or database infrastructure can be guaranteed to be absolutely secure against persistent intrusion attempts.*
                  </p>
                </div>
              </section>

              {/* 24. DATA BREACHES AND SECURITY INCIDENTS */}
              <section id="data-breaches-and-security-incidents" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  24. DATA BREACHES AND SECURITY INCIDENTS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    If Lavender identifies a data breach or security incident involving customer personal records, we will implement response protocols, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Activating containment and isolating affected systems;</li>
                    <li>Conducting technical forensic investigation of the cause and scope;</li>
                    <li>Implementing patching, password resets, and hardware firewall upgrades;</li>
                    <li>Evaluating the classes of records exposed; and</li>
                    <li>Providing statutory and customer notifications where mandated by legal frameworks.</li>
                  </ul>
                </div>
              </section>

              {/* 25. DATA RETENTION */}
              <section id="data-retention" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  25. DATA RETENTION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender retains personal records strictly as long as required to execute order transits, coordinate returns, process refunds, address complaints, and manage tax records (including GST documentation), accounting logs, auditing trails, and legal compliance.
                  </p>
                  <p>
                    When retention constraints lapse, records are securely deleted, anonymized, or shredded in compliance with data safety standards.
                  </p>
                </div>
              </section>

              {/* 26. FRAUD AND MISUSE PREVENTION */}
              <section id="fraud-and-misuse-prevention" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  26. FRAUD AND MISUSE PREVENTION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    To defend our systems and customers, we collect and process parameters strictly to evaluate and prevent order fraud, check chargebacks, trace returns abuse, prevent promo-code exploitation, and stop credential stuffing.
                  </p>
                  <p>
                    These logs may be retained as long as required to enforce our safety policies.
                  </p>
                </div>
              </section>

              {/* 27. LEGAL DISCLOSURES */}
              <section id="legal-disclosures" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  27. LEGAL DISCLOSURES
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender may disclose personal data to law enforcement, government controllers, tax officers, or judicial bodies when legally compelled by:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Applicable state or federal statutes;</li>
                    <li>Valid court summonses or warrants;</li>
                    <li>Regulatory tax filings and GST requests;</li>
                    <li>Defending our legal rights, checking fraud, or protecting customer safety.</li>
                  </ul>
                </div>
              </section>

              {/* 28. CUSTOMER PRIVACY RIGHTS */}
              <section id="customer-privacy-rights" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  28. CUSTOMER PRIVACY RIGHTS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Subject to applicable national regulations (such as the DPDP Act in India), users have distinct rights regarding the control of their data.
                  </p>
                  <p className="mb-2 font-semibold">These rights include:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Requesting a copy of personal information stored with us;</li>
                    <li>Instructing correction of inaccurate or incomplete records;</li>
                    <li>Demanding erasure of personal profiles under valid terms;</li>
                    <li>Withdrawing consent for data processing where processing is consent-based;</li>
                    <li>Filing privacy complaints with our coordinator or data protection boards.</li>
                  </ul>
                  <p>
                    Lavender requires identity verification prior to executing modifications to protect your account.
                  </p>
                </div>
              </section>

              {/* 29. ACCESS TO PERSONAL INFORMATION */}
              <section id="access-to-personal-information" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  29. ACCESS TO PERSONAL INFORMATION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Verified account owners can request summaries of their personal records held by Lavender. Identity checks are strictly enforced before disclosure to prevent account takeover. Submit requests directly to lavendertsetrading@gmail.com.
                  </p>
                </div>
              </section>

              {/* 30. CORRECTION OF INFORMATION */}
              <section id="correction-of-information" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  30. CORRECTION OF INFORMATION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    You have the right to modify outdated or inaccurate email, phone, name, or shipping parameters. Customers should maintain accurate delivery fields to avoid shipment errors or delays. Contact us to update fields if you cannot modify them directly in your profile dashboard.
                  </p>
                </div>
              </section>

              {/* 31. DELETION OF INFORMATION */}
              <section id="deletion-of-information" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  31. DELETION OF INFORMATION
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    You may submit erasure requests for your personal records. Lavender will delete eligible records, except where statutory compliance forces data preservation (such as accounting records, tax logs, ongoing return verification, and anti-fraud monitoring).
                  </p>
                </div>
              </section>

              {/* 32. WITHDRAWAL OF CONSENT AND MARKETING OPT-OUT */}
              <section id="withdrawal-of-consent-and-marketing-opt-out" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  32. WITHDRAWAL OF CONSENT AND MARKETING OPT-OUT
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Where our processing relies on your voluntary consent, you can revoke consent at any time. Revocation does not invalidate processing carried out prior to withdrawal. Opt-out links are appended to all promotional text/WhatsApp updates.
                  </p>
                </div>
              </section>

              {/* 33. PRIVACY REQUESTS AND COMPLAINTS */}
              <section id="privacy-requests-and-complaints" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  33. PRIVACY REQUESTS AND COMPLAINTS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    For inquiries, corrections, complaints, or questions regarding our privacy framework, reach out to our privacy representative:
                  </p>
                  <div className="bg-[#FAF6FF] border border-primary/10 rounded-2xl p-5 inline-flex flex-col gap-3.5 min-w-[280px]">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-primary" />
                      <a href="mailto:lavendertsetrading@gmail.com" className="font-semibold text-primary hover:underline">lavendertsetrading@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <UserCheck size={16} className="text-primary" />
                      <span>Designated Privacy Team</span>
                    </div>
                  </div>
                  <p>
                    We acknowledge and resolve complaints within the periods defined by local legislation.
                  </p>
                </div>
              </section>

              {/* 34. INTERNATIONAL DATA PROCESSING */}
              <section id="international-data-processing" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  34. INTERNATIONAL DATA PROCESSING
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender coordinates with servers and service agencies globally. Data transferred to entities outside of your country of residence is handled with appropriate safeguards and compliance measures.
                  </p>
                </div>
              </section>

              {/* 35. THIRD-PARTY LINKS */}
              <section id="third-party-links" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  35. THIRD-PARTY LINKS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Our store links to external pages. We do not control or endorse the privacy practices of external websites. Review their specific disclosures before completing transactions on their pages.
                  </p>
                </div>
              </section>

              {/* 36. BUSINESS RECORDS */}
              <section id="business-records" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  36. BUSINESS RECORDS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    We retain official business logs (invoices, receipts, correspondence logs) as required by financial, corporate, and fiscal regulations.
                  </p>
                </div>
              </section>

              {/* 37. BUSINESS TRANSFERS */}
              <section id="business-transfers" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  37. BUSINESS TRANSFERS
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender does not reserve a blanket right to transfer your records without notification in the event of mergers or acquisition. Any future structural transaction will comply with legal rules.
                  </p>
                </div>
              </section>

              {/* 38. CHANGES TO THIS PRIVACY POLICY */}
              <section id="changes-to-this-privacy-policy" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  38. CHANGES TO THIS PRIVACY POLICY
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    We may update this policy to account for platform expansion or regulatory modifications. Revised policies display a modified &ldquo;Last Updated&rdquo; date at the top of the policy page. Material modifications will be highlighted via site notices where required.
                  </p>
                </div>
              </section>

              {/* 39. GOVERNING LEGAL FRAMEWORK */}
              <section id="governing-legal-framework" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  39. GOVERNING LEGAL FRAMEWORK
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Lavender operates in compliance with India's data privacy framework, including the **Digital Personal Data Protection (DPDP) Act, 2023** and subsequent rules notified in November 2025. For customers in foreign jurisdictions, local laws apply according to service transits.
                  </p>
                </div>
              </section>

              {/* 40. CONTACT US */}
              <section id="contact-us" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  40. CONTACT US
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-6">
                  <p>
                    For privacy requests or updates, contact our headquarters:
                  </p>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="bg-[#FAF6FF] border border-primary/10 rounded-2xl p-5 flex items-start gap-4">
                      <MapPin className="text-primary shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="font-display font-semibold text-gray-950 text-sm mb-1">Address</h4>
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
                          <a href="mailto:lavendertsetrading@gmail.com" className="text-xs text-primary hover:underline font-semibold">lavendertsetrading@gmail.com</a>
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

              {/* 41. EFFECTIVE DATE */}
              <section id="effective-date" className="privacy-section scroll-mt-28">
                <h2 className="font-display text-2xl font-bold text-primary mb-5 pb-2 border-b border-gold-pale/20">
                  41. EFFECTIVE DATE
                </h2>
                <div className="font-body text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    This Privacy Policy is effective from **4/1/2023** and was last updated on **4/1/2023**.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    This Privacy Policy should be read together with Lavender's other applicable website policies, including its Terms & Conditions, Shipping Policy, Return & Refund Policy, Cancellation Policy and Cookie Policy.
                  </p>
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
            className="fixed bottom-8 right-8 z-40 bg-primary text-white p-3 rounded-full shadow-premium hover:bg-primary-dark transition-all hover:scale-110 active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
      
    </div>
  );
}
