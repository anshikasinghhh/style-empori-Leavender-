import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Search } from 'lucide-react';
import { EmptyState } from '../../components/common/LoadingSpinner';
import { PRODUCTS, formatPrice } from '../../utils/data';

const DEMO_ORDERS = [
  { _id:'o1', orderNumber:'VE174521', orderStatus:'delivered', paymentStatus:'paid', total:9499, createdAt:'2025-02-10', items:[{ name:'Royal Kanjivaram Silk Saree', image: PRODUCTS[0].images[0].url }] },
  { _id:'o2', orderNumber:'VE174522', orderStatus:'shipped',   paymentStatus:'paid', total:28999, createdAt:'2025-02-28', items:[{ name:'Bridal Lehenga — Rani Pink & Gold', image: PRODUCTS[1].images[0].url }] },
  { _id:'o3', orderNumber:'VE174523', orderStatus:'processing',paymentStatus:'paid', total:2899,  createdAt:'2025-03-05', items:[{ name:'Lucknowi Chikankari Kurti Set', image: PRODUCTS[2].images[0].url }] },
  { _id:'o4', orderNumber:'VE174524', orderStatus:'placed',    paymentStatus:'pending', total:4599, createdAt:'2025-03-10', items:[{ name:'Polki Kundan Bridal Jewelry Set', image: PRODUCTS[3].images[0].url }] },
  { _id:'o5', orderNumber:'VE174525', orderStatus:'cancelled', paymentStatus:'refunded', total:6499, createdAt:'2025-01-20', items:[{ name:'Navratri Chaniya Choli', image: PRODUCTS[4].images[0].url }] },
];

const STATUS_STYLES = { placed:'bg-blue-100 text-blue-700', confirmed:'bg-indigo-100 text-indigo-700', processing:'bg-amber-100 text-amber-700', shipped:'bg-primary-100 text-primary', out_for_delivery:'bg-orange-100 text-orange-700', delivered:'bg-emerald-100 text-emerald-700', cancelled:'bg-rose-soft text-rose', returned:'bg-gray-100 text-gray-600' };
const STATUS_ICONS = { delivered:'✓', shipped:'🚚', processing:'⚙️', placed:'📋', confirmed:'✅', cancelled:'✕', out_for_delivery:'📦', returned:'↩' };

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const filtered = DEMO_ORDERS.filter(o =>
    (filter === 'all' || o.orderStatus === filter) &&
    (o.orderNumber.includes(search) || o.items[0]?.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-gray-900">My Orders</h1>
        <span className="badge-primary">{DEMO_ORDERS.length} orders</span>
      </div>

      {/* Filters */}
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
              className="bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60 hover:shadow-hover transition-all group flex items-center gap-4 block">
              <div className="w-16 h-18 rounded-xl overflow-hidden bg-champagne-light shrink-0">
                <img src={order.items[0]?.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                  <p className="font-body font-bold text-gray-900 text-sm">#{order.orderNumber}</p>
                  <span className={`badge text-[11px] ${STATUS_STYLES[order.orderStatus]||'bg-gray-100 text-gray-600'}`}>{STATUS_ICONS[order.orderStatus]} {order.orderStatus.replace('_',' ')}</span>
                  {order.paymentStatus === 'refunded' && <span className="badge bg-orange-100 text-orange-700 text-[10px]">Refunded</span>}
                </div>
                <p className="font-body text-gray-600 text-sm truncate">{order.items[0]?.name}</p>
                <p className="font-body text-gray-400 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-primary">{formatPrice(order.total)}</p>
                <ChevronRight size={16} className="text-gray-300 ml-auto mt-1 group-hover:text-primary transition-colors"/>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
