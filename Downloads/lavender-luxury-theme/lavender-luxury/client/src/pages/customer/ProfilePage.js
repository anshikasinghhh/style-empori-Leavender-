import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Edit2, Save, Package, Heart, Star, LogOut, Plus, RefreshCw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../slices/authSlice';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch(); const navigate = useNavigate();
  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passForm, setPassForm] = useState({ current:'', newPass:'', confirm:'' });
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, reviews: 0 });
  const [addressForm, setAddressForm] = useState({ fullName: '', address: '', city: '', state: '', pincode: '', phone: '' });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadAddresses();
  }, [location.key]); // Refresh when navigating to this page

  const loadStats = async () => {
    setLoading(true);
    try {
      console.log('Loading stats...');
      console.log('User:', user);
      
      let ordersCount = 0;
      let wishlistCount = 0;
      let reviewsCount = 0;
      
      try {
        const ordersRes = await api.get('/orders/my-orders');
        console.log('Orders response:', ordersRes.data);
        ordersCount = ordersRes.data.orders?.length || 0;
      } catch (ordersErr) {
        console.error('Error loading orders:', ordersErr);
        console.error('Orders error response:', ordersErr.response?.data);
      }
      
      try {
        const wishlistRes = await api.get('/wishlist');
        console.log('Wishlist response:', wishlistRes.data);
        wishlistCount = wishlistRes.data.wishlist?.products?.length || 0;
      } catch (wishlistErr) {
        console.error('Error loading wishlist:', wishlistErr);
        console.error('Wishlist error response:', wishlistErr.response?.data);
      }
      
      try {
        const reviewsRes = await api.get('/reviews/my');
        console.log('Reviews response:', reviewsRes.data);
        reviewsCount = reviewsRes.data.reviews?.length || 0;
      } catch (reviewsErr) {
        console.error('Error loading reviews:', reviewsErr);
        console.error('Reviews error response:', reviewsErr.response?.data);
      }
      
      console.log('Final Stats:', { orders: ordersCount, wishlist: wishlistCount, reviews: reviewsCount });
      setStats({ orders: ordersCount, wishlist: wishlistCount, reviews: reviewsCount });
    } catch (err) {
      console.error('Error loading stats:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const res = await api.get('/auth/addresses');
      setSavedAddresses(res.data.addresses || []);
    } catch (err) {
      console.error('Error loading addresses:', err);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/auth/profile', { name: form.name, phone: form.phone });
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handlePassChange = (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirm) { toast.error('Passwords do not match'); return; }
    if (passForm.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    toast.success('Password changed successfully!');
    setPassForm({ current:'', newPass:'', confirm:'' });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/addresses', addressForm);
      toast.success('Address added successfully!');
      setAddressForm({ fullName: '', address: '', city: '', state: '', pincode: '', phone: '' });
      loadAddresses();
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await api.delete(`/auth/addresses/${addressId}`);
      toast.success('Address deleted successfully!');
      loadAddresses();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const STATS = [{ icon:Package, label:'Total Orders', value:stats.orders, link:'/orders' },{ icon:Heart, label:'Wishlist Items', value:stats.wishlist, link:'/wishlist' },{ icon:Star, label:'Reviews Given', value:stats.reviews, link:'#' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Account</h1>

      {/* Header card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-gold-pale/60 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-card shrink-0">
          <span className="text-white text-2xl sm:text-3xl font-display font-bold">{user?.name?.[0]?.toUpperCase()}</span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900">{user?.name}</h2>
          <p className="font-body text-gray-500 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1.5 justify-center sm:justify-start">
            <span className="badge bg-primary-100 text-primary border border-primary-200 capitalize">{user?.role}</span>
            <span className="badge bg-emerald-100 text-emerald-700">Verified Member</span>
          </div>
        </div>
        <button onClick={() => { dispatch(logout()); navigate('/'); toast.success('Logged out'); }} className="btn-outline text-sm py-2 gap-2 text-rose border-rose hover:bg-rose hover:text-white"><LogOut size={14}/> Logout</button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-gold-pale/60 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-gray-900">Account Overview</h3>
          <button onClick={loadStats} disabled={loading} className="btn-ghost text-sm py-1.5 gap-1.5">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/> Refresh
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {STATS.map(s => (
            <Link key={s.label} to={s.link} className="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-champagne-light/80 transition-all text-center group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-champagne-light/80 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary group-hover:text-white transition-all"><s.icon size={16} className="text-primary group-hover:text-white sm:hidden"/><s.icon size={18} className="text-primary group-hover:text-white hidden sm:block"/></div>
              <p className="font-body text-lg sm:text-xl font-bold text-gray-900">{loading ? '...' : s.value}</p>
              <p className="font-body text-[10px] sm:text-xs text-gray-500">{s.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-6 gap-1 overflow-x-auto">
        {['profile','security','addresses'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 sm:px-5 py-3 font-body text-sm font-semibold transition-all border-b-2 -mb-px capitalize whitespace-nowrap ${tab===t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}>
            {t === 'addresses' ? 'Saved Addresses' : t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900">Personal Information</h3>
            <button onClick={() => editing ? handleSave() : setEditing(true)} className={editing ? 'btn-primary text-sm py-2 gap-2' : 'btn-ghost text-sm py-2 gap-2'}>
              {editing ? <><Save size={14}/> Save Changes</> : <><Edit2 size={14}/> Edit Profile</>}
            </button>
          </div>
          <div className="space-y-4">
            {[{icon:User,label:'Full Name',key:'name',type:'text'},{icon:Mail,label:'Email Address',key:'email',type:'email',disabled:true},{icon:Phone,label:'Phone Number',key:'phone',type:'tel'}].map(({icon:Icon,label,key,type,disabled}) => (
              <div key={key}>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><Icon size={13} className="text-primary"/>{label}</label>
                <input type={type} value={key==='email' ? user?.email : form[key] || ''}
                  onChange={e => setForm(f => ({...f,[key]:e.target.value}))}
                  disabled={disabled || !editing}
                  className={`input-field ${(disabled||!editing) ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}`}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security tab */}
      {tab === 'security' && (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60">
          <h3 className="font-display font-bold text-gray-900 mb-5">Change Password</h3>
          <form onSubmit={handlePassChange} className="space-y-4 max-w-md">
            {[{k:'current',l:'Current Password'},{k:'newPass',l:'New Password'},{k:'confirm',l:'Confirm New Password'}].map(({k,l}) => (
              <div key={k}>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block"><Lock size={13} className="inline mr-1.5 text-primary"/>{l}</label>
                <input type="password" value={passForm[k]} onChange={e => setPassForm(f => ({...f,[k]:e.target.value}))} className="input-field" placeholder="••••••••" required minLength={6}/>
              </div>
            ))}
            <button type="submit" className="btn-primary w-full py-3.5 gap-2"><Lock size={16}/> Update Password</button>
          </form>
        </div>
      )}

      {/* Addresses tab */}
      {tab === 'addresses' && (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900">Add New Address</h3>
          </div>
          <form onSubmit={handleAddAddress} className="space-y-4 mb-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block"><User size={13} className="inline mr-1.5 text-primary"/>Full Name</label>
                <input type="text" value={addressForm.fullName} onChange={e => setAddressForm(f => ({...f, fullName: e.target.value}))} className="input-field" placeholder="Enter full name" required />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block"><Phone size={13} className="inline mr-1.5 text-primary"/>Phone Number</label>
                <input type="tel" value={addressForm.phone} onChange={e => setAddressForm(f => ({...f, phone: e.target.value}))} className="input-field" placeholder="Enter phone number" required />
              </div>
            </div>
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block"><MapPin size={13} className="inline mr-1.5 text-primary"/>Address</label>
              <textarea value={addressForm.address} onChange={e => setAddressForm(f => ({...f, address: e.target.value}))} className="input-field" placeholder="Enter street address, landmark, etc." rows="3" required />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">City</label>
                <input type="text" value={addressForm.city} onChange={e => setAddressForm(f => ({...f, city: e.target.value}))} className="input-field" placeholder="City" required />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">State</label>
                <input type="text" value={addressForm.state} onChange={e => setAddressForm(f => ({...f, state: e.target.value}))} className="input-field" placeholder="State" required />
              </div>
              <div>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Pincode</label>
                <input type="text" value={addressForm.pincode} onChange={e => setAddressForm(f => ({...f, pincode: e.target.value}))} className="input-field" placeholder="Pincode" required />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-3.5 gap-2"><Plus size={16}/> Add Address</button>
          </form>

          {savedAddresses.length > 0 && (
            <>
              <div className="border-t border-gray-100 pt-5 mb-5">
                <h3 className="font-display font-bold text-gray-900">Saved Addresses</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {savedAddresses.map((a) => (
                  <div key={a._id} className="p-4 rounded-xl border-2 border-gray-100 hover:border-primary-200 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge bg-primary-100 text-primary text-xs font-bold">{a.label || 'Address'}</span>
                    </div>
                    <p className="font-body font-semibold text-gray-900 text-sm">{a.fullName}</p>
                    <p className="font-body text-gray-500 text-xs mt-1 leading-relaxed">{a.address}, {a.city}, {a.state} - {a.pincode}</p>
                    <p className="font-body text-gray-500 text-xs mt-1">Phone: {a.phone}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleDeleteAddress(a._id)} className="font-body text-xs text-rose hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
