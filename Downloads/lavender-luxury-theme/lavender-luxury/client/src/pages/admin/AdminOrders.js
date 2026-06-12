import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Eye, Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { PRODUCTS, formatPrice } from '../../utils/data';
import toast from 'react-hot-toast';

const ORDERS = [
  {id:'VE174521',customer:'Priya Sharma',email:'priya@email.com',product:'Royal Kanjivaram Silk Saree',image:PRODUCTS[0].images[0].url,amount:9499,status:'delivered',payment:'razorpay',date:'2025-03-15',items:1},
  {id:'VE174522',customer:'Anjali Mehta',email:'anjali@email.com',product:'Bridal Lehenga — Rani Pink',image:PRODUCTS[1].images[0].url,amount:28999,status:'shipped',payment:'razorpay',date:'2025-03-14',items:1},
  {id:'VE174523',customer:'Kavya Nair',email:'kavya@email.com',product:'Polki Kundan Bridal Set',image:PRODUCTS[3].images[0].url,amount:4599,status:'processing',payment:'cod',date:'2025-03-13',items:2},
  {id:'VE174524',customer:'Ritu Agarwal',email:'ritu@email.com',product:'Navratri Chaniya Choli',image:PRODUCTS[4].images[0].url,amount:6499,status:'placed',payment:'stripe',date:'2025-03-12',items:1},
  {id:'VE174525',customer:'Sneha Iyer',email:'sneha@email.com',product:'Lucknowi Chikankari Kurti',image:PRODUCTS[2].images[0].url,amount:2899,status:'confirmed',payment:'razorpay',date:'2025-03-11',items:3},
  {id:'VE174526',customer:'Meera Kapoor',email:'meera@email.com',product:'Kids Festive Lehenga',image:PRODUCTS[7].images[0].url,amount:1699,status:'delivered',payment:'cod',date:'2025-03-10',items:1},
  {id:'VE174527',customer:'Divya Bose',email:'divya@email.com',product:'Oxidised Silver Jhumka',image:PRODUCTS[9].images[0].url,amount:899,status:'cancelled',payment:'razorpay',date:'2025-03-09',items:1},
];
const ALL_STATUSES = ['placed','confirmed','processing','shipped','out_for_delivery','delivered','cancelled'];
const STATUS_STYLES = {placed:'bg-blue-100 text-blue-700',confirmed:'bg-indigo-100 text-indigo-700',processing:'bg-amber-100 text-amber-700',shipped:'bg-primary-100 text-primary',out_for_delivery:'bg-orange-100 text-orange-700',delivered:'bg-emerald-100 text-emerald-700',cancelled:'bg-rose-soft text-rose'};

export default function AdminOrders() {
  const [orders, setOrders] = useState(ORDERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = orders.filter(o =>
    (filterStatus === 'all' || o.status === filterStatus) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search) || o.product.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id, status) => {
    setOrders(os => os.map(o => o.id === id ? {...o, status} : o));
    toast.success(`Order status updated to "${status}"`);
  };

  const stats = [
    {label:'Total', value:orders.length, icon:Package, color:'text-primary bg-champagne-light/80'},
    {label:'Pending', value:orders.filter(o=>o.status==='placed').length, icon:Clock, color:'text-amber-600 bg-amber-50'},
    {label:'Shipped', value:orders.filter(o=>o.status==='shipped'||o.status==='out_for_delivery').length, icon:TrendingUp, color:'text-blue-600 bg-blue-50'},
    {label:'Delivered', value:orders.filter(o=>o.status==='delivered').length, icon:CheckCircle, color:'text-emerald-600 bg-emerald-50'},
  ];

  return (
    <AdminLayout>
      <div className="mb-6"><h1 className="font-display text-2xl font-bold text-gray-900">Orders</h1><p className="font-body text-gray-500 text-sm mt-0.5">Manage and track all customer orders</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-card border border-gray-50 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={17}/></div>
            <div><p className="font-display text-xl font-bold text-gray-900">{s.value}</p><p className="font-body text-xs text-gray-400">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {['all',...ALL_STATUSES].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold whitespace-nowrap transition-all capitalize ${filterStatus===s ? 'bg-primary text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-champagne-light/80 border border-gray-100'}`}>
            {s === 'all' ? `All (${orders.length})` : `${s.replace('_',' ')} (${orders.filter(o=>o.status===s).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-sm"><Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 input-field text-sm py-2.5"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body min-w-[750px]">
            <thead className="bg-gray-50/80"><tr>{['Order','Customer','Product','Amount','Payment','Status','Date'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-champagne-light/80/20 transition-colors group">
                  <td className="px-4 py-3 font-bold text-primary text-xs">#{order.id}</td>
                  <td className="px-4 py-3"><p className="font-semibold text-gray-900 text-sm">{order.customer}</p><p className="text-xs text-gray-400">{order.email}</p></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={order.image} alt="" className="w-8 h-10 object-cover rounded-lg shrink-0"/>
                      <span className="text-gray-600 text-xs line-clamp-2 max-w-[120px]">{order.product}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{order.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><span className="badge bg-gray-100 text-gray-600 text-[10px] capitalize">{order.payment}</span></td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ${STATUS_STYLES[order.status]}`}>
                      {ALL_STATUSES.map(s => <option key={s} value={s} className="text-gray-900 bg-white">{s.replace('_',' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
