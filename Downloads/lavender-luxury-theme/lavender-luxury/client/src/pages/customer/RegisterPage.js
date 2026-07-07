import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, googleLoginUser, clearError } from '../../slices/authSlice';
import toast from 'react-hot-toast';
import registerImage from '../../assets/ChatGPT Image Jun 30, 2026, 02_29_42 PM.png';
import logoImage from '../../assets/logo.jpeg';

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' });
  const [showPass, setShowPass] = useState(false);
  const { loading, error, token } = useSelector(s => s.auth);
  const dispatch = useDispatch(); const navigate = useNavigate();

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId || 'your-google-client-id.apps.googleusercontent.com',
          callback: (response) => {
            dispatch(googleLoginUser(response.credential));
          }
        });
        const btnElem = document.getElementById("realGoogleSignUpButton");
        if (btnElem) {
          window.google.accounts.id.renderButton(btnElem, {
            theme: "outline",
            size: "large",
            width: 350
          });
        }
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        script.addEventListener('load', initGoogle);
      }
    }
  }, [googleClientId, dispatch]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={registerImage}
          alt="Ethnic Fashion"
          className="h-full w-full object-cover "
        />
        <div className="absolute inset-0 bg-black/35"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <div className="w-full max-w-xl text-white text-center translate-x-52">
            <div className="mb-8 mt-4 flex justify-center">
              <div className="mb-1 rounded-full backdrop-blur-xl shadow-[0_0_40px_rgba(255,215,0,0.35)]">
                <img
                  src={logoImage}
                  alt="Logo"
                  className="h-24 w-24 rounded-full"
                />
              </div>
            </div> 

            <h1 className="mb-1 font-display text-5xl font-bold drop-shadow-lg">Join Us Today</h1>

            <p className="mb-8 font-accent text-2xl italic text-rose-100">
              Begin Your Ethnic Journey
            </p>

            <ul className="mx-auto w-full max-w-md space-y-4 text-lg text-center">
              <li>✨ Exclusive member-only offers</li>
              <li>🎁 10% off your first order</li>
              <li>📦 Free delivery on orders ₹999+</li>
              <li>💝 Early access to new collections</li>
              <li>🪡 Support Indian artisans</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center sm:justify-start px-4 sm:pl-12 sm:pr-6 py-6 lg:pl-28 lg:pr-10 lg:py-10">
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} className="w-full max-w-md">
            <Link to="/" className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-gray-100 hover:text-primary font-body text-sm transition-colors"><ArrowLeft size={16}/> Back to Home</Link>
            <div className="rounded-3xl border border-gold-pale/60 bg-white/95 p-6 sm:p-8 shadow-premium backdrop-blur-sm">
              <div className="mb-6 sm:mb-8">
                <h2 className="mb-1 font-display text-2xl sm:text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="font-body text-sm text-gray-500">Join thousands of ethnic fashion lovers</p>
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

                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <span className="relative bg-white/95 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Or continue with</span>
                </div>

                <div className="flex justify-center">
                  <div id="realGoogleSignUpButton" className="w-full"></div>
                </div>
              </form>
              <p className="mt-6 text-center font-body text-sm text-gray-500">Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link></p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

