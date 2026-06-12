import React, { useState,useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Plus, Tag, Trash2, X, Save, Copy, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
// const { Coupon } = require('../models/index');


const INIT = [
  { _id:'cp1', code:'VASTRA10',  type:'percentage', value:10, minOrderValue:999,  maxDiscount:500,  usageLimit:100, usedCount:34, expiresAt:'2025-12-31', isActive:true },
  { _id:'cp2', code:'WELCOME20', type:'percentage', value:20, minOrderValue:1500, maxDiscount:1000, usageLimit:50,  usedCount:12, expiresAt:'2025-12-15', isActive:true },
  { _id:'cp3', code:'FLAT500',   type:'fixed',      value:500,minOrderValue:2999, maxDiscount:null, usageLimit:200, usedCount:89, expiresAt:'2025-11-30', isActive:false },
  { _id:'cp4', code:'FESTIVE15', type:'percentage', value:15, minOrderValue:1999, maxDiscount:750,  usageLimit:150, usedCount:67, expiresAt:'2025-12-25', isActive:true },
  { _id:'cp5', code:'BRIDE25',   type:'percentage', value:25, minOrderValue:15000,maxDiscount:5000, usageLimit:30,  usedCount:8,  expiresAt:'2025-12-31', isActive:true },
];
const EMPTY = { code:'', type:'percentage', value:'', minOrderValue:'', maxDiscount:'', usageLimit:'100', expiresAt:'', isActive:true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  useEffect(() => {
  loadCoupons();
}, []);

 const handleSave = async () => {
  try {
    if (!form.code || !form.value) {
      toast.error("Code and value are required");
      return;
    }

    const newCoupon = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrderValue: Number(form.minOrderValue || 0),
      maxDiscount: form.maxDiscount
        ? Number(form.maxDiscount)
        : null,
      usageLimit: Number(form.usageLimit || 100),
      expiresAt: form.expiresAt,
      isActive: true
    };

    const res = await api.post(
      "/admin/coupon",
      newCoupon
    );

    setCoupons(prev => [
      res.data.coupon,
      ...prev
    ]);

    toast.success("Coupon Created");

    setModal(false);
    setForm(EMPTY);

  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
  }
};

const loadCoupons = async () => {
  
  try {
    const res = await api.get('/admin/coupons');

    setCoupons(res.data.coupons);
  } catch (err) {
    console.error(err);
    toast.error('Failed to load coupons');
  }
  
};
const toggle = async (id) => {

  try {

    const coupon =
    coupons.find(c => c._id === id);

    const res =
    await api.put(
      `/admin/coupon/${id}`,
      {
        isActive: !coupon.isActive
      }
    );

    setCoupons(cs =>
      cs.map(c =>
        c._id === id
          ? res.data.coupon
          : c
      )
    );

    toast.success("Status Updated");

  } catch (err) {

    toast.error("Update failed");

  }
};
  // const toggle = (id) => { setCoupons(cs => cs.map(c => c._id===id ? {...c,isActive:!c.isActive} : c)); toast.success('Coupon status updated'); };
  // const remove = (id) => { setCoupons(cs => cs.filter(c => c._id!==id)); toast.success('Coupon deleted'); };
  const remove = async (id) => {
  try {

    await api.delete(
      `/admin/coupon/${id}`
    );

    setCoupons(cs =>
      cs.filter(c => c._id !== id)
    );

    toast.success("Coupon Deleted");

  } catch (err) {
    toast.error("Delete failed");
  }
};
  const copy = (code) => { navigator.clipboard?.writeText(code); toast.success(`Copied "${code}" to clipboard!`); };

  const activeCoupons = coupons.filter(c => c.isActive);
  const totalUsed = coupons.reduce((s,c) => s+c.usedCount, 0);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="font-body text-gray-500 text-sm mt-0.5">{activeCoupons.length} active · {totalUsed} total uses</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setModal(true); }} className="btn-primary text-sm gap-2 py-2.5"><Plus size={16}/> Create Coupon</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {coupons.map(c => {
          const usePct = Math.round((c.usedCount / c.usageLimit) * 100);
          const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
          return (
            <div key={c._id} className={`bg-white rounded-2xl p-5 shadow-card border-2 transition-all hover:shadow-hover ${c.isActive && !expired ? 'border-primary-100' : 'border-gray-100 opacity-60'}`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-champagne-light/80 flex items-center justify-center"><Tag size={16} className="text-primary"/></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-body font-black text-gray-900 text-base tracking-widest">{c.code}</p>
                      <button onClick={() => copy(c.code)} className="text-gray-300 hover:text-primary transition-colors"><Copy size={12}/></button>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {c.isActive && !expired ? <span className="badge bg-emerald-100 text-emerald-700 text-[10px]">Active</span> : expired ? <span className="badge bg-gray-100 text-gray-500 text-[10px]">Expired</span> : <span className="badge bg-gray-100 text-gray-500 text-[10px]">Inactive</span>}
                      <span className="badge bg-champagne-light/80 text-primary text-[10px]">{c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => toggle(c._id)} className="p-1.5 rounded-lg hover:bg-champagne-light/80 text-gray-400 hover:text-primary transition-all" title="Toggle">
                    {c.isActive ? <ToggleRight size={16} className="text-emerald-500"/> : <ToggleLeft size={16}/>}
                  </button>
                  <button onClick={() => remove(c._id)} className="p-1.5 rounded-lg hover:bg-rose-soft text-gray-400 hover:text-rose transition-all"><Trash2 size={14}/></button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs font-body mb-4">
                <div className="flex justify-between text-gray-500"><span>Min. Order Value</span><span className="font-bold text-gray-800">₹{c.minOrderValue.toLocaleString('en-IN')}</span></div>
                {c.maxDiscount && <div className="flex justify-between text-gray-500"><span>Max Discount</span><span className="font-bold text-gray-800">₹{c.maxDiscount.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between text-gray-500"><span>Expires</span><span className={`font-bold ${expired ? 'text-rose' : 'text-gray-800'}`}>{new Date(c.expiresAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></div>
              </div>

              {/* Usage bar */}
              <div className="border-t border-gray-50 pt-3">
                <div className="flex justify-between text-[11px] font-body mb-1.5">
                  <span className="text-gray-500">Usage</span>
                  <span className="font-bold text-gray-700">{c.usedCount} / {c.usageLimit} ({usePct}%)</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${usePct > 80 ? 'bg-rose' : usePct > 50 ? 'bg-amber-400' : 'bg-primary'}`} style={{ width:`${usePct}%` }}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }} className="bg-white rounded-3xl w-full max-w-md shadow-premium">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-display text-xl font-bold text-gray-900">Create Coupon</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"><X size={18}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Coupon Code *</label>
                  <input value={form.code} onChange={e => setForm(f=>({...f,code:e.target.value.toUpperCase().replace(/\s/g,'')}))} placeholder="e.g. SAVE20" className="input-field font-bold tracking-widest text-sm"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Type</label>
                    <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} className="input-field text-sm">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Value *</label>
                    <input type="number" value={form.value} onChange={e => setForm(f=>({...f,value:e.target.value}))} placeholder={form.type==='percentage'?'10':'500'} className="input-field text-sm"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Min Order (₹)</label>
                    <input type="number" value={form.minOrderValue} onChange={e => setForm(f=>({...f,minOrderValue:e.target.value}))} placeholder="999" className="input-field text-sm"/>
                  </div>
                  <div>
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Max Discount (₹)</label>
                    <input type="number" value={form.maxDiscount} onChange={e => setForm(f=>({...f,maxDiscount:e.target.value}))} placeholder="500" className="input-field text-sm"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Usage Limit</label>
                    <input type="number" value={form.usageLimit} onChange={e => setForm(f=>({...f,usageLimit:e.target.value}))} placeholder="100" className="input-field text-sm"/>
                  </div>
                  <div>
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Expires At</label>
                    <input type="date" value={form.expiresAt} onChange={e => setForm(f=>({...f,expiresAt:e.target.value}))} className="input-field text-sm"/>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-gray-100">
                <button onClick={() => setModal(false)} className="flex-1 btn-outline py-3">Cancel</button>
                <button onClick={handleSave} className="flex-1 btn-primary py-3 gap-2"><Save size={15}/>Create Coupon</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
