import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Archive, Check, XCircle, Clock, CheckCircle2, ChevronRight, HelpCircle, Tag } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminInventoryRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employee/inventory-requests/admin/all');
      setRequests(res.data.requests || []);
    } catch (err) {
      toast.error('Failed to load inventory requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await api.put(`/employee/inventory-requests/${id}/approve`);
      toast.success(res.data.message);
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approve failed');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.put(`/employee/inventory-requests/${id}/reject`);
      toast.success(res.data.message);
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reject failed');
    }
  };

  const filteredRequests = requests.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Inventory Requests</h1>
          <p className="font-body text-gray-500 text-sm mt-0.5">Review, compare, and approve stock corrections submitted by staff</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          {[['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']].map(([status, label]) => (
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
        <div className="bg-white rounded-2xl p-8 border border-gray-50 text-center text-gray-500">Loading requests...</div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredRequests.map((req) => (
            <div key={req._id} className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex flex-col justify-between hover:shadow-hover transition-all relative overflow-hidden group">
              {/* Status color-bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                req.status === 'approved' ? 'bg-emerald-500' :
                req.status === 'rejected' ? 'bg-rose' : 'bg-amber-400'
              }`} />

              <div className="pt-2">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-14 bg-champagne-light rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <img src={req.product?.images?.[0]?.url} alt={req.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-body font-bold text-gray-900 text-sm truncate">{req.product?.name}</h3>
                    <p className="font-body text-xs text-gray-400 mt-0.5">Code: {req.product?.productCode || 'N/A'}</p>
                    <p className="font-body text-[10px] text-gray-400 mt-1">Submitted by: <span className="font-bold text-gray-600">{req.employee?.name || 'Staff'}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100 text-xs font-body">
                  <div>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase mb-1">Variant Size</span>
                    <span className="font-bold text-gray-800">{req.variant?.size}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase mb-1">Variant Color</span>
                    {req.variant?.color?.name ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-white shadow-sm shrink-0" style={{ backgroundColor: req.variant.color.hex }} />
                        <span className="font-semibold text-gray-700">{req.variant.color.name}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </div>
                  <div className="col-span-2 border-t border-gray-200/60 pt-2 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">Original Stock</span>
                      <span className="font-bold text-gray-600 text-sm">{req.previousStock} units</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                    <div className="text-right">
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">Proposed Stock</span>
                      <span className="font-bold text-primary text-sm">{req.updatedStock} units</span>
                    </div>
                  </div>
                </div>

                {req.remarks && (
                  <div className="bg-champagne-light/35 p-3 rounded-xl border border-gold-pale/30 text-xs font-body mb-3">
                    <p className="font-bold text-[9px] text-gold uppercase tracking-wide">Remarks</p>
                    <p className="text-gray-600 mt-1">{req.remarks}</p>
                  </div>
                )}
                {req.suggestedCouponCode && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Tag size={13} className="text-primary"/>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-primary uppercase tracking-wide">Employee Coupon Suggestion</p>
                      <p className="font-black text-sm tracking-widest text-primary mt-0.5">{req.suggestedCouponCode}</p>
                      <p className="text-[9px] text-gray-400 font-body mt-0.5">Apply this coupon to the product from the Products page</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                <span className="text-[10px] text-gray-400 font-body">{formatDate(req.createdAt)}</span>
                
                {req.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(req._id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-soft hover:bg-rose-soft/80 text-rose text-xs font-bold transition-all"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold transition-all"
                    >
                      <Check size={13} /> Approve
                    </button>
                  </div>
                ) : (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    req.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-soft text-rose'
                  }`}>
                    {req.status === 'approved' ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                    {req.status?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-gray-50 text-center text-gray-400">
          <Archive size={48} className="mx-auto mb-3 opacity-30 text-primary" />
          <p className="font-semibold text-gray-600 mb-1">No requests found</p>
          <p className="text-xs text-gray-400">Inventory update requests matching your current selection will show here.</p>
        </div>
      )}
    </AdminLayout>
  );
}
