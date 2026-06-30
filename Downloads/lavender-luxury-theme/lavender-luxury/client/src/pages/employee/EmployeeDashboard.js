import React, { useState, useEffect } from 'react';
import EmployeeLayout from './EmployeeLayout';
import { Clock, CheckCircle2, AlertCircle, FileSpreadsheet, ArrowUpRight, ShieldAlert, Award, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Helper to get local YYYY-MM-DD date string
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null); // Today's record
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    pendingTasks: 0,
    completedTasks: 0,
    totalWorkingHours: 0
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Load attendance history to find today's punch state
      const attRes = await api.get('/employee/attendance/history');
      const todayStr = getLocalDateString();
      const todayRecord = attRes.data.history?.find(r => r.dateString === todayStr) || null;
      setAttendance(todayRecord);

      // Calculate monthly working hours from attendance records
      const totalHours = attRes.data.history?.reduce((sum, r) => sum + (r.workingHours || 0), 0) || 0;

      // 2. Load assigned tasks
      const tasksRes = await api.get('/employee/tasks/assigned');
      const allTasks = tasksRes.data.tasks || [];
      setTasks(allTasks);

      const pending = allTasks.filter(t => t.status !== 'Completed').length;
      const completed = allTasks.filter(t => t.status === 'Completed').length;

      // 3. Load inventory requests
      const requestsRes = await api.get('/employee/inventory-requests/employee/my');
      setRequests(requestsRes.data.requests || []);

      setStats({
        pendingTasks: pending,
        completedTasks: completed,
        totalWorkingHours: parseFloat(totalHours.toFixed(1))
      });
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handlePunchIn = async () => {
    try {
      const res = await api.post('/employee/attendance/punch-in');
      toast.success(res.data.message);
      loadDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Punch in failed');
    }
  };

  const handlePunchOut = async () => {
    try {
      const res = await api.post('/employee/attendance/punch-out');
      toast.success(res.data.message);
      loadDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Punch out failed');
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-600 shadow-card">
          Loading dashboard data...
        </div>
      </EmployeeLayout>
    );
  }

  // Determine punch button states
  const hasPunchedIn = !!attendance;
  const hasPunchedOut = !!(attendance && attendance.punchOut);

  return (
    <EmployeeLayout>
      {/* Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-dark-brand rounded-3xl p-6 sm:p-8 text-white mb-6 overflow-hidden shadow-premium border border-gold/15"
      >
        <div className="relative z-10 max-w-lg">
          <span className="badge bg-gold text-plum text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 mb-3">WORKSPACE Portal</span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="font-body text-white/70 text-sm">
            Here is your daily workflow checklist. Make sure to punch in to record your attendance, check your assigned inventory, and update your tasks.
          </p>
        </div>
        <div className="absolute right-6 bottom-0 top-0 hidden md:flex items-center justify-center pointer-events-none opacity-20">
          <Award size={180} className="text-gold-light" />
        </div>
      </motion.div>

      {/* Attendance and stats */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Punch Card */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-900 text-base flex items-center gap-2">
                <Clock className="text-primary" size={18} /> Today's Attendance
              </h3>
              <span className={`badge text-[10px] ${
                hasPunchedOut ? 'bg-gray-100 text-gray-500' :
                hasPunchedIn ? (attendance.status === 'Late' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700') :
                'bg-rose-soft text-rose'
              }`}>
                {hasPunchedOut ? 'Punched Out' : hasPunchedIn ? `Active (${attendance.status})` : 'Not Checked In'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 mb-5 text-center">
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Punch In</p>
                <p className="font-display text-lg font-bold text-gray-800 mt-1">{hasPunchedIn ? formatTime(attendance.punchIn) : '--:--'}</p>
              </div>
              <div className="border-l border-gray-200">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Punch Out</p>
                <p className="font-display text-lg font-bold text-gray-800 mt-1">{hasPunchedOut ? formatTime(attendance.punchOut) : '--:--'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handlePunchIn} 
              disabled={hasPunchedIn}
              className={`flex-1 btn-primary py-2.5 text-xs text-center justify-center font-bold tracking-wide rounded-xl ${hasPunchedIn ? 'opacity-40 cursor-not-allowed bg-gray-400 shadow-none' : ''}`}
            >
              Punch In
            </button>
            <button 
              onClick={handlePunchOut} 
              disabled={!hasPunchedIn || hasPunchedOut}
              className={`flex-1 btn-outline py-2.5 text-xs text-center justify-center font-bold tracking-wide rounded-xl ${(!hasPunchedIn || hasPunchedOut) ? 'opacity-40 cursor-not-allowed border-gray-300 text-gray-400 hover:bg-transparent hover:text-gray-400' : ''}`}
            >
              Punch Out
            </button>
          </div>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm"><AlertCircle size={20}/></div>
            <div>
              <p className="font-display text-3xl font-bold text-gray-900 mb-0.5">{stats.pendingTasks}</p>
              <p className="font-body text-xs text-gray-500">Pending Tasks</p>
            </div>
            <Link to="/employee/tasks" className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1">View list <ArrowUpRight size={12}/></Link>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm"><CheckCircle2 size={20}/></div>
            <div>
              <p className="font-display text-3xl font-bold text-gray-900 mb-0.5">{stats.completedTasks}</p>
              <p className="font-body text-xs text-gray-500">Completed Tasks</p>
            </div>
            <Link to="/employee/tasks" className="text-[11px] font-bold text-emerald-600 hover:underline inline-flex items-center gap-1">Track progress <ArrowUpRight size={12}/></Link>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm"><Clock size={20}/></div>
            <div>
              <p className="font-display text-3xl font-bold text-gray-900 mb-0.5">{stats.totalWorkingHours}h</p>
              <p className="font-body text-xs text-gray-500">Total Working Hours</p>
            </div>
            <Link to="/employee/attendance" className="text-[11px] font-bold text-amber-600 hover:underline inline-flex items-center gap-1">Attendance history <ArrowUpRight size={12}/></Link>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-sm"><FileSpreadsheet size={20}/></div>
            <div>
              <p className="font-display text-3xl font-bold text-gray-900 mb-0.5">{requests.length}</p>
              <p className="font-body text-xs text-gray-500">Inventory Requests</p>
            </div>
            <Link to="/employee/stock-requests" className="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1">Update inventory <ArrowUpRight size={12}/></Link>
          </div>
        </div>
      </div>

      {/* Tasks and Inventory Updates splits */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <h3 className="font-display font-bold text-gray-900 text-base">Assigned Tasks</h3>
            <span className="badge-primary">Today</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
            {tasks.filter(t => t.status !== 'Completed').slice(0, 4).length > 0 ? (
              tasks.filter(t => t.status !== 'Completed').slice(0, 4).map(t => (
                <div key={t._id} className="flex items-start justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div className="min-w-0 flex-1">
                    <p className="font-body font-bold text-gray-800 text-sm truncate">{t.title}</p>
                    <p className="font-body text-xs text-gray-400 truncate mt-0.5">{t.description || 'No description'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        t.priority === 'High' ? 'bg-rose/10 text-rose' :
                        t.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t.priority}
                      </span>
                      {t.type === 'Inventory' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-blue-100 text-blue-700">
                          Inventory
                        </span>
                      )}
                    </div>
                  </div>
                  {t.type === 'Inventory' && t.product ? (
                    <Link to={`/employee/stock-requests?productId=${t.product._id}`} className="btn-ghost py-1.5 px-3 text-[11px] font-bold shrink-0">
                      Update Stock
                    </Link>
                  ) : (
                    <Link to="/employee/tasks" className="btn-ghost py-1.5 px-3 text-[11px] font-bold shrink-0">
                      Manage
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2 opacity-50"/>
                All caught up! No pending tasks today.
              </div>
            )}
          </div>
        </div>

        {/* Recent Inventory Update Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <h3 className="font-display font-bold text-gray-900 text-base">Inventory Requests</h3>
            <Link to="/employee/stock-requests" className="text-[11px] font-bold text-primary hover:underline">New Request</Link>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
            {requests.slice(0, 4).length > 0 ? (
              requests.slice(0, 4).map(r => (
                <div key={r._id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="min-w-0">
                    <p className="font-body font-bold text-gray-800 text-sm truncate">{r.product?.name}</p>
                    <p className="font-body text-xs text-gray-500 mt-0.5">
                      Size: <span className="font-semibold">{r.variant?.size}</span>
                      {r.variant?.color?.name && <> · Color: <span className="font-semibold">{r.variant.color.name}</span></>}
                    </p>
                    <p className="font-body text-[11px] text-gray-400 mt-1">
                      Stock: {r.previousStock} → <span className="text-primary font-bold">{r.updatedStock}</span>
                    </p>
                  </div>
                  <span className={`badge text-[10px] ${
                    r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    r.status === 'rejected' ? 'bg-rose-soft text-rose' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                <FileSpreadsheet size={36} className="mx-auto text-gray-300 mb-2 opacity-50"/>
                No inventory update requests submitted yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
