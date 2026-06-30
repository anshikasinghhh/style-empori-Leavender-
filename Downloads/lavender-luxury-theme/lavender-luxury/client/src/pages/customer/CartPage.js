import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, Sparkles, Star, AlertTriangle, Flame, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItem, removeFromCart, addToCart } from '../../slices/cartSlice';
import { EmptyState } from '../../components/common/LoadingSpinner';
import { PRODUCTS, formatPrice, getDiscount } from '../../utils/data';
import toast from 'react-hot-toast';

// Stock urgency helper
const getStockUrgency = (product) => {
  const stock = product?.stock ?? 999;
  const sold = product?.sold ?? 0;
  if (stock <= 0) return { level: 'out', label: 'Out of Stock', message: 'This item is no longer available', icon: AlertTriangle, color: 'text-rose', bg: 'bg-rose-50 border-rose-200', badge: 'bg-rose text-white' };
  if (stock <= 3) return { level: 'critical', label: `Only ${stock} left!`, message: 'Hurry! Almost gone — checkout now before it sells out', icon: Flame, color: 'text-rose', bg: 'bg-rose-50 border-rose-200', badge: 'bg-rose text-white' };
  if (stock <= 8) return { level: 'low', label: `Only ${stock} left`, message: 'Stock is running low — this item is in high demand', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-500 text-white' };
  if (sold > 100) return { level: 'popular', label: 'Selling fast!', message: `${sold}+ people already bought this — popular pick`, icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-500 text-white' };
  return null;
};

export default function CartPage() {
  const { items } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use demo products if backend not connected
  const enriched = items.map(item => ({
    ...item,
    product: item.product?.price ? item.product : PRODUCTS.find(p => p._id === (item.product?._id || item.product)) || item.product
  }));

  const subtotal = enriched.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  // Find items with stock urgency
  const urgencyItems = enriched
    .map(item => ({ ...item, urgency: getStockUrgency(item.product) }))
    .filter(item => item.urgency && item.urgency.level !== 'popular');
  const hasUrgency = urgencyItems.length > 0;

  // "You Might Also Like" — only genuinely related products
  const recommendations = useMemo(() => {
    const cartIds = new Set(enriched.map(i => String(i.product?._id)));

    // Find local PRODUCTS data for cart items (local data has tags, occasions, etc.)
    const cartLocalProducts = enriched
      .map(i => PRODUCTS.find(p => String(p._id) === String(i.product?._id)))
      .filter(Boolean);

    // If we can't find local matches, use enriched products as source
    const cartSource = cartLocalProducts.length > 0 ? cartLocalProducts : enriched.map(i => i.product).filter(Boolean);

    // Related category groups — products within a group are considered related
    const RELATED_GROUPS = [
      ['saree', 'shawl', 'churidar-set'],    // ethnic drape/wear
      ['kurti', 'churidar-set'],              // daily ethnic wear
      ['bag'],                                // accessories
      ['kidswear'],                             // kids
      ['croptop', 'bodycon', 'casual', 'coord-set', 'pant'], // western wear
      ['night-gown'],                           // lounge
    ];

    const norm = (s) => (s || '').toLowerCase().replace(/s$/, '').trim();
    const cartCatSlugs = cartSource.map(p => norm(p.category?.slug || p.category?.name)).filter(Boolean);
    const cartTags = cartSource.flatMap(p => (p.tags || []).map(t => t.toLowerCase()));
    const cartOccasions = cartSource.flatMap(p => (p.occasion || []).map(o => o.toLowerCase()));

    // Find all categories related to what's in cart
    const relatedCats = new Set(cartCatSlugs);
    cartCatSlugs.forEach(cat => {
      RELATED_GROUPS.forEach(group => {
        if (group.some(g => cat === g || cat.includes(g) || g.includes(cat))) {
          group.forEach(g => relatedCats.add(g));
        }
      });
    });

    const results = PRODUCTS
      .filter(p => !cartIds.has(String(p._id)))
      .map(p => {
        const pCat = norm(p.category?.slug || p.category?.name);
        const pTags = (p.tags || []).map(t => t.toLowerCase());
        const pOccasions = (p.occasion || []).map(o => o.toLowerCase());

        let score = 0;
        // Same category — strongest signal
        if (cartCatSlugs.some(c => c === pCat || pCat.includes(c) || c.includes(pCat))) score += 5;
        // Related category
        else if (relatedCats.has(pCat)) score += 2;
        // Tag overlap (e.g. both have 'wedding', 'silk')
        const tagMatches = pTags.filter(t => cartTags.includes(t)).length;
        score += tagMatches * 2;
        // Occasion overlap (e.g. both 'Wedding', 'Festival')
        const occasionMatches = pOccasions.filter(o => cartOccasions.includes(o)).length;
        score += occasionMatches;

        return { ...p, score };
      })
      // Only show products with meaningful relevance (same cat OR related cat + tags)
      .filter(p => p.score >= 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // Fallback: if no scored results, show products from same category as cart items
    if (results.length === 0) {
      return PRODUCTS
        .filter(p => !cartIds.has(String(p._id)))
        .filter(p => {
          const pCat = norm(p.category?.slug || p.category?.name);
          return cartCatSlugs.some(c => c === pCat || pCat.includes(c) || c.includes(pCat));
        })
        .slice(0, 6);
    }

    return results;
  }, [enriched]);

  const handleAddToCart = (product) => {
    const defaultSize = product.sizes?.[0]?.size || 'Free Size';
    dispatch(addToCart({ productId: product._id, quantity: 1, size: defaultSize }));
    toast.success(`${product.name} added to cart!`);
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
            {enriched.map((item) => {
              const urgency = getStockUrgency(item.product);
              return (
              <motion.div key={item._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:-20, height:0 }}
                className={`bg-white rounded-2xl p-4 shadow-card border flex gap-4 ${urgency && (urgency.level === 'critical' || urgency.level === 'out') ? 'border-rose-200' : urgency?.level === 'low' ? 'border-amber-200' : 'border-gold-pale/60'}`}>
                <Link to={`/products/${item.product?._id}`} className="w-24 h-28 rounded-xl overflow-hidden bg-champagne-light shrink-0 block relative">
                  <img src={item.product?.images?.[0]?.url || PRODUCTS[0].images[0].url} alt={item.product?.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                  {urgency && urgency.level !== 'popular' && (
                    <span className={`absolute bottom-1.5 left-1.5 right-1.5 text-center font-body text-[9px] font-bold px-1.5 py-0.5 rounded-full ${urgency.badge}`}>
                      {urgency.label}
                    </span>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[11px] font-bold text-primary uppercase tracking-widest mb-0.5">{item.product?.category?.name}</p>
                  <Link to={`/products/${item.product?._id}`}><h3 className="font-display font-semibold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-primary transition-colors">{item.product?.name}</h3></Link>
                  {item.size && <p className="font-body text-xs text-gray-400 mb-2">Size: <span className="font-semibold text-gray-600">{item.size}</span></p>}
                  {urgency && (
                    <div className={`flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg border ${urgency.bg}`}>
                      <urgency.icon size={12} className={urgency.color} />
                      <span className={`font-body text-[11px] font-semibold ${urgency.color}`}>{urgency.message}</span>
                    </div>
                  )}
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
                  {urgency && urgency.level === 'popular' && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold font-body">
                      <Flame size={10}/> {urgency.label}
                    </span>
                  )}
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Stock Urgency Alert Banner */}
          {hasUrgency && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 animate-pulse">
                  <AlertTriangle size={18} className="text-rose" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-gray-900 text-sm">Your items are waiting!</p>
                  <p className="font-body text-xs text-gray-600 mt-1">
                    {urgencyItems.length === 1
                      ? `"${urgencyItems[0].product?.name?.split(' ').slice(0, 4).join(' ')}" is ${urgencyItems[0].urgency.label.toLowerCase()}. Complete your order before it's gone!`
                      : `${urgencyItems.length} items in your cart have limited stock. Checkout now to secure them!`
                    }
                  </p>
                  <ul className="mt-2 space-y-1">
                    {urgencyItems.map(item => (
                      <li key={item._id} className="flex items-center gap-2 font-body text-[11px]">
                        <Clock size={10} className={item.urgency.color} />
                        <span className="text-gray-700 font-semibold line-clamp-1">{item.product?.name}</span>
                        <span className={`${item.urgency.color} font-bold`}>— {item.urgency.label}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/checkout')}
                    className="mt-3 btn-primary text-xs py-2 px-4 gap-1">
                    <Flame size={13}/> Secure My Items <ArrowRight size={13}/>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

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
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60">
            <h3 className="font-display font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm font-body">
              <div className="flex justify-between text-gray-600"><span>Subtotal ({enriched.length} items)</span><span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-gray-800'}>{shipping === 0 ? '🎉 FREE' : formatPrice(shipping)}</span></div>
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

      {/* You Might Also Like */}
      {recommendations.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-primary" />
            <h2 className="font-display text-2xl font-bold text-gray-900">You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendations.map((product) => {
              const discount = getDiscount(product.originalPrice, product.price);
              return (
                <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-card border border-gold-pale/60 group hover:shadow-lg transition-shadow">
                  <Link to={`/products/${product._id}`} className="block relative aspect-[3/4] overflow-hidden bg-champagne-light">
                    <img src={product.images?.[0]?.url} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-primary text-white font-body text-[10px] font-bold px-2 py-0.5 rounded-full">{product.badge}</span>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 right-2 bg-rose text-white font-body text-[10px] font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
                    )}
                  </Link>
                  <div className="p-3">
                    <p className="font-body text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">{product.category?.name}</p>
                    <Link to={`/products/${product._id}`}>
                      <h4 className="font-display text-xs font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-primary transition-colors">{product.name}</h4>
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="font-body text-[10px] text-gray-500">{product.ratings} ({product.numReviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-bold text-primary text-sm">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="font-body text-[10px] text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => handleAddToCart(product)}
                      className="w-full mt-2 py-2 rounded-xl border-2 border-primary text-primary font-body text-xs font-bold hover:bg-primary hover:text-white transition-all">
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
