import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { motion } from 'framer-motion';
import { ShoppingCart, Users, Package, IndianRupee, AlertTriangle, Eye, Calendar, ClipboardList, Clock, Archive } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/api';

const STATUS_STYLES = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-primary-100 text-primary',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-soft text-rose',
  out_for_delivery: 'bg-sky-100 text-sky-700',
  returned: 'bg-rose-100 text-rose-700'
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pieColors = ['#4A1068', '#7C3AED', '#EC4899', '#0EA5E9', '#14B8A6', '#A855F7', '#F59E0B', '#F97316'];

const DashboardTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-hover p-3 text-sm font-body">
      <p className="font-bold text-gray-900 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === 'revenue' ? `₹${Number(p.value).toLocaleString('en-IN')}` : p.value}
        </p>
      ))}
    </div>
  );
};

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const formatMonthLabel = ({ month, year }) => `${monthNames[month - 1] || 'Jan'} ${year}`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ecommerce');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // E-Commerce Data
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    lowStockProducts: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Operations Data
  const [opsLoading, setOpsLoading] = useState(false);
  const [opsStats, setOpsStats] = useState({
    totalEmployees: 0,
    employeesPresentToday: 0,
    employeesAbsent: 0,
    tasksPending: 0,
    tasksCompletedToday: 0,
    inventoryRequestsPending: 0,
    inventoryRequestsApproved: 0
  });
  const [opsAttendanceGraph, setOpsAttendanceGraph] = useState([]);
  const [opsMonthlyHours, setOpsMonthlyHours] = useState([]);
  const [opsTaskGraph, setOpsTaskGraph] = useState([]);
  const [opsInventoryGraph, setOpsInventoryGraph] = useState([]);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/dashboard');
      const {
        stats: apiStats = {},
        monthlyData: apiMonthly = [],
        categorySales: apiCategorySales = [],
        recentOrders: apiRecent = []
      } = response.data;

      setStats({
        totalOrders: apiStats.totalOrders || 0,
        pendingOrders: apiStats.pendingOrders || 0,
        totalCustomers: apiStats.totalCustomers || 0,
        totalProducts: apiStats.totalProducts || 0,
        totalRevenue: apiStats.totalRevenue || 0,
        lowStockProducts: apiStats.lowStockProducts || 0
      });

      setMonthlyData(
        apiMonthly.map((item) => ({
          month: formatMonthLabel(item._id),
          revenue: item.revenue || 0,
          orders: item.orders || 0
        }))
      );
      setCategorySales(apiCategorySales);
      setRecentOrders(apiRecent || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchOperationsData = async () => {
    setOpsLoading(true);
    try {
      const res = await api.get('/employee/admin/analytics');
      setOpsStats(res.data.stats || {});
      setOpsAttendanceGraph(res.data.attendanceGraph || []);
      setOpsMonthlyHours(res.data.monthlyWorkingHours || []);
      setOpsTaskGraph(res.data.taskGraph || []);
      setOpsInventoryGraph(res.data.inventoryGraph || []);
    } catch (err) {
      toast.error('Failed to load operational analytics');
    } finally {
      setOpsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'operations') {
      fetchOperationsData();
    }
  }, [activeTab]);

  const kpis = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      sub: 'From all placed orders',
      icon: IndianRupee,
      from: 'from-indigo-600',
      to: 'to-violet-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      sub: 'All orders placed',
      icon: ShoppingCart,
      from: 'from-sky-600',
      to: 'to-cyan-500'
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      sub: 'Registered buyers',
      icon: Users,
      from: 'from-emerald-600',
      to: 'to-teal-500'
    },
    {
      title: 'Low Stock',
      value: stats.lowStockProducts,
      sub: 'Products below threshold',
      icon: Package,
      from: 'from-amber-500',
      to: 'to-orange-500'
    }
  ];

  const totalCategoryRevenue = categorySales.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
  const pieData = categorySales.length && totalCategoryRevenue > 0
    ? categorySales.map((item, index) => ({
        name: item.category || 'Uncategorized',
        value: Number(item.revenue) || 0,
        revenue: Number(item.revenue) || 0,
        percent: totalCategoryRevenue > 0 ? Number(((Number(item.revenue) || 0) / totalCategoryRevenue) * 100).toFixed(1) : 0,
        color: pieColors[index % pieColors.length]
      }))
    : [{ name: 'No data', value: 1, revenue: 0, percent: 100, color: '#E5E7EB' }];

  if (loading) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-600 shadow-card">
          Loading dashboard data...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="font-body text-gray-500 text-sm mt-0.5">Welcome back! Review operations and sales overview.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 font-body">
        <button 
          onClick={() => setActiveTab('ecommerce')} 
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${activeTab === 'ecommerce' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          E-Commerce Sales
        </button>
        <button 
          onClick={() => setActiveTab('operations')} 
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${activeTab === 'operations' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Staff & Operations
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-5">
          {error}
        </div>
      ) : null}

      {activeTab === 'ecommerce' ? (
        /* Existing Ecommerce View */
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {kpis.map((k, i) => (
              <motion.div
                key={k.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 hover:shadow-hover transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.from} ${k.to} flex items-center justify-center shadow-sm`}>
                    <k.icon size={18} className="text-white" />
                  </div>
                </div>
                <p className="font-body text-2xl font-bold text-gray-900 mb-0.5">{k.value}</p>
                <p className="font-body text-xs text-gray-400">{k.title}</p>
                <p className="font-body text-[11px] text-gray-300 mt-0.5">{k.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-5">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-50">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-display font-bold text-gray-900">Revenue Overview</h3>
                  <p className="font-body text-xs text-gray-400 mt-0.5">Monthly paid revenue</p>
                </div>
                <span className="badge-primary">This Year</span>
              </div>
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A1068" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4A1068" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DashboardTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#4A1068" strokeWidth={2.5} fill="url(#rev)" dot={false} activeDot={{ r: 5, fill: '#4A1068', stroke: 'white', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
              <h3 className="font-display font-bold text-gray-900 mb-0.5">Sales by Category</h3>
              <p className="font-body text-xs text-gray-400 mb-4">Revenue share by category</p>
              <ResponsiveContainer width="100%" height={165}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DashboardTooltip />} formatter={(value, name, entry) => [`${entry?.payload?.percent ?? 0}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-1">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs font-body">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
                      <span className="text-gray-600">{entry.name}</span>
                    </div>
                    <span className="font-bold text-gray-700">{entry.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-5">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
              <h3 className="font-display font-bold text-gray-900 mb-0.5">Monthly Orders</h3>
              <p className="font-body text-xs text-gray-400 mb-4">Order count per month</p>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={monthlyData} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#4A1068" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-50">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-display font-bold text-gray-900">Recent Orders</h3>
                  <p className="font-body text-xs text-gray-400 mt-0.5">Latest 6 orders</p>
                </div>
                <Link to="/admin/orders" className="btn-ghost text-xs py-1.5 px-3 gap-1">
                  <Eye size={12} /> View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-50">
                      {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
                        <th key={h} className="text-left pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wide pr-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/80">
                    {recentOrders.slice(0, 6).map((order) => (
                      <tr key={order._id} className="hover:bg-champagne-light/80/30 transition-colors group">
                        <td className="py-3 pr-3 text-primary font-bold text-xs">#{order.orderNumber || order._id.slice(-6)}</td>
                        <td className="py-3 pr-3 font-semibold text-gray-900 text-sm">{order.user?.name || 'Guest'}</td>
                        <td className="py-3 pr-3 text-gray-500 text-xs max-w-[130px] truncate">{order.items?.[0]?.name || 'N/A'}</td>
                        <td className="py-3 pr-3 font-bold text-gray-900 text-sm">{formatCurrency(order.total)}</td>
                        <td className="py-3 pr-3">
                          <span className={`badge text-[10px] ${STATUS_STYLES[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400 text-xs">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="font-body font-bold text-amber-800 text-sm">Low Stock Alert — Action Required</p>
              <p className="font-body text-amber-700 text-xs mt-0.5">
                {stats.lowStockProducts ? `${stats.lowStockProducts} products running critically low` : 'Stock levels are healthy across your catalog.'}
              </p>
            </div>
          </div>
        </>
      ) : (
        /* Operational View */
        <>
          {opsLoading ? (
            <div className="text-center py-12 text-gray-500">Loading operations analytics...</div>
          ) : (
            <>
              {/* Ops KPIs */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shadow-sm"><Users size={18}/></div>
                  </div>
                  <p className="font-display text-2xl font-bold text-gray-900 mb-0.5">{opsStats.totalEmployees || 0}</p>
                  <p className="font-body text-xs text-gray-400">Total Employees</p>
                  <p className="font-body text-[11px] text-gray-300 mt-0.5">Active profiles</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm"><Calendar size={18}/></div>
                  </div>
                  <p className="font-display text-2xl font-bold text-gray-900 mb-0.5">{opsStats.employeesPresentToday || 0}</p>
                  <p className="font-body text-xs text-gray-400">Staff Present Today</p>
                  <p className="font-body text-[11px] text-gray-300 mt-0.5">{opsStats.employeesAbsent || 0} absent logged</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-sm"><ClipboardList size={18}/></div>
                  </div>
                  <p className="font-display text-2xl font-bold text-gray-900 mb-0.5">{opsStats.tasksPending || 0}</p>
                  <p className="font-body text-xs text-gray-400">Pending Tasks</p>
                  <p className="font-body text-[11px] text-gray-300 mt-0.5">{opsStats.tasksCompletedToday || 0} completed today</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shadow-sm"><Archive size={18}/></div>
                  </div>
                  <p className="font-display text-2xl font-bold text-gray-900 mb-0.5">{opsStats.inventoryRequestsPending || 0}</p>
                  <p className="font-body text-xs text-gray-400">Staged Stock Requests</p>
                  <p className="font-body text-[11px] text-gray-300 mt-0.5">{opsStats.inventoryRequestsApproved || 0} approved total</p>
                </div>
              </div>

              {/* Ops Charts splits */}
              <div className="grid lg:grid-cols-3 gap-5 mb-5">
                {/* Attendance Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-50">
                  <h3 className="font-display font-bold text-gray-900">Attendance Log Rate</h3>
                  <p className="font-body text-xs text-gray-400 mt-0.5 mb-4">Daily checked-in head counts (last 15 days)</p>
                  <ResponsiveContainer width="100%" height={230}>
                    <AreaChart data={opsAttendanceGraph}>
                      <defs>
                        <linearGradient id="attPresent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="present" name="Present" stroke="#10B981" strokeWidth={2} fill="url(#attPresent)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Task completions Pie */}
                <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
                  <h3 className="font-display font-bold text-gray-900 mb-0.5">Tasks Breakdown</h3>
                  <p className="font-body text-xs text-gray-400 mb-4">Operations duties status ratio</p>
                  <ResponsiveContainer width="100%" height={165}>
                    <PieChart>
                      <Pie data={opsTaskGraph} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {opsTaskGraph.map((entry, index) => (
                          <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-1">
                    {opsTaskGraph.map((entry, index) => (
                      <div key={entry.name} className="flex items-center justify-between text-xs font-body">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: pieColors[index % pieColors.length] }} />
                          <span className="text-gray-600">{entry.name}</span>
                        </div>
                        <span className="font-bold text-gray-700">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-5">
                {/* Working hours monthly */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-50">
                  <h3 className="font-display font-bold text-gray-900 mb-0.5">Cumulative Hours logged</h3>
                  <p className="font-body text-xs text-gray-400 mb-4">Combined monthly staff working hours</p>
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={opsMonthlyHours} barSize={16}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="hours" name="Working Hours" fill="#4A1068" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Inventory update requests status Pie */}
                <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-gray-900 mb-0.5">Inventory Requests Ratio</h3>
                    <p className="font-body text-xs text-gray-400 mb-4">Audit adjustment status log</p>
                    <ResponsiveContainer width="100%" height={165}>
                      <PieChart>
                        <Pie data={opsInventoryGraph} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                          {opsInventoryGraph.map((entry, index) => (
                            <Cell key={entry.name} fill={pieColors[(index + 3) % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5 mt-3">
                    {opsInventoryGraph.map((entry, index) => (
                      <div key={entry.name} className="flex items-center justify-between text-xs font-body">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: pieColors[(index + 3) % pieColors.length] }} />
                          <span className="text-gray-600">{entry.name}</span>
                        </div>
                        <span className="font-bold text-gray-700">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </AdminLayout>
  );
}
