import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Calendar, FileSpreadsheet, Search, RefreshCw, User, Clock } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsRes, empRes] = await Promise.all([
        api.get(`/employee/attendance/admin/all?employee=${filterEmployee}&date=${filterDate}`),
        api.get('/employee/admin/employees')
      ]);
      setRecords(recordsRes.data.records || []);
      setEmployees(empRes.data.employees || []);
    } catch (err) {
      toast.error('Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterEmployee, filterDate]);

  const handleExportCSV = () => {
    if (records.length === 0) {
      toast.error('No records to export');
      return;
    }

    // Format headers and rows
    const headers = ['Employee Name', 'Email', 'Date', 'Punch In Time', 'Punch Out Time', 'Working Hours', 'Status'];
    const rows = records.map(r => [
      r.employee?.name || 'Guest',
      r.employee?.email || 'N/A',
      r.dateString,
      r.punchIn ? new Date(r.punchIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
      r.punchOut ? new Date(r.punchOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
      r.workingHours || 0,
      r.status
    ]);

    // Build CSV content
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${filterDate || 'All'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendance CSV downloaded successfully!');
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Attendance Register</h1>
          <p className="font-body text-gray-500 text-sm mt-0.5">Track daily shift logs, total hours, and export staff clock entries</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="btn-gold py-2.5 px-5 text-sm gap-2"
        >
          <FileSpreadsheet size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-50 flex flex-wrap items-center gap-3 bg-gray-50/40">
          <div className="flex flex-wrap gap-3 items-center w-full">
            <div className="flex items-center gap-1.5 min-w-[200px]">
              <User size={14} className="text-gray-400" />
              <select 
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                className="input-field py-2 text-xs"
              >
                <option value="">Filter by Employee</option>
                {employees.map(e => (
                  <option key={e._id} value={e._id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 min-w-[200px]">
              <Calendar size={14} className="text-gray-400" />
              <input 
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input-field py-1.5 text-xs"
              />
            </div>

            {(filterEmployee || filterDate) && (
              <button 
                onClick={() => { setFilterEmployee(''); setFilterDate(''); }}
                className="text-xs text-rose font-semibold hover:underline"
              >
                Reset Filters
              </button>
            )}

            <button onClick={loadData} className="p-2 ml-auto text-gray-600 hover:text-primary rounded-lg transition-colors">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Retrieving attendance logs...</div>
        ) : records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body min-w-[800px]">
              <thead className="bg-gray-50/80">
                <tr className="border-b border-gray-100">
                  {['Employee Info', 'Date', 'Punch In', 'Punch Out', 'Working Hours', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-champagne-light/80/20 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{r.employee?.name || 'Guest'}</p>
                        <p className="text-[10px] text-gray-400">{r.employee?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-700 text-xs">
                      {formatDate(r.punchIn)}
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-xs">{formatTime(r.punchIn)}</td>
                    <td className="px-4 py-4 text-gray-600 text-xs">{formatTime(r.punchOut)}</td>
                    <td className="px-4 py-4 font-bold text-gray-900 text-sm">
                      {r.punchOut ? (
                        <span className="flex items-center gap-1 text-xs">
                          <Clock size={12} className="text-gray-400" />
                          {r.workingHours} hrs
                        </span>
                      ) : (
                        <span className="text-primary font-bold text-xs animate-pulse">On Shift</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge text-[10px] ${
                        r.status === 'Late' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        r.status === 'Present' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        'bg-rose-soft text-rose border-rose/10'
                      }`}>
                        {r.status}
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
            <p className="font-semibold text-gray-600 mb-1">No attendance records found</p>
            <p className="text-xs text-gray-400">No shift clock logs matched the current search criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
