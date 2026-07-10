// import React, { useState } from 'react';
// import React, {useState,useEffect} from 'react';
import AdminLayout from './AdminLayout';
import { Plus, Search, Edit2, Trash2, X, Save, Tag } from 'lucide-react';
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

const EMPTY = { name:'', productCode:'', mrp:'', price:'', originalPrice:'', category:'', description:'', stock:'', material:'', sizes:[], colors:[], variants:[], isFeatured:false, isNewArrival:false, isBestSeller:false, isFlashSale:false, isFestival:false, images:[{url:'',alt:''}], couponCode:'' };

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
  const [selectedColor, setSelectedColor] = useState("");
  const [customColor, setCustomColor] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [customSize, setCustomSize] = useState("");

  // Variant builder state
  const [variantSize, setVariantSize] = useState("");
  const [variantColor, setVariantColor] = useState("");
  const [variantStock, setVariantStock] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  
  const uploadImages = async (files) => {
    try {
      toast.loading('Uploading image(s)...', { id: 'upload' });
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      const res = await api.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const uploaded = (res.data.images || []).map(i => ({ url: i.url, alt: '' }));
      setForm(f => ({ ...f, images: [...(f.images || []), ...uploaded] }));
      toast.success('Upload complete', { id: 'upload' });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed', { id: 'upload' });
    }
  };
const [availableCoupons, setAvailableCoupons] = useState([]);
const [couponMode, setCouponMode] = useState('none');
const [customCoupon, setCustomCoupon] = useState(EMPTY_CUSTOM_COUPON);

const loadAvailableCoupons = async () => {
  try {
    const res = await api.get('/coupons/available');
    setAvailableCoupons(res.data.coupons || []);
  } catch (err) {
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
    setModal(true);
  };
  const openEdit = (p) => {
    // Normalize product shape before editing to avoid runtime errors
    setForm({
      ...p,
      mrp: String(p.mrp || ''),
      price: String(p.price || ''),
      originalPrice: String(p.originalPrice || ''),
      stock: String(p.stock || ''),
      category: typeof p.category === 'object' && p.category !== null ? (p.category.name || '') : (p.category || ''),
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      colors: Array.isArray(p.colors) ? p.colors : [],
      images: Array.isArray(p.images) && p.images.length ? p.images : [{ url: '', alt: '' }],
      variants: Array.isArray(p.variants) ? p.variants : [],
      couponCode: p.couponCode || ''
    });
    setEditId(p._id);
    if (p.couponCode && Array.isArray(availableCoupons) && availableCoupons.some(c => c.code === p.couponCode)) {
      setCouponMode(p.couponCode);
    } else if (p.couponCode) {
      setCouponMode('custom');
      setCustomCoupon({ ...EMPTY_CUSTOM_COUPON, code: p.couponCode });
    } else {
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

    const payload = { ...form, couponCode: resolvedCouponCode };

    if (editId) {
      await api.put(`/products/${editId}`, payload);
      toast.success('Product Updated');
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
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-gray-900">Products</h1><p className="font-body text-gray-500 text-sm mt-0.5">{products.length} products in store</p></div>
        <button onClick={openAdd} className="btn-primary text-sm gap-2 py-2.5"><Plus size={16}/> Add Product</button>
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
                  <td className="px-4 py-3"><span className={`badge text-xs font-bold ${p.stock < 10 ? 'bg-rose-soft text-rose' : p.stock < 25 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{p.stock} left</span></td>
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
                      {CATEGORIES.map(c => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                  <div><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Stock Units</label><input type="number" value={form.stock} onChange={e => setForm(f=>({...f,stock:e.target.value}))} className="input-field text-sm" placeholder="50"/></div>
                  <div className="col-span-2">

<label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
Sizes
</label>

<div className="flex gap-2">

<select
value={selectedSize}
onChange={(e)=>setSelectedSize(e.target.value)}
className="input-field flex-1"
>

<option value="">Select Size</option>

{SIZE_OPTIONS.map(size=>(

<option
key={size}
value={size}
>
{size}
</option>

))}

</select>

<button
type="button"
onClick={()=>{

if(!selectedSize) return;

if(form.sizes.some(s=>s.size===selectedSize))
return;

setForm(f=>({

...f,

sizes:[
...f.sizes,
{
size:selectedSize,
stock:Number(f.stock || 0)
}
]

}));

setSelectedSize("");

}}
className="btn-primary"
>

Add

</button>

</div>

<div className="flex gap-2 mt-3">

<input
value={customSize}
onChange={(e)=>setCustomSize(e.target.value)}
placeholder="Custom Size"
className="input-field flex-1"
/>

<button
type="button"
onClick={()=>{

if(!customSize) return;

if(form.sizes.some(s=>s.size===customSize))
return;

setForm(f=>({

...f,

sizes:[
...f.sizes,
{
size:customSize,
stock:Number(f.stock || 0)
}
]

}));

setCustomSize("");

}}
className="btn-outline"
>

Add Custom

</button>

</div>

</div>
<div className="flex flex-wrap gap-2 mt-3">

{form.sizes.map((size,index)=>(

<div
key={index}
className="px-3 py-1 bg-primary text-white rounded-full flex items-center gap-2"
>

{size.size}

<button
type="button"
onClick={()=>{

setForm(f=>({

...f,

sizes:f.sizes.filter((_,i)=>i!==index)

}));

}}
>

✕

</button>

</div>

))}

</div>
                  <div className="col-span-2">

<label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
Colors
</label>

<div className="flex gap-2">

<select
value={selectedColor}
onChange={(e)=>setSelectedColor(e.target.value)}
className="input-field flex-1"
>

<option value="">Select Color</option>

{COLOR_OPTIONS.map(color=>(

<option key={color}>
{color}
</option>

))}

</select>

<button
type="button"
onClick={()=>{

if(!selectedColor) return;

if(form.colors.some(c=>c.name===selectedColor))
return;

setForm(f=>({

...f,

colors:[
...f.colors,
{
name:selectedColor,
hex:""
}
]

}));

setSelectedColor("");

}}
className="btn-primary"
>

Add

</button>

</div>

<div className="flex gap-2 mt-3">

<input
value={customColor}
onChange={(e)=>setCustomColor(e.target.value)}
placeholder="Custom Color"
className="input-field flex-1"
/>

<button
type="button"
onClick={()=>{

if(!customColor) return;

setForm(f=>({

...f,

colors:[
...f.colors,
{
name:customColor,
hex:""
}
]

}));

setCustomColor("");

}}
className="btn-outline"
>

Add Custom

</button>

</div>

</div>
<div className="flex flex-wrap gap-2 mt-3">

{form.colors.map((color,index)=>(

<div
key={index}
className="px-3 py-1 bg-primary text-white rounded-full flex items-center gap-2"
>

{color.name}

<button
type="button"
onClick={()=>{

setForm(f=>({

...f,

colors:f.colors.filter((_,i)=>i!==index)

}));

}}
>

✕

</button>

</div>

))}

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

                  {/* Variants builder */}
                  <div className="col-span-2 mt-4">
                    <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Variants (Size / Color / Stock)</label>
                    <div className="grid grid-cols-3 gap-2 items-end">
                      <select value={variantSize} onChange={e=>setVariantSize(e.target.value)} className="input-field">
                        <option value="">Select size</option>
                        {[...new Set([...SIZE_OPTIONS, ...form.sizes.map(s=>s.size)])].map(s=> <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select value={variantColor} onChange={e=>setVariantColor(e.target.value)} className="input-field">
                        <option value="">Select color</option>
                        {[...new Set([...COLOR_OPTIONS, ...form.colors.map(c=>c.name)])].map(c=> <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input type="number" value={variantStock} onChange={e=>setVariantStock(Number(e.target.value))} className="input-field" placeholder="Stock" />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button type="button" onClick={()=>{
                        if(!variantSize || !variantColor) { toast.error('Select size and color'); return; }
                        // prevent duplicates
                        if(form.variants.some(v=>v.size===variantSize && v.color?.name===variantColor)) { toast.error('Variant exists'); return; }
                        setForm(f=>({...f, variants:[...f.variants, { size: variantSize, color:{ name: variantColor, hex: '' }, stock: Number(variantStock || 0) }]}));
                        setVariantSize(''); setVariantColor(''); setVariantStock(0);
                      }} className="btn-primary">Add Variant</button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.variants.map((v, i)=> (
                        <div key={i} className="px-3 py-2 bg-gray-50 rounded-lg flex items-center gap-3">
                          <div className="text-xs"><strong>{v.size}</strong> / {v.color?.name} — <span className="font-mono">{v.stock}</span></div>
                          <div className="flex gap-1">
                            <button type="button" onClick={()=>{
                              setForm(f=>({...f, variants: f.variants.filter((_,idx)=>idx!==i)}));
                            }} className="text-rose">Remove</button>
                          </div>
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
