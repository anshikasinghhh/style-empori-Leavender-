import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ShoppingBag, Truck, Star } from 'lucide-react';

export default function PaymentSuccessPage() {
  const orderNum = 'VE' + Date.now().toString().slice(-6);
  const delivery = new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
  return (
    <div className="max-w-lg mx-auto px-4 pt-28 pb-16 text-center">
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', duration:0.7, bounce:0.4 }}>
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-card">
          <CheckCircle size={50} className="text-emerald-500" strokeWidth={1.5}/>
        </div>
      </motion.div>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
        <div className="flex justify-center gap-1 mb-4">{[1,2,3,4,5].map(s => <Star key={s} size={18} className="text-gold-light fill-gold-light"/>)}</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
        <p className="font-body text-gray-500 mb-1">Thank you for shopping with <span className="font-semibold text-primary">Lavender</span></p>
        <p className="font-body text-gray-400 text-sm mb-8">A confirmation email has been sent to your inbox</p>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 mb-8 text-left space-y-4">
          {[['Order Number', `#${orderNum}`],['Estimated Delivery', delivery],['Payment Status', 'Confirmed ✓'],['Shipping', 'FREE Express Delivery']].map(([l,v]) => (
            <div key={l} className="flex justify-between items-center text-sm font-body border-b border-gray-50 pb-3 last:border-0 last:pb-0">
              <span className="text-gray-500">{l}</span>
              <span className={`font-semibold ${l === 'Payment Status' ? 'text-emerald-600' : 'text-gray-900'}`}>{v}</span>
            </div>
          ))}
        </div>

        <div className="bg-champagne-light/80 rounded-2xl p-4 mb-8 flex items-center gap-3 text-left">
          <Truck size={20} className="text-primary shrink-0"/>
          <div><p className="font-body font-semibold text-gray-800 text-sm">Your order is being prepared</p><p className="font-body text-xs text-gray-500">You'll receive tracking updates via SMS & email</p></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/orders" className="flex-1 btn-outline gap-2 py-3.5 text-center"><Package size={16}/> Track Order</Link>
          <Link to="/" className="flex-1 btn-primary gap-2 py-3.5 text-center"><ShoppingBag size={16}/> Shop More</Link>
        </div>
      </motion.div>
    </div>
  );
}
