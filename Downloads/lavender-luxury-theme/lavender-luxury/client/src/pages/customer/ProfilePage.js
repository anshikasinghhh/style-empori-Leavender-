import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Edit2, Save, Package, Heart, Star, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../slices/authSlice';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch(); const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passForm, setPassForm] = useState({ current:'', newPass:'', confirm:'' });

  const handleSave = () => { toast.success('Profile updated successfully!'); setEditing(false); };
  const handlePassChange = (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirm) { toast.error('Passwords do not match'); return; }
    if (passForm.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    toast.success('Password changed successfully!');
    setPassForm({ current:'', newPass:'', confirm:'' });
  };

  const STATS = [{ icon:Package, label:'Total Orders', value:'5', link:'/orders' },{ icon:Heart, label:'Wishlist Items', value:'8', link:'/wishlist' },{ icon:Star, label:'Reviews Given', value:'3', link:'#' }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      {/* Header card */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gold-pale/60 mb-6 flex items-center gap-5 flex-wrap">
        <div className="w-20 h-20 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-card shrink-0">
          <span className="text-white text-3xl font-display font-bold">{user?.name?.[0]?.toUpperCase()}</span>
        </div>
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold text-gray-900">{user?.name}</h2>
          <p className="font-body text-gray-500 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="badge bg-primary-100 text-primary border border-primary-200 capitalize">{user?.role}</span>
            <span className="badge bg-emerald-100 text-emerald-700">Verified Member</span>
          </div>
        </div>
        <button onClick={() => { dispatch(logout()); navigate('/'); toast.success('Logged out'); }} className="btn-outline text-sm py-2 gap-2 text-rose border-rose hover:bg-rose hover:text-white"><LogOut size={14}/> Logout</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS.map(s => (
          <Link key={s.label} to={s.link} className="bg-white rounded-2xl p-4 shadow-card border border-gold-pale/60 hover:shadow-hover transition-all text-center group">
            <div className="w-10 h-10 rounded-xl bg-champagne-light/80 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary group-hover:text-white transition-all"><s.icon size={18} className="text-primary group-hover:text-white"/></div>
            <p className="font-body text-xl font-bold text-gray-900">{s.value}</p>
            <p className="font-body text-xs text-gray-500">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-6 gap-1">
        {['profile','security','addresses'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 font-body text-sm font-semibold transition-all border-b-2 -mb-px capitalize ${tab===t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}>
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
            <h3 className="font-display font-bold text-gray-900">Saved Addresses</h3>
            <button className="btn-ghost text-sm py-2 gap-1.5">+ Add New Address</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ label:'Home', name:'Priya Sharma', addr:'42 Lotus Colony, Bandra West, Mumbai, Maharashtra 400050', default:true },{ label:'Office', name:'Priya Sharma', addr:'101 Tech Park, Powai, Mumbai, Maharashtra 400076', default:false }].map((a,i) => (
              <div key={i} className={`p-4 rounded-xl border-2 transition-all ${a.default ? 'border-primary bg-champagne-light/80' : 'border-gray-100 hover:border-primary-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge bg-primary-100 text-primary text-xs font-bold">{a.label}</span>
                  {a.default && <span className="badge bg-emerald-100 text-emerald-700 text-[10px]">Default</span>}
                </div>
                <p className="font-body font-semibold text-gray-900 text-sm">{a.name}</p>
                <p className="font-body text-gray-500 text-xs mt-1 leading-relaxed">{a.addr}</p>
                <div className="flex gap-2 mt-3">
                  <button className="font-body text-xs text-primary hover:underline">Edit</button>
                  <span className="text-gray-200">·</span>
                  <button className="font-body text-xs text-rose hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
