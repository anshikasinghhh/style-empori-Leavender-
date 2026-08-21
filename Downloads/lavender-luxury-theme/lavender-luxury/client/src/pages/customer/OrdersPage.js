import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Search } from 'lucide-react';
import { EmptyState, LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/data';
import api from '../../utils/api';

const STATUS_STYLES = { placed:'bg-blue-100 text-blue-700', confirmed:'bg-indigo-100 text-indigo-700', processing:'bg-amber-100 text-amber-700', shipped:'bg-primary-100 text-primary', out_for_delivery:'bg-orange-100 text-orange-700', delivered:'bg-emerald-100 text-emerald-700', cancelled:'bg-rose-soft text-rose', returned:'bg-gray-100 text-gray-600' };
const STATUS_ICONS = { delivered:'✓', shipped:'🚚', processing:'⚙️', placed:'📋', confirmed:'✅', cancelled:'✕', out_for_delivery:'📦', returned:'↩' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter(o =>
    (filter === 'all' || o.orderStatus === filter) &&
    (o.orderNumber?.includes(search) || o.items?.[0]?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
        <span className="badge-primary">{orders.length} orders</span>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['all','placed','processing','shipped','delivered','cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-body font-semibold whitespace-nowrap transition-all ${filter===s ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-champagne-light/80 border border-gray-100 shadow-sm'}`}>
            {s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order number or product name..." className="w-full pl-10 input-field text-sm py-2.5"/>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No orders found" description="Your orders will appear here once you make a purchase"
          action={<Link to="/products" className="btn-primary">Start Shopping</Link>} />
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <Link key={order._id} to={`/orders/${order._id}`}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-gold-pale/60 hover:shadow-hover transition-all group flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 block">
              <div className="w-14 h-16 sm:w-16 sm:h-18 rounded-xl overflow-hidden bg-champagne-light shrink-0 self-start sm:self-auto">
                <img src={order.items[0]?.image || order.items[0]?.product?.images?.[0]?.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-2.5 mb-1 flex-wrap">
                  <p className="font-body font-bold text-gray-900 text-sm">#{order.orderNumber}</p>
                  <span className={`badge text-[10px] sm:text-[11px] ${STATUS_STYLES[order.orderStatus]||'bg-gray-100 text-gray-600'}`}>{STATUS_ICONS[order.orderStatus]} {order.orderStatus?.replace('_',' ')}</span>
                  {order.paymentStatus === 'refunded' && <span className="badge bg-orange-100 text-orange-700 text-[10px]">Refunded</span>}
                </div>
                <p className="font-body text-gray-600 text-sm truncate">{order.items[0]?.name}</p>
                <p className="font-body text-gray-400 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="font-body text-xs text-gray-500">{order.items?.length || 0} product{order.items?.length !== 1 ? 's' : ''}</p>
                  <p className="font-body text-xs text-gray-500">•</p>
                  <p className="font-body text-xs text-gray-500">{order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0} items</p>
                </div>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto sm:text-right shrink-0">
                <p className="font-display font-bold text-primary">{formatPrice(order.total)}</p>
                <ChevronRight size={16} className="text-gray-300 sm:ml-auto group-hover:text-primary transition-colors hidden sm:block"/>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
