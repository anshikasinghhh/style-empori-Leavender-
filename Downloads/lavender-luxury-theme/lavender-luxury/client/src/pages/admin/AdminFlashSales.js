import React, { useState, useEffect } from 'react';
import { Zap, Plus, Clock, Calendar, Package, Edit3, Trash2, X, ChevronDown, Timer, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import AdminLayout from './AdminLayout';

const QUICK_PRESETS = [
  { label: '2 Hours', hours: 2 },
  { label: '6 Hours', hours: 6 },
  { label: '12 Hours', hours: 12 },
  { label: '1 Day', hours: 24 },
  { label: '2 Days', hours: 48 },
  { label: '3 Days', hours: 72 },
  { label: '1 Week', hours: 168 },
];

const EMPTY_FORM = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  discountPercent: 0,
  bannerText: '',
  products: [],
};

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((d - now) / 1000);
  if (diff < 0) return 'Expired';
  if (diff < 3600) return `${Math.floor(diff / 60)}m left`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h left`;
  return `${Math.floor(diff / 86400)}d left`;
}

function statusBadge(status) {
  const map = {
    scheduled: 'bg-blue-100 text-blue-700',
    active: 'bg-emerald-100 text-emerald-700',
    expired: 'bg-gray-100 text-gray-500',
    cancelled: 'bg-rose-100 text-rose-600',
  };
  return map[status] || 'bg-gray-100 text-gray-500';
}

export default function AdminFlashSales({ Layout = AdminLayout }) {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [salesRes, prodRes] = await Promise.all([
        api.get('/flash-sales'),
        api.get('/products', { params: { limit: 500 } }),
      ]);
      setSales(salesRes.data);
      setProducts(prodRes.data.products || prodRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (hours) => {
    const now = new Date();
    const end = new Date(now.getTime() + hours * 60 * 60 * 1000);
    setForm(f => ({
      ...f,
      startDate: formatDateTime(now),
      endDate: formatDateTime(end),
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.startDate || !form.endDate) {
      toast.error('Name, start date and end date are required');
      return;
    }
    try {
      const payload = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };
      if (editingId) {
        await api.put(`/flash-sales/${editingId}`, payload);
        toast.success('Flash sale updated');
      } else {
        await api.post('/flash-sales', payload);
        toast.success('Flash sale created');
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ ...EMPTY_FORM });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleEdit = (sale) => {
    setForm({
      name: sale.name,
      description: sale.description || '',
      startDate: formatDateTime(sale.startDate),
      endDate: formatDateTime(sale.endDate),
      discountPercent: sale.discountPercent || 0,
      bannerText: sale.bannerText || '',
      products: (sale.products || []).map(p => p._id || p),
    });
    setEditingId(sale._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flash sale?')) return;
    try {
      await api.delete(`/flash-sales/${id}`);
      toast.success('Flash sale deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleActive = async (sale) => {
    try {
      await api.put(`/flash-sales/${sale._id}`, { isActive: !sale.isActive });
      toast.success(sale.isActive ? 'Flash sale deactivated' : 'Flash sale activated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const toggleProduct = (pid) => {
    setForm(f => ({
      ...f,
      products: f.products.includes(pid)
        ? f.products.filter(p => p !== pid)
        : [...f.products, pid],
    }));
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredSales = activeTab === 'all' ? sales : sales.filter(s => s.status === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-gold" size={26} fill="currentColor" /> Flash Sales
          </h1>
          <p className="font-body text-sm text-gray-500 mt-1">Create and manage timed sale events</p>
        </div>
        <button onClick={() => { setForm({ ...EMPTY_FORM }); setEditingId(null); setShowForm(true); }}
          className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> New Flash Sale
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'scheduled', 'active', 'expired', 'cancelled'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-body font-semibold capitalize transition-all ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
            {tab} {tab === 'all' ? `(${sales.length})` : `(${sales.filter(s => s.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Sales List */}
      {filteredSales.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Zap size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="font-body text-gray-500 font-semibold">No flash sales found</p>
          <p className="font-body text-sm text-gray-400 mt-1">Create your first flash sale to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSales.map(sale => (
            <motion.div key={sale._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-lg font-bold text-gray-900 truncate">{sale.name}</h3>
                    <span className={`text-[10px] font-body font-bold px-2 py-0.5 rounded-full ${statusBadge(sale.status)}`}>
                      {sale.status}
                    </span>
                    {!sale.isActive && <span className="text-[10px] font-body font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">Inactive</span>}
                  </div>
                  {sale.description && <p className="font-body text-sm text-gray-500 mb-2">{sale.description}</p>}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-body text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={13} /> Start: {new Date(sale.startDate).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Timer size={13} /> End: {new Date(sale.endDate).toLocaleString()}</span>
                    {sale.status === 'scheduled' && <span className="text-blue-600 font-semibold">{timeAgo(sale.startDate)}</span>}
                    {sale.status === 'active' && <span className="text-emerald-600 font-semibold">{timeAgo(sale.endDate)}</span>}
                    {sale.discountPercent > 0 && <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold">{sale.discountPercent}% OFF</span>}
                    <span className="flex items-center gap-1"><Package size={13} /> {(sale.products || []).length} products</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggleActive(sale)} title={sale.isActive ? 'Deactivate' : 'Activate'}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    {sale.isActive
                      ? <ToggleRight size={20} className="text-emerald-500" />
                      : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                  <button onClick={() => handleEdit(sale)} className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
                    <Edit3 size={16} className="text-blue-500" />
                  </button>
                  <button onClick={() => handleDelete(sale._id)} className="p-2 rounded-lg hover:bg-rose-50 transition-colors">
                    <Trash2 size={16} className="text-rose-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-display text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap size={20} className="text-gold" fill="currentColor" />
                  {editingId ? 'Edit Flash Sale' : 'New Flash Sale'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-5">
                {/* Quick Presets */}
                <div>
                  <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Quick Set Duration</label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PRESETS.map(p => (
                      <button key={p.label} onClick={() => applyPreset(p.hours)}
                        className="px-3 py-1.5 rounded-lg border border-primary/20 text-primary text-xs font-body font-semibold hover:bg-primary/5 transition-colors">
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Sale Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Weekend Mega Sale, Summer Clearance"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none" />
                </div>

                {/* Description */}
                <div>
                  <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Description</label>
                  <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Short description shown to customers"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none" />
                </div>

                {/* Start / End Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Calendar size={13} /> Start Date & Time *
                    </label>
                    <input type="datetime-local" value={form.startDate}
                      onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none" />
                  </div>
                  <div>
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Timer size={13} /> End Date & Time *
                    </label>
                    <input type="datetime-local" value={form.endDate}
                      onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none" />
                  </div>
                </div>

                {/* Duration Preview */}
                {form.startDate && form.endDate && (
                  <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3">
                    <p className="font-body text-sm text-primary font-semibold flex items-center gap-2">
                      <Clock size={14} />
                      {(() => {
                        const diff = new Date(form.endDate) - new Date(form.startDate);
                        if (diff <= 0) return 'End time must be after start time';
                        const hrs = Math.floor(diff / 3600000);
                        const mins = Math.floor((diff % 3600000) / 60000);
                        const days = Math.floor(hrs / 24);
                        if (days > 0) return `Duration: ${days} day${days > 1 ? 's' : ''} ${hrs % 24}h`;
                        return `Duration: ${hrs}h ${mins}m`;
                      })()}
                    </p>
                  </div>
                )}

                {/* Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Discount %</label>
                    <input type="number" min="0" max="100" value={form.discountPercent}
                      onChange={e => setForm(f => ({ ...f, discountPercent: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none" />
                  </div>
                  <div>
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Banner Text</label>
                    <input type="text" value={form.bannerText}
                      onChange={e => setForm(f => ({ ...f, bannerText: e.target.value }))}
                      placeholder="e.g. Up to 50% off!"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none" />
                  </div>
                </div>

                {/* Products */}
                <div>
                  <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                    Products ({form.products.length} selected)
                  </label>
                  <button onClick={() => setShowProductPicker(!showProductPicker)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm text-left flex items-center justify-between hover:border-primary transition-colors">
                    <span className="text-gray-500">{showProductPicker ? 'Click to collapse' : 'Click to select products'}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${showProductPicker ? 'rotate-180' : ''}`} />
                  </button>
                  {showProductPicker && (
                    <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)}
                          placeholder="Search products..."
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 font-body text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredProducts.slice(0, 50).map(p => (
                          <label key={p._id}
                            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${form.products.includes(p._id) ? 'bg-primary/5' : ''}`}>
                            <input type="checkbox" checked={form.products.includes(p._id)} onChange={() => toggleProduct(p._id)}
                              className="w-4 h-4 text-primary rounded" />
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                              <p className="font-body text-xs text-gray-400">{p.category} — ₹{p.price}</p>
                            </div>
                            {p.isFlashSale && <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">In Sale</span>}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
                <button onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 font-body text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  className="btn-primary text-sm flex items-center gap-2">
                  <Zap size={14} fill="currentColor" />
                  {editingId ? 'Update Flash Sale' : 'Create Flash Sale'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
