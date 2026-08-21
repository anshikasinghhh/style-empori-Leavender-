import React, { useState, useEffect } from 'react';
import EmployeeLayout from './EmployeeLayout';
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function EmployeeAttendance() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employee/attendance/history');
      setHistory(res.data.history || []);
    } catch (err) {
      toast.error('Failed to load attendance history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <EmployeeLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Attendance Log</h1>
          <p className="font-body text-gray-500 text-sm mt-0.5">Your daily work hours and check-in history</p>
        </div>
        <button onClick={loadAttendance} className="btn-ghost p-2 rounded-xl text-gray-600 hover:text-primary">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading records...</div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body min-w-[650px]">
              <thead className="bg-gray-50/80">
                <tr className="border-b border-gray-100">
                  {['Date', 'Punch In', 'Punch Out', 'Working Hours', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((record) => (
                  <tr key={record._id} className="hover:bg-champagne-light/80/20 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-800 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(record.punchIn)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">
                      {formatDateTime(record.punchIn)}
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">
                      {formatDateTime(record.punchOut)}
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900 text-sm">
                      {record.punchOut ? (
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-gray-400" />
                          {record.workingHours} hrs
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Active Shift</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge text-[10px] ${
                        record.status === 'Late' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        record.status === 'Present' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        'bg-rose-soft text-rose border border-rose/10'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Calendar size={48} className="mx-auto mb-3 opacity-30 text-primary" />
            <p className="font-semibold text-gray-600 mb-1">No attendance logs found</p>
            <p className="text-xs text-gray-400">Your daily checked hours will appear here once you punch in.</p>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
