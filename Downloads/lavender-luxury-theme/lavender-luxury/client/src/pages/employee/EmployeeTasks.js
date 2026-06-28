import React, { useState, useEffect } from 'react';
import EmployeeLayout from './EmployeeLayout';
import { ClipboardList, CheckCircle2, Play, Calendar, AlertCircle, MessageSquare } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function EmployeeTasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [activeModalTask, setActiveModalTask] = useState(null);
  const [completionRemarks, setCompletionRemarks] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employee/tasks/assigned');
      setTasks(res.data.tasks || []);
    } catch (err) {
      toast.error('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStartTask = async (taskId) => {
    try {
      await api.put(`/employee/tasks/${taskId}/status`, { status: 'In Progress' });
      toast.success('Task marked as In Progress');
      loadTasks();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleCompleteTaskSubmit = async (e) => {
    e.preventDefault();
    if (!completionRemarks.trim()) {
      toast.error('Please enter completion remarks');
      return;
    }

    try {
      await api.put(`/employee/tasks/${activeModalTask._id}/status`, {
        status: 'Completed',
        remarks: completionRemarks
      });
      toast.success('Task completed successfully');
      setActiveModalTask(null);
      setCompletionRemarks('');
      loadTasks();
    } catch (err) {
      toast.error('Failed to complete task');
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <EmployeeLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="font-body text-gray-500 text-sm mt-0.5">Manage and update progress of your assigned duties</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          {[['all', 'All'], ['Pending', 'Pending'], ['In Progress', 'In Progress'], ['Completed', 'Completed']].map(([status, label]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all ${
                filterStatus === status ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-champagne-light/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-50 text-center text-gray-500">Loading tasks...</div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredTasks.map((task) => (
            <div key={task._id} className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex flex-col justify-between hover:shadow-hover transition-shadow group">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-body font-bold text-gray-900 text-base line-clamp-1">{task.title}</h3>
                  <span className={`badge text-[9px] ${
                    task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
                
                <p className="font-body text-gray-500 text-xs line-clamp-3 mb-4">{task.description || 'No description provided.'}</p>

                <div className="space-y-2 mb-4 border-t border-gray-50 pt-3 text-xs font-body text-gray-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-gray-400" /> Due Date</span>
                    <span className="font-bold text-gray-700">{formatDate(task.dueDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><AlertCircle size={13} className="text-gray-400" /> Priority</span>
                    <span className={`font-bold ${
                      task.priority === 'High' ? 'text-rose' :
                      task.priority === 'Medium' ? 'text-amber-600' : 'text-gray-600'
                    }`}>{task.priority}</span>
                  </div>
                  {task.remarks && (
                    <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 mt-2 flex items-start gap-1.5">
                      <MessageSquare size={13} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[10px] uppercase tracking-wide">Remarks</p>
                        <p className="text-[11px] mt-0.5">{task.remarks}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 mt-2 pt-3 border-t border-gray-50">
                {task.type === 'Inventory' && task.product && (
                  <Link to={`/employee/inventory?productId=${task.product._id}`} className="text-xs font-bold text-primary hover:underline">
                    ✦ Open Product Stock
                  </Link>
                )}
                <div className="flex gap-2 ml-auto">
                  {task.status === 'Pending' && (
                    <button
                      onClick={() => handleStartTask(task._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold transition-all"
                    >
                      <Play size={12} /> Start Task
                    </button>
                  )}
                  {task.status !== 'Completed' && (
                    <button
                      onClick={() => setActiveModalTask(task)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold transition-all"
                    >
                      <CheckCircle2 size={12} /> Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-gray-50 text-center text-gray-400">
          <ClipboardList size={48} className="mx-auto mb-3 opacity-30 text-primary" />
          <p className="font-semibold text-gray-600 mb-1">No tasks found</p>
          <p className="text-xs text-gray-400">Tasks assigned to you will be listed here.</p>
        </div>
      )}

      {/* Completion Remarks Modal */}
      {activeModalTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-premium p-6 border border-gold/15">
            <h3 className="font-display font-bold text-gray-900 text-lg mb-2">Complete Task</h3>
            <p className="font-body text-xs text-gray-400 mb-4">Please submit remarks describing how you completed this task.</p>
            
            <form onSubmit={handleCompleteTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-body font-bold text-gray-700 mb-1">Remarks *</label>
                <textarea
                  value={completionRemarks}
                  onChange={(e) => setCompletionRemarks(e.target.value)}
                  placeholder="e.g. Completed stock audit for sarees variant X. Corrected variant sizes."
                  className="w-full h-24 p-3 rounded-xl border border-gray-200 input-field text-sm font-body"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setActiveModalTask(null); setCompletionRemarks(''); }}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-50 text-sm font-body font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-5 text-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
}
