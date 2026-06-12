import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../slices/authSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPass, setShowPass] = useState(false);
  const { loading, error, token } = useSelector(s => s.auth);
  const dispatch = useDispatch(); const navigate = useNavigate();
  useEffect(() => { if (token) navigate('/'); }, [token, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-dark-brand items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">{[...Array(5)].map((_,i) => <div key={i} className="absolute rounded-full border border-white/10" style={{width:`${(i+1)*250}px`,height:`${(i+1)*250}px`,top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>)}</div>
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-premium"><span className="text-white text-3xl font-display font-bold">VE</span></div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Lavender</h1>
          <p className="font-accent text-2xl italic text-gold mb-6">The Style Emporio</p>
          <p className="font-body text-white/60 max-w-xs leading-relaxed text-sm">India's most loved ethnic fashion destination — discover artisan craftsmanship delivered to your door.</p>
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[['500+','Artisans'],['50K+','Customers'],['2000+','Products']].map(([n,l]) => (
              <div key={l} className="bg-white/10 rounded-xl p-3"><p className="font-display text-xl font-bold text-white">{n}</p><p className="font-body text-white/50 text-xs">{l}</p></div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-ivory">
        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-body text-sm mb-8 transition-colors"><ArrowLeft size={16}/> Back to Home</Link>
          <div className="bg-white rounded-3xl p-8 shadow-premium border border-gold-pale/60">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-1">Welcome Back</h2>
              <p className="font-body text-gray-500 text-sm">Sign in to continue your style journey</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); dispatch(loginUser(form)); }} className="space-y-4">
              <div className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/><input type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} className="input-field pl-11" required/></div>
              <div className="relative"><Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type={showPass?'text':'password'} placeholder="Password" value={form.password} onChange={e => setForm(f => ({...f, password:e.target.value}))} className="input-field pl-11 pr-12" required/>
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">{showPass ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
              </div>
              <div className="flex justify-end"><Link to="#" className="font-body text-sm text-primary hover:underline">Forgot password?</Link></div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-base">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Sign In'}
              </button>
              <div className="bg-champagne-light/80 rounded-xl p-4 border border-primary-100 space-y-2">
                <p className="font-body text-xs font-bold text-primary-dark flex items-center gap-1"><Sparkles size={12}/> Demo Accounts</p>
                <button type="button" onClick={() => setForm({ email:'admin@lavender.com', password:'admin123' })} className="w-full text-left text-xs font-body text-gray-700 hover:text-primary transition-colors py-1">👑 Admin: admin@lavender.com / admin123</button>
                <button type="button" onClick={() => setForm({ email:'customer@lavender.com', password:'customer123' })} className="w-full text-left text-xs font-body text-gray-600 hover:text-primary transition-colors py-1">🛍️ Customer: customer@lavender.com / customer123</button>
              </div>
            </form>
            <p className="font-body text-center text-gray-500 text-sm mt-6">New here? <Link to="/register" className="text-primary font-semibold hover:underline">Create an account</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
