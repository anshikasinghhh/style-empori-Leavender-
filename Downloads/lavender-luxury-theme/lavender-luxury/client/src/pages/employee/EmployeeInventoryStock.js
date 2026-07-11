import React, { useState, useEffect } from 'react';
import EmployeeLayout from './EmployeeLayout';
import { AlertTriangle, Package, TrendingDown, Search, RefreshCw, Tag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatPrice } from '../../utils/data';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const getStatus = (stock) => {
  if (stock === 0) return { label: 'Out of Stock', cls: 'bg-rose-soft text-rose border border-rose/20', bar: 'bg-rose' };
  if (stock < 10) return { label: 'Low Stock', cls: 'bg-amber-100 text-amber-700 border border-amber-200', bar: 'bg-amber-400' };
  if (stock < 25) return { label: 'Limited', cls: 'bg-yellow-100 text-yellow-700 border border-yellow-200', bar: 'bg-yellow-400' };
  return { label: 'In Stock', cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200', bar: 'bg-emerald-500' };
};

export default function EmployeeInventoryStock() {
  const { user } = useSelector(s => s.auth);
  const canManageCoupons = user?.canManageCoupons || false;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [products, setProducts] = useState([]);

  const filtered = products.filter((p) => {
    const match =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'low') return match && p.stock > 0 && p.stock < 10;
    if (filter === 'out') return match && p.stock === 0;
    if (filter === 'ok') return match && p.stock >= 25;
    return match;
  });

  const loadInventory = async () => {
    try {
      const res = await api.get('/products', { params: { limit: 500 } });
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error('Failed to load inventory');
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const restock = async (id) => {
    const product = products.find((p) => p._id === id);
    try {
      await api.put(`/products/${id}/restock`, { increment: 50 });
      toast.success('Restocked +50 units');
      await loadInventory();
    } catch (err) {
      toast.error('Restock failed');
    }
  };

  const summaryStats = [
    { label: 'Total Products', value: products.length, color: 'from-primary to-gold-light', icon: Package },
    { label: 'Low Stock', value: products.filter((p) => p.stock > 0 && p.stock < 10).length, color: 'from-amber-500 to-orange-400', icon: AlertTriangle },
    { label: 'Out of Stock', value: products.filter((p) => p.stock === 0).length, color: 'from-rose to-pink-500', icon: TrendingDown },
    { label: 'Total Units', value: products.reduce((s, p) => s + p.stock, 0), color: 'from-emerald-500 to-teal-400', icon: Package },
  ];

  return (
    <EmployeeLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="font-body text-gray-500 text-sm mt-0.5">View and manage stock levels for all products</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm shrink-0`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-gray-900">{s.value}</p>
              <p className="font-body text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {products.filter((p) => p.stock > 0 && p.stock < 10).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-body font-bold text-amber-800 text-sm">Low Stock Alert</p>
            <p className="font-body text-amber-700 text-xs mt-0.5">
              {products
                .filter((p) => p.stock > 0 && p.stock < 10)
                .map((p) => `${p.name.split(' ').slice(0, 3).join(' ')} (${p.stock})`)
                .join(' · ')}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="w-full pl-10 input-field text-sm py-2.5"
            />
          </div>
          <div className="flex gap-2">
            {[
              ['all', 'All'],
              ['low', 'Low Stock'],
              ['out', 'Out of Stock'],
              ['ok', 'Healthy'],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                  filter === v ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-champagne-light/80'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body min-w-[700px]">
            <thead className="bg-gray-50/80">
              <tr>
                {(canManageCoupons
                  ? ['Product', 'Category', 'Price', 'In Stock', 'Sold', 'Status', 'Stock Level', 'Coupon', 'Action']
                  : ['Product', 'Category', 'Price', 'In Stock', 'Sold', 'Status', 'Stock Level', 'Action']
                ).map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const st = getStatus(p.stock);
                const pct = Math.min(100, (p.stock / Math.max(p.stock + p.sold, 1)) * 100);
                return (
                  <tr key={p._id} className="hover:bg-champagne-light/80/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-champagne-light shrink-0">
                          <img src={p.images?.[0]?.url} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-champagne-light/80 text-primary text-[10px]">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 text-center">{p.stock}</td>
                    <td className="px-4 py-3 text-gray-500 text-center">{p.sold}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-[10px] ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 w-32">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${st.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{Math.round(pct)}%</p>
                    </td>
                    {canManageCoupons && (
                    <td className="px-4 py-3">
                      {p.couponCode ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-champagne-light/80 text-primary text-[10px] font-bold tracking-widest border border-primary-100">
                          <Tag size={9} /> {p.couponCode}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    )}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => restock(p._id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-champagne-light/80 hover:bg-primary text-primary hover:text-white text-xs font-semibold transition-all"
                      >
                        <RefreshCw size={11} /> Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </EmployeeLayout>
  );
}
