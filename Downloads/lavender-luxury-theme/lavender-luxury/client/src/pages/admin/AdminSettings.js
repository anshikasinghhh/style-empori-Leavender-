import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Save, Store, Bell, Shield, Palette, Mail, CreditCard, Globe, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const Toggle = ({ value, onChange, label, desc }) => (
  <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-champagne-light/80/50 transition-colors cursor-pointer" onClick={onChange}>
    <div>
      <p className="font-body font-semibold text-gray-800 text-sm">{label}</p>
      {desc && <p className="font-body text-gray-400 text-xs mt-0.5">{desc}</p>}
    </div>
    <div className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ml-4 ${value ? 'bg-primary' : 'bg-gray-200'}`}>
      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm transition-all ${value ? 'right-0.5' : 'left-0.5'}`}/>
    </div>
  </div>
);

export default function AdminSettings() {
  const [store, setStore] = useState({ name:'Lavender', email:'hello@lavender-styleemporio.in', phone:'+91 98765 43210', address:'Fashion District, Bandra, Mumbai 400050', currency:'INR', freeShippingThreshold:999, tagline:'The Style Emporio', metaDesc:'Premium ethnic & traditional fashion', handlingCharge:0 });
  const [payments, setPayments] = useState({ codEnabled:true, razorpayEnabled:true, stripeEnabled:false });
  const [notifs, setNotifs] = useState({ newOrder:true, lowStock:true, customerReview:false, paymentFail:true, dailyReport:false, weeklyReport:true });
  const [brand, setBrand] = useState({ primaryColor:'#4A1068', accentColor:'#C9963C', goldColor:'#B45309' });
  const [cancellationFee, setCancellationFee] = useState(100);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/loyalty-settings');
        if (res.data.success && res.data.settings) {
          setCancellationFee(res.data.settings.cancellationFee ?? 100);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveCancellationFee = async () => {
    try {
      const res = await api.put('/loyalty-settings', { cancellationFee });
      if (res.data.success) {
        toast.success("Cancellation settings saved! ✓");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get('/admin/settings');
        if (data.settings) {
          setStore((prev) => ({ ...prev, ...data.settings }));
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    loadSettings();
  }, []);

  const save = async (section) => {
    try {
      if (section === 'Store') {
        await api.put('/admin/settings', { handlingCharge: store.handlingCharge });
      }
      toast.success(`${section} settings saved! ✓`);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Settings</h1>
        <p className="font-body text-gray-500 text-sm mt-0.5">Manage your store configuration and preferences</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Store Info */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h3 className="font-display font-bold text-gray-900 mb-5 flex items-center gap-2"><Store size={18} className="text-primary"/>Store Information</h3>
          <div className="space-y-4">
            {[['Store Name','name','text','Lavender'],['Email Address','email','email','hello@lavender-styleemporio.in'],['Phone Number','phone','tel','+91 98765 43210'],['Address','address','text','Mumbai, Maharashtra']].map(([l,k,t,p]) => (
              <div key={k}>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">{l}</label>
                <input type={t} value={store[k]} onChange={e => setStore(s=>({...s,[k]:e.target.value}))} className="input-field text-sm" placeholder={p}/>
              </div>
            ))}
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Brand Tagline</label>
              <input value={store.tagline} onChange={e => setStore(s=>({...s,tagline:e.target.value}))} className="input-field text-sm"/>
            </div>
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Free Shipping Threshold (₹)</label>
              <input type="number" value={store.freeShippingThreshold} onChange={e => setStore(s=>({...s,freeShippingThreshold:Number(e.target.value)}))} className="input-field text-sm"/>
            </div>
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Handling Charge (₹)</label>
              <input type="number" value={store.handlingCharge} onChange={e => setStore(s=>({...s,handlingCharge:Number(e.target.value)}))} className="input-field text-sm"/>
            </div>
          </div>
          <button onClick={() => save('Store')} className="w-full btn-primary mt-5 text-sm gap-2 py-3"><Save size={14}/>Save Store Settings</button>
        </div>

        {/* Payments */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h3 className="font-display font-bold text-gray-900 mb-5 flex items-center gap-2"><CreditCard size={18} className="text-primary"/>Payment Settings</h3>
          <div className="space-y-3 mb-5">
            <Toggle value={payments.codEnabled} onChange={() => setPayments(p=>({...p,codEnabled:!p.codEnabled}))} label="Cash on Delivery" desc="Allow customers to pay on delivery"/>
            <Toggle value={payments.razorpayEnabled} onChange={() => setPayments(p=>({...p,razorpayEnabled:!p.razorpayEnabled}))} label="Razorpay" desc="UPI, cards, netbanking & wallets"/>
            <Toggle value={payments.stripeEnabled} onChange={() => setPayments(p=>({...p,stripeEnabled:!p.stripeEnabled}))} label="Stripe" desc="International card payments"/>
          </div>
          <div className="bg-champagne-light/80 rounded-xl p-4 mb-5">
            <p className="font-body text-xs font-bold text-primary mb-2 flex items-center gap-1"><Shield size={12}/>API Keys (set in .env)</p>
            {[['RAZORPAY_KEY_ID','rzp_test_••••••••'],['RAZORPAY_KEY_SECRET','•••••••••••••••'],['STRIPE_SECRET_KEY','sk_test_••••••••']].map(([k,v]) => (
              <div key={k} className="flex justify-between items-center py-1">
                <span className="font-body text-[11px] text-gray-500 font-mono">{k}</span>
                <span className="font-body text-[11px] text-gray-400">{v}</span>
              </div>
            ))}
          </div>
          <button onClick={() => save('Payment')} className="w-full btn-primary text-sm gap-2 py-3"><Save size={14}/>Save Payment Settings</button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h3 className="font-display font-bold text-gray-900 mb-5 flex items-center gap-2"><Bell size={18} className="text-primary"/>Notifications</h3>
          <div className="space-y-3 mb-5">
            <Toggle value={notifs.newOrder}      onChange={() => setNotifs(n=>({...n,newOrder:!n.newOrder}))}           label="New Order Alerts"    desc="Get notified for every new order"/>
            <Toggle value={notifs.lowStock}      onChange={() => setNotifs(n=>({...n,lowStock:!n.lowStock}))}           label="Low Stock Alerts"    desc="Alert when stock falls below 10"/>
            <Toggle value={notifs.customerReview}onChange={() => setNotifs(n=>({...n,customerReview:!n.customerReview}))}label="Customer Reviews"    desc="New product review notifications"/>
            <Toggle value={notifs.paymentFail}   onChange={() => setNotifs(n=>({...n,paymentFail:!n.paymentFail}))}     label="Payment Failures"    desc="Alert on failed transactions"/>
            <Toggle value={notifs.dailyReport}   onChange={() => setNotifs(n=>({...n,dailyReport:!n.dailyReport}))}     label="Daily Sales Report"  desc="Receive daily summary email"/>
            <Toggle value={notifs.weeklyReport}  onChange={() => setNotifs(n=>({...n,weeklyReport:!n.weeklyReport}))}   label="Weekly Analytics"    desc="Weekly performance report"/>
          </div>
          <button onClick={() => save('Notification')} className="w-full btn-primary text-sm gap-2 py-3"><Save size={14}/>Save Notification Preferences</button>
        </div>

        {/* Brand & Theme */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50">
          <h3 className="font-display font-bold text-gray-900 mb-5 flex items-center gap-2"><Palette size={18} className="text-primary"/>Brand & Theme</h3>
          <div className="space-y-4 mb-5">
            {[['Primary Color (Violet)','primaryColor'],['Accent Color (Rose)','accentColor'],['Gold Color','goldColor']].map(([l,k]) => (
              <div key={k}>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">{l}</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={brand[k]} onChange={e => setBrand(b=>({...b,[k]:e.target.value}))} className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer bg-transparent p-0.5"/>
                  <input value={brand[k]} onChange={e => setBrand(b=>({...b,[k]:e.target.value}))} className="flex-1 input-field text-sm font-mono"/>
                </div>
              </div>
            ))}
            <div>
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">SEO Meta Description</label>
              <textarea value={store.metaDesc} onChange={e => setStore(s=>({...s,metaDesc:e.target.value}))} className="input-field text-sm h-20 resize-none" placeholder="SEO description..."/>
            </div>
          </div>
          <div className="flex gap-2 p-4 bg-champagne-light/80 rounded-xl mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background:`linear-gradient(135deg, ${brand.primaryColor}, ${brand.accentColor})` }}>VE</div>
            <div><p className="font-body text-xs font-bold text-gray-800">Preview</p><p className="font-body text-[11px] text-gray-500">Brand gradient looks like this ↑</p></div>
          </div>
          <button onClick={() => save('Brand')} className="w-full btn-primary text-sm gap-2 py-3"><Save size={14}/>Save Brand Settings</button>
        </div>

        {/* Order Cancellation Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-50 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Shield size={18} className="text-primary"/> Order Cancellation Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Shipped Order Cancellation Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-body text-sm font-semibold">₹</span>
                  <input 
                    type="number" 
                    value={cancellationFee} 
                    onChange={e => setCancellationFee(Number(e.target.value))} 
                    className="input-field text-sm pl-8" 
                    placeholder="100"
                  />
                </div>
                <p className="font-body text-gray-400 text-xs mt-2 flex items-start gap-1">
                  <Info size={12} className="shrink-0 mt-0.5" />
                  This fee is charged if a shipped order gets cancelled. Placed, confirmed, or processing orders can be cancelled for free.
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleSaveCancellationFee} 
            className="w-full btn-primary mt-6 text-sm gap-2 py-3"
          >
            <Save size={14}/> Save Cancellation Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
