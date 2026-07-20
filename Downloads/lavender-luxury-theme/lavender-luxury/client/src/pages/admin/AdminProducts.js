// import React, { useState } from 'react';
// import React, {useState,useEffect} from 'react';
import AdminLayout from './AdminLayout';
import { Plus, Search, Edit2, Trash2, X, Save, Tag, RefreshCw } from 'lucide-react';
import { CATEGORIES, formatPrice } from '../../utils/data';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import ProductCouponSection, { EMPTY_CUSTOM_COUPON, resolveProductCouponCode } from '../../components/staff/ProductCouponSection';

const COLOR_OPTIONS = [
  "Black",
  "White",
  "Blue",
  "Red",
  "Green",
  "Pink",
  "Purple",
  "Yellow",
  "Grey",
  "Brown",
  "Navy Blue",
  "Maroon",
  "Beige",
  "Lavender"
];

const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Free Size"
];
// const loadProducts = async () => {
//   try {
//     const res = await api.get('/products');

//     console.log("SUCCESS RESPONSE:", res.data);

//     setProducts(res.data.products || []);

//   } catch (err) {

//     console.error("ERROR OBJECT:", err);

//     if (err.response) {
//       console.error("STATUS:", err.response.status);
//       console.error("DATA:", err.response.data);
//     }

//     toast.error('Failed to load products');
//   }
// };

const EMPTY = { name:'', productCode:'', mrp:'', price:'', originalPrice:'', category:'', description:'', stock:0, material:'', sizes:[], colors:[], variants:[], isFeatured:false, isNewArrival:false, isBestSeller:false, isFlashSale:false, isFestival:false, images:[], couponCode:'' };

export default function AdminProducts({ Layout = AdminLayout }) {
  const [products, setProducts] = useState([]);
  const loadProducts = async () => {
  try {
    const res = await api.get('/products');

    console.log("SUCCESS RESPONSE:", res.data);

    setProducts(res.data.products || []);

  } catch (err) {

    console.error("ERROR OBJECT:", err);

    if (err.response) {
      console.error("STATUS:", err.response.status);
      console.error("DATA:", err.response.data);
    }

    toast.error('Failed to load products');
  }
};

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [variantCustomSize, setVariantCustomSize] = useState("");
  const [variantCustomColorName, setVariantCustomColorName] = useState("");
  const [variantCustomColorHex, setVariantCustomColorHex] = useState("#2D0845");
  const [selectedCoupon, setSelectedCoupon] = useState("");

  // Variant builder state
  const [variantSize, setVariantSize] = useState("");
  const [variantColor, setVariantColor] = useState("");
  const [variantStock, setVariantStock] = useState(0);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  
  const uploadImages = async (files) => {
    try {
      if (!files || files.length === 0) {
        toast.error('No files selected');
        return;
      }

      // Validate file types
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const invalidFiles = files.filter(f => !validTypes.includes(f.type));
      if (invalidFiles.length > 0) {
        toast.error(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}`);
        return;
      }

      toast.loading('Uploading image(s)...', { id: 'upload' });
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      
      const res = await api.post('/uploads', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000 
      });
      
      if (!res.data.success) {
        throw new Error(res.data.message || 'Upload failed');
      }

      const uploadedImages = (res.data.images || []).filter(i => i && i.url);

      if (uploadedImages.length === 0) {
        toast.error('No images were uploaded');
        return;
      }

      // Add images to form with URL validation
      const validImages = uploadedImages.map(i => ({
        url: i.url.trim(),
        alt: i.alt || ''
      }));

      setForm(f => ({
        ...f,
        images: [...(f.images || []), ...validImages]
      }));

      toast.success(`${uploadedImages.length} image(s) uploaded successfully`, { id: 'upload' });
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || err.message || 'Upload failed', { id: 'upload' });
    }
  };

const [availableCoupons, setAvailableCoupons] = useState([]);
const [couponMode, setCouponMode] = useState('none');
const [customCoupon, setCustomCoupon] = useState(EMPTY_CUSTOM_COUPON);

const loadAvailableCoupons = async () => {
  try {
    console.log('Loading available coupons...');
    const res = await api.get('/coupons/available');
    console.log('Available coupons response:', res.data);
    setAvailableCoupons(res.data.coupons || []);
  } catch (err) {
    console.error('Error loading coupons:', err);
    // coupons optional — silent fail
  }
};

const filtered = products.filter(
  p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
);
console.log("Products:", products);
console.log("Filtered:", filtered);
  // console.log("Current Products State:", products);
  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setCouponMode('none');
    setCustomCoupon(EMPTY_CUSTOM_COUPON);
    setEditingVariantIndex(null);
    resetVariantForm();
    setModal(true);
  };

  const resetVariantForm = () => {
    setVariantSize('');
    setVariantColor('');
    setVariantStock(0);
    setVariantCustomSize('');
    setVariantCustomColorName('');
    setVariantCustomColorHex('#2D0845');
    setEditingVariantIndex(null);
  };

  const handleEditVariant = (index) => {
    const variant = form.variants[index];
    if (!variant) return;

    setEditingVariantIndex(index);
    setVariantSize(variant.size || '');
    setVariantColor(variant.color?.name || '');
    setVariantCustomSize(variant.size || '');
    setVariantCustomColorName(variant.color?.name || '');
    setVariantCustomColorHex(variant.color?.hex || '#2D0845');
    setVariantStock(variant.stock || 0);
  };

  const handleCancelEditVariant = () => {
    resetVariantForm();
  };
  const openEdit = (p) => {
    // Normalize product shape before editing to avoid runtime errors
    console.log('Opening edit for product:', p);
    setForm({
      ...p,
      mrp: String(p.mrp || ''),
      price: String(p.price || ''),
      originalPrice: String(p.originalPrice || ''),
      stock: Number(p.stock || 0),
      category: typeof p.category === 'object' && p.category !== null ? (p.category.name || '') : (p.category || ''),
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      colors: Array.isArray(p.colors) ? p.colors : [],
      images: Array.isArray(p.images) && p.images.length ? p.images : [],
      variants: Array.isArray(p.variants) ? p.variants : [],
      couponCode: p.couponCode || ''
    });
    setEditingVariantIndex(null);
    resetVariantForm();
    setEditId(p._id);
    console.log('Available coupons:', availableCoupons);
    console.log('Product coupon code:', p.couponCode);
    if (p.couponCode && Array.isArray(availableCoupons) && availableCoupons.some(c => c.code === p.couponCode)) {
      console.log('Setting coupon mode to existing');
      setCouponMode('existing');
      setSelectedCoupon(p.couponCode);
    } else if (p.couponCode) {
      console.log('Setting coupon mode to custom');
      setCouponMode('custom');
      setCustomCoupon({ ...EMPTY_CUSTOM_COUPON, code: p.couponCode });
    } else {
      console.log('Setting coupon mode to none');
      setCouponMode('none');
      setCustomCoupon(EMPTY_CUSTOM_COUPON);
    }
    setModal(true);
  };
useEffect(() => {
    loadProducts();
    loadAvailableCoupons();
  }, []);

  // const handleSave = () => {
  //   if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
  //   if (editId) {
  //     setProducts(ps => ps.map(p => p._id === editId ? { ...p, ...form, price:Number(form.price), originalPrice:Number(form.originalPrice)||null, stock:Number(form.stock), category:{ name:form.category, slug:form.category?.toLowerCase() } } : p));
  //     toast.success('Product updated!');
  //   } else {
  //     setProducts(ps => [{ ...form, _id:'p'+Date.now(), price:Number(form.price), originalPrice:Number(form.originalPrice)||null, stock:Number(form.stock), ratings:0, numReviews:0, sold:0, category:{ name:form.category, slug:form.category?.toLowerCase() }, images:[{url:form.images?.[0]?.url||PRODUCTS[0].images[0].url,alt:form.name}] }, ...ps]);
  //     toast.success('Product added successfully!');
  //   }
  //   setModal(false);
  // };
  const handleSave = async () => {
  try {
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    
    // Validate negative values
    const price = Number(form.price);
    const mrp = Number(form.mrp);
    const originalPrice = Number(form.originalPrice);
    
    if (price < 0) {
      toast.error('Price cannot be negative - this is invalid amount');
      return;
    }
    if (mrp < 0) {
      toast.error('MRP cannot be negative - this is invalid amount');
      return;
    }
    if (originalPrice < 0) {
      toast.error('Original Price cannot be negative - this is invalid amount');
      return;
    }

    // Calculate total stock from variants, otherwise use form stock
    const calculatedStock = form.variants.length > 0
      ? form.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
      : Number(form.stock) || 0;
    
    // Client-side duplicate productCode check (exclude current edit)
    if (form.productCode) {
      const codeToCheck = String(form.productCode).trim();
      const duplicate = products.find(p => p.productCode && String(p.productCode).trim() === codeToCheck && p._id !== editId);
      if (duplicate) {
        toast.error('Product with same code exists, try a different code');
        return;
      }
    }

    const resolvedCouponCode = await resolveProductCouponCode({
      couponMode,
      couponCode: form.couponCode,
      customCoupon,
      api,
    });

    // Validate images - only filter out invalid ones, don't require images
    const validImages = (form.images || []).filter(img => img && img.url && img.url.trim());

    const payload = { 
      ...form, 
      couponCode: resolvedCouponCode, 
      stock: calculatedStock,
      images: validImages.map(img => ({
        url: img.url.trim(),
        alt: (img.alt || form.name || 'Product image').trim()
      }))
    };
    console.log('Payload to send:', payload);

    // Ensure sizes and colors are properly formatted
    if (form.sizes && Array.isArray(form.sizes)) {
      payload.sizes = form.sizes.map(s => ({
        size: s.size,
        stock: Number(s.stock) || 0
      }));
    }
    if (form.colors && Array.isArray(form.colors)) {
      payload.colors = form.colors.map(c => ({
        name: c.name,
        hex: c.hex || ''
      }));
    }
    if (form.variants && Array.isArray(form.variants)) {
      payload.variants = form.variants.map(v => ({
        size: v.size,
        color: v.color,
        stock: Number(v.stock) || 0
      }));
    }

    console.log('Final payload after formatting:', payload);

    if (editId) {
      console.log('Updating product with ID:', editId);
      const res = await api.put(`/products/${editId}`, payload);
      console.log('Update response:', res.data);
      toast.success('Product Updated');
      // Update the product in the local state with the returned data
      if (res.data.success && res.data.product) {
        setProducts(ps => ps.map(p => p._id === editId ? res.data.product : p));
      }
    } else {
      await api.post('/products', payload);
      toast.success('Product Added');
    }

    loadProducts();
    loadAvailableCoupons();
    setModal(false);
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || 'Error');
  }
};

  // const deleteProduct = (id) => { setProducts(ps => ps.filter(p => p._id !== id)); toast.success('Product removed'); };
const deleteProduct = async (id) => {

  try {

    await api.delete(
      `/products/${id}`
    );

    toast.success(
      "Product Deleted"
    );

    loadProducts();

  } catch (err) {

    toast.error(
      "Delete Failed"
    );

  }

};

  const recalculateAllStock = async () => {
    try {
      toast.loading('Recalculating stock for all products...', { id: 'recalc' });
      const res = await api.post('/admin/recalculate-stock');
      toast.success(res.data.message, { id: 'recalc' });
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to recalculate stock', { id: 'recalc' });
    }
  };
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-gray-900">Products</h1><p className="font-body text-gray-500 text-sm mt-0.5">{products.length} products in store</p></div>
        <div className="flex gap-2">
          <button onClick={recalculateAllStock} className="btn-outline text-sm gap-2 py-2.5"><RefreshCw size={16}/> Recalculate Stock</button>
          <button onClick={openAdd} className="btn-primary text-sm gap-2 py-2.5"><Plus size={16}/> Add Product</button>
        </div>
      </div>
     

      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs"><Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 input-field text-sm py-2.5"/>
          </div>
          <span className="font-body text-sm text-gray-400 ml-auto">{filtered.length} results</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body min-w-[700px]">
            <thead className="bg-gray-50/80">
              <tr>{['Product','Category','MRP' ,'Price','Stock','Coupon','Tags','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p._id} className="hover:bg-champagne-light/80/20 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-champagne-light shrink-0">
                        <img src={p.images?.[0]?.url||'https://via.placeholder.com/200'} alt={p.name} className="w-full h-full object-cover"/>
                      </div>
                      <div><p className="font-semibold text-gray-900 text-sm line-clamp-1">{p.name}</p><p className="text-xs text-gray-400">{p.material}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="badge bg-champagne-light/80 text-primary border border-primary-100">{p.category}</span></td>
                  <td className="px-4 py-3"><p className="font-bold text-gray-900">{formatPrice(p.mrp)}</p></td>
                  <td className="px-4 py-3"><p className="font-bold text-gray-900">{formatPrice(p.price)}</p>{p.originalPrice && <p className="text-xs text-gray-400 line-through">{formatPrice(p.originalPrice)}</p>}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`badge text-xs font-bold ${p.stock === 0 ? 'bg-gray-100 text-gray-600' : p.stock < 10 ? 'bg-rose-soft text-rose' : p.stock < 25 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.stock} available
                      </span>
                      <span className="text-[10px] text-gray-400">{p.sold || 0} sold</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.couponCode ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-champagne-light/80 text-primary text-[10px] font-bold tracking-widest border border-primary-100">
                        <Tag size={9}/> {p.couponCode}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.isFeatured && <span className="badge-primary text-[10px]">Featured</span>}
                      {p.isNewArrival && <span className="badge bg-emerald-100 text-emerald-700 text-[10px]">New</span>}
                      {p.isBestSeller && <span className="badge bg-amber-100 text-amber-700 text-[10px]">Bestseller</span>}
                      {p.isFlashSale && <span className="badge bg-rose-soft text-rose text-[10px]">Sale</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-champagne-light/80 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-all"><Edit2 size={13}/></button>
                      <button onClick={() => deleteProduct(p._id)} className="w-8 h-8 rounded-lg bg-rose-soft hover:bg-rose text-rose hover:text-white flex items-center justify-center transition-all"><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-8 px-4 pb-4 overflow-y-auto">
            <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }} className="bg-white rounded-3xl w-full max-w-2xl shadow-premium">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-display text-xl font-bold text-gray-900">{editId ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"><X size={18}/></button>
              </div>
              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Product Name *</label><input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} className="input-field text-sm" placeholder="e.g. Royal Kanjivaram Silk Saree"/></div>
                  <div><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Product Code *</label><input value={form.productCode} onChange={e => setForm(f=>({...f,productCode:e.target.value}))} className="input-field text-sm" placeholder="e.g. KS-001"/></div>
                  <div>
  <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
    MRP (₹)
  </label>

  <input
    type="number"
    value={form.mrp}
    onChange={e => setForm(f => ({
      ...f,
      mrp: e.target.value
    }))}
    className="input-field text-sm"
    placeholder="2000"
  />
</div>
                  <div><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Price (₹) *</label><input type="number" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} className="input-field text-sm" placeholder="9499"/></div>
                  <div><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Original Price (₹)</label><input type="number" value={form.originalPrice} onChange={e => setForm(f=>({...f,originalPrice:e.target.value}))} className="input-field text-sm" placeholder="14999"/></div>
                  <div><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Category</label>
                    <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} className="input-field text-sm">
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Stock Units (Auto-calculated from Variants)</label><input type="number" value={form.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)} readOnly className="input-field text-sm bg-gray-50 cursor-not-allowed font-bold text-primary" placeholder="0"/><p className="text-[10px] text-gray-400 mt-1">⚠️ Add variants above to set stock. Total = Sum of all variant quantities</p></div>

                  {/* Variants builder */}
                  <div className="col-span-2 mt-4 border-l-4 border-primary/30 pl-4 py-3 bg-champagne-light/20 rounded-r-lg">
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">➕ Add Custom Variant (Size / Color / Stock)</label>
                    
                    {/* Size Section */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <label className="font-body text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-2 block">Size Option</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-body text-[10px] text-gray-500 mb-1 block">Preset Size</label>
                          <select value={variantSize} onChange={e=>setVariantSize(e.target.value)} className="input-field text-sm">
                            <option value="">-- Select preset --</option>
                            {[...new Set([...SIZE_OPTIONS, ...form.sizes.map(s=>s.size)])].map(s=> <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="font-body text-[10px] text-gray-500 mb-1 block">Or Custom Size</label>
                          <input value={variantCustomSize} onChange={e=>setVariantCustomSize(e.target.value)} placeholder="e.g., S, M, L" className="input-field text-sm" />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Select preset OR enter custom size</p>
                    </div>

                    {/* Color Section */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <label className="font-body text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-2 block">Color Option</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-body text-[10px] text-gray-500 mb-1 block">Preset Color</label>
                          <select value={variantColor} onChange={e=>setVariantColor(e.target.value)} className="input-field text-sm">
                            <option value="">-- Select preset --</option>
                            {[...new Set([...COLOR_OPTIONS, ...form.colors.map(c=>c.name)])].map(c=> <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="font-body text-[10px] text-gray-500 mb-1 block">Or Custom Color</label>
                          <input value={variantCustomColorName} onChange={e=>setVariantCustomColorName(e.target.value)} placeholder="e.g., Royal Blue" className="input-field text-sm" />
                        </div>
                      </div>
                      {variantCustomColorName && (
                        <div className="mt-2">
                          <label className="font-body text-[10px] text-gray-500 mb-1 block">Color Hex Code</label>
                          <input type="color" value={variantCustomColorHex} onChange={e=>setVariantCustomColorHex(e.target.value)} className="w-full h-9 cursor-pointer border border-gray-200 rounded" />
                        </div>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">Select preset OR enter custom color</p>
                    </div>

                    {/* Stock Section */}
                    <div className="mb-3">
                      <label className="font-body text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-2 block">Stock Quantity</label>
                      <input type="number" value={variantStock} onChange={e=>{
                        const val = Number(e.target.value);
                        if (val < 0) {
                          toast.error('Stock cannot be negative - this is invalid amount');
                          return;
                        }
                        setVariantStock(val);
                      }} className="input-field w-full" placeholder="0" />
                    </div>

                    {/* Add/Update Button */}
                    <div className="flex gap-2 mt-4">
                      {editingVariantIndex !== null ? (
                        <>
                          <button type="button" onClick={()=>{
                            const finalSize = variantSize || variantCustomSize;
                            const finalColorName = variantColor || variantCustomColorName;

                            if(!finalSize) { toast.error('Please specify a size'); return; }
                            if(!finalColorName) { toast.error('Please specify a color'); return; }

                            const colorObj = variantColor ?
                              { name: variantColor, hex: '' } :
                              { name: variantCustomColorName, hex: variantCustomColorHex };

                            // Check for duplicate with other variants (excluding current editing variant)
                            const duplicateIndex = form.variants.findIndex((v, i) =>
                              i !== editingVariantIndex && v.size === finalSize && v.color?.name === finalColorName
                            );

                            if(duplicateIndex > -1) {
                              toast.error('Variant with this Size + Color already exists');
                              return;
                            }

                            setForm(f => {
                              const updated = [...f.variants];
                              updated[editingVariantIndex] = {
                                size: finalSize,
                                color: colorObj,
                                stock: Number(variantStock || 0)
                              };
                              return { ...f, variants: updated };
                            });

                            toast.success(`✓ Updated variant: ${finalSize} / ${finalColorName}`);
                            resetVariantForm();
                          }} className="btn-primary flex-1">✓ Update Variant</button>
                          <button type="button" onClick={handleCancelEditVariant} className="btn-outline">Cancel</button>
                        </>
                      ) : (
                        <button type="button" onClick={()=>{
                          const finalSize = variantSize || variantCustomSize;
                          const finalColorName = variantColor || variantCustomColorName;

                          if(!finalSize) { toast.error('Please specify a size (preset or custom)'); return; }
                          if(!finalColorName) { toast.error('Please specify a color (preset or custom)'); return; }

                          const colorObj = variantColor ?
                            { name: variantColor, hex: '' } :
                            { name: variantCustomColorName, hex: variantCustomColorHex };

                          const existingIndex = form.variants.findIndex(v=>v.size===finalSize && v.color?.name===finalColorName);

                          if(existingIndex > -1) {
                            toast.error('Variant with this Size + Color already exists. Click the variant to edit it.');
                            return;
                          }

                          setForm(f=>({
                            ...f,
                            variants:[
                              ...f.variants,
                              {
                                size: finalSize,
                                color: colorObj,
                                stock: Number(variantStock || 0)
                              }
                            ]
                          }));

                          toast.success(`✓ New variant added: ${finalSize} / ${finalColorName}`);
                          resetVariantForm();
                        }} className="btn-primary flex-1">✓ Add Variant</button>
                      )}
                    </div>

                    {/* Display Added Variants */}
                    {form.variants.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-body text-[11px] font-bold text-gray-600 uppercase tracking-wide">📦 Product Variants:</p>
                          <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-lg">
                            <p className="font-body text-[11px] font-bold text-primary">Total Stock: <span className="text-lg">{form.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)}</span> units</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-2">💡 Click any variant row to edit its details</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs font-body">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-left px-3 py-2 font-bold text-gray-600">Size</th>
                                <th className="text-left px-3 py-2 font-bold text-gray-600">Color</th>
                                <th className="text-left px-3 py-2 font-bold text-gray-600">Stock</th>
                                <th className="text-right px-3 py-2 font-bold text-gray-600">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {form.variants.map((v, i)=> (
                                <tr
                                  key={i}
                                  onClick={() => handleEditVariant(i)}
                                  className={`cursor-pointer hover:bg-champagne-light/50 transition-colors ${editingVariantIndex === i ? 'bg-primary/10 border-l-4 border-primary' : ''}`}
                                >
                                  <td className="px-3 py-2 font-semibold text-gray-900">{v.size}</td>
                                  <td className="px-3 py-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{backgroundColor: v.color?.hex || '#f0f0f0'}}></div>
                                      <span className="text-gray-600">{v.color?.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 font-bold text-primary">{v.stock}</td>
                                  <td className="px-3 py-2 text-right">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setForm(f=>({...f, variants: f.variants.filter((_,idx)=>idx!==i)}));
                                        if(editingVariantIndex === i) resetVariantForm();
                                        toast.success('Variant removed');
                                      }}
                                      className="text-rose hover:text-red-700 font-bold transition-colors"
                                      title="Remove variant"
                                    >
                                      ×
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2"><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Material</label><input value={form.material} onChange={e => setForm(f=>({...f,material:e.target.value}))} className="input-field text-sm" placeholder="Pure Kanjivaram Silk"/></div>
                  <div className="col-span-2"><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label><textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} className="input-field text-sm h-24 resize-none" placeholder="Product description..."/></div>
                  <div className="col-span-2"><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Product Images *</label>
                    <div className="flex gap-3 items-start">
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;
                          uploadImages(files);
                        }} 
                        className="input-field text-sm flex-1" 
                        placeholder="Select image files"
                      />
                      <div className="ml-2 flex gap-2 items-center">
                        <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL" className="input-field text-sm" />
                        <input value={imageAlt} onChange={e=>setImageAlt(e.target.value)} placeholder="Alt text" className="input-field text-sm w-40" />
                        <button type="button" onClick={()=>{
                          if(!imageUrl) { toast.error('Enter image URL'); return; }
                          setForm(f=>({...f, images:[...(f.images||[]), { url: imageUrl, alt: imageAlt || f.name || '' }]}));
                          setImageUrl(''); setImageAlt('');
                        }} className="btn-outline">Add</button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3">
                      {form.images?.map((img, idx) => (
                        <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden bg-champagne-light relative">
                          <img src={img.url || 'https://via.placeholder.com/200'} alt={img.alt || form.name} className="w-full h-full object-cover"/>
                          <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">Product Tags</label>
                    <div className="flex flex-wrap gap-3">
                      {[['isFeatured','⭐ Featured'],['isNewArrival','🆕 New Arrival'],['isBestSeller','🏆 Best Seller'],['isFlashSale','⚡ Flash Sale'],['isFestival','🎉 Festival']].map(([k,l]) => (
                        <label key={k} className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 cursor-pointer transition-all ${form[k] ? 'border-primary bg-champagne-light/80' : 'border-gray-100 hover:border-primary-200'}`}>
                          <input type="checkbox" checked={form[k]||false} onChange={e => setForm(f=>({...f,[k]:e.target.checked}))} className="w-3.5 h-3.5 text-primary rounded"/>
                          <span className="font-body text-xs font-semibold text-gray-700">{l}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <ProductCouponSection
                    couponMode={couponMode}
                    setCouponMode={setCouponMode}
                    couponCode={form.couponCode}
                    setCouponCode={(code) => setForm((f) => ({ ...f, couponCode: code }))}
                    customCoupon={customCoupon}
                    setCustomCoupon={setCustomCoupon}
                    availableCoupons={availableCoupons}
                    selectedCoupon={selectedCoupon}
                    setSelectedCoupon={setSelectedCoupon}
                  />
                </div>
              </div>
              <div className="flex gap-3 p-6 border-t border-gray-100">
                <button onClick={() => setModal(false)} className="flex-1 btn-outline py-3">Cancel</button>
                <button onClick={handleSave} className="flex-1 btn-primary py-3 gap-2"><Save size={16}/> {editId ? 'Update' : 'Add'} Product</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
