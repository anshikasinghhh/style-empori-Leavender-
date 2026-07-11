import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export const EMPTY_CUSTOM_COUPON = {
  code: '',
  type: 'percentage',
  value: '',
  minOrderValue: '',
  maxDiscount: '',
  usageLimit: '100',
  expiresAt: '',
};

export async function resolveProductCouponCode({ couponMode, couponCode, customCoupon, api }) {
  if (couponMode === 'none' || !couponCode) return '';

  if (couponMode === 'existing') {
    // For existing coupons, just return the code - no need to create
    return couponCode;
  }

  if (couponMode !== 'custom') {
    return couponCode;
  }

  if (!customCoupon.code) {
    throw new Error('Custom coupon requires code');
  }

  if (!customCoupon.value) {
    return couponCode;
  }

  const payload = {
    code: customCoupon.code.toUpperCase(),
    type: customCoupon.type,
    value: Number(customCoupon.value),
    minOrderValue: Number(customCoupon.minOrderValue || 0),
    maxDiscount: customCoupon.maxDiscount ? Number(customCoupon.maxDiscount) : null,
    usageLimit: Number(customCoupon.usageLimit || 100),
    expiresAt: customCoupon.expiresAt || null,
    isActive: true,
  };

  await api.post('/coupons', payload);
  return payload.code;
}

export default function ProductCouponSection({
  couponMode,
  setCouponMode,
  couponCode,
  setCouponCode,
  customCoupon,
  setCustomCoupon,
  availableCoupons,
  selectedCoupon,
  setSelectedCoupon,
}) {

  const clearCoupon = () => {
    setCouponMode('none');
    setCouponCode('');
    setCustomCoupon(EMPTY_CUSTOM_COUPON);
    setSelectedCoupon('');
  };

  const addExistingCoupon = () => {
    if (!selectedCoupon) return;
    setCouponMode('existing');
    setCouponCode(selectedCoupon);
    setCustomCoupon(EMPTY_CUSTOM_COUPON);
  };

  const addCustomCoupon = () => {
    if (!customCoupon.code || !customCoupon.value) {
      toast.error('Custom coupon code and value are required');
      return;
    }
    const code = customCoupon.code.toUpperCase().replace(/\s/g, '');
    setCustomCoupon((f) => ({ ...f, code }));
    setCouponMode('custom');
    setCouponCode(code);
    setSelectedCoupon('');
  };

  return (
    <div className="col-span-2">
      <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
        Coupon Code (Optional)
      </label>

      <div className="flex gap-2">
        <select
          value={selectedCoupon}
          onChange={(e) => setSelectedCoupon(e.target.value)}
          className="input-field flex-1 text-sm"
        >
          <option value="">Select Coupon</option>
          {availableCoupons.map((c) => (
            <option key={c._id} value={c.code}>
              {c.code} · {c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`}
            </option>
          ))}
        </select>
        <button type="button" onClick={addExistingCoupon} className="btn-primary">
          Add
        </button>
      </div>

      <div className="mt-3">
        <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
          Custom Coupon
        </label>
        <div className="space-y-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div>
            <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Coupon Code
            </label>
            <input
              value={customCoupon.code}
              onChange={(e) =>
                setCustomCoupon((f) => ({
                  ...f,
                  code: e.target.value.toUpperCase().replace(/\s/g, ''),
                }))
              }
              placeholder="e.g. SAVE20"
              className="input-field font-bold tracking-widest text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Type
              </label>
              <select
                value={customCoupon.type}
                onChange={(e) => setCustomCoupon((f) => ({ ...f, type: e.target.value }))}
                className="input-field text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Value
              </label>
              <input
                type="number"
                value={customCoupon.value}
                onChange={(e) => setCustomCoupon((f) => ({ ...f, value: e.target.value }))}
                placeholder={customCoupon.type === 'percentage' ? '10' : '500'}
                className="input-field text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Min Order (₹)
              </label>
              <input
                type="number"
                value={customCoupon.minOrderValue}
                onChange={(e) => setCustomCoupon((f) => ({ ...f, minOrderValue: e.target.value }))}
                placeholder="999"
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Max Discount (₹)
              </label>
              <input
                type="number"
                value={customCoupon.maxDiscount}
                onChange={(e) => setCustomCoupon((f) => ({ ...f, maxDiscount: e.target.value }))}
                placeholder="500"
                className="input-field text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Usage Limit
              </label>
              <input
                type="number"
                value={customCoupon.usageLimit}
                onChange={(e) => setCustomCoupon((f) => ({ ...f, usageLimit: e.target.value }))}
                placeholder="100"
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Expires At
              </label>
              <input
                type="date"
                value={customCoupon.expiresAt}
                onChange={(e) => setCustomCoupon((f) => ({ ...f, expiresAt: e.target.value }))}
                className="input-field text-sm"
              />
            </div>
          </div>
          <button type="button" onClick={addCustomCoupon} className="btn-outline">
            Add Custom
          </button>
        </div>
      </div>

      {couponCode && (
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="px-3 py-1.5 bg-primary text-white rounded-full flex items-center gap-2 text-sm font-body">
            <Tag size={12} />
            <span className="tracking-widest font-bold">{couponCode}</span>
            <button type="button" onClick={clearCoupon} className="hover:opacity-80">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
