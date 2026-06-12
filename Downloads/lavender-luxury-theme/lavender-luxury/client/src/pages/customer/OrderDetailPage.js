import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Package, Truck, CheckCircle, Clock, Star } from 'lucide-react';
import { PRODUCTS, formatPrice } from '../../utils/data';

const DEMO_ORDER = { orderNumber:'VE174521', orderStatus:'shipped', paymentStatus:'paid', total:9499, subtotal:9499, shipping:0, tax:0, createdAt:'2025-02-10', estimatedDelivery:'2025-02-17', items:[{ product:PRODUCTS[0], quantity:1, size:'Free Size', price:9499 }], shippingAddress:{ name:'Priya Sharma', street:'42 Lotus Colony, Bandra West', city:'Mumbai', state:'Maharashtra', pincode:'400050', phone:'+91 98765 43210' }, paymentMethod:'razorpay' };
const TRACK_STEPS = [{ status:'Order Placed', done:true, time:'10 Feb, 9:30 AM' },{ status:'Confirmed', done:true, time:'10 Feb, 11:00 AM' },{ status:'Processing', done:true, time:'11 Feb, 2:00 PM' },{ status:'Shipped', done:true, time:'12 Feb, 6:00 PM', note:'AWB: IND987654321' },{ status:'Out for Delivery', done:false, time:'Expected 15 Feb' },{ status:'Delivered', done:false, time:'Expected 17 Feb' }];

export default function OrderDetailPage() {
  const { id } = useParams();
  const order = DEMO_ORDER;
  const currentStep = TRACK_STEPS.filter(s => s.done).length - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <Link to="/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-body text-sm mb-8 transition-colors"><ArrowLeft size={16}/> Back to Orders</Link>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="font-body text-gray-500 text-sm mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <span className="badge bg-primary-100 text-primary border border-primary-200 text-sm px-4 py-2 capitalize">{order.orderStatus}</span>
      </div>

      {/* Tracking */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 mb-6">
        <h2 className="font-display font-bold text-gray-900 mb-6 flex items-center gap-2"><Truck size={18} className="text-primary"/>Order Tracking</h2>
        <div className="relative">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100"/>
          <div className="absolute left-4 top-4 w-0.5 bg-primary transition-all" style={{ height:`${(currentStep/Math.max(TRACK_STEPS.length-1,1))*100}%` }}/>
          <div className="space-y-5">
            {TRACK_STEPS.map((step, i) => (
              <div key={step.status} className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 text-xs font-bold transition-all ${step.done ? 'bg-primary text-white shadow-card' : 'bg-gray-100 text-gray-400'}`}>
                  {step.done ? '✓' : i + 1}
                </div>
                <div className="pb-2">
                  <p className={`font-body font-semibold text-sm ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.status}</p>
                  <p className={`font-body text-xs mt-0.5 ${step.done ? 'text-gray-500' : 'text-gray-300'}`}>{step.time}</p>
                  {step.note && <p className="font-body text-xs text-primary mt-0.5 bg-champagne-light/80 px-2 py-0.5 rounded-full inline-block">{step.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 mb-6">
        <h2 className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={18} className="text-primary"/>Items Ordered</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 p-3 bg-champagne-light/80 rounded-xl border border-primary-100">
            <img src={item.product.images[0].url} alt={item.product.name} className="w-20 h-24 object-cover rounded-xl shadow-sm"/>
            <div className="flex-1">
              <p className="font-body text-xs font-bold text-primary uppercase tracking-widest mb-0.5">{item.product.category?.name}</p>
              <p className="font-body font-bold text-gray-900 text-sm">{item.product.name}</p>
              <p className="font-body text-xs text-gray-500 mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
              <p className="font-display font-bold text-primary mt-2">{formatPrice(item.price * item.quantity)}</p>
            </div>
            <Link to={`/products/${item.product._id}`} className="btn-ghost text-xs py-1.5 px-3 h-fit self-start">Buy Again</Link>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60">
          <h3 className="font-body font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><MapPin size={15} className="text-primary"/>Delivery Address</h3>
          <p className="font-body font-semibold text-gray-900 text-sm">{order.shippingAddress.name}</p>
          <p className="font-body text-gray-500 text-xs mt-1">{order.shippingAddress.street}</p>
          <p className="font-body text-gray-500 text-xs">{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
          <p className="font-body text-gray-500 text-xs mt-1">{order.shippingAddress.phone}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60">
          <h3 className="font-body font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><CreditCard size={15} className="text-primary"/>Payment Summary</h3>
          <div className="space-y-2 text-sm font-body">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-emerald-600 font-semibold">FREE</span></div>
            <div className="flex justify-between text-gray-600"><span>Payment via</span><span className="font-semibold capitalize">{order.paymentMethod}</span></div>
            <div className="flex justify-between font-bold border-t border-gray-50 pt-2 mt-1">
              <span className="font-display text-gray-900">Total</span>
              <span className="font-display text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
