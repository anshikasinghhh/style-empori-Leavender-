// import React, { useState } from 'react';
// import React, {useState,useEffect} from 'react';
import AdminLayout from './AdminLayout';
import { Plus, Search, Edit2, Trash2, X, Save, Eye } from 'lucide-react';
import { CATEGORIES, formatPrice } from '../../utils/data';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';


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

const EMPTY = { name:'', productCode:'', price:'', originalPrice:'', category:'', description:'', stock:'', material:'', isFeatured:false, isNewArrival:false, isBestSeller:false, isFlashSale:false, isFestival:false, images:[{url:'',alt:''}] };

export default function AdminProducts() {
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
  
const filtered = products.filter(
  p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
);
console.log("Products:", products);
console.log("Filtered:", filtered);
  // console.log("Current Products State:", products);
  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (p) => { setForm({ ...p, price:String(p.price), originalPrice:String(p.originalPrice||''), stock:String(p.stock) }); setEditId(p._id); setModal(true); };
useEffect(() => {
    loadProducts();
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

    if (editId) {

      const res = await api.put(
        `/products/${editId}`,
        form
      );

      toast.success("Product Updated");

    } else {

      const res = await api.post(
        "/products",
        form
      );

      toast.success("Product Added");

    }

    loadProducts();

    setModal(false);

  } catch (err) {

    toast.error(err.response?.data?.message || "Error");

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
    <AdminLayout>
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
              <tr>{['Product','Category','Price','Stock','Tags','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
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
                  <td className="px-4 py-3"><p className="font-bold text-gray-900">{formatPrice(p.price)}</p>{p.originalPrice && <p className="text-xs text-gray-400 line-through">{formatPrice(p.originalPrice)}</p>}</td>
                  <td className="px-4 py-3"><span className={`badge text-xs font-bold ${p.stock < 10 ? 'bg-rose-soft text-rose' : p.stock < 25 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{p.stock} left</span></td>
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
                  <div><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Price (₹) *</label><input type="number" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} className="input-field text-sm" placeholder="9499"/></div>
                  <div><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Original Price (₹)</label><input type="number" value={form.originalPrice} onChange={e => setForm(f=>({...f,originalPrice:e.target.value}))} className="input-field text-sm" placeholder="14999"/></div>
                  <div><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Category</label>
                    <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} className="input-field text-sm">
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                  <div><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Stock Units</label><input type="number" value={form.stock} onChange={e => setForm(f=>({...f,stock:e.target.value}))} className="input-field text-sm" placeholder="50"/></div>
                  <div className="col-span-2"><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Material</label><input value={form.material} onChange={e => setForm(f=>({...f,material:e.target.value}))} className="input-field text-sm" placeholder="Pure Kanjivaram Silk"/></div>
                  <div className="col-span-2"><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label><textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} className="input-field text-sm h-24 resize-none" placeholder="Product description..."/></div>
                  <div className="col-span-2"><label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Product Image *</label>
                    <div className="flex gap-3 items-start">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setForm(f => ({...f, images:[{url:reader.result, alt:f.name}]}));
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="input-field text-sm flex-1" 
                        placeholder="Select image file"
                      />
                      {form.images?.[0]?.url && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-champagne-light shrink-0">
                          <img src={form.images[0].url} alt="Preview" className="w-full h-full object-cover"/>
                        </div>
                      )}
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
    </AdminLayout>
  );
}
