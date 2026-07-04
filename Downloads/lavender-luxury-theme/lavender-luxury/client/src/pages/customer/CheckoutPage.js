import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, CheckCircle, MapPin, Shield, ChevronRight, Heart, Gift } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { PRODUCTS, formatPrice } from '../../utils/data';
import { clearCart } from '../../slices/cartSlice';
import axios from 'axios';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Address', 'Payment', 'Confirm'];
const GIFT_WRAP_COST = 50;
const DONATION_PRESETS = [3, 5, 10];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState({ name:'', street:'', city:'', state:'', pincode:'', phone:'' });
  const [payMethod, setPayMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [donationPreset, setDonationPreset] = useState(null);
  const [customDonation, setCustomDonation] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [handlingCharge, setHandlingCharge] = useState(0);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardDiscount, setGiftCardDiscount] = useState(0);
  const [giftCardLoading, setGiftCardLoading] = useState(false);
  const [giftCardMessage, setGiftCardMessage] = useState('');
  const [giftCardBalance, setGiftCardBalance] = useState(0);
  const { items } = useSelector(s => s.cart);
  const { user, token } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const enriched = items.map(item => ({
    ...item,
    product: item.product?.price ? item.product : PRODUCTS.find(p => p._id === (item.product?._id || item.product)) || item.product
  }));

  const subtotal = enriched.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const giftWrapCost = giftWrap ? GIFT_WRAP_COST : 0;
  const donationAmount =
    donationPreset === 'custom'
      ? Math.max(0, Number(customDonation) || 0)
      : donationPreset
        ? donationPreset
        : 0;
  const total = Math.max(0, subtotal - couponDiscount - giftCardDiscount + shipping + handlingCharge + tax + giftWrapCost + donationAmount);

  useEffect(() => {
    const loadAvailableCoupons = async () => {
      try {
        const { data } = await api.get('/coupons/available');
        setAvailableCoupons(data.coupons || []);
      } catch (error) {
        console.error('Failed to load coupons', error);
      }
    };

    const loadHandlingCharge = async () => {
      try {
        const { data } = await api.get('/coupons/settings');
        setHandlingCharge(Number(data.settings?.handlingCharge || 0));
      } catch (error) {
        console.error('Failed to load handling charge', error);
      }
    };

    loadAvailableCoupons();
    loadHandlingCharge();
  }, []);

  useEffect(() => {
    if (!selectedCouponCode) return;
    const selectedCoupon = availableCoupons.find((coupon) => coupon.code === selectedCouponCode);
    if (!selectedCoupon) {
      setSelectedCouponCode('');
      setCouponDiscount(0);
      setCouponMessage('');
    }
  }, [availableCoupons, selectedCouponCode]);

  const selectDonation = (amount) => {
    if (donationPreset === amount) {
      setDonationPreset(null);
      setCustomDonation('');
      return;
    }
    setDonationPreset(amount);
    if (amount !== 'custom') setCustomDonation('');
  };

  const handleApplyCoupon = async (code) => {
    const normalizedCode = code?.trim().toUpperCase();
    if (!normalizedCode) {
      setSelectedCouponCode('');
      setCouponDiscount(0);
      setCouponMessage('');
      return;
    }

    setCouponLoading(true);
    setCouponMessage('');

    try {
      const { data } = await api.post('/coupons/validate', {
        code: normalizedCode,
        orderValue: subtotal
      });

      if (!data.success) {
        throw new Error(data.message || 'Coupon could not be applied');
      }

      setSelectedCouponCode(data.coupon.code);
      setCouponDiscount(data.discount || 0);
      setCouponMessage(`${data.coupon.code} applied successfully`);
      toast.success(`${data.coupon.code} applied successfully`);
    } catch (error) {
      setSelectedCouponCode('');
      setCouponDiscount(0);
      const message = error.response?.data?.message || error.message || 'Coupon could not be applied';
      setCouponMessage(message);
      toast.error(message);
    } finally {
      setCouponLoading(false);
    }
  };

  const clearCoupon = () => {
    setSelectedCouponCode('');
    setCouponDiscount(0);
    setCouponMessage('');
  };

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
        paymentMethod: payMethod,
        couponCode: selectedCouponCode || undefined,
        couponDiscount,
        giftWrap,
        donationAmount,
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

        // Use raw axios to avoid 401 interceptor redirect during payment
        const baseURL = process.env.REACT_APP_API_URL || '/api';
        const { data: rzpOrderRes } = await axios.post(`${baseURL}/payments/razorpay/create-order`, { orderId }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!rzpOrderRes.success) {
          throw new Error(rzpOrderRes.message || 'Failed to generate payment session');
        }

        if (!rzpOrderRes.key) {
          throw new Error('Razorpay is not configured on the server. Contact support.');
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
                orderId
              };

              // Use raw axios to avoid 401 interceptor redirect during payment
              const baseURL = process.env.REACT_APP_API_URL || '/api';
              const { data: verifyRes } = await axios.post(`${baseURL}/payments/razorpay/verify`, verifyData, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });
              if (verifyRes.success) {
                dispatch(clearCart());
                toast.success('Payment successful & order confirmed! 🛍️', { id: verifyToastId });
                navigate('/payment/success');
              } else {
                throw new Error(verifyRes.message || 'Signature verification failed');
              }
            } catch (err) {
              console.error('Payment verification error:', err);
              if (err.response?.status === 401) {
                toast.error('Session expired. Please login again.', { id: verifyToastId });
                navigate('/login?redirect=/checkout');
              } else {
                toast.error(err.response?.data?.message || err.message || 'Payment verification failed', { id: verifyToastId });
              }
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
            },
            onerror: function (err) {
              console.error('Razorpay error:', err);
              toast.dismiss(toastId);
              toast.error(err?.reason || 'Payment failed. Please try again.');
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
          toast.dismiss(toastId);
          toast.error(response.error?.description || 'Payment failed');
          setLoading(false);
        });
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
                  {giftWrap && <p className="font-body text-xs text-primary mt-1 flex items-center gap-1"><Gift size={11}/> Gift wrap included (+{formatPrice(GIFT_WRAP_COST)})</p>}
                  {donationAmount > 0 && <p className="font-body text-xs text-rose mt-1 flex items-center gap-1"><Heart size={11}/> Donation: {formatPrice(donationAmount)}</p>}
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
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="font-semibold">{formatPrice(shipping)}</span></div>
            {handlingCharge > 0 && (
              <div className="flex justify-between text-gray-600"><span>Handling Charge</span><span className="font-semibold">{formatPrice(handlingCharge)}</span></div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600"><span>Coupon Discount</span><span className="font-semibold">-{formatPrice(couponDiscount)}</span></div>
            )}
            {giftCardDiscount > 0 && (
              <div className="flex justify-between text-emerald-600"><span>Gift Card</span><span className="font-semibold">-{formatPrice(giftCardDiscount)}</span></div>
            )}
            <div className="flex justify-between text-gray-600"><span>Tax (5%)</span><span className="font-semibold">{formatPrice(tax)}</span></div>
            {giftWrapCost > 0 && (
              <div className="flex justify-between text-gray-600"><span>Gift Wrap</span><span className="font-semibold">{formatPrice(giftWrapCost)}</span></div>
            )}
            {donationAmount > 0 && (
              <div className="flex justify-between text-gray-600"><span>Donation</span><span className="font-semibold text-rose">{formatPrice(donationAmount)}</span></div>
            )}
            <div className="flex justify-between font-bold text-base border-t border-gray-50 pt-2 mt-1">
              <span className="font-display text-gray-900">Total</span>
              <span className="font-display text-primary text-lg">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="border-t border-gray-50 mt-5 pt-5 space-y-5">
            <div>
              <p className="font-body font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                <Gift size={15} className="text-primary" /> Coupons
              </p>
              <p className="font-body text-xs text-gray-500 mb-3">Available offers from admin and staff are shown here for today’s order.</p>
              <select
                value={selectedCouponCode}
                onChange={(e) => handleApplyCoupon(e.target.value)}
                disabled={couponLoading || availableCoupons.length === 0}
                className="input-field text-sm"
              >
                <option value="">{availableCoupons.length ? 'Select a coupon' : 'No coupons available'}</option>
                {availableCoupons.map((coupon) => {
                  const isEligible = subtotal >= (coupon.minOrderValue || 0);
                  return (
                    <option key={coupon._id} value={coupon.code}>
                      {coupon.code} · {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`} off{isEligible ? '' : ` · Min ₹${coupon.minOrderValue || 0}`}
                    </option>
                  );
                })}
              </select>
              {couponMessage && (
                <p className={`font-body text-xs mt-2 ${couponDiscount > 0 ? 'text-emerald-600' : 'text-rose'}`}>{couponMessage}</p>
              )}
              {couponDiscount > 0 && (
                <button type="button" onClick={clearCoupon} className="text-xs font-semibold text-primary mt-2">
                  Remove coupon
                </button>
              )}
            </div>

            <div>
              <p className="font-body font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                <Gift size={15} className="text-primary" /> Gift Wrap
              </p>
              <p className="font-body text-xs text-gray-500 mb-3">Premium packaging for a special touch</p>
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${giftWrap ? 'border-primary bg-champagne-light/80' : 'border-gray-100 hover:border-primary-200'}`}>
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="font-body text-sm text-gray-800 flex-1">Add gift wrap</span>
                <span className="font-body text-sm font-bold text-primary">+{formatPrice(GIFT_WRAP_COST)}</span>
              </label>
            </div>

            <div>
              <p className="font-body font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                <Gift size={15} className="text-primary" /> Gift Card
              </p>
              <p className="font-body text-xs text-gray-500 mb-3">Have a gift card? Enter the code here</p>
              <div className="flex gap-2">
                <input value={giftCardCode} onChange={e => setGiftCardCode(e.target.value.toUpperCase())}
                  placeholder="LAV-XXXX-XXXX" maxLength={12}
                  className="flex-1 input-field text-sm font-mono tracking-wider" />
                <button onClick={async () => {
                  const code = giftCardCode.trim();
                  if (!code) { toast.error('Enter a gift card code'); return; }
                  setGiftCardLoading(true);
                  try {
                    const { data } = await api.post('/giftcards/verify', { code });
                    if (data.success) {
                      const applyAmount = Math.min(data.giftCard.remainingBalance, total);
                      const redeemRes = await api.post('/giftcards/redeem', { code, amount: applyAmount });
                      if (redeemRes.data.success) {
                        setGiftCardDiscount(redeemRes.data.redeemed);
                        setGiftCardBalance(redeemRes.data.remainingBalance);
                        setGiftCardMessage(`Gift card applied! ₹${redeemRes.data.redeemed} deducted`);
                        toast.success('Gift card applied!');
                      }
                    }
                  } catch (err) {
                    setGiftCardMessage(err.response?.data?.message || 'Invalid gift card');
                    toast.error(err.response?.data?.message || 'Invalid gift card code');
                  } finally {
                    setGiftCardLoading(false);
                  }
                }} disabled={giftCardLoading}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-body font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                  {giftCardLoading ? '...' : 'Apply'}
                </button>
              </div>
              {giftCardMessage && (
                <p className={`font-body text-xs mt-2 ${giftCardDiscount > 0 ? 'text-emerald-600' : 'text-rose'}`}>{giftCardMessage}</p>
              )}
              {giftCardDiscount > 0 && (
                <button type="button" onClick={() => { setGiftCardCode(''); setGiftCardDiscount(0); setGiftCardMessage(''); setGiftCardBalance(0); }}
                  className="text-xs font-semibold text-primary mt-2">Remove gift card</button>
              )}
            </div>

            <div>
              <p className="font-body font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                <Heart size={15} className="text-rose" /> Donate for Poor Children
              </p>
              <p className="font-body text-xs text-gray-500 mb-3">Support a cause with your order (optional)</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {DONATION_PRESETS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => selectDonation(amount)}
                    className={`px-3 py-2 rounded-xl text-sm font-body font-semibold border-2 transition-all ${
                      donationPreset === amount
                        ? 'border-primary bg-champagne-light/80 text-primary'
                        : 'border-gray-100 text-gray-600 hover:border-primary-200'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => selectDonation('custom')}
                  className={`px-3 py-2 rounded-xl text-sm font-body font-semibold border-2 transition-all ${
                    donationPreset === 'custom'
                      ? 'border-primary bg-champagne-light/80 text-primary'
                      : 'border-gray-100 text-gray-600 hover:border-primary-200'
                  }`}
                >
                  Other
                </button>
              </div>
              {donationPreset === 'custom' && (
                <input
                  type="number"
                  min="1"
                  value={customDonation}
                  onChange={(e) => setCustomDonation(e.target.value)}
                  placeholder="Enter amount (₹)"
                  className="input-field text-sm"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
