import React, { useState, useMemo, useEffect} from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { ProductCard, SkeletonCard, SectionHeader, EmptyState } from '../../components/common/LoadingSpinner';
import { PRODUCTS, CATEGORIES } from '../../utils/data';
import { ShoppingBag } from 'lucide-react';
import api from '../../utils/api';

const SORT_OPTIONS = [
  { value:'newest', label:'Newest First' },
  { value:'price_asc', label:'Price: Low to High' },
  { value:'price_desc', label:'Price: High to Low' },
  { value:'popular', label:'Most Popular' },
  { value:'rating', label:'Top Rated' },
];

function FilterSidebar({ filters, setFilters, onClose, mobile }) {
  return (
    <div className={`space-y-5 ${!mobile && 'sticky top-28'}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-gray-900 flex items-center gap-2"><SlidersHorizontal size={16} className="text-primary"/> Filters</h3>
        {mobile && <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18}/></button>}
      </div>
      {/* Category */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gold-pale/60">
        <p className="font-body font-semibold text-gray-800 text-sm mb-3">Category</p>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat._id} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={filters.categories?.includes(cat.slug)||false}
                onChange={e => setFilters(f => ({ ...f, categories: e.target.checked ? [...(f.categories||[]),cat.slug] : (f.categories||[]).filter(c=>c!==cat.slug) }))}
                className="w-4 h-4 rounded border-gray-200 text-primary focus:ring-primary/20 cursor-pointer"/>
              <span className="font-body text-sm text-gray-600 group-hover:text-primary transition-colors">{cat.icon} {cat.name}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Price */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gold-pale/60">
        <p className="font-body font-semibold text-gray-800 text-sm mb-3">Price Range</p>
        <div className="space-y-2">
          {[{label:'Under ₹1,000',min:0,max:1000},{label:'₹1,000 – ₹5,000',min:1000,max:5000},{label:'₹5,000 – ₹15,000',min:5000,max:15000},{label:'₹15,000 – ₹30,000',min:15000,max:30000},{label:'Above ₹30,000',min:30000,max:Infinity}].map(r => (
            <label key={r.label} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="radio" name="price" checked={filters.minPrice===r.min&&filters.maxPrice===r.max}
                onChange={() => setFilters(f => ({...f, minPrice:r.min, maxPrice:r.max}))}
                className="w-4 h-4 border-gray-200 text-primary focus:ring-primary/20 cursor-pointer"/>
              <span className="font-body text-sm text-gray-600 group-hover:text-primary transition-colors">{r.label}</span>
            </label>
          ))}
          {(filters.minPrice||filters.maxPrice) && <button onClick={() => setFilters(f => ({...f,minPrice:null,maxPrice:null}))} className="font-body text-xs text-primary hover:underline mt-1">Clear</button>}
        </div>
      </div>
      {/* Occasion */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gold-pale/60">
        <p className="font-body font-semibold text-gray-800 text-sm mb-3">Occasion</p>
        <div className="flex flex-wrap gap-2">
          {['Wedding','Bridal','Festival','Casual','Office','Party','Garba'].map(occ => (
            <button key={occ} onClick={() => setFilters(f => ({ ...f, occasions: f.occasions?.includes(occ) ? f.occasions.filter(o=>o!==occ) : [...(f.occasions||[]),occ] }))}
              className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${filters.occasions?.includes(occ) ? 'bg-primary text-white shadow-sm' : 'bg-champagne-light/80 text-gray-600 hover:bg-primary-100'}`}>{occ}</button>
          ))}
        </div>
      </div>
      <button onClick={() => setFilters({})} className="w-full btn-outline text-sm py-2.5">Clear All Filters</button>
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search')||'');
  const [mobileFilter, setMobileFilter] = useState(false);
useEffect(() => {
  const loadProducts = async () => {
    try {
      const res = await api.get('/products');

      console.log("URL Category:", searchParams.get("category"));
      console.log("Mongo Products:", res.data.products);

      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  loadProducts();
}, [searchParams]);
//   loadProducts();
// }, []);

// const loadProducts = async () => {
//   try {
//     const res = await api.get('/products');

//     if (res.data.success) {
//       setProducts(res.data.products);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };
  const filtered = useMemo(() => {
    
    let p = [...products];
    console.log("Before Filter:", p);
console.log("Category Param:", searchParams.get("category"));
    if (searchParams.get('isFeatured')) p = p.filter(x => x.isFeatured);
    if (searchParams.get('isNewArrival')) p = p.filter(x => x.isNewArrival);
    if (searchParams.get('isBestSeller')) p = p.filter(x => x.isBestSeller);
    if (searchParams.get('isFlashSale')) p = p.filter(x => x.isFlashSale);
    if (searchParams.get('isFestival')) p = p.filter(x => x.isFestival);
    if (searchParams.get('category')) {
  const category = searchParams.get('category').toLowerCase();

  p = p.filter(
    x =>
      typeof x.category === "string" &&
      x.category.toLowerCase() === category
  );
}
    // if (searchParams.get('category')) p = p.filter(x => x.category && x.category.toLowerCase() === searchParams.get('category').toLowerCase());
    // if (searchParams.get('subcategory')) p = p.filter(x => x.category?.slug === searchParams.get('subcategory'));
    // if (filters.categories?.length) p = p.filter(x => filters.categories.includes(x.category?.slug));
    if (filters.categories?.length)
  p = p.filter(
    x =>
      x.category &&
      filters.categories.includes(x.category.toLowerCase())
  );
    if (filters.minPrice!=null) p = p.filter(x => x.price >= filters.minPrice);
    if (filters.maxPrice!=null && filters.maxPrice!==Infinity) p = p.filter(x => x.price <= filters.maxPrice);
    if (filters.occasions?.length) p = p.filter(x => x.occasion?.some(o => filters.occasions.includes(o)));
    if (search) p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.tags?.some(t => t.includes(search.toLowerCase())));
    if (sort==='price_asc') p.sort((a,b) => a.price-b.price);
    else if (sort==='price_desc') p.sort((a,b) => b.price-a.price);
    else if (sort==='popular') p.sort((a,b) => b.sold-a.sold);
    else if (sort==='rating') p.sort((a,b) => b.ratings-a.ratings);
    return p;
  }, [products, searchParams, filters, sort, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <SectionHeader title="Our Collections" subtitle="Explore ethnic fashion"/>
      <div className="flex items-center justify-between mb-5 lg:hidden">
        <button onClick={() => setMobileFilter(true)} className="btn-ghost text-sm py-2.5 gap-2"><Filter size={15}/>Filters</button>
        <select value={sort} onChange={e => setSort(e.target.value)} className="input-field w-auto text-sm py-2.5 px-4">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {mobileFilter && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileFilter(false)}>
          <motion.div initial={{ x:'-100%' }} animate={{ x:0 }} transition={{ type:'spring', damping:22 }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-ivory p-5 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setMobileFilter(false)} mobile/>
          </motion.div>
        </div>
      )}
      <div className="flex gap-8">
        <div className="hidden lg:block w-64 shrink-0"><FilterSidebar filters={filters} setFilters={setFilters}/></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1"><Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 input-field text-sm py-2.5"/>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <span className="font-body text-sm text-gray-400 whitespace-nowrap">{filtered.length} products</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="input-field w-auto text-sm py-2.5">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No products found" description="Try adjusting your filters or search query"
              action={<button onClick={() => { setFilters({}); setSearch(''); }} className="btn-primary">Clear Filters</button>}/>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {filtered.map((p,i) => <ProductCard key={p._id} product={p} index={i}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
