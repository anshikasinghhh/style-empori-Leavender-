import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Sparkles, X, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, googleLoginUser, clearError } from '../../slices/authSlice';
import toast from 'react-hot-toast';
import loginImage from '../../assets/login2.png';
import logoImage from '../../assets/logo.jpeg';

export default function LoginPage() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPass, setShowPass] = useState(false);
  const { loading, error, token } = useSelector(s => s.auth);
  const dispatch = useDispatch(); const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // Mock Google Modal states
  const [showMockGoogle, setShowMockGoogle] = useState(false);
  const [customMockEmail, setCustomMockEmail] = useState('');
  const [customMockName, setCustomMockName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const isRealGoogleConfigured = googleClientId && googleClientId !== 'your-google-client-id.apps.googleusercontent.com';

  useEffect(() => {
    if (token) navigate(redirectTo);
  }, [token, navigate, redirectTo]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (!isRealGoogleConfigured) return;

    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            dispatch(googleLoginUser(response.credential));
          }
        });
        const btnElem = document.getElementById("realGoogleSignInButton");
        if (btnElem) {
          window.google.accounts.id.renderButton(btnElem, {
            theme: "outline",
            size: "large",
            width: btnElem.offsetWidth || 350
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
  }, [isRealGoogleConfigured, googleClientId, dispatch]);

  const handleMockLogin = (email, name) => {
    const mockPayload = {
      email,
      name,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };
    const base64 = btoa(unescape(encodeURIComponent(JSON.stringify(mockPayload))));
    dispatch(googleLoginUser(`mock-google-token-${base64}`));
    setShowMockGoogle(false);
  };

  const handleCustomMockSubmit = (e) => {
    e.preventDefault();
    if (!customMockEmail || !customMockName) {
      toast.error('Please enter name and email');
      return;
    }
    handleMockLogin(customMockEmail, customMockName);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={loginImage}
          alt="Ethnic Fashion"
          className="h-full w-full object-cover "
        />
        <div className="absolute inset-0 bg-black/35"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden lg:flex w-1/2 items-center justify-center pl-40 pr-8">
          <div className="flex w-full max-w-xl flex-col items-center text-center text-white translate-x-60">
            <div className="mb-6">
              <div className="mb-2 rounded-full backdrop-blur-xl shadow-[0_0_40px_rgba(255,215,0,0.35)]">
                <img
                  src={logoImage}
                  className="h-24 w-24 rounded-full"
                  alt="Vastra Elegance Logo"
                />
              </div>
            </div>

            <h1 className="mb-3 font-display text-5xl font-bold">Join Us Today</h1>

            <p className="mb-10 font-accent text-2xl italic text-rose-100">
              Begin Your Ethnic Journey
            </p>

            <ul className="w-full max-w-md space-y-4 text-lg">
              <li>✨ Exclusive member-only offers</li>
              <li>🎁 10% off your first order</li>
              <li>📦 Free delivery on orders ₹999+</li>
              <li>💝 Early access to new collections</li>
              <li>🪡 Support Indian artisans</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-8 lg:px-10 lg:py-10">
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} className="w-full max-w-md">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-gray-100 hover:text-primary font-body text-sm transition-colors"><ArrowLeft size={16}/> Back to Home</Link>
            <div className="rounded-3xl border border-gold-pale/60 bg-white/95 p-8 shadow-premium backdrop-blur-sm">
              <div className="mb-8">
                <h2 className="mb-1 font-display text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="font-body text-sm text-gray-500">Sign in to continue your style journey</p>
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

                <div className="relative my-5 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <span className="relative bg-white/95 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Or continue with</span>
                </div>

                {isRealGoogleConfigured ? (
                  <div className="flex justify-center">
                    <div id="realGoogleSignInButton" className="w-full"></div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMockGoogle(true)}
                    className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 font-body text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-55 active:bg-gray-100"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                )}

                <div className="rounded-xl border border-primary-100 bg-champagne-light/80 p-4 space-y-2">
                  <p className="flex items-center gap-1 font-body text-xs font-bold text-primary-dark"><Sparkles size={12}/> Demo Accounts</p>
                  <button type="button" onClick={() => setForm({ email:'admin@vastra.com', password:'admin123' })} className="w-full py-1 text-left text-xs font-body text-gray-700 transition-colors hover:text-primary">👑 Admin: admin@vastra.com / admin123</button>
                  <button type="button" onClick={() => setForm({ email:'customer@vastra.com', password:'customer123' })} className="w-full py-1 text-left text-xs font-body text-gray-600 transition-colors hover:text-primary">🛍️ Customer: customer@vastra.com / customer123</button>
                </div>
              </form>
              <p className="mt-6 text-center font-body text-sm text-gray-500">New here? <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link></p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Mock Google Selector Modal */}
      <AnimatePresence>
        {showMockGoogle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMockGoogle(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100"
            >
              <button
                onClick={() => setShowMockGoogle(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>

              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900">Sign in with Google</h3>
                <p className="font-body text-xs text-gray-500 mt-1">Choose a Google account to continue to Vastra Elegance</p>
              </div>

              {!isCustomMode ? (
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleMockLogin('anshikasingh@gmail.com', 'Anshika Singh')}
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-left transition hover:bg-gray-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-sm">AS</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Anshika Singh</p>
                      <p className="text-[10px] text-gray-500">anshikasingh@gmail.com</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleMockLogin('lakshitraina@gmail.com', 'Lakshit Raina')}
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-left transition hover:bg-gray-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">LR</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Lakshit Raina</p>
                      <p className="text-[10px] text-gray-500">lakshitraina@gmail.com</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleMockLogin('guestgoogle@gmail.com', 'Guest Explorer')}
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-left transition hover:bg-gray-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">GE</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Guest Explorer</p>
                      <p className="text-[10px] text-gray-500">guestgoogle@gmail.com</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setIsCustomMode(true)}
                    className="flex w-full items-center justify-center gap-1.5 py-2.5 font-body text-xs font-semibold text-primary hover:underline"
                  >
                    <User size={13} />
                    Use another email account
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomMockSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={customMockName}
                      onChange={e => setCustomMockName(e.target.value)}
                      className="input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="rahul@gmail.com"
                      value={customMockEmail}
                      onChange={e => setCustomMockEmail(e.target.value)}
                      className="input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(false)}
                      className="flex-1 rounded-xl border border-gray-250 py-2.5 text-xs font-semibold text-gray-650 hover:bg-gray-55"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary-dark"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
