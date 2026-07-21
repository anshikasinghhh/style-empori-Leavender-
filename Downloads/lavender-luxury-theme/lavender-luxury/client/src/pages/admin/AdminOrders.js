import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Package, TrendingUp, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ALL_STATUSES = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_STYLES = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-primary-100 text-primary',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-soft text-rose'
};

const mapOrder = (o) => ({
  id: o._id,
  orderNumber: o.orderNumber || o._id?.slice(-6),
  customer: o.user?.name || o.shippingAddress?.name || 'Guest',
  email: o.user?.email || '',
  product: o.items?.[0]?.name || 'N/A',
  image: o.items?.[0]?.image || '',
  amount: o.total || 0,
  status: o.orderStatus || 'placed',
  payment: o.paymentMethod || 'cod',
  date: o.createdAt,
  items: o.items?.length || 0,
  productCount: o.items?.length || 0,
  totalQuantity: o.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
});

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders', { params: { limit: 200 } });
      setOrders((res.data.orders || []).map(mapOrder));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter(o =>
    (filterStatus === 'all' || o.status === filterStatus) &&
    (
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      String(o.orderNumber).includes(search) ||
      o.product.toLowerCase().includes(search.toLowerCase())
    )
  );

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order? This action cannot be undone.')) return;
    try {
      await api.delete(`/orders/${id}`);
      setOrders(os => os.filter(o => o.id !== id));
      toast.success('Order deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders(os => os.map(o => (o.id === id ? { ...o, status } : o)));
      toast.success(`Order status updated to "${status.replace('_', ' ')}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const stats = [
    { label: 'Total', value: orders.length, icon: Package, color: 'text-primary bg-champagne-light/80' },
    { label: 'Pending', value: orders.filter(o => o.status === 'placed').length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Shipped', value: orders.filter(o => o.status === 'shipped' || o.status === 'out_for_delivery').length, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' }
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Orders</h1>
        <p className="font-body text-gray-500 text-sm mt-0.5">Manage and track all customer orders</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-card border border-gray-50 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={17}/></div>
            <div><p className="font-display text-xl font-bold text-gray-900">{s.value}</p><p className="font-body text-xs text-gray-400">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {['all', ...ALL_STATUSES].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold whitespace-nowrap transition-all capitalize ${filterStatus === s ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-champagne-light/80 border border-gray-100'}`}>
            {s === 'all' ? `All (${orders.length})` : `${s.replace('_', ' ')} (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-sm"><Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer, email, or order..." className="w-full pl-10 input-field text-sm py-2.5"/>
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-body text-sm">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-body text-sm">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body min-w-[850px]">
              <thead className="bg-gray-50/80"><tr>{['Order', 'Customer', 'Product', 'Products', 'Qty', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-champagne-light/80/20 transition-colors group">
                    <td className="px-4 py-3 font-bold text-primary text-xs">#{order.orderNumber}</td>
                    <td className="px-4 py-3"><p className="font-semibold text-gray-900 text-sm">{order.customer}</p><p className="text-xs text-gray-400">{order.email}</p></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {order.image ? <img src={order.image} alt="" className="w-8 h-10 object-cover rounded-lg shrink-0"/> : <div className="w-8 h-10 rounded-lg bg-champagne-light shrink-0"/>}
                        <span className="text-gray-600 text-xs line-clamp-2 max-w-[120px]">{order.product}{order.items > 1 ? ` +${order.items - 1} more` : ''}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 text-center">{order.productCount}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 text-center">{order.totalQuantity}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">₹{order.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><span className="badge bg-gray-100 text-gray-600 text-[10px] capitalize">{order.payment}</span></td>
                    <td className="px-4 py-3">
                      <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ${STATUS_STYLES[order.status]}`}>
                        {ALL_STATUSES.map(s => <option key={s} value={s} className="text-gray-900 bg-white">{s.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteOrder(order.id)} className="w-8 h-8 rounded-lg bg-rose-soft hover:bg-rose/90 text-rose transition-colors flex items-center justify-center" title="Delete order">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
