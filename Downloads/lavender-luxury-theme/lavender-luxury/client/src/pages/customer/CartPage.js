import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, X, Truck, Gift } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItem, removeFromCart } from '../../slices/cartSlice';
import { EmptyState } from '../../components/common/LoadingSpinner';
import { PRODUCTS, formatPrice } from '../../utils/data';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(null);

  // Use demo products if backend not connected
  const enriched = items.map(item => ({
    ...item,
    product: item.product?.price ? item.product : PRODUCTS.find(p => p._id === (item.product?._id || item.product)) || item.product
  }));

  const COUPONS = {
    'ANSHI10': 10,
    'VASTRA10': 10,
    'WELCOME20': 20
  };

  const subtotal = enriched.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = applied ? Math.round(subtotal * (COUPONS[applied] / 100)) : 0;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    const code = coupon.toUpperCase();
    if (COUPONS[code] !== undefined) {
      setApplied(code);
      toast.success(`${COUPONS[code]}% discount applied! 🎉`);
    } else {
      toast.error('Invalid coupon code. Try ANSHI10');
    }
  };

  if (enriched.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      <EmptyState icon={ShoppingBag} title="Your cart is empty"
        description="Explore our beautiful ethnic collections and add items you love!"
        action={<Link to="/products" className="btn-primary">Start Shopping</Link>} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="badge-primary">{enriched.length} item{enriched.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {enriched.map((item) => (
              <motion.div key={item._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:-20, height:0 }}
                className="bg-white rounded-2xl p-4 shadow-card border border-gold-pale/60 flex gap-4">
                <Link to={`/products/${item.product?._id}`} className="w-24 h-28 rounded-xl overflow-hidden bg-champagne-light shrink-0 block">
                  <img src={item.product?.images?.[0]?.url || PRODUCTS[0].images[0].url} alt={item.product?.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[11px] font-bold text-primary uppercase tracking-widest mb-0.5">{item.product?.category?.name}</p>
                  <Link to={`/products/${item.product?._id}`}><h3 className="font-display font-semibold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-primary transition-colors">{item.product?.name}</h3></Link>
                  {item.size && <p className="font-body text-xs text-gray-400 mb-2">Size: <span className="font-semibold text-gray-600">{item.size}</span></p>}
                  <p className="font-display font-bold text-primary mb-3">{formatPrice(item.product?.price)}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-100 rounded-xl overflow-hidden">
                      <button onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity - 1 }))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-champagne-light/80 text-primary transition-colors"><Minus size={13}/></button>
                      <span className="w-8 text-center font-body font-bold text-gray-900 text-sm">{item.quantity}</span>
                      <button onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-champagne-light/80 text-primary transition-colors"><Plus size={13}/></button>
                    </div>
                    <button onClick={() => { dispatch(removeFromCart(item._id)); toast.success('Removed from cart'); }}
                      className="w-8 h-8 rounded-lg hover:bg-rose-soft flex items-center justify-center text-gray-300 hover:text-rose transition-all"><Trash2 size={14}/></button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-bold text-gray-900">{formatPrice((item.product?.price || 0) * item.quantity)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Free shipping progress */}
          {subtotal < 999 && (
            <div className="bg-champagne-light/80 border border-primary-100 rounded-2xl p-4 flex items-center gap-3">
              <Truck size={18} className="text-primary shrink-0"/>
              <div className="flex-1">
                <p className="font-body text-sm font-medium text-gray-700">Add <span className="font-bold text-primary">{formatPrice(999 - subtotal)}</span> more for free shipping!</p>
                <div className="w-full h-1.5 bg-primary-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100,(subtotal/999)*100)}%` }}/>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60">
            <h3 className="font-body font-bold text-gray-800 mb-3 flex items-center gap-2"><Tag size={16} className="text-primary"/>Coupon Code</h3>
            {applied ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                <div><p className="font-body font-bold text-emerald-700 text-sm">{applied} applied!</p><p className="font-body text-emerald-600 text-xs">{COUPONS[applied]}% discount on your order</p></div>
                <button onClick={() => { setApplied(null); setCoupon(''); }} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={16}/></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="ANSHI10" className="flex-1 input-field text-sm py-2.5 font-bold tracking-widest"/>
                <button onClick={applyCoupon} className="btn-primary py-2.5 px-4 text-sm whitespace-nowrap">Apply</button>
              </div>
            )}
            <p className="font-body text-xs text-gray-400 mt-2">Try: ANSHI10, VASTRA10 or WELCOME20</p>
          </div>

          {/* Gift wrap */}
          <div className="bg-white rounded-2xl p-4 shadow-card border border-gold-pale/60 flex items-center gap-3">
            <Gift size={18} className="text-primary shrink-0"/>
            <div className="flex-1"><p className="font-body font-semibold text-gray-800 text-sm">Gift Wrapping</p><p className="font-body text-gray-400 text-xs">Free on all orders</p></div>
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><span className="text-white text-[10px] font-bold">✓</span></div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60">
            <h3 className="font-display font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm font-body">
              <div className="flex justify-between text-gray-600"><span>Subtotal ({enriched.length} items)</span><span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-gray-800'}>{shipping === 0 ? '🎉 FREE' : formatPrice(shipping)}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-600 font-semibold"><span>Coupon ({applied})</span><span>−{formatPrice(discount)}</span></div>}
              <div className="flex justify-between text-gray-600 text-xs pb-3 border-b border-gray-50"><span>Taxes (incl.)</span><span>Included</span></div>
              <div className="flex justify-between font-bold text-base pt-1">
                <span className="font-display text-gray-900">Total</span>
                <span className="font-display text-primary text-xl">{formatPrice(total)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full btn-primary mt-5 py-4 text-base gap-2">
              Proceed to Checkout <ArrowRight size={18}/>
            </button>
            <Link to="/products" className="block text-center font-body text-sm text-gray-400 hover:text-primary transition-colors mt-3">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
