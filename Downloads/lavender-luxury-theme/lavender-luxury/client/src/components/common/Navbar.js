import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, Menu, X, LogOut, Settings, Package, User, ChevronDown, Sparkles, AlertTriangle, Flame } from 'lucide-react';
import { logout } from '../../slices/authSlice';
import { CATEGORIES, PRODUCTS } from '../../utils/data';
import NotificationBell from './NotificationBell';
import { disconnectSocket } from '../../utils/socket';
import toast from 'react-hot-toast';
import logo from "../../assets/logo.jpeg";
const NAV_LINKS = [
  { label:'Home', path:'/' },
  { label:'Women', path:'/products', sub: CATEGORIES.filter(c => c.slug !== 'kidswear' && c.slug !== 'bags').map(c => ({
    label: c.name,
    path: `/products?category=${c.slug}`
  }))},
  { label:'Kids', path:'/products?category=kidswear' },
  { label:'Bags', path:'/products?category=bags' },
  { label:'✨ Sale', path:'/products?isFlashSale=true', highlight:true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const { user, token } = useSelector(s => s.auth);
  const { items: cartItems } = useSelector(s => s.cart);
  const { products: wishlist } = useSelector(s => s.wishlist);
  const dispatch = useDispatch(); const navigate = useNavigate(); const location = useLocation();

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 24); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn); }, []);
  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [location]);

  // Detect low-stock items in cart for notification
  const cartUrgency = useMemo(() => {
    if (!cartItems?.length) return null;
    const enriched = cartItems.map(item => {
      const product = item.product?.price ? item.product : PRODUCTS.find(p => p._id === (item.product?._id || item.product)) || item.product;
      return { name: product?.name, stock: product?.stock ?? 999, sold: product?.sold ?? 0 };
    });
    const lowStock = enriched.filter(i => i.stock <= 5 && i.stock > 0);
    const outOfStock = enriched.filter(i => i.stock <= 0);
    if (outOfStock.length > 0) return { type: 'out', count: outOfStock.length, message: `${outOfStock.length} item${outOfStock.length > 1 ? 's' : ''} in your cart ${outOfStock.length > 1 ? 'are' : 'is'} out of stock!` };
    if (lowStock.length > 0) return { type: 'low', count: lowStock.length, message: `${lowStock.length} item${lowStock.length > 1 ? 's' : ''} in your cart ${lowStock.length > 1 ? 'are' : 'is'} running low on stock!` };
    return null;
  }, [cartItems]);

  // Don't show urgency banner on cart page (it has its own detailed alerts)
  const showUrgencyBanner = cartUrgency && location.pathname !== '/cart' && location.pathname !== '/checkout';

  const handleLogout = () => { dispatch(logout()); disconnectSocket(); toast.success('Logged out successfully'); navigate('/'); };
  const handleSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/products?search=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); setSearchQuery(''); } };

  return (
    <>
      <motion.nav initial={{ y:-80 }} animate={{ y:0 }} transition={{ duration:0.5, ease:'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gold-pale' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-1.5 sm:px-3 lg:px-4">
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 lg:h-20">

            {/* Logo — leftmost */}
            <Link to="/" className="flex items-center gap-2 group shrink-0 -ml-2 sm:-ml-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.6)] group-hover:shadow-[0_0_40px_rgba(255,215,0,0.75)] transition-shadow border border-gold/30 bg-white backdrop-blur-xl ring-2 ring-yellow-300/50">
  <img
    src={logo}
    alt="Lavender Logo"
    className="w-full h-full object-cover"
  />
</div>
              <div className="leading-none">
                <p className="font-display font-bold text-lg text-plum tracking-tight">Lavender <span className="text-gold">✦</span></p>
                <p className="font-accent text-xs text-gold italic tracking-widest">The Style Emporio</p>
              </div>
            </Link>

            {/* Desktop nav — centered */}
            <div className="hidden lg:flex items-center justify-center gap-1">
              {NAV_LINKS.map(link => (
                <div key={link.label} className="relative" onMouseEnter={() => setDropdown(link.label)} onMouseLeave={() => setDropdown(null)}>
                  <Link to={link.path} className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${link.highlight ? 'text-rose font-semibold hover:bg-rose-soft' : location.pathname === link.path ? 'text-primary bg-champagne-light/80' : 'text-gray-700 hover:text-primary hover:bg-champagne-light/80'}`}>
                    {link.label} {link.sub && <ChevronDown size={13} className={`transition-transform ${dropdown === link.label ? 'rotate-180' : ''}`} />}
                  </Link>
                  {link.sub && dropdown === link.label && (
                    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="absolute top-full left-0 mt-1 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-hover border border-gold-pale/60 py-2 z-50">
                      {link.sub.map(s => <Link key={s.label} to={s.path} className="block px-4 py-2.5 text-sm font-body text-gray-700 hover:text-primary hover:bg-champagne-light/80 transition-colors first:rounded-t-xl last:rounded-b-xl">{s.label}</Link>)}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions — rightmost */}
            <div className="flex items-center justify-end gap-1.5">
              <button onClick={() => setSearchOpen(true)} className="p-2.5 rounded-full text-gray-600 hover:text-primary hover:bg-champagne-light/80 transition-all"><Search size={19} /></button>

              {token ? (
                <>
                  <NotificationBell />
                  <Link to="/wishlist" className="relative p-2.5 rounded-full text-gray-600 hover:text-rose hover:bg-rose-soft transition-all">
                    <Heart size={19} />
                    {wishlist?.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>}
                  </Link>
                  <Link to="/cart" className="relative p-2.5 rounded-full text-gray-600 hover:text-primary hover:bg-champagne-light/80 transition-all">
                    <ShoppingBag size={19} />
                    {cartItems?.length > 0 && <motion.span key={cartItems.length} initial={{ scale:0 }} animate={{ scale:1 }} className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartItems.length}</motion.span>}
                  </Link>
                  <div className="relative">
                    <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full hover:bg-champagne-light/80 transition-all">
                      <div className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center shadow-sm"><span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span></div>
                      <span className="hidden sm:block font-body text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                    </button>
                    <AnimatePresence>
                      {userMenu && (
                        <motion.div initial={{ opacity:0, y:8, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8, scale:0.96 }}
                          className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-hover border border-gold-pale/60 py-2 z-50" onMouseLeave={() => setUserMenu(false)}>
                          <div className="px-4 py-3 border-b border-gray-50">
                            <p className="font-body font-semibold text-gray-800 text-sm">{user?.name}</p>
                            <p className="font-body text-xs text-gray-400 truncate">{user?.email}</p>
                          </div>
                          {user?.role === 'admin' && <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-primary hover:bg-champagne-light/80 transition-colors"><Sparkles size={15}/> Admin Panel</Link>}
                          {user?.role === 'employee' && <Link to="/employee" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-primary hover:bg-champagne-light/80 transition-colors"><Sparkles size={15}/> Employee Dashboard</Link>}
                          <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-champagne-light/80 transition-colors"><User size={15}/> My Profile</Link>
                          <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-champagne-light/80 transition-colors"><Package size={15}/> My Orders</Link>
                          <div className="border-t border-gray-50 mt-1">
                            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-rose hover:bg-rose-soft transition-colors rounded-b-2xl"><LogOut size={15}/> Logout</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="btn-ghost py-2 px-4 text-sm">Login</Link>
                  <Link to="/register" className="btn-primary py-2 px-4 text-sm">Sign Up</Link>
                </div>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2.5 rounded-full text-gray-600 hover:bg-champagne-light/80 transition-all ml-1">
                {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
              className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-gold-pale/60 px-4 py-4 space-y-1">
              {NAV_LINKS.map(l => <Link key={l.label} to={l.path} className={`block px-4 py-3 rounded-xl text-sm font-body font-medium transition-colors ${l.highlight ? 'text-rose' : 'text-gray-700 hover:text-primary hover:bg-champagne-light/80'}`}>{l.label}</Link>)}
              {!token && <div className="flex gap-2 pt-3 border-t border-gray-100"><Link to="/login" className="flex-1 btn-ghost text-center text-sm py-2.5">Login</Link><Link to="/register" className="flex-1 btn-primary text-center text-sm py-2.5">Sign Up</Link></div>}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Cart urgency notification bar */}
      <AnimatePresence>
        {showUrgencyBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`fixed top-16 lg:top-20 left-0 right-0 z-40 ${cartUrgency.type === 'out' ? 'bg-rose' : 'bg-amber-500'} text-white overflow-hidden`}
          >
            <Link to="/cart" className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-black/10 transition-colors">
              {cartUrgency.type === 'out' ? <AlertTriangle size={14} /> : <Flame size={14} />}
              <span className="font-body text-xs sm:text-sm font-medium text-center">
                {cartUrgency.message}
                <span className="ml-2 underline font-bold">View Cart →</span>
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-28 px-4"
            onClick={e => e.target === e.currentTarget && setSearchOpen(false)}>
            <motion.div initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-20, opacity:0 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-premium p-4">
              <form onSubmit={handleSearch} className="flex gap-3">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search sarees, kurtis, co-ord sets, bags..." className="flex-1 input-field" autoFocus />
                <button type="submit" className="btn-primary px-6">Search</button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-3 rounded-xl hover:bg-champagne-light/80 transition-colors"><X size={20} className="text-gray-400"/></button>
              </form>
              <div className="flex gap-2 mt-3 flex-wrap">
                {['Silk Saree','Bridal Lehenga','Chikankari','Kundan Jewelry','Kidswear'].map(s => (
                  <button key={s} onClick={() => { setSearchQuery(s); }} className="px-3 py-1.5 bg-champagne-light/80 text-primary text-xs font-body font-medium rounded-full hover:bg-primary-100 transition-colors">{s}</button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
