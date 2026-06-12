import React from 'react';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import { ShoppingCart, Users, Package, IndianRupee, AlertTriangle, ArrowUpRight, ArrowDownRight, TrendingUp, Eye } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const MONTHLY = [
  {month:'Jan',revenue:145000,orders:48,customers:120},{month:'Feb',revenue:178000,orders:62,customers:145},
  {month:'Mar',revenue:195000,orders:71,customers:167},{month:'Apr',revenue:221000,orders:85,customers:198},
  {month:'May',revenue:189000,orders:69,customers:178},{month:'Jun',revenue:234000,orders:93,customers:215},
  {month:'Jul',revenue:267000,orders:108,customers:243},{month:'Aug',revenue:312000,orders:124,customers:289},
  {month:'Sep',revenue:289000,orders:115,customers:261},{month:'Oct',revenue:345000,orders:138,customers:318},
  {month:'Nov',revenue:398000,orders:159,customers:356},{month:'Dec',revenue:456000,orders:184,customers:412},
];
const CAT_DATA = [
  {name:'Sarees',value:32,color:'#4A1068'},{name:'Lehengas',value:26,color:'#C9963C'},
  {name:'Kurtis',value:18,color:'#C9963C'},{name:'Jewelry',value:14,color:'#B45309'},
  {name:'Kids',value:6,color:'#059669'},{name:'Others',value:4,color:'#9CA3AF'},
];
const RECENT = [
  {id:'VE174521',customer:'Priya Sharma',product:'Kanjivaram Silk Saree',amount:9499,status:'delivered',date:'15 Mar'},
  {id:'VE174522',customer:'Anjali Mehta',product:'Bridal Lehenga',amount:28999,status:'shipped',date:'14 Mar'},
  {id:'VE174523',customer:'Kavya Nair',product:'Kundan Jewelry Set',amount:4599,status:'processing',date:'13 Mar'},
  {id:'VE174524',customer:'Ritu Agarwal',product:'Navratri Chaniya Choli',amount:6499,status:'placed',date:'12 Mar'},
  {id:'VE174525',customer:'Sneha Iyer',product:'Chikankari Kurti Set',amount:2899,status:'confirmed',date:'11 Mar'},
  {id:'VE174526',customer:'Meera Kapoor',product:'Kids Festive Lehenga',amount:1699,status:'delivered',date:'10 Mar'},
];
const STATUS_STYLES = {placed:'bg-blue-100 text-blue-700',confirmed:'bg-indigo-100 text-indigo-700',processing:'bg-amber-100 text-amber-700',shipped:'bg-primary-100 text-primary',delivered:'bg-emerald-100 text-emerald-700',cancelled:'bg-rose-soft text-rose'};
const KPI = [
  {title:'Total Revenue',  value:'₹34,56,800', sub:'vs last month',  change:'+18.2%', up:true,  icon:IndianRupee,  from:'from-primary',    to:'to-gold-light'},
  {title:'Total Orders',   value:'1,256',       sub:'this month: 184', change:'+12.5%', up:true,  icon:ShoppingCart, from:'from-rose',       to:'to-pink-400'},
  {title:'Active Customers',value:'3,842',      sub:'new this month',  change:'+8.3%',  up:true,  icon:Users,        from:'from-blue-500',   to:'to-indigo-400'},
  {title:'Products Listed', value:'284',         sub:'active products', change:'-2 items',up:false,icon:Package,      from:'from-amber-500',  to:'to-orange-400'},
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-hover p-3 text-sm font-body">
      <p className="font-bold text-gray-900 mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>₹{Number(p.value).toLocaleString('en-IN')}</p>)}
    </div>
  );
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="font-body text-gray-500 text-sm mt-0.5">Welcome back! Here's your store overview for today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {KPI.map((k, i) => (
          <motion.div key={k.title} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 hover:shadow-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.from} ${k.to} flex items-center justify-center shadow-sm`}>
                <k.icon size={18} className="text-white"/>
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-body font-bold ${k.up ? 'text-emerald-600':'text-rose'}`}>
                {k.up ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}{k.change}
              </span>
            </div>
            <p className="font-display text-2xl font-bold text-gray-900 mb-0.5">{k.value}</p>
            <p className="font-body text-xs text-gray-400">{k.title}</p>
            <p className="font-body text-[11px] text-gray-300 mt-0.5">{k.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <div className="flex items-center justify-between mb-5">
            <div><h3 className="font-display font-bold text-gray-900">Revenue Overview</h3><p className="font-body text-xs text-gray-400 mt-0.5">Monthly revenue — FY 2025</p></div>
            <span className="badge-primary">This Year</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A1068" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#4A1068" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize:11, fontFamily:'DM Sans' }} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize:11, fontFamily:'DM Sans' }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="revenue" stroke="#4A1068" strokeWidth={2.5} fill="url(#rev)" dot={false} activeDot={{ r:5, fill:'#4A1068', stroke:'white', strokeWidth:2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h3 className="font-display font-bold text-gray-900 mb-0.5">Sales by Category</h3>
          <p className="font-body text-xs text-gray-400 mb-4">Current month breakdown</p>
          <ResponsiveContainer width="100%" height={165}>
            <PieChart>
              <Pie data={CAT_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {CAT_DATA.map((e, i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, '']}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {CAT_DATA.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs font-body">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background:c.color }}/><span className="text-gray-600">{c.name}</span></div>
                <span className="font-bold text-gray-700">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h3 className="font-display font-bold text-gray-900 mb-0.5">Monthly Orders</h3>
          <p className="font-body text-xs text-gray-400 mb-4">Order volume per month</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={MONTHLY} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize:10, fontFamily:'DM Sans' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10, fontFamily:'DM Sans' }} axisLine={false} tickLine={false}/>
              <Tooltip/>
              <Bar dataKey="orders" fill="#4A1068" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <div className="flex items-center justify-between mb-5">
            <div><h3 className="font-display font-bold text-gray-900">Recent Orders</h3><p className="font-body text-xs text-gray-400 mt-0.5">Latest 6 orders</p></div>
            <button className="btn-ghost text-xs py-1.5 px-3 gap-1"><Eye size={12}/> View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Order ID','Customer','Product','Amount','Status','Date'].map(h => <th key={h} className="text-left pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wide pr-3">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80">
                {RECENT.map(o => (
                  <tr key={o.id} className="hover:bg-champagne-light/80/30 transition-colors group">
                    <td className="py-3 pr-3 text-primary font-bold text-xs">#{o.id}</td>
                    <td className="py-3 pr-3 font-semibold text-gray-900 text-sm">{o.customer}</td>
                    <td className="py-3 pr-3 text-gray-500 text-xs max-w-[130px] truncate">{o.product}</td>
                    <td className="py-3 pr-3 font-bold text-gray-900 text-sm">₹{o.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-3"><span className={`badge text-[10px] ${STATUS_STYLES[o.status]||'bg-gray-100 text-gray-600'}`}>{o.status}</span></td>
                    <td className="py-3 text-gray-400 text-xs">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Low stock alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"><AlertTriangle size={16} className="text-amber-600"/></div>
        <div>
          <p className="font-body font-bold text-amber-800 text-sm">Low Stock Alert — Action Required</p>
          <p className="font-body text-amber-700 text-xs mt-0.5">3 products running critically low: <span className="font-semibold">Bridal Lehenga XS (2 left)</span> · <span className="font-semibold">Brocade Saree (9 left)</span> · <span className="font-semibold">Pashmina Shawl (14 left)</span></p>
        </div>
        <button className="btn-ghost text-xs py-1.5 px-3 shrink-0 text-amber-700 bg-amber-100 hover:bg-amber-200">Manage</button>
      </div>
    </AdminLayout>
  );
}
