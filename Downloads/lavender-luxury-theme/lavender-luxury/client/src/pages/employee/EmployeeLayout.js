import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Calendar, Archive, User, LogOut, Menu, X, Bell, ChevronRight, Sparkles, Package, Boxes, Tag, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, fetchMe } from '../../slices/authSlice';
import NotificationBell from '../../components/common/NotificationBell';
import { disconnectSocket } from '../../utils/socket';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeeLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  // Always fetch fresh user data on page navigation to stay in sync with admin changes
  useEffect(() => {
    dispatch(fetchMe());
  }, [location.pathname, dispatch]);

  const NAV = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/employee' },
    { icon: ClipboardList, label: 'My Tasks', path: '/employee/tasks' },
    { icon: Calendar, label: 'Attendance', path: '/employee/attendance' },
    { icon: Package, label: 'Products', path: '/employee/products' },
    { icon: Boxes, label: 'Inventory', path: '/employee/inventory' },
    { icon: Archive, label: 'Stock Requests', path: '/employee/stock-requests' },
    { icon: Zap, label: 'Flash Sales', path: '/employee/flash-sales' },
    ...(user?.canManageCoupons ? [{ icon: Tag, label: 'Coupons', path: '/employee/coupons' }] : []),
    { icon: User, label: 'Profile', path: '/employee/profile' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    disconnectSocket();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const Sidebar = ({ mobile }) => (
    <aside className={`${mobile ? 'w-64' : collapsed ? 'w-16' : 'w-64'} bg-dark-brand text-white flex flex-col transition-all duration-300 ${mobile ? '' : 'fixed top-0 left-0 bottom-0 z-40'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0 shadow-sm border border-gold/30">
          <span className="text-gold-light font-display font-bold text-sm">E</span>
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <p className="font-display font-bold text-sm text-white leading-tight">Lavender <span className="text-gold">✦</span></p>
            <p className="font-body text-white/40 text-[10px]">Employee Hub</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} onClick={() => setMobileSidebar(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-body group relative ${active ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={18} className="shrink-0" />
              {(!collapsed || mobile) && (
                <span className="flex-1 font-medium">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/10 shrink-0">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="font-body text-[10px] text-white/40">Team Member</p>
            </div>
            <span className="badge bg-gold/20 text-gold-light text-[9px]">Staff</span>
          </div>
        )}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm font-body">
          <LogOut size={17} className="shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-gray-50/80">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
        <div className={collapsed ? 'w-16' : 'w-64'} style={{ transition: 'width 0.3s' }} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileSidebar(false)}>
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 22 }}
              onClick={e => e.stopPropagation()}>
              <Sidebar mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => { if (window.innerWidth < 1024) setMobileSidebar(true); else setCollapsed(!collapsed); }}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Menu size={20} className="text-gray-600" />
            </button>
            <div className="hidden sm:block">
              <p className="font-body font-bold text-gray-900 text-sm">{NAV.find(n => n.path === location.pathname)?.label || 'Employee Hub'}</p>
              <div className="flex items-center gap-1 text-xs font-body text-gray-400">
                <span>Employee</span><ChevronRight size={11} /><span className="text-primary">{NAV.find(n => n.path === location.pathname)?.label || 'Overview'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-ghost text-xs py-1.5 px-3 gap-1"><Sparkles size={12} /> View Store</Link>
            <NotificationBell />
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-xs font-bold shadow-sm">{user?.name?.[0]?.toUpperCase()}</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
