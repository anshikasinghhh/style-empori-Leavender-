import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../slices/cartSlice';
import { toggleWishlist } from '../../slices/wishlistSlice';
import { formatPrice, getDiscount } from '../../utils/data';
import toast from 'react-hot-toast';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 rounded-full border-4 border-gold-pale border-t-primary animate-spin"/>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary text-xs font-bold font-display">VE</span>
        </div>
      </div>
      <p className="font-body text-sm text-gray-400 animate-pulse">Loading...</p>
    </div>
  );
}
export default LoadingSpinner;

const BADGE_COLORS = {
  'Bestseller':     'bg-rose-soft text-rose border border-rose/20',
  'Luxury':         'bg-plum-pale text-plum border border-plum/20',
  'New Arrival':    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Festival Special':'bg-gold-pale text-gold border border-gold/20',
  'Flash Sale':     'bg-rose-soft text-rose border border-rose/20',
  'Trending':       'bg-gold-pale text-gold border border-gold/20',
  'Artisan Pick':   'bg-champagne-light/80 text-primary border border-primary/20',
  'Artisan':        'bg-champagne-light/80 text-primary border border-primary/20',
  'Kids Pick':      'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Gifting':        'bg-plum-pale text-plum border border-plum/20',
  'default':        'bg-champagne-light/80 text-primary border border-primary/20',
};

export function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch();
  const { token } = useSelector(s => s.auth);
  const { products: wishlistItems } = useSelector(s => s.wishlist);
  const isWishlisted = wishlistItems?.some(p => (p._id || p) === product._id);
  const discount = product.originalPrice ? getDiscount(product.originalPrice, product.price) : 0;
  const effectivePrice = product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price;

  const handleCart = (e) => {
    e.preventDefault();
    if (!token) { toast.error('Please login to add to cart'); return; }
    dispatch(addToCart({ productId: product._id, quantity: 1, size: product.sizes?.[0]?.size || 'Free Size' }));
    toast.success('Added to cart! 🛍️');
  };
  const handleWishlist = (e) => {
    e.preventDefault();
    if (!token) { toast.error('Please login to save items'); return; }
    dispatch(toggleWishlist(product._id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist ❤️');
  };

  const badgeStyle = BADGE_COLORS[product.badge] || BADGE_COLORS.default;

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:index*0.06 }} whileHover={{ y:-5 }} className="group">
      <Link to={`/products/${product._id}`}>
        <div className="bg-white rounded-2xl shadow-card hover:shadow-hover transition-all duration-400 overflow-hidden border border-gold-pale/60/60">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[3/4] bg-champagne-light product-img-wrap">
            <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80'}
              alt={product.name} className="w-full h-full object-cover" loading="lazy"/>

            {/* Badges top-left */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && <span className="badge bg-rose text-white text-[11px] shadow-sm">{discount}% OFF</span>}
              {product.badge && <span className={`badge text-[10px] shadow-sm ${badgeStyle}`}>{product.badge}</span>}
              {product.isFlashSale && <span className="badge bg-gold text-white text-[10px] shadow-sm flex items-center gap-1"><Zap size={9} fill="white"/>Flash</span>}
            </div>

            {/* Wishlist btn */}
            <button onClick={handleWishlist}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-card transition-all hover:scale-110 ${isWishlisted ? 'text-rose' : 'text-gray-400 hover:text-rose'}`}>
              <Heart size={16} className={isWishlisted ? 'fill-rose' : ''}/>
            </button>

            {/* Add to cart slide-up */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-350">
              <button onClick={handleCart} className="w-full bg-primary/95 backdrop-blur-sm text-white py-3.5 flex items-center justify-center gap-2 font-body font-semibold text-sm hover:bg-primary-dark transition-colors">
                <ShoppingBag size={15}/> Add to Cart
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="font-body text-[11px] text-primary font-semibold uppercase tracking-widest mb-1">{typeof product.category === 'object' ? product.category?.name : product.category}</p>
            <h3 className="font-display text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug">{product.name}</h3>
            {product.ratings > 0 && (
              <div className="flex items-center gap-1.5 mb-2.5">
                <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= Math.round(product.ratings) ? 'text-gold-light fill-gold-light' : 'text-gray-200 fill-gray-200'}/>)}</div>
                <span className="font-body text-[11px] text-gray-400">({product.numReviews})</span>
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-bold text-gray-900 text-base">{formatPrice(effectivePrice)}</span>
              {product.originalPrice && product.originalPrice > effectivePrice && (
                <span className="font-body text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gold-pale/60 shadow-card">
      <div className="skeleton aspect-[3/4]"/>
      <div className="p-4 space-y-2">
        <div className="skeleton h-2.5 w-1/3 rounded-full"/>
        <div className="skeleton h-4 w-4/5 rounded-full"/>
        <div className="skeleton h-3.5 w-1/2 rounded-full"/>
        <div className="skeleton h-5 w-1/3 rounded-full mt-1"/>
      </div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, center=true }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {subtitle && <p className="section-tag mb-1.5">{subtitle}</p>}
      <h2 className="section-title">{title}</h2>
      {center && <div className="section-divider"><div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40"/><div className="w-2 h-2 rounded-full bg-primary"/><div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40"/></div>}
    </div>
  );
}

export function EmptyState({ icon:Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-champagne-light/80 flex items-center justify-center mb-5 shadow-card">
        {Icon && <Icon size={34} className="text-primary"/>}
      </div>
      <h3 className="font-display text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="font-body text-gray-500 max-w-sm text-sm leading-relaxed">{description}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
