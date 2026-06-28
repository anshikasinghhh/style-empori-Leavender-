import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Package, Truck } from 'lucide-react';
import { formatPrice } from '../../utils/data';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import api from '../../utils/api';

const STATUS_FLOW = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
const STATUS_LABELS = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned'
};

const buildTrackSteps = (order) => {
  const currentIdx = STATUS_FLOW.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';

  if (isCancelled) {
    return [{ status: 'Cancelled', done: true, time: new Date(order.updatedAt || order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }];
  }

  return STATUS_FLOW.map((status, i) => {
    const historyEntry = order.statusHistory?.find(h => h.status === status);
    const done = currentIdx >= i;
    return {
      status: STATUS_LABELS[status],
      done,
      time: historyEntry?.timestamp
        ? new Date(historyEntry.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        : done ? 'Completed' : 'Pending'
    };
  });
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16 text-center">
        <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
        <Link to="/orders" className="btn-primary">Back to Orders</Link>
      </div>
    );
  }

  const trackSteps = buildTrackSteps(order);
  const currentStep = trackSteps.filter(s => s.done).length - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <Link to="/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-body text-sm mb-8 transition-colors"><ArrowLeft size={16}/> Back to Orders</Link>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="font-body text-gray-500 text-sm mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <span className="badge bg-primary-100 text-primary border border-primary-200 text-sm px-4 py-2 capitalize">{order.orderStatus?.replace('_', ' ')}</span>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 mb-6">
        <h2 className="font-display font-bold text-gray-900 mb-6 flex items-center gap-2"><Truck size={18} className="text-primary"/>Order Tracking</h2>
        <div className="relative">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100"/>
          <div className="absolute left-4 top-4 w-0.5 bg-primary transition-all" style={{ height:`${(currentStep/Math.max(trackSteps.length-1,1))*100}%` }}/>
          <div className="space-y-5">
            {trackSteps.map((step, i) => (
              <div key={step.status} className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 text-xs font-bold transition-all ${step.done ? 'bg-primary text-white shadow-card' : 'bg-gray-100 text-gray-400'}`}>
                  {step.done ? '✓' : i + 1}
                </div>
                <div className="pb-2">
                  <p className={`font-body font-semibold text-sm ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.status}</p>
                  <p className={`font-body text-xs mt-0.5 ${step.done ? 'text-gray-500' : 'text-gray-300'}`}>{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 mb-6">
        <h2 className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={18} className="text-primary"/>Items Ordered</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 p-3 bg-champagne-light/80 rounded-xl border border-primary-100 mb-3 last:mb-0">
            <img src={item.image || item.product?.images?.[0]?.url} alt={item.name} className="w-20 h-24 object-cover rounded-xl shadow-sm"/>
            <div className="flex-1">
              <p className="font-body font-bold text-gray-900 text-sm">{item.name}</p>
              <p className="font-body text-xs text-gray-500 mt-0.5">Size: {item.size || 'Free Size'} · Qty: {item.quantity}</p>
              <p className="font-display font-bold text-primary mt-2">{formatPrice(item.price * item.quantity)}</p>
            </div>
            {item.product?._id && (
              <Link to={`/products/${item.product._id}`} className="btn-ghost text-xs py-1.5 px-3 h-fit self-start">Buy Again</Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60">
          <h3 className="font-body font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><MapPin size={15} className="text-primary"/>Delivery Address</h3>
          <p className="font-body font-semibold text-gray-900 text-sm">{order.shippingAddress?.name}</p>
          <p className="font-body text-gray-500 text-xs mt-1">{order.shippingAddress?.street}</p>
          <p className="font-body text-gray-500 text-xs">{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
          <p className="font-body text-gray-500 text-xs mt-1">{order.shippingAddress?.phone}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-card border border-gold-pale/60">
          <h3 className="font-body font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><CreditCard size={15} className="text-primary"/>Payment Summary</h3>
          <div className="space-y-2 text-sm font-body">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span className={order.shippingCost === 0 ? 'text-emerald-600 font-semibold' : 'font-semibold'}>{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span></div>
            {order.tax > 0 && <div className="flex justify-between text-gray-600"><span>Tax</span><span className="font-semibold">{formatPrice(order.tax)}</span></div>}
            {order.couponDiscount > 0 && <div className="flex justify-between text-gray-600"><span>Coupon</span><span className="text-emerald-600 font-semibold">-{formatPrice(order.couponDiscount)}</span></div>}
            <div className="flex justify-between text-gray-600"><span>Payment via</span><span className="font-semibold capitalize">{order.paymentMethod}</span></div>
            <div className="flex justify-between font-bold border-t border-gray-50 pt-2 mt-1">
              <span className="font-display text-gray-900">Total</span>
              <span className="font-display text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
