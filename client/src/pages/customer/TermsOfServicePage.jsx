import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowUp, Ban, Calendar, ChevronDown, ChevronRight, Clock,
  CreditCard, FileText, Globe, HelpCircle, Mail, MapPin, Package, Phone,
  Scale, Shield, ShoppingBag, Sparkles, Truck, User, X
} from 'lucide-react';

const sections = [
  ['about', 'About These Terms', 'These Terms of Service govern your access to and use of onlinelavender.com and the purchase of products from Lavender The Style Emporio. By using the website or placing an order, you agree to these Terms and our related policies.'],
  ['who-we-are', 'Who Lavender Is', 'Lavender The Style Emporio is the online fashion and ethnic-wear business operating on onlinelavender.com. References to “Lavender”, “we”, “us” or “our” mean Lavender The Style Emporio.'],
  ['eligibility', 'Eligibility to Use Our Website', 'You must be legally capable of entering into a binding contract under applicable Indian law to use this website or place an order. If you use the website for a business or another person, you confirm that you have authority to do so.'],
  ['account', 'Your Account', 'You are responsible for keeping your account details and password confidential and for all activity through your account. Please tell us promptly if you believe your account has been accessed without permission.'],
  ['product-information', 'Product Information', 'We make reasonable efforts to show product descriptions, colours, measurements and images accurately. Display colours can vary by screen, and minor differences may occur because products are made, finished or photographed individually.'],
  ['availability', 'Product Availability', 'Products are offered while stocks last. We may limit quantities, discontinue products or correct availability information at any time. A product shown online is not guaranteed to remain available until checkout is completed.'],
  ['prices', 'Prices', 'Prices are shown in Indian Rupees unless stated otherwise and include applicable taxes where indicated. Delivery charges, customs duties or other fees may be shown separately before you place an order.'],
  ['orders', 'Orders', 'An order request is made when you submit checkout. We may decline or cancel an order where there is an inventory issue, pricing error, suspected fraud, an address problem or another legitimate operational reason.'],
  ['confirmation', 'Order Confirmation', 'After receiving an order, we will send an acknowledgement to your registered email address. The acknowledgement confirms receipt of your request; acceptance of the order occurs when we confirm dispatch or otherwise expressly accept it.'],
  ['abandoned-checkouts', 'Abandoned Checkouts', 'If you leave checkout without completing payment, items are not reserved unless we expressly say so. We may send a reminder or release the items back into inventory.'],
  ['payments', 'Payments', 'Payments may be made through the payment methods displayed at checkout, including secure payments processed by Razorpay. You confirm that you are authorised to use the selected payment method.'],
  ['payment-failure', 'Payment Failure', 'If payment is declined, reversed or not received, we may hold, cancel or suspend the order until payment is successfully completed. We are not responsible for delays caused by a bank or payment provider.'],
  ['shipping', 'Shipping and Delivery', 'We dispatch orders to the address submitted at checkout using available delivery partners. Delivery estimates are indicative and can change because of location, weather, holidays, carrier delays or events outside our reasonable control.'],
  ['delivery-responsibility', 'Customer Delivery Responsibility', 'You must provide a complete and accurate delivery address and be available to receive the parcel. Additional costs or delays caused by an incorrect address, missed delivery or refusal may be your responsibility.'],
  ['international-orders', 'International Orders', 'International orders may be subject to shipping charges, import restrictions, customs duties, taxes and clearance requirements in the destination country. These costs and requirements are the customer’s responsibility unless expressly stated otherwise.'],
  ['international-returns', 'International Returns', 'International orders are generally not eligible for returns or exchanges unless we expressly agree otherwise in writing. Please review the Return & Refund Policy before ordering.'],
  ['returns', 'Returns', 'Returns are accepted only in accordance with our Return & Refund Policy, including its time limits, product condition requirements and exclusions. A return request does not guarantee approval until the product is inspected.'],
  ['exchanges', 'Exchanges', 'Exchanges are available only where permitted by our Return & Refund Policy and subject to size, colour and inventory availability. An approved exchange may be replaced with a refund where the requested product is unavailable.'],
  ['refunds', 'Refunds', 'Approved refunds are issued using the method and timeline described in our Return & Refund Policy. Bank, card, wallet or payment-provider processing times may affect when the amount reaches you.'],
  ['damaged-products', 'Damaged, Defective or Incorrect Products', 'Contact us as soon as possible with your order number, photographs and an unedited unboxing video where available. We will review the report and, where the issue is confirmed, provide the remedy available under our policy.'],
  ['care', 'Product Care', 'Follow the care instructions supplied with each product. Damage caused by incorrect washing, storage, alteration, wear, misuse or failure to follow care instructions may not qualify for a return, exchange or remedy.'],
  ['promotions', 'Promotional Offers', 'Promotions are subject to their stated conditions, validity period, product exclusions and availability. Offers cannot be combined unless expressly permitted, and we may correct or withdraw an offer affected by an obvious error.'],
  ['birthday-offers', 'Birthday Offers', 'Birthday offers, where available, are subject to eligibility, account details, verification and the terms communicated with the offer. They may be limited to one use and may exclude sale items, shipping or other promotions.'],
  ['marketing', 'Marketing Communications', 'With your consent, we may send updates about products, offers and the brand. You can unsubscribe from marketing emails using the link in the message; transactional messages about orders and accounts may still be sent.'],
  ['reviews', 'Customer Reviews and Content', 'If you submit a review, photograph or other content, you confirm that it is lawful, accurate and yours to share. You grant Lavender a non-exclusive, royalty-free licence to use, display and adapt it for operating and promoting the business, and we may remove content that breaches these Terms.'],
  ['intellectual-property', 'Intellectual Property', 'The website, its text, photography, graphics, logos, product designs, software and other materials belong to Lavender or its licensors. You may use them only for personal, non-commercial shopping and may not copy, modify, distribute or exploit them without permission.'],
  ['trademarks', 'Trademarks and Branding', 'Lavender The Style Emporio, its name, logos, marks, designs and brand presentation may not be used in a way that suggests endorsement or affiliation without our prior written consent.'],
  ['prohibited-use', 'Prohibited Use', 'You must not misuse the website, interfere with its operation, introduce malicious code, scrape content, impersonate another person, infringe rights, place fraudulent orders or use the website for unlawful or commercial purposes without permission.'],
  ['third-party', 'Third-Party Services', 'The website may use third-party services for payments, delivery, analytics, communications or other functions. Their own terms and privacy practices may apply, and Lavender is not responsible for services it does not control.'],
  ['marketplaces', 'Marketplaces', 'If you purchase through an authorised marketplace, that marketplace’s checkout, payment, shipping and customer-service terms may also apply. Where terms conflict, the terms shown for that transaction will govern the marketplace transaction.'],
  ['website-availability', 'Website Availability', 'We aim to keep the website available, but access may be interrupted for maintenance, updates, technical faults or events beyond our control. We may change, suspend or withdraw features without notice where reasonably necessary.'],
  ['accuracy', 'Accuracy of Information', 'We work to keep website information current, but errors or omissions may occur. We may correct information, including prices, descriptions and availability, and take appropriate action for affected orders.'],
  ['disclaimer', 'Disclaimer', 'To the extent permitted by law, the website and its content are provided on an “as available” basis. We do not promise that access will always be uninterrupted, error-free or free from harmful components. Nothing in these Terms excludes a right that cannot legally be excluded.'],
  ['liability', 'Limitation of Liability', 'To the maximum extent permitted by law, Lavender will not be liable for indirect, incidental, special or consequential loss arising from use of the website or a product. Our total liability for an order will not exceed the amount paid for that order, except where liability cannot legally be limited.'],
  ['force-majeure', 'Force Majeure', 'We are not responsible for delay or failure caused by events beyond our reasonable control, including natural disasters, epidemics, war, government action, strikes, infrastructure failures, carrier disruption or payment-network outages.'],
  ['privacy', 'Privacy', 'Our Privacy Policy explains how we collect, use, store and protect personal information. By using the website, you acknowledge that information may be handled as described in that policy.'],
  ['termination', 'Termination', 'We may suspend or terminate access to the website or an account if these Terms are breached, activity is fraudulent or harmful, or suspension is necessary to protect customers or the business. Provisions that should continue by their nature will survive termination.'],
  ['changes', 'Changes to These Terms', 'We may update these Terms from time to time. The updated version will be posted on this page with a revised date. Your continued use of the website after an update means you accept the revised Terms for future use and orders.'],
  ['law', 'Governing Law', 'These Terms are governed by the laws of India. Subject to applicable consumer-protection rights, the courts having jurisdiction over Thiruvananthapuram, Kerala will have jurisdiction over matters relating to these Terms.'],
  ['disputes', 'Disputes', 'Please contact us first so we can try to resolve a concern promptly. If a dispute cannot be resolved informally, it will be handled by the competent courts and legal processes available under Indian law.'],
  ['contact', 'Contact Information', 'For questions about these Terms, orders or support, contact Lavender The Style Emporio at lavendertsetrading@gmail.com, +91 89214 18188, or onlinelavender.com. Our address is Opposite, Technopark Phase III Main Rd, Mukkolackal, Kazhakkoottam, Thiruvananthapuram, Kerala 695582. GSTIN: [GSTIN PLACEHOLDER].'],
  ['effective-date', 'Effective Date', 'These Terms are effective from 4/1/2023 and were last updated on 4/1/2023.']
];

const sectionIcons = { account: User, payments: CreditCard, shipping: Truck, returns: Package, privacy: Shield, 'intellectual-property': Sparkles, disputes: Scale, law: Scale };
const importantSections = new Set(['liability', 'law', 'disputes']);

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState(() => new Set(sections.map(([id]) => id)));
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sectionLinks = useMemo(() => sections.map(([id, title], index) => ({ id, label: `${index + 1}. ${title}` })), []);

  useEffect(() => {
    document.title = 'Terms of Service | Lavender The Style Emporio';
    const meta = document.querySelector('meta[name="description"]');
    const previous = meta?.getAttribute('content');
    if (meta) meta.setAttribute('content', 'Terms of Service for Lavender The Style Emporio and onlinelavender.com.');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)), { rootMargin: '-15% 0px -75% 0px' });
    document.querySelectorAll('.terms-section').forEach((element) => observer.observe(element));
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => { document.title = 'Lavender | The Style Emporio'; if (meta && previous) meta.setAttribute('content', previous); observer.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const scrollToSection = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveSection(id); setMobileMenuOpen(false); };
  const toggleSection = (id) => setOpenSections((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });

  return (
    <div className="min-h-screen bg-[#FBF8FF] text-gray-900 pb-20">
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-[#f7efff] via-[#f9f3ff] to-[#FBF8FF] border-b border-gold-pale/25">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_top_left,#4A1068,transparent_55%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-5"><FileText size={13} className="text-primary" /><span className="font-accent text-primary text-sm italic tracking-wide">Legal & Customer Care</span></div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-955 leading-tight mb-4">Terms of Service</h1>
          <p className="font-accent text-lg italic text-gold mb-8">Lavender The Style Emporio</p>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed mb-8">A clear guide to shopping with us, from product information and payment to delivery, returns and your rights.</p>
          <div className="flex flex-wrap justify-center items-center gap-3 max-w-3xl mx-auto"><span className="badge badge-primary px-4 py-2 text-xs">30-Day Returns</span><span className="badge badge-purple px-4 py-2 text-xs">Secure Payments via Razorpay</span><span className="badge badge-gold px-4 py-2 text-xs">Governed by Indian Law</span></div>
          <div className="flex flex-wrap justify-center items-center gap-5 mt-8 text-xs text-gray-500"><span className="flex items-center gap-2"><Globe size={13} />onlinelavender.com</span><span className="flex items-center gap-2"><Calendar size={13} />Effective: 4/1/2023</span><span className="flex items-center gap-2"><Clock size={13} />Updated: 4/1/2023</span></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 print:hidden"><nav className="flex items-center gap-2 text-xs text-gray-500"><Link to="/" className="hover:text-primary transition-colors">Home</Link><ChevronRight size={12} /><span className="text-primary font-semibold">Terms of Service</span></nav></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden sticky top-20 z-30 mb-5 print:hidden"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-full flex items-center justify-between bg-white border border-gold-pale/60 px-5 py-3.5 rounded-2xl shadow-card text-gray-800 text-sm font-semibold" aria-expanded={mobileMenuOpen}><span className="flex items-center gap-2 text-primary"><FileText size={16} />Table of Contents</span>{mobileMenuOpen ? <X size={17} /> : <ChevronDown size={17} />}</button>{mobileMenuOpen && <div className="mt-2 bg-white rounded-2xl border border-gold-pale/50 shadow-premium max-h-[60vh] overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-1">{sectionLinks.map((item) => <button key={item.id} onClick={() => scrollToSection(item.id)} className={`text-left px-3 py-2 rounded-xl text-xs transition-colors ${activeSection === item.id ? 'bg-primary text-white font-semibold' : 'text-gray-600 hover:bg-champagne-light/50 hover:text-primary'}`}>{item.label}</button>)}</div>}</div>}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="hidden lg:block lg:w-72 sticky top-28 shrink-0 print:hidden"><div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-card border border-gold-pale/40 max-h-[calc(100vh-160px)] flex flex-col"><h2 className="font-display text-lg font-bold text-gray-950 mb-4 pb-3 border-b border-gold-pale/25 flex items-center gap-2"><FileText size={18} className="text-primary" />Sections</h2><div className="overflow-y-auto pr-2 space-y-1">{sectionLinks.map((item) => <button key={item.id} onClick={() => scrollToSection(item.id)} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all ${activeSection === item.id ? 'bg-primary text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-champagne-light/40 hover:text-primary'}`}>{item.label}</button>)}</div></div></aside>
          <main className="flex-1 min-w-0"><div className="bg-white rounded-2xl border border-primary/10 px-5 py-4 mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600"><HelpCircle size={18} className="text-primary shrink-0" /><span>Need a policy at a glance?</span><Link to="/return-policy" className="text-primary font-semibold hover:underline">Return & Refund Policy</Link><Link to="/privacy-policy" className="text-primary font-semibold hover:underline">Privacy Policy</Link><span className="text-gray-300">|</span><span>Shipping details are included in section 14.</span></div>
            <div className="space-y-4">{sections.map(([id, title, text], index) => { const Icon = sectionIcons[id] || (importantSections.has(id) ? AlertTriangle : ShoppingBag); const isOpen = openSections.has(id); return <section key={`${id}-${index}`} id={id} className={`terms-section scroll-mt-28 rounded-2xl border shadow-card overflow-hidden ${importantSections.has(id) ? 'bg-[#fffaf0] border-gold/40' : 'bg-white border-gold-pale/40'}`}><button onClick={() => toggleSection(id)} className="w-full text-left flex items-center gap-3 px-5 sm:px-7 py-5" aria-expanded={isOpen} aria-controls={`${id}-content`}><span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${importantSections.has(id) ? 'bg-gold/15 text-gold' : 'bg-primary/8 text-primary'}`}><Icon size={18} /></span><h2 className="font-display text-lg sm:text-xl font-bold text-primary flex-1">{index + 1}. {title}</h2><ChevronDown size={19} className={`text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>{isOpen && <div id={`${id}-content`} className="px-5 sm:px-7 pb-6 pl-[4.25rem] sm:pl-[5.75rem] text-[16px] text-gray-700 leading-7"><p>{text}</p></div>}</section>; })}</div>
            <section className="mt-8 rounded-3xl bg-gradient-to-br from-[#F7EFFF] to-[#EDE0FA] border border-primary/15 text-[#2D0845] p-7 sm:p-10"><p className="section-tag text-gold mb-2">We are here to help</p><h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Questions about your order or these Terms?</h2><p className="text-gray-600 text-sm leading-6 max-w-2xl mb-6">Our support team can help with product, payment, delivery and policy questions.</p><div className="flex flex-col sm:flex-row flex-wrap gap-3 text-sm"><a href="mailto:lavendertsetrading@gmail.com" className="btn-gold"><Mail size={16} />Email us</a><a href="tel:+918921418188" className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-3 hover:bg-primary/5"><Phone size={16} />+91 89214 18188</a><span className="inline-flex items-center gap-2 px-1 py-3 text-gray-600"><MapPin size={16} />Thiruvananthapuram, Kerala</span></div></section>
          </main>
        </div>
      </div>
      {showScrollTop && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 right-8 z-40 bg-primary text-white p-3 rounded-full shadow-premium hover:bg-primary-dark transition-all print:hidden" aria-label="Back to top"><ArrowUp size={20} /></button>}
    </div>
  );
}