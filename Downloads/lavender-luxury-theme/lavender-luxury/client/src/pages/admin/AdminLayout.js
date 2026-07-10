import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Archive, Tag, Settings, LogOut, Menu, X, Bell, ChevronRight, Sparkles, TrendingUp, Calendar, ClipboardList, Gift, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slices/authSlice';
import NotificationBell from '../../components/common/NotificationBell';
import { disconnectSocket } from '../../utils/socket';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const NAV = [
  { icon:LayoutDashboard, label:'Dashboard',  path:'/admin',            badge:null },
  { icon:Package,         label:'Products',   path:'/admin/products',   badge:'284' },
  { icon:ShoppingCart,    label:'Orders',     path:'/admin/orders',     badge:'12', badgeColor:'rose' },
  { icon:Users,           label:'Customers',  path:'/admin/customers',  badge:'3.8K' },
  { icon:Archive,         label:'Inventory',  path:'/admin/inventory',  badge:'3', badgeColor:'amber' },
  { icon:Tag,             label:'Coupons',    path:'/admin/coupons',    badge:null },
  { icon:Users,           label:'Employees',  path:'/admin/employees',  badge:null },
  { icon:ClipboardList,   label:'Tasks',      path:'/admin/tasks',      badge:null },
  { icon:Calendar,        label:'Attendance', path:'/admin/attendance', badge:null },
  { icon: Archive,         label:'Stock Requests', path:'/admin/inventory-requests', badge:null },
  { icon: Gift,             label:'Gift Cards',    path:'/admin/gift-cards',        badge:null },
  { icon: Zap,              label:'Flash Sales',   path:'/admin/flash-sales',       badge:null },
  { icon: Settings,        label:'Settings',   path:'/admin/settings',   badge:null },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const location = useLocation(); const dispatch = useDispatch(); const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const [sidebarStats, setSidebarStats] = useState({
    products: null,
    orders: null,
    customers: null,
    inventory: null
  });

  useEffect(() => {
    let active = true;
    const fetchSidebarStats = async () => {
      try {
        const res = await api.get('/admin/sidebar-stats');
        if (active && res.data && res.data.stats) {
          setSidebarStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch sidebar stats:', err);
      }
    };
    fetchSidebarStats();

    const interval = setInterval(fetchSidebarStats, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [location.pathname]);

  const handleLogout = () => { dispatch(logout()); disconnectSocket(); toast.success('Logged out successfully'); navigate('/'); };

  const Sidebar = ({ mobile }) => (
    <aside className={`${mobile ? 'w-64' : collapsed ? 'w-16' : 'w-64'} bg-dark-brand text-white flex flex-col transition-all duration-300 ${mobile ? '' : 'fixed top-0 left-0 bottom-0 z-40'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white font-display font-bold text-sm">VE</span>
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <p className="font-display font-bold text-sm text-white leading-tight">Lavender</p>
            <p className="font-body text-white/40 text-[10px]">Admin Console</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ icon:Icon, label, path, badge, badgeColor }) => {
          const active = location.pathname === path;
          let displayBadge = badge;
          if (label === 'Products') {
            displayBadge = sidebarStats.products !== null ? String(sidebarStats.products) : '...';
          } else if (label === 'Orders') {
            displayBadge = sidebarStats.orders !== null ? String(sidebarStats.orders) : '...';
          } else if (label === 'Customers') {
            displayBadge = sidebarStats.customers !== null ? String(sidebarStats.customers) : '...';
          } else if (label === 'Inventory') {
            displayBadge = sidebarStats.inventory !== null ? String(sidebarStats.inventory) : '...';
          }

          return (
            <Link key={path} to={path} onClick={() => setMobileSidebar(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-body group relative ${active ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={18} className="shrink-0"/>
              {(!collapsed || mobile) && (
                <>
                  <span className="flex-1 font-medium">{label}</span>
                  {displayBadge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${badgeColor === 'rose' ? 'bg-rose/80 text-white' : badgeColor === 'amber' ? 'bg-amber-500/80 text-white' : 'bg-white/15 text-white/70'}`}>{displayBadge}</span>}
                </>
              )}
              {collapsed && !mobile && displayBadge && <span className={`absolute right-1 top-1 w-2 h-2 rounded-full ${badgeColor === 'rose' ? 'bg-rose' : badgeColor === 'amber' ? 'bg-amber-400' : 'bg-white/40'}`}/>}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/10 shrink-0">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">{user?.name?.[0]}</div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="font-body text-[10px] text-white/40">Administrator</p>
            </div>
            <span className="badge bg-gold/20 text-gold-light text-[9px]">Admin</span>
          </div>
        )}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm font-body">
          <LogOut size={17} className="shrink-0"/>
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-gray-50/80">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar/>
        <div className={collapsed ? 'w-16' : 'w-64'} style={{ transition:'width 0.3s' }}/>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileSidebar(false)}>
            <motion.div initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }} transition={{ type:'spring', damping:22 }}
              onClick={e => e.stopPropagation()}>
              <Sidebar mobile/>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => { if(window.innerWidth < 1024) setMobileSidebar(true); else setCollapsed(!collapsed); }}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Menu size={20} className="text-gray-600"/>
            </button>
            <div className="hidden sm:block">
              <p className="font-body font-bold text-gray-900 text-sm">{NAV.find(n => n.path === location.pathname)?.label || 'Admin'}</p>
              <div className="flex items-center gap-1 text-xs font-body text-gray-400">
                <span>Admin</span><ChevronRight size={11}/><span className="text-primary">{NAV.find(n => n.path === location.pathname)?.label}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-ghost text-xs py-1.5 px-3 gap-1"><Sparkles size={12}/> View Store</Link>
            <NotificationBell />
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-xs font-bold shadow-sm">{user?.name?.[0]}</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
