import React, { useState, useEffect } from 'react';
import EmployeeLayout from './EmployeeLayout';
import { Package, Search, PlusCircle, HelpCircle, Tag, ChevronDown } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function EmployeeInventory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paramProductId = searchParams.get('productId');

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [isNewVariant, setIsNewVariant] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2D0845');
  const [updatedStock, setUpdatedStock] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [suggestedCouponCode, setSuggestedCouponCode] = useState('');

  useEffect(() => {
    const loadProductsAndProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        const activeProducts = res.data.products || [];
        setProducts(activeProducts);

        if (paramProductId) {
          const matched = activeProducts.find(p => p._id === paramProductId);
          if (matched) {
            setSelectedProduct(matched);
          } else {
            // Fetch direct if not in list
            const singleRes = await api.get(`/products/${paramProductId}`);
            if (singleRes.data.product) {
              setSelectedProduct(singleRes.data.product);
            }
          }
        }
      } catch (err) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProductsAndProduct();
  }, [paramProductId]);

  // Load active coupons for reference/suggestion
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const res = await api.get('/coupons/available');
        setAvailableCoupons(res.data.coupons || []);
      } catch (err) { /* silent */ }
    };
    loadCoupons();
  }, []);

  const handleProductChange = (productId) => {
    const match = products.find(p => p._id === productId);
    setSelectedProduct(match || null);
    setIsNewVariant(false);
    setSelectedVariantIndex('');
    setNewSize('');
    setNewColorName('');
    setUpdatedStock(0);
    setSuggestedCouponCode('');
  };

  const handleVariantChange = (index) => {
    setSelectedVariantIndex(index);
    if (index !== '') {
      const v = selectedProduct.variants[index];
      setUpdatedStock(v.stock || 0);
    } else {
      setUpdatedStock(0);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    let variantData = {};

    if (isNewVariant) {
      if (!newSize.trim()) {
        toast.error('Please specify a size for the new variant');
        return;
      }
      variantData = {
        size: newSize.trim().toUpperCase(),
        color: newColorName.trim() ? {
          name: newColorName.trim(),
          hex: newColorHex
        } : undefined
      };
    } else {
      if (selectedVariantIndex === '') {
        toast.error('Please select a variant to update');
        return;
      }
      const v = selectedProduct.variants[selectedVariantIndex];
      variantData = {
        size: v.size,
        color: v.color
      };
    }

    setSubmitting(true);
    try {
      await api.post('/employee/inventory-requests', {
        product: selectedProduct._id,
        variant: variantData,
        updatedStock: Number(updatedStock),
        remarks: remarks.trim(),
        suggestedCouponCode: suggestedCouponCode.trim().toUpperCase() || undefined
      });

      toast.success('Inventory update request submitted for admin review!');
      
      // Reset form
      setRemarks('');
      setUpdatedStock(0);
      setSelectedVariantIndex('');
      setIsNewVariant(false);
      setSuggestedCouponCode('');
      
      // Redirect back to dashboard or task list
      navigate('/employee');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Update Stock</h1>
        <p className="font-body text-gray-500 text-sm mt-0.5">Submit inventory modification requests for Administrator review</p>
      </div>

      <div className="max-w-2xl bg-white rounded-2xl shadow-card border border-gray-50 p-6">
        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading catalog items...</div>
        ) : (
          <form onSubmit={handleSubmitRequest} className="space-y-5">
            {/* Product selection */}
            <div>
              <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Select Product *</label>
              <select
                value={selectedProduct?._id || ''}
                onChange={(e) => handleProductChange(e.target.value)}
                className="input-field py-2.5 text-sm"
                required
              >
                <option value="">-- Choose a Product --</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name} ({p.productCode})</option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <>
                {/* Product Detail Brief */}
                <div className="bg-gray-50 rounded-xl p-4 flex gap-4 border border-gray-100">
                  <div className="w-16 h-20 bg-champagne-light rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <img src={selectedProduct.images?.[0]?.url} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-body font-bold text-sm text-gray-900">{selectedProduct.name}</h4>
                    <p className="font-body text-xs text-gray-400 mt-0.5">Code: {selectedProduct.productCode}</p>
                    <p className="font-body text-xs text-primary font-bold mt-2">Total Catalog Stock: {selectedProduct.stock || 0} units</p>
                    {selectedProduct.couponCode ? (
                      <p className="font-body text-xs mt-1.5 flex items-center gap-1">
                        <Tag size={10} className="text-primary"/>
                        <span className="text-gray-500">Coupon attached:</span>
                        <span className="font-black tracking-widest text-primary">{selectedProduct.couponCode}</span>
                      </p>
                    ) : (
                      <p className="font-body text-xs text-gray-400 mt-1">No coupon attached to this product</p>
                    )}
                  </div>
                </div>

                {/* Variant Mode selection */}
                <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <span className="text-xs font-body font-bold text-gray-700">Modification Mode:</span>
                  <label className="flex items-center gap-1.5 text-xs font-body text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isNewVariant}
                      onChange={() => setIsNewVariant(false)}
                      className="text-primary focus:ring-primary"
                    />
                    Modify Existing Variant
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-body text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={isNewVariant}
                      onChange={() => setIsNewVariant(true)}
                      className="text-primary focus:ring-primary"
                    />
                    Add New Variant
                  </label>
                </div>

                {!isNewVariant ? (
                  /* Modify Existing Variant Fields */
                  <div>
                    <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Select Variant *</label>
                    <select
                      value={selectedVariantIndex}
                      onChange={(e) => handleVariantChange(e.target.value)}
                      className="input-field py-2.5 text-sm"
                      required={!isNewVariant}
                    >
                      <option value="">-- Choose Variant --</option>
                      {selectedProduct.variants?.map((v, i) => (
                        <option key={i} value={i}>
                          Size: {v.size} {v.color?.name ? `· Color: ${v.color.name}` : ''} (Current Stock: {v.stock || 0})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  /* Create New Variant Fields */
                  <div className="grid sm:grid-cols-2 gap-4 bg-champagne-light/30 p-4 rounded-xl border border-gold-pale/40">
                    <div>
                      <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">New Size *</label>
                      <input
                        type="text"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        placeholder="e.g. XL, XXL, 32"
                        className="input-field py-2 text-sm"
                        required={isNewVariant}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">New Color Name (Optional)</label>
                      <input
                        type="text"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        placeholder="e.g. Lavender, Emerald"
                        className="input-field py-2 text-sm"
                      />
                    </div>
                    {newColorName.trim() && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Color Hex Selector</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value)}
                            className="w-10 h-8 p-0.5 rounded border border-gray-200 cursor-pointer"
                          />
                          <span className="font-body text-xs text-gray-500 font-mono">{newColorHex}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stock values */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Previous Stock</label>
                    <div className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold">
                      {isNewVariant ? 0 : selectedVariantIndex !== '' ? selectedProduct.variants[selectedVariantIndex].stock || 0 : '--'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Proposed Stock *</label>
                    <input
                      type="number"
                      value={updatedStock}
                      onChange={(e) => setUpdatedStock(Math.max(0, parseInt(e.target.value) || 0))}
                      min="0"
                      className="input-field py-2 text-sm font-bold"
                      required
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-body font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Reason / Remarks *</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Provide details about why stock is modified (e.g. Audit correction, defect write-off, fresh arrivals count)"
                    className="w-full h-24 p-3 rounded-xl border border-gray-200 input-field text-sm font-body"
                    required
                  />
                </div>

                {/* Suggest Coupon Code */}
                <div className="bg-champagne-light/30 border border-gold-pale/40 rounded-xl p-4">
                  <label className="block text-xs font-body font-bold text-gray-700 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                    <Tag size={11} className="text-primary"/> Suggest Coupon Code (Optional)
                  </label>
                  <p className="text-[10px] text-gray-400 mb-2 font-body">Suggest a discount coupon to be applied to this product. Admin will review your suggestion.</p>
                  <div className="flex gap-2 items-center">
                    <select
                      value={availableCoupons.some(c => c.code === suggestedCouponCode) ? suggestedCouponCode : '__custom__'}
                      onChange={e => {
                        if (e.target.value === '__none__') setSuggestedCouponCode('');
                        else if (e.target.value !== '__custom__') setSuggestedCouponCode(e.target.value);
                      }}
                      className="input-field text-sm flex-1 py-2"
                    >
                      <option value="__none__">— No Suggestion —</option>
                      {availableCoupons.map(c => (
                        <option key={c._id} value={c.code}>
                          {c.code} · {c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`}
                        </option>
                      ))}
                      <option value="__custom__">✏️ Type a custom code…</option>
                    </select>
                    {(!availableCoupons.some(c => c.code === suggestedCouponCode)) && (
                      <input
                        value={suggestedCouponCode}
                        onChange={e => setSuggestedCouponCode(e.target.value.toUpperCase().replace(/\s/g,''))}
                        placeholder="e.g. NEWSTOCK10"
                        className="input-field text-sm font-bold tracking-widest flex-1 py-2"
                      />
                    )}
                  </div>
                  {suggestedCouponCode && (
                    <p className="mt-1.5 text-[10px] text-primary font-semibold font-body flex items-center gap-1">
                      <Tag size={9}/> You're suggesting: <span className="tracking-widest font-black ml-1">{suggestedCouponCode}</span>
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary py-3 rounded-xl text-sm font-bold"
                  >
                    {submitting ? 'Submitting Request...' : 'Submit Update Request'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </EmployeeLayout>
  );
}
