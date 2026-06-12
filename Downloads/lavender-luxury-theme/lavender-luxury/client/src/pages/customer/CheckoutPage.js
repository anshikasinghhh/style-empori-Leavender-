import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, CheckCircle, MapPin, Shield, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { PRODUCTS, formatPrice } from '../../utils/data';
import { clearCart } from '../../slices/cartSlice';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Address', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState({ name:'', street:'', city:'', state:'', pincode:'', phone:'' });
  const [payMethod, setPayMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const { items } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const enriched = items.map(item => ({
    ...item,
    product: item.product?.price ? item.product : PRODUCTS.find(p => p._id === (item.product?._id || item.product)) || item.product
  }));

  const subtotal = enriched.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlace = async () => {
    if (loading) return;
    setLoading(true);
    const toastId = toast.loading('Processing your order...');
    
    try {
      // 1. Format order items
      const orderItems = enriched.map(i => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.images?.[0]?.url,
        price: i.product.price,
        quantity: i.quantity,
        size: i.size || 'Free Size',
        color: i.color || 'Default'
      }));

      // 2. Create order in DB
      const orderData = {
        items: orderItems,
        shippingAddress: {
          name: addr.name || user?.name || '',
          street: addr.street,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          phone: addr.phone
        },
        paymentMethod: payMethod
      };

      const { data: orderRes } = await api.post('/orders', orderData);
      if (!orderRes.success) {
        throw new Error(orderRes.message || 'Failed to create order');
      }

      const orderId = orderRes.order._id;

      // 3. Handle Cash on Delivery (COD)
      if (payMethod === 'cod') {
        const { data: codRes } = await api.post('/payments/cod/confirm', { orderId });
        if (codRes.success) {
          dispatch(clearCart());
          toast.success('Order placed successfully! 🎉', { id: toastId });
          setTimeout(() => navigate('/payment/success'), 800);
        } else {
          throw new Error(codRes.message || 'Failed to confirm COD order');
        }
        return;
      }

      // 4. Handle Stripe warning
      if (payMethod === 'stripe') {
        toast.error('Stripe payments are not configured in this region yet. Please choose Razorpay or COD.', { id: toastId });
        setLoading(false);
        return;
      }

      // 5. Handle Razorpay Payment
      if (payMethod === 'razorpay') {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
        }

        const { data: rzpOrderRes } = await api.post('/payments/razorpay/create-order', {
          amount: total,
          orderId
        });

        if (!rzpOrderRes.success) {
          throw new Error(rzpOrderRes.message || 'Failed to generate payment session');
        }

        const { order: rzpOrder, key } = rzpOrderRes;

        const options = {
          key,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: 'Lavender',
          description: 'Secure Payment for Premium Ethnic Wear',
          image: 'https://cdn-icons-png.flaticon.com/512/3068/3068327.png',
          order_id: rzpOrder.id,
          handler: async function (response) {
            const verifyToastId = toast.loading('Verifying transaction...');
            try {
              const verifyData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
                amount: total
              };

              const { data: verifyRes } = await api.post('/payments/razorpay/verify', verifyData);
              if (verifyRes.success) {
                dispatch(clearCart());
                toast.success('Payment successful & order confirmed! 🛍️', { id: verifyToastId });
                navigate('/payment/success');
              } else {
                throw new Error(verifyRes.message || 'Signature verification failed');
              }
            } catch (err) {
              toast.error(err.message || 'Payment verification failed', { id: verifyToastId });
              setLoading(false);
            }
          },
          prefill: {
            name: addr.name || user?.name || '',
            email: user?.email || '',
            contact: addr.phone || ''
          },
          notes: {
            address: `${addr.street}, ${addr.city}`
          },
          theme: {
            color: '#4A1068'
          },
          modal: {
            ondismiss: function () {
              toast.dismiss(toastId);
              toast.error('Payment cancelled');
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        toast.dismiss(toastId);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to place order', { id: toastId });
      setLoading(false);
    }
  };

  const PAY_OPTIONS = [
    { id:'razorpay', label:'Razorpay', desc:'UPI, Cards, Net Banking, Wallets', icon:'🏦', badge:'Recommended' },
    { id:'stripe',   label:'Stripe',   desc:'International cards (Visa/Mastercard)', icon:'💳', badge:'' },
    { id:'cod',      label:'Cash on Delivery', desc:'Pay when your order arrives at door', icon:'💵', badge:'' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-gray-300'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-body transition-all ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-primary text-white shadow-card' : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`font-body text-sm font-semibold hidden sm:inline ${i <= step ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all ${i < step ? 'bg-emerald-400' : 'bg-gray-100'}`}/>}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Step 0 — Address */}
          {step === 0 && (
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-5 flex items-center gap-2"><MapPin size={20} className="text-primary"/>Delivery Address</h2>
              <div className="grid grid-cols-2 gap-4">
                {[{k:'name',l:'Full Name',col:2,p:'Your full name'},{k:'street',l:'Street / Area',col:2,p:'House no., Street, Area'},{k:'city',l:'City',col:1,p:'City'},{k:'state',l:'State',col:1,p:'State'},{k:'pincode',l:'PIN Code',col:1,p:'6-digit PIN'},{k:'phone',l:'Phone Number',col:1,p:'+91 XXXXX XXXXX'}].map(({k,l,col,p}) => (
                  <div key={k} className={col===2?'col-span-2':''}>
                    <label className="font-body text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">{l}</label>
                    <input value={addr[k]} onChange={e => setAddr(a => ({...a,[k]:e.target.value}))} placeholder={p} className="input-field text-sm"/>
                  </div>
                ))}
              </div>
              <button onClick={() => { if(!addr.name||!addr.city) { toast.error('Please fill required fields'); return; } setStep(1); }} className="w-full btn-primary mt-6 py-4 gap-2">Continue to Payment <ChevronRight size={16}/></button>
            </motion.div>
          )}

          {/* Step 1 — Payment */}
          {step === 1 && (
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-5 flex items-center gap-2"><CreditCard size={20} className="text-primary"/>Payment Method</h2>
              <div className="space-y-3 mb-6">
                {PAY_OPTIONS.map(opt => (
                  <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod===opt.id ? 'border-primary bg-champagne-light/80' : 'border-gray-100 hover:border-primary-200'}`}>
                    <input type="radio" name="pay" value={opt.id} checked={payMethod===opt.id} onChange={() => setPayMethod(opt.id)} className="text-primary w-4 h-4"/>
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-body font-bold text-gray-900 text-sm">{opt.label}</p>
                        {opt.badge && <span className="badge bg-emerald-100 text-emerald-700 text-[10px]">{opt.badge}</span>}
                      </div>
                      <p className="font-body text-gray-500 text-xs mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-champagne-light/80 rounded-xl p-3 mb-6">
                <Shield size={15} className="text-primary shrink-0"/>
                <p className="font-body text-xs text-gray-600">Your payment is secured with 256-bit SSL encryption</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 btn-outline">← Back</button>
                <button onClick={() => setStep(2)} className="flex-1 btn-primary gap-2">Review Order <ChevronRight size={16}/></button>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Review */}
          {step === 2 && (
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-5 flex items-center gap-2"><CheckCircle size={20} className="text-primary"/>Review & Place Order</h2>
              <div className="space-y-3 mb-6">
                {enriched.map(item => (
                  <div key={item._id} className="flex gap-3 bg-champagne-light/80 rounded-xl p-3 border border-primary-100">
                    <img src={item.product?.images?.[0]?.url || PRODUCTS[0].images[0].url} alt="" className="w-14 h-16 object-cover rounded-lg shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-gray-900 text-sm line-clamp-1">{item.product?.name}</p>
                      <p className="font-body text-xs text-gray-500 mt-0.5">Qty: {item.quantity}{item.size ? ` · Size: ${item.size}` : ''}</p>
                      <p className="font-display font-bold text-primary text-sm mt-1">{formatPrice((item.product?.price||0)*item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-body font-bold text-gray-800 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5"><MapPin size={12} className="text-primary"/>Delivery To</p>
                  <p className="font-body text-sm text-gray-700 font-semibold">{addr.name || user?.name}</p>
                  <p className="font-body text-xs text-gray-500">{addr.street}, {addr.city}</p>
                  <p className="font-body text-xs text-gray-500">{addr.state} – {addr.pincode}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-body font-bold text-gray-800 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5"><CreditCard size={12} className="text-primary"/>Payment Via</p>
                  <p className="font-body text-sm text-gray-700 font-semibold capitalize">{payMethod === 'cod' ? 'Cash on Delivery' : payMethod.charAt(0).toUpperCase()+payMethod.slice(1)}</p>
                  <p className="font-body text-xs text-gray-500 mt-0.5">Estimated delivery: 5–7 business days</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 btn-outline" disabled={loading}>← Back</button>
                <button onClick={handlePlace} disabled={loading} className="flex-1 btn-primary py-4 text-base gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  ) : (
                    <><Truck size={18}/> Place Order · {formatPrice(total)}</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60 h-fit sticky top-28">
          <h3 className="font-display font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {enriched.map(i => (
              <div key={i._id} className="flex justify-between text-xs font-body text-gray-600">
                <span className="truncate mr-2 flex-1">{i.product?.name?.substring(0,26)}… ×{i.quantity}</span>
                <span className="shrink-0 font-semibold">{formatPrice((i.product?.price||0)*i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-50 pt-3 space-y-2 text-sm font-body">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping===0?'text-emerald-600 font-bold':'font-semibold'}>{shipping===0?'FREE':formatPrice(shipping)}</span></div>
            <div className="flex justify-between font-bold text-base border-t border-gray-50 pt-2 mt-1">
              <span className="font-display text-gray-900">Total</span>
              <span className="font-display text-primary text-lg">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
