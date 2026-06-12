import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Users, ShoppingBag, TrendingUp, Mail, Phone, Ban, Eye } from 'lucide-react';
// import { PRODUCTS } from '../../utils/data';
import api from '../../utils/api';
import { useEffect } from 'react';
import toast from 'react-hot-toast';



const TIER_COLORS = { Gold:'bg-gold-pale text-gold border border-gold/30', Silver:'bg-gray-100 text-gray-600 border border-gray-200', Bronze:'bg-amber-50 text-amber-700 border border-amber-200' };
const getTier = (spent) => spent > 50000 ? 'Gold' : spent > 20000 ? 'Silver' : 'Bronze';

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
  loadCustomers();
}, []);

const loadCustomers = async () => {
  try {

    const res = await api.get('/admin/customers');

    setCustomers(res.data.customers || []);

  } catch (err) {

    console.error(err);

    toast.error('Failed to load customers');

  }
};
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.includes(search.toLowerCase()) ||
    (c.city || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalRevenue = 0;
const avgOrders = 0;
  const toggleStatus = (id) => {
    setCustomers(cs => cs.map(c => c._id === id ? { ...c, isActive: !c.isActive } : c));
    toast.success('Customer status updated');
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Customers</h1>
        <p className="font-body text-gray-500 text-sm mt-0.5">{customers.length} registered customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon:Users,      label:'Total Customers', value:customers.length,                           color:'from-primary to-gold-light' },
          { icon:Users,      label:'Active',          value:customers.filter(c=>c.isActive).length,     color:'from-emerald-500 to-teal-400' },
          { icon:ShoppingBag,label:'Avg. Orders',     value:avgOrders,                                  color:'from-rose to-pink-400' },
          { icon:TrendingUp, label:'Total Revenue',   value:`₹${(totalRevenue/100000).toFixed(1)}L`,    color:'from-gold to-amber-400' },
        ].map((s,i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm shrink-0`}><s.icon size={18} className="text-white"/></div>
            <div><p className="font-display text-xl font-bold text-gray-900">{s.value}</p><p className="font-body text-xs text-gray-400">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-sm"><Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-10 input-field text-sm py-2.5"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body min-w-[750px]">
            <thead className="bg-gray-50/80">
              <tr>{['Customer','Contact','City','Orders','Total Spent','Tier','Joined','Status',''].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c._id} className="hover:bg-champagne-light/80/20 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">{c.name?.charAt(0).toUpperCase()}</div>
                      <span className="font-semibold text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-0.5"><Mail size={11}/>{c.email}</div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs"><Phone size={11}/>{c.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">N/A</td>
                  <td className="px-4 py-3 font-bold text-gray-900 text-center">0</td>
                  <td className="px-4 py-3 font-bold text-primary">₹0</td>
                  <td className="px-4 py-3"><span className={`badge text-[10px] ${TIER_COLORS[getTier(c.spent)]}`}>Bronze</span></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                  <td className="px-4 py-3"><span className={`badge text-[10px] ${c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(c._id)} className="w-7 h-7 rounded-lg hover:bg-rose-soft flex items-center justify-center text-gray-400 hover:text-rose transition-all" title="Toggle status"><Ban size={13}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
