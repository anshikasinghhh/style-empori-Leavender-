import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Users, UserPlus, Trash2, Award, BookOpen, Clock, Activity, Search, X, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const perfRes = await api.get('/employee/admin/performance');
      setPerformance(perfRes.data.performance || []);
    } catch (err) {
      toast.error('Failed to load employee directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in name, email, and password.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/employee/admin/employees', { name, email, password, phone });
      toast.success('Employee account created successfully!');
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id, empName) => {
    if (!window.confirm(`Are you sure you want to delete ${empName}? This will permanently wipe their attendance, task lists, and inventory requests.`)) {
      return;
    }

    try {
      await api.delete(`/employee/admin/employees/${id}`);
      toast.success('Employee account deleted');
      loadData();
    } catch (err) {
      toast.error('Delete operation failed');
    }
  };

  const handleToggleCouponAccess = async (id, empName) => {
    try {
      const res = await api.put(`/employee/admin/employees/${id}/coupon-access`);
      toast.success(res.data.message);
      loadData();
    } catch (err) {
      toast.error('Failed to update coupon access');
    }
  };

  const filtered = performance.filter(p => 
    p.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.employee?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Top performance summary stats
  const avgAttendance = performance.length 
    ? Math.round(performance.reduce((sum, p) => sum + p.attendancePercentage, 0) / performance.length) 
    : 0;
  const avgProductivity = performance.length 
    ? Math.round(performance.reduce((sum, p) => sum + p.productivityScore, 0) / performance.length) 
    : 0;

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Employee Directory</h1>
          <p className="font-body text-gray-500 text-sm mt-0.5">Manage staff credentials and review individual productivity reports</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-2.5 px-5 text-sm gap-2"
        >
          <UserPlus size={16} /> Add Employee
        </button>
      </div>

      {/* Summary KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0"><Users size={18}/></div>
          <div><p className="font-display text-xl font-bold text-gray-900">{performance.length}</p><p className="font-body text-xs text-gray-400">Total Staff</p></div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm shrink-0"><Activity size={18}/></div>
          <div><p className="font-display text-xl font-bold text-gray-900">{avgAttendance}%</p><p className="font-body text-xs text-gray-400">Avg Attendance</p></div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm shrink-0"><Clock size={18}/></div>
          <div><p className="font-display text-xl font-bold text-gray-900">{performance.reduce((sum, p) => sum + p.totalWorkingHours, 0).toFixed(1)}h</p><p className="font-body text-xs text-gray-400">Combined Hours</p></div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 shadow-sm shrink-0"><Award size={18}/></div>
          <div><p className="font-display text-xl font-bold text-gray-900">{avgProductivity}%</p><p className="font-body text-xs text-gray-400">Avg Productivity</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..." 
              className="w-full pl-10 input-field text-sm py-2"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading staff records...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body min-w-[900px]">
              <thead className="bg-gray-50/80">
                <tr className="border-b border-gray-100">
                  {['Employee Info', 'Attendance %', 'Working Hours', 'Task Completed', 'Updates Sent', 'Productivity', 'Coupon Access', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(({ employee, attendancePercentage, totalWorkingHours, assignedTasks, completedTasks, inventoryUpdatesSubmitted, productivityScore }) => (
                  <tr key={employee._id} className="hover:bg-champagne-light/80/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{employee.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{employee.email}</p>
                        {employee.phone && <p className="text-[10px] text-gray-400">{employee.phone}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{attendancePercentage}%</td>
                    <td className="px-4 py-3 text-gray-600 font-bold">{totalWorkingHours} hrs</td>
                    <td className="px-4 py-3 text-gray-600">
                      {completedTasks} / <span className="text-xs text-gray-400">{assignedTasks}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{inventoryUpdatesSubmitted} requests</td>
                    <td className="px-4 py-3 w-40">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              productivityScore >= 80 ? 'bg-emerald-500' :
                              productivityScore >= 50 ? 'bg-amber-400' : 'bg-rose'
                            }`}
                            style={{ width: `${productivityScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs text-gray-800">{productivityScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleCouponAccess(employee._id, employee.name)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          employee.canManageCoupons 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                        title={employee.canManageCoupons ? 'Revoke coupon access' : 'Grant coupon access'}
                      >
                        {employee.canManageCoupons ? <ToggleRight size={16} className="text-emerald-500"/> : <ToggleLeft size={16}/>}
                        {employee.canManageCoupons ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleDeleteEmployee(employee._id, employee.name)}
                        className="p-2 text-rose hover:bg-rose-soft rounded-lg transition-colors"
                        title="Delete Employee Account"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-30 text-primary" />
            <p className="font-semibold text-gray-600 mb-1">No employees found</p>
            <p className="text-xs text-gray-400">Click "Add Employee" above to register your first team member.</p>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-premium p-6 border border-gold/15"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-gray-900 text-lg">Create Employee Account</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18}/></button>
            </div>
            
            <form onSubmit={handleAddEmployee} className="space-y-4 font-body">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="input-field py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@vastra.com"
                  className="input-field py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Temporary Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="input-field py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="input-field py-2 text-sm"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-50 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2 px-5 text-sm"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
