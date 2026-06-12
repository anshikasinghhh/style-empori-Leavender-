import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../slices/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' });
  const [showPass, setShowPass] = useState(false);
  const { loading, error, token } = useSelector(s => s.auth);
  const dispatch = useDispatch(); const navigate = useNavigate();
  useEffect(() => { if (token) navigate('/'); }, [token, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-rose-900 via-primary-dark to-plum items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">{[...Array(5)].map((_,i) => <div key={i} className="absolute rounded-full border border-white/10" style={{width:`${(i+1)*250}px`,height:`${(i+1)*250}px`,top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>)}</div>
        <div className="relative text-center text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6"><span className="text-3xl font-display font-bold">VE</span></div>
          <h1 className="font-display text-4xl font-bold mb-3">Join Us Today</h1>
          <p className="font-accent text-xl italic text-rose-300 mb-8">Begin Your Ethnic Journey</p>
          <ul className="font-body text-white/70 space-y-3 text-sm text-left max-w-xs mx-auto">
            {['✨ Exclusive member-only offers','🎁 10% off your first order','📦 Free delivery on orders ₹999+','💝 Early access to new collections','🪡 Support Indian artisans'].map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-ivory">
        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-body text-sm mb-8 transition-colors"><ArrowLeft size={16}/> Back to Home</Link>
          <div className="bg-white rounded-3xl p-8 shadow-premium border border-gold-pale/60">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-1">Create Account</h2>
              <p className="font-body text-gray-500 text-sm">Join thousands of ethnic fashion lovers</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); if(form.password.length < 6){ toast.error('Password min 6 chars'); return; } dispatch(registerUser(form)); }} className="space-y-4">
              {[{icon:User,key:'name',type:'text',placeholder:'Full Name',required:true},{icon:Mail,key:'email',type:'email',placeholder:'Email Address',required:true},{icon:Phone,key:'phone',type:'tel',placeholder:'Phone Number (optional)',required:false}].map(({icon:Icon,key,type,placeholder,required}) => (
                <div key={key} className="relative"><Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm(f => ({...f,[key]:e.target.value}))} className="input-field pl-11" required={required}/>
                </div>
              ))}
              <div className="relative"><Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type={showPass?'text':'password'} placeholder="Password (min 6 characters)" value={form.password} onChange={e => setForm(f => ({...f, password:e.target.value}))} className="input-field pl-11 pr-12" required minLength={6}/>
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">{showPass ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
              </div>
              <p className="font-body text-xs text-gray-400">By creating an account you agree to our <Link to="#" className="text-primary hover:underline">Terms</Link> & <Link to="#" className="text-primary hover:underline">Privacy Policy</Link></p>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-base">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Create Account'}
              </button>
            </form>
            <p className="font-body text-center text-gray-500 text-sm mt-6">Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
