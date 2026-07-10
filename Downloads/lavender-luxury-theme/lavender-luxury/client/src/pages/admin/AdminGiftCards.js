import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, Search, Filter, Download, Eye, Trash2, ToggleLeft, ToggleRight,
  X, Package, CheckCircle, Clock, Ban, IndianRupee, RefreshCw, Plus, Edit3,
  Layers, GripVertical, ChevronDown
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700',
  redeemed: 'bg-blue-100 text-blue-700',
  expired: 'bg-amber-100 text-amber-700',
  deactivated: 'bg-gray-100 text-gray-500',
};

const TIER_COLORS = [
  '#a78bfa', '#94a3b8', '#d4a853', '#6B21A8', '#ec4899', '#10b981', '#f59e0b', '#3b82f6',
];

const EMPTY_TIER = { name: '', amount: '', bonusAmount: 0, benefits: [''], sortOrder: 0, color: '#6B21A8' };

export default function AdminGiftCards() {
  const [activeTab, setActiveTab] = useState('cards');
  // Gift cards state
  const [giftCards, setGiftCards] = useState([]);
  const [stats, setStats] = useState({ totalSold: 0, totalRevenue: 0, active: 0, redeemed: 0, expired: 0, deactivated: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewCard, setViewCard] = useState(null);
  const [downloading, setDownloading] = useState(false);
  // Tiers state
  const [tiers, setTiers] = useState([]);
  const [tiersLoading, setTiersLoading] = useState(true);
  const [showTierForm, setShowTierForm] = useState(false);
  const [editingTierId, setEditingTierId] = useState(null);
  const [tierForm, setTierForm] = useState({ ...EMPTY_TIER });

  const fetchGiftCards = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const { data } = await api.get(`/giftcards/admin/list?${params}`);
      if (data.success) {
        setGiftCards(data.giftCards);
        setStats(data.stats);
      }
    } catch (err) {
      toast.error('Failed to load gift cards');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  const fetchTiers = useCallback(async () => {
    try {
      setTiersLoading(true);
      const { data } = await api.get('/giftcards/tiers/all');
      if (data.success) setTiers(data.tiers);
    } catch (err) {
      toast.error('Failed to load tiers');
    } finally {
      setTiersLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchGiftCards, 300);
    return () => clearTimeout(timer);
  }, [fetchGiftCards]);

  useEffect(() => {
    if (activeTab === 'tiers') fetchTiers();
  }, [activeTab, fetchTiers]);

  // Gift card handlers
  const handleStatusToggle = async (card) => {
    const newStatus = card.status === 'active' ? 'deactivated' : 'active';
    try {
      await api.put(`/giftcards/admin/${card._id}`, { status: newStatus });
      toast.success(`Gift card ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchGiftCards();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (card) => {
    if (!window.confirm(`Delete gift card ${card.giftCode}? This cannot be undone.`)) return;
    try {
      await api.delete(`/giftcards/admin/${card._id}`);
      toast.success('Gift card deleted');
      fetchGiftCards();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleDownloadCSV = () => {
    setDownloading(true);
    try {
      const headers = ['Code', 'Amount', 'Balance', 'Sender', 'Recipient', 'Email', 'Status', 'Purchase Date', 'Expiry Date'];
      const rows = giftCards.map(gc => [
        gc.giftCode, gc.amount, gc.remainingBalance, gc.senderName, gc.recipientName,
        gc.recipientEmail, gc.status,
        new Date(gc.purchaseDate).toLocaleDateString(),
        new Date(gc.expiryDate).toLocaleDateString(),
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gift-cards-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded');
    } catch (err) {
      toast.error('CSV download failed');
    } finally {
      setDownloading(false);
    }
  };

  // Tier handlers
  const openTierForm = (tier) => {
    if (tier) {
      setTierForm({
        name: tier.name,
        amount: tier.amount,
        bonusAmount: tier.bonusAmount || 0,
        benefits: tier.benefits?.length ? tier.benefits : [''],
        sortOrder: tier.sortOrder || 0,
        color: tier.color || '#6B21A8',
      });
      setEditingTierId(tier._id);
    } else {
      setTierForm({ ...EMPTY_TIER, benefits: [''] });
      setEditingTierId(null);
    }
    setShowTierForm(true);
  };

  const handleTierSubmit = async () => {
    if (!tierForm.name || !tierForm.amount) {
      toast.error('Name and amount are required');
      return;
    }
    const benefits = tierForm.benefits.filter(b => b.trim());
    try {
      const payload = { ...tierForm, amount: Number(tierForm.amount), bonusAmount: Number(tierForm.bonusAmount), benefits };
      if (editingTierId) {
        await api.put(`/giftcards/tiers/${editingTierId}`, payload);
        toast.success('Tier updated');
      } else {
        await api.post('/giftcards/tiers', payload);
        toast.success('Tier created');
      }
      setShowTierForm(false);
      fetchTiers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save tier');
    }
  };

  const handleTierDelete = async (id) => {
    if (!window.confirm('Delete this tier?')) return;
    try {
      await api.delete(`/giftcards/tiers/${id}`);
      toast.success('Tier deleted');
      fetchTiers();
    } catch (err) {
      toast.error('Failed to delete tier');
    }
  };

  const handleTierToggle = async (tier) => {
    try {
      await api.put(`/giftcards/tiers/${tier._id}`, { isActive: !tier.isActive });
      toast.success(tier.isActive ? 'Tier deactivated' : 'Tier activated');
      fetchTiers();
    } catch (err) {
      toast.error('Failed to update tier');
    }
  };

  const addBenefitField = () => setTierForm(f => ({ ...f, benefits: [...f.benefits, ''] }));
  const removeBenefitField = (i) => setTierForm(f => ({ ...f, benefits: f.benefits.filter((_, idx) => idx !== i) }));
  const updateBenefit = (i, val) => setTierForm(f => ({ ...f, benefits: f.benefits.map((b, idx) => idx === i ? val : b) }));

  const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const STAT_CARDS = [
    { label: 'Total Sold', value: stats.totalSold, icon: Package, color: 'bg-primary/10 text-primary' },
    { label: 'Active', value: stats.active, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Redeemed', value: stats.redeemed, icon: Clock, color: 'bg-blue-100 text-blue-600' },
    { label: 'Expired', value: stats.expired, icon: Ban, color: 'bg-amber-100 text-amber-600' },
    { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: IndianRupee, color: 'bg-gold/15 text-gold-dark' },
  ];

  return (
    <AdminLayout>
      <div>
        {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('cards')}
          className={`px-5 py-2.5 rounded-xl text-sm font-body font-semibold transition-all ${activeTab === 'cards' ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
          <span className="flex items-center gap-2"><Gift size={15} /> Gift Cards</span>
        </button>
        <button onClick={() => setActiveTab('tiers')}
          className={`px-5 py-2.5 rounded-xl text-sm font-body font-semibold transition-all ${activeTab === 'tiers' ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
          <span className="flex items-center gap-2"><Layers size={15} /> Tiers &amp; Benefits</span>
        </button>
      </div>

      {/* ═══════════ GIFT CARDS TAB ═══════════ */}
      {activeTab === 'cards' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {STAT_CARDS.map(card => (
              <div key={card.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                  <card.icon size={20} />
                </div>
                <p className="font-body text-xs text-gray-500 mb-0.5">{card.label}</p>
                <p className="font-display text-xl font-bold text-gray-900">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by code, name, email..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-body focus:outline-none focus:border-primary/50" />
            </div>
            <div className="flex gap-2">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-body focus:outline-none focus:border-primary/50">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="redeemed">Redeemed</option>
                <option value="expired">Expired</option>
                <option value="deactivated">Deactivated</option>
              </select>
              <button onClick={handleDownloadCSV} disabled={downloading || giftCards.length === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-body font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
                <Download size={14} /> CSV
              </button>
              <button onClick={fetchGiftCards} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <RefreshCw size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                <p className="font-body text-sm text-gray-500">Loading gift cards...</p>
              </div>
            ) : giftCards.length === 0 ? (
              <div className="p-12 text-center">
                <Gift size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="font-body text-sm text-gray-500">No gift cards found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-body font-semibold text-gray-600 text-xs uppercase tracking-wide">Code</th>
                      <th className="text-left px-4 py-3 font-body font-semibold text-gray-600 text-xs uppercase tracking-wide">Amount</th>
                      <th className="text-left px-4 py-3 font-body font-semibold text-gray-600 text-xs uppercase tracking-wide">Balance</th>
                      <th className="text-left px-4 py-3 font-body font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Recipient</th>
                      <th className="text-left px-4 py-3 font-body font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Sender</th>
                      <th className="text-left px-4 py-3 font-body font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 font-body font-semibold text-gray-600 text-xs uppercase tracking-wide hidden sm:table-cell">Date</th>
                      <th className="text-right px-4 py-3 font-body font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {giftCards.map(gc => (
                      <tr key={gc._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-gray-900 text-xs">{gc.giftCode}</td>
                        <td className="px-4 py-3 font-body font-semibold text-gray-900">{formatCurrency(gc.amount)}</td>
                        <td className="px-4 py-3 font-body text-gray-600">{formatCurrency(gc.remainingBalance)}</td>
                        <td className="px-4 py-3 font-body text-gray-600 hidden md:table-cell">
                          <p className="text-xs font-semibold text-gray-800">{gc.recipientName}</p>
                          <p className="text-[10px] text-gray-400">{gc.recipientEmail}</p>
                        </td>
                        <td className="px-4 py-3 font-body text-gray-600 text-xs hidden lg:table-cell">{gc.senderName}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-body font-bold capitalize ${STATUS_COLORS[gc.status] || 'bg-gray-100 text-gray-500'}`}>
                            {gc.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-body text-gray-500 text-xs hidden sm:table-cell">
                          {new Date(gc.purchaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setViewCard(gc)} title="View" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                              <Eye size={14} className="text-gray-500" />
                            </button>
                            <button onClick={() => handleStatusToggle(gc)} title={gc.status === 'active' ? 'Deactivate' : 'Activate'}
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                              {gc.status === 'active' ? <ToggleRight size={14} className="text-amber-500" /> : <ToggleLeft size={14} className="text-emerald-500" />}
                            </button>
                            <button onClick={() => handleDelete(gc)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════ TIERS TAB ═══════════ */}
      {activeTab === 'tiers' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">Gift Card Tiers</h2>
              <p className="font-body text-sm text-gray-500">Manage amounts, bonuses, and benefits for each tier</p>
            </div>
            <button onClick={() => openTierForm(null)} className="btn-primary text-sm flex items-center gap-2">
              <Plus size={16} /> Add Tier
            </button>
          </div>

          {tiersLoading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
              <p className="font-body text-sm text-gray-500">Loading tiers...</p>
            </div>
          ) : tiers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <Layers size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="font-body text-gray-500">No tiers configured yet</p>
              <button onClick={() => openTierForm(null)} className="btn-primary text-sm mt-4">Create First Tier</button>
            </div>
          ) : (
            <div className="grid gap-4">
              {tiers.map(tier => (
                <motion.div key={tier._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Color dot + name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tier.color + '20', borderColor: tier.color + '40', borderWidth: 1 }}>
                        <Gift size={18} style={{ color: tier.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-base font-bold text-gray-900 truncate">{tier.name}</h3>
                          {!tier.isActive && <span className="text-[10px] font-body font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">Inactive</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-body text-gray-500 mt-1">
                          <span className="font-semibold text-gray-800">₹{tier.amount.toLocaleString('en-IN')}</span>
                          {tier.bonusAmount > 0 && (
                            <span className="text-emerald-600 font-semibold">+ ₹{tier.bonusAmount.toLocaleString('en-IN')} bonus</span>
                          )}
                          {tier.bonusAmount > 0 && (
                            <span className="text-gray-400">Worth ₹{(tier.amount + tier.bonusAmount).toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="flex-1">
                      {tier.benefits?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {tier.benefits.map((b, i) => (
                            <span key={i} className="text-[11px] font-body bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-100">
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleTierToggle(tier)} title={tier.isActive ? 'Deactivate' : 'Activate'}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        {tier.isActive
                          ? <ToggleRight size={20} className="text-emerald-500" />
                          : <ToggleLeft size={20} className="text-gray-400" />}
                      </button>
                      <button onClick={() => openTierForm(tier)} className="p-2 rounded-lg hover:bg-blue-50 transition-colors">
                        <Edit3 size={16} className="text-blue-500" />
                      </button>
                      <button onClick={() => handleTierDelete(tier._id)} className="p-2 rounded-lg hover:bg-rose-50 transition-colors">
                        <Trash2 size={16} className="text-rose-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ═══════════ TIER FORM MODAL ═══════════ */}
      <AnimatePresence>
        {showTierForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setShowTierForm(false)}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold text-gray-900 flex items-center gap-2">
                <Layers size={20} className="text-primary" />
                {editingTierId ? 'Edit Tier' : 'New Tier'}
              </h2>
              <button onClick={() => setShowTierForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Tier Name *</label>
                <input type="text" value={tierForm.name} onChange={e => setTierForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Lavender Mini, Lavender Silver"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none" />
              </div>

              {/* Amount + Bonus */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Amount (₹) *</label>
                  <input type="number" min="1" value={tierForm.amount}
                    onChange={e => setTierForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="500" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none" />
                </div>
                <div>
                  <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Bonus (₹)</label>
                  <input type="number" min="0" value={tierForm.bonusAmount}
                    onChange={e => setTierForm(f => ({ ...f, bonusAmount: e.target.value }))}
                    placeholder="25" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none" />
                </div>
              </div>

              {/* Worth preview */}
              {tierForm.amount && tierForm.bonusAmount > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                  <p className="font-body text-sm text-emerald-700 font-semibold">
                    Customer pays ₹{Number(tierForm.amount).toLocaleString('en-IN')} — gets worth ₹{(Number(tierForm.amount) + Number(tierForm.bonusAmount)).toLocaleString('en-IN')}
                  </p>
                </div>
              )}

              {/* Benefits */}
              <div>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Benefits</label>
                <div className="space-y-2">
                  {tierForm.benefits.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={b} onChange={e => updateBenefit(i, e.target.value)}
                        placeholder={`Benefit ${i + 1}`}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 font-body text-sm focus:border-primary outline-none" />
                      {tierForm.benefits.length > 1 && (
                        <button onClick={() => removeBenefitField(i)} className="p-2 rounded-lg hover:bg-rose-50">
                          <X size={14} className="text-rose-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={addBenefitField} className="mt-2 text-xs font-body font-semibold text-primary hover:underline flex items-center gap-1">
                  <Plus size={12} /> Add benefit
                </button>
              </div>

              {/* Color */}
              <div>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Tier Color</label>
                <div className="flex items-center gap-2">
                  {TIER_COLORS.map(c => (
                    <button key={c} onClick={() => setTierForm(f => ({ ...f, color: c }))}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${tierForm.color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShowTierForm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 font-body text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleTierSubmit} className="btn-primary text-sm">
                {editingTierId ? 'Update Tier' : 'Create Tier'}
              </button>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Card Details Modal */}
      <AnimatePresence>
        {viewCard && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewCard(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-gray-900 text-lg">Gift Card Details</h3>
                <button onClick={() => setViewCard(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={18} className="text-gray-500" /></button>
              </div>
              <div className="space-y-3">
                {[
                  ['Code', viewCard.giftCode],
                  ['Amount', formatCurrency(viewCard.amount)],
                  ['Remaining Balance', formatCurrency(viewCard.remainingBalance)],
                  ['Status', viewCard.status],
                  ['Sender', viewCard.senderName],
                  ['Recipient', `${viewCard.recipientName} (${viewCard.recipientEmail})`],
                  ['Purchase Date', new Date(viewCard.purchaseDate).toLocaleDateString('en-IN')],
                  ['Expiry Date', new Date(viewCard.expiryDate).toLocaleDateString('en-IN')],
                  ['Payment ID', viewCard.paymentId || 'N/A'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-start py-2 border-b border-gray-50">
                    <span className="font-body text-xs text-gray-500 font-semibold uppercase">{label}</span>
                    <span className="font-body text-sm text-gray-900 text-right max-w-[60%] break-words">{value}</span>
                  </div>
                ))}
                {viewCard.personalMessage && (
                  <div className="pt-2">
                    <span className="font-body text-xs text-gray-500 font-semibold uppercase block mb-1">Personal Message</span>
                    <p className="font-body text-sm text-gray-700 italic bg-primary-50/50 rounded-xl p-3">"{viewCard.personalMessage}"</p>
                  </div>
                )}
                {viewCard.redemptionHistory?.length > 0 && (
                  <div className="pt-2">
                    <span className="font-body text-xs text-gray-500 font-semibold uppercase block mb-2">Redemption History</span>
                    {viewCard.redemptionHistory.map((rh, i) => (
                      <div key={i} className="flex justify-between text-xs font-body text-gray-600 py-1">
                        <span>{formatCurrency(rh.amount)}</span>
                        <span>{new Date(rh.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </AdminLayout>
  );
}
