import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { ClipboardList, Plus, Calendar, AlertCircle, Search, Filter, X, CheckCircle2, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState('General');
  const [product, setProduct] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load each independently so one failure doesn't break others
      const tasksRes = await api.get('/employee/tasks/admin/all').catch(err => {
        console.error('Failed to load tasks:', err);
        return { data: { tasks: [] } };
      });
      const empRes = await api.get('/employee/admin/employees').catch(err => {
        console.error('Failed to load employees:', err);
        return { data: { employees: [] } };
      });
      const prodRes = await api.get('/products').catch(err => {
        console.error('Failed to load products:', err);
        return { data: { products: [] } };
      });
      setTasks(tasksRes.data.tasks || []);
      setEmployees(empRes.data.employees || []);
      setProducts(prodRes.data.products || []);
    } catch (err) {
      toast.error('Failed to load task dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = async () => {
    setShowAddModal(true);
    // Refresh employee list when opening modal to ensure latest employees are shown
    try {
      const empRes = await api.get('/employee/admin/employees');
      setEmployees(empRes.data.employees || []);
    } catch (err) {
      console.error('Failed to refresh employee list:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title || !assignedTo || !dueDate) {
      toast.error('Title, assignee, and due date are required.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/employee/tasks', {
        title,
        description,
        assignedTo,
        priority,
        dueDate,
        type,
        product: type === 'Inventory' ? product : undefined
      });

      toast.success('Task assigned successfully!');
      setShowAddModal(false);
      
      // Reset
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setPriority('Medium');
      setDueDate('');
      setType('General');
      setProduct('');
      
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign task');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchEmp = filterEmployee === 'all' || t.assignedTo?._id === filterEmployee;
    const matchPrio = filterPriority === 'all' || t.priority === filterPriority;
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    
    return matchSearch && matchEmp && matchPrio && matchStatus;
  });

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task? This action cannot be undone.')) return;
    try {
      await api.delete(`/employee/tasks/${id}`);
      setTasks(ts => ts.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Task Assignments</h1>
          <p className="font-body text-gray-500 text-sm mt-0.5">Assign, prioritize, and monitor the progress of operational staff tasks</p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn-primary py-2.5 px-5 text-sm gap-2"
        >
          <Plus size={16} /> Assign Task
        </button>
      </div>

      {/* Task Filters & Lists */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..." 
              className="w-full pl-10 input-field text-sm py-2"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select 
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="input-field py-2 text-xs w-36"
            >
              <option value="all">All Employees</option>
              {employees.map(e => (
                <option key={e._id} value={e._id}>{e.name}</option>
              ))}
            </select>

            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input-field py-2 text-xs w-28"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field py-2 text-xs w-28"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading task list...</div>
        ) : filteredTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body min-w-[850px]">
              <thead className="bg-gray-50/80">
                <tr className="border-b border-gray-100">
                  {['Task details', 'Assignee', 'Type', 'Priority', 'Due Date', 'Status', 'Remarks', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-champagne-light/80/20 transition-colors">
                    <td className="px-4 py-4 max-w-[200px]">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{task.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{task.description || 'No description'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-gray-700 text-xs">{task.assignedTo?.name || 'Unassigned'}</p>
                        <p className="text-[10px] text-gray-400">{task.assignedTo?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {task.type === 'Inventory' ? (
                        <span className="badge bg-blue-100 text-blue-700 text-[10px] border border-blue-200">
                          Stock Check ({task.product?.productCode || 'Deleted Product'})
                        </span>
                      ) : (
                        <span className="badge bg-purple-100 text-purple-700 text-[10px] border border-purple-200">
                          General
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold uppercase ${
                        task.priority === 'High' ? 'text-rose' :
                        task.priority === 'Medium' ? 'text-amber-700' : 'text-gray-500'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-700 text-xs">{formatDate(task.dueDate)}</td>
                    <td className="px-4 py-4">
                      <span className={`badge text-[9px] ${
                        task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-[150px]">
                      <p className="text-xs text-gray-500 italic truncate" title={task.remarks}>{task.remarks || '--'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => deleteTask(task._id)} className="w-8 h-8 rounded-lg bg-rose-soft hover:bg-rose/90 text-rose transition-colors flex items-center justify-center" title="Delete task">
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
            <ClipboardList size={48} className="mx-auto mb-3 opacity-30 text-primary" />
            <p className="font-semibold text-gray-600 mb-1">No tasks found</p>
            <p className="text-xs text-gray-400">No tasks matched your current query.</p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-premium p-6 border border-gold/15"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-gray-900 text-lg">Assign New Task</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18}/></button>
            </div>
            
            <form onSubmit={handleCreateTask} className="space-y-4 font-body">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Audit Kurtis Stock"
                  className="input-field py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assign Employee *</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="input-field py-2 text-sm"
                  required
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map(e => (
                    <option key={e._id} value={e._id}>{e.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="input-field py-2 text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-field py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Task Type</label>
                  <select
                    value={type}
                    onChange={(e) => { setType(e.target.value); setProduct(''); }}
                    className="input-field py-2 text-sm"
                  >
                    <option value="General">General</option>
                    <option value="Inventory">Inventory Audit</option>
                  </select>
                </div>

                {type === 'Inventory' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Link Product *</label>
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="input-field py-2 text-sm"
                      required={type === 'Inventory'}
                    >
                      <option value="">-- Select Product --</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the objective of this task..."
                  className="w-full h-20 p-2.5 rounded-xl border border-gray-200 input-field text-sm font-body"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
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
                  {submitting ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
