import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Truck, Shield, RefreshCw, Share2, ChevronRight, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../slices/cartSlice';
import { toggleWishlist } from '../../slices/wishlistSlice';
import { formatPrice, getDiscount } from '../../utils/data';
import { ProductCard, SectionHeader, LoadingSpinner } from '../../components/common/LoadingSpinner';
import { fetchProductById, clearProduct } from '../../slices/productSlice';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error, items: allProducts } = useSelector((s) => s.products);
  const [selImg, setSelImg] = useState(0);
  const [selSize, setSelSize] = useState('');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const { token } = useSelector(s => s.auth);
  const { products: wishlist } = useSelector(s => s.wishlist);
  const isWishlisted = wishlist?.some(p => (p._id||p) === product?._id);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProductById(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  useEffect(() => {
    setSelImg(0);
  }, [product]);

  if (loading && !product) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4 text-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  const discount = product.originalPrice ? getDiscount(product.originalPrice, product.price) : 0;
  const effectivePrice = product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price;
  const productCategory = (cat) => {
    if (!cat) return '';
    if (typeof cat === 'string') return cat.toLowerCase();
    return (cat.slug || cat.name || '').toLowerCase();
  };
  const related = allProducts.filter(p => {
    if (p._id === product._id) return false;
    return productCategory(p.category) === productCategory(product.category);
  }).slice(0, 4);
  const images = product.images?.length >= 3 ? product.images : [
    ...product.images,
    { url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85', alt:'Fabric detail' },
    { url:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=85', alt:'Pattern detail' },
  ].slice(0,4);

  const handleCart = () => {
    if (!token) { toast.error('Please login to add to cart'); return; }
    if (product.sizes?.length > 0 && !selSize) { toast.error('Please select a size'); return; }
    dispatch(addToCart({ productId: product._id, quantity: qty, size: selSize || 'Free Size' }));
    setAddedToCart(true);
    // Stock urgency warning
    const stock = product.stock ?? 999;
    if (stock <= 3 && stock > 0) {
      toast(`⚠️ Only ${stock} left in stock! Checkout soon to secure your item.`, { icon: '🔥', duration: 4000 });
    } else if (stock <= 8) {
      toast(`Stock is limited — only ${stock} left!`, { icon: '⏰', duration: 3000 });
    } else {
      toast.success('Added to cart! 🛍️');
    }
    setTimeout(() => setAddedToCart(false), 2500);
  };
  const handleWishlist = () => {
    if (!token) { toast.error('Please login'); return; }
    dispatch(toggleWishlist(product._id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist ❤️');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* Breadcrumb */}
      <nav className="hidden sm:flex items-center gap-2 text-sm font-body text-gray-400 mb-6 sm:mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link><ChevronRight size={14}/>
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link><ChevronRight size={14}/>
        <Link to={`/products?category=${product.category?.slug}`} className="hover:text-primary transition-colors">{product.category?.name}</Link><ChevronRight size={14}/>
        <span className="text-primary truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="space-y-3">
          <motion.div className="aspect-[4/5] rounded-3xl overflow-hidden bg-champagne-light shadow-premium" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
            <img src={images[selImg]?.url} alt={images[selImg]?.alt} className="w-full h-full object-cover"/>
          </motion.div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img,i) => (
              <button key={i} onClick={() => setSelImg(i)} className={`w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${i===selImg ? 'border-primary shadow-card' : 'border-transparent opacity-55 hover:opacity-100'}`}>
                <img src={img?.url} alt={img?.alt} className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <motion.div className="space-y-5" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}>
          {product.badge && <span className="badge-primary text-xs">{product.badge}</span>}
          <div>
            <p className="font-body text-xs font-bold text-primary uppercase tracking-widest mb-1.5">{product.category?.name}</p>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gold-pale border border-gold/20 rounded-full px-3 py-1">
                <Star size={14} className="text-gold-light fill-gold-light"/><span className="font-body font-bold text-gold text-sm">{product.ratings}</span>
              </div>
              <span className="font-body text-sm text-gray-400">({product.numReviews} reviews)</span>
              <span className={`font-body text-sm font-semibold ${product.stock < 10 ? 'text-rose' : 'text-emerald-600'}`}>{product.stock < 10 ? `Only ${product.stock} left!` : 'In Stock'}</span>
            </div>
          </div>

          {/* Stock urgency banner */}
          {product.stock <= 5 && product.stock > 0 && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200">
              <span className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center animate-pulse shrink-0">
                <span className="text-base">🔥</span>
              </span>
              <div>
                <p className="font-display font-bold text-gray-900 text-sm">This product is waiting for you!</p>
                <p className="font-body text-xs text-rose font-semibold">Only {product.stock} left — stock is getting finished. Order now!</p>
              </div>
            </motion.div>
          )}
          {product.stock <= 0 && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-base">😔</span>
              <p className="font-body text-sm font-semibold text-gray-500">Out of stock — this item is currently unavailable</p>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 sm:gap-3 py-2 flex-wrap">
            <span className="font-display text-3xl sm:text-4xl font-bold text-gray-900">{formatPrice(effectivePrice)}</span>
            {product.originalPrice && product.originalPrice > effectivePrice && <>
              <span className="font-body text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              <span className="badge bg-rose text-white shadow-sm">{discount}% OFF</span>
            </>}
          </div>

          {/* Short desc */}
          {product.shortDescription && <p className="font-body text-gray-600 text-sm leading-relaxed border-l-2 border-primary-200 pl-3 italic">{product.shortDescription}</p>}

          {/* Occasion tags */}
          <div className="flex flex-wrap gap-2">
            {product.occasion?.map(occ => <span key={occ} className="badge bg-champagne-light/80 text-primary-dark border border-primary-100">{occ}</span>)}
          </div>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="font-body font-semibold text-gray-800">Select Size</p>
                <button className="font-body text-xs text-primary underline underline-offset-2">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(({ size, stock }) => (
                  <button key={size} onClick={() => setSelSize(size)} disabled={stock===0}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-body transition-all ${selSize===size ? 'border-primary bg-primary text-white shadow-sm' : stock===0 ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through' : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="flex items-center gap-4">
            <p className="font-body font-semibold text-gray-800">Quantity</p>
            <div className="flex items-center gap-0 border-2 border-gray-100 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-10 h-10 flex items-center justify-center hover:bg-champagne-light/80 text-primary transition-colors"><Minus size={14}/></button>
              <span className="w-10 text-center font-body font-bold text-gray-900">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock,q+1))} className="w-10 h-10 flex items-center justify-center hover:bg-champagne-light/80 text-primary transition-colors"><Plus size={14}/></button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-2 sm:gap-3">
            <button onClick={handleCart} className={`flex-1 py-3 sm:py-4 rounded-full font-body font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-card hover:shadow-hover ${addedToCart ? 'bg-emerald-500 text-white' : 'bg-brand-gradient text-white hover:scale-[1.02]'}`}>
              {addedToCart ? <><Check size={18}/> Added!</> : <><ShoppingBag size={18}/> Add to Cart</>}
            </button>
            <button onClick={handleWishlist} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${isWishlisted ? 'border-rose bg-rose-soft text-rose' : 'border-gray-200 hover:border-rose hover:text-rose text-gray-400'}`}>
              <Heart size={18} className={isWishlisted ? 'fill-rose' : ''}/>
            </button>
            <button className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary text-gray-400 transition-all">
              <Share2 size={18}/>
            </button>
          </div>

          {/* Benefits strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100 pt-5">
            {[{icon:Truck,text:'Free above ₹999'},{icon:RefreshCw,text:'7-Day Returns'},{icon:Shield,text:'100% Authentic'}].map((b,i) => (
              <div key={i} className="flex items-center sm:flex-col sm:text-center gap-2 sm:gap-1.5 p-3 bg-champagne-light/80 rounded-xl">
                <b.icon size={18} className="text-primary"/><span className="font-body text-[11px] text-gray-600 leading-tight">{b.text}</span>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-4 border border-gold-pale/60 shadow-card space-y-2">
            {[['Material', product.material],['Return Policy', product.returnPolicy],['SKU', product.sku || 'VE-'+product._id.toUpperCase()]].map(([l,v]) => v && (
              <div key={l} className="flex justify-between text-sm font-body">
                <span className="text-gray-400">{l}</span><span className="text-gray-800 font-medium">{v}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-gray-100 mb-6 gap-1 overflow-x-auto">
          {['description','reviews','care'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 sm:px-6 py-3 font-body capitalize text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${tab===t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}>
              {t==='care' ? 'Care & Shipping' : t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gold-pale/60 shadow-card">
          {tab==='description' && <div className="font-body text-gray-600 leading-relaxed space-y-3"><p>{product.description}</p>{product.tags?.length > 0 && <div className="flex flex-wrap gap-2 pt-2">{product.tags.map(tag => <span key={tag} className="badge bg-champagne-light/80 text-primary border border-primary-100">#{tag}</span>)}</div>}</div>}
          {tab==='reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-6 pb-5 border-b border-gray-50">
                <div className="text-center"><div className="font-display text-6xl font-bold text-primary">{product.ratings}</div><div className="flex justify-center gap-0.5 my-1">{[1,2,3,4,5].map(s=><Star key={s} size={14} className={s<=Math.round(product.ratings)?'text-gold-light fill-gold-light':'text-gray-200 fill-gray-200'}/>)}</div><div className="font-body text-sm text-gray-400">{product.numReviews} reviews</div></div>
                <div className="flex-1 space-y-1.5">{[5,4,3,2,1].map(s=><div key={s} className="flex items-center gap-2"><span className="font-body text-xs w-2 text-gray-500">{s}</span><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gold-light" style={{width:`${s===5?70:s===4?20:s===3?6:s===2?3:1}%`}}/></div></div>)}</div>
              </div>
              <p className="font-body text-gray-400 text-sm text-center py-4">Connect backend to load verified customer reviews</p>
            </div>
          )}
          {tab==='care' && <div className="font-body text-gray-600 space-y-3 leading-relaxed"><p>{product.careInstructions || 'Dry clean recommended. Store in a cool, dry place in muslin cloth. Avoid direct sunlight. Iron on low heat with a pressing cloth to protect embellishments.'}</p><div className="grid grid-cols-2 gap-3 mt-4">{[{icon:Truck,label:'Shipping',text:'3-7 business days'},{icon:RefreshCw,label:'Returns',text:'7-day easy return'},{icon:Shield,label:'Packaging',text:'Gift-ready box'},{icon:Sparkles,label:'Authenticity',text:'100% genuine'}].map(({icon:Icon,label,text}) => <div key={label} className="flex items-start gap-2.5 p-3 bg-champagne-light/80 rounded-xl"><Icon size={16} className="text-primary mt-0.5 shrink-0"/><div><p className="font-body font-semibold text-gray-800 text-xs">{label}</p><p className="font-body text-gray-500 text-xs">{text}</p></div></div>)}</div></div>}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <SectionHeader title="You May Also Love" subtitle="Similar styles" center={false}/>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-6">
            {related.map((p,i) => <ProductCard key={p._id} product={p} index={i}/>)}
          </div>
        </div>
      )}
    </div>
  );
}
