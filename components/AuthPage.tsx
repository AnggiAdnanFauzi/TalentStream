import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SparklesIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from './icons/Icons';
import { translations } from '../utils/translations';
import { ArrowLeft, PlayCircle, Phone, ShieldCheck, Briefcase } from 'lucide-react';
import { apiLogin, apiRegister } from '../services/api';

interface AuthPageProps {
  language: 'en' | 'id';
  onAuthSuccess: (user: any) => void;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ language, onAuthSuccess, onBack }) => {
  const t = translations[language];
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isId = language === 'id';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password || (!isSuperAdmin && !isLogin && (!name || !phone))) {
      setError(isId ? 'Harap lengkapi semua kolom yang wajib diisi.' : 'Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError(isId ? 'Password minimal 6 karakter.' : 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSuperAdmin || isLogin) {
        const res = await apiLogin(email, password);
        if (res.success && res.user) {
          localStorage.setItem('ts_session', JSON.stringify(res.user));
          onAuthSuccess(res.user);
        } else {
          setError(res.message || (isId ? 'Login gagal. Periksa kembali email dan kata sandi Anda.' : 'Login failed. Please check your credentials.'));
        }
      } else {
        const res = await apiRegister(name, email, password, phone);
        if (res.success && res.user) {
          localStorage.setItem('ts_session', JSON.stringify(res.user));
          onAuthSuccess(res.user);
        } else {
          setError(res.message || (isId ? 'Pendaftaran gagal.' : 'Registration failed.'));
        }
      }
    } catch (err: any) {
      setError(err.message || (isId ? 'Terjadi kesalahan koneksi ke server.' : 'Network error connecting to backend'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    // Demo user ALWAYS uses local mock data to keep it isolated per user
    // and ensure it resets when localStorage is cleared (cuma buat coba coba).

    const demoUser = {
        id: 'demo-user',
        email: 'demo@talentstream.com',
        name: 'Demo Recruiter',
        role: 'admin',
        subscription: {
          type: 'pro',
          status: 'active',
          expiryDate: '2027-12-31T23:59:59Z',
          limitJobs: 999,
          limitCandidates: 999
        },
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('ts_session', JSON.stringify(demoUser));
    sessionStorage.setItem('ts_demo_active', '1'); // Tandai bahwa sesi demo ini aktif di tab/jendela ini
    onAuthSuccess(demoUser);
  };

  const handleDemoSuperAdmin = async () => {
    setIsLoading(true);
    try {
      const res = await apiLogin('superadmin@talentstream.com', 'admin123');
      if (res.success && res.user) {
        localStorage.setItem('ts_session', JSON.stringify(res.user));
        onAuthSuccess(res.user);
        return;
      }
    } catch (err) {
      console.warn('Backend superadmin fallback:', err);
    } finally {
      setIsLoading(false);
    }

    const superAdminUser = {
        id: 'super-admin-01',
        email: 'superadmin@talentstream.com',
        name: 'Super Administrator',
        role: 'super_admin',
        subscription: {
          type: 'enterprise',
          status: 'active',
          expiryDate: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString(),
          limitJobs: 9999,
          limitCandidates: 9999
        },
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('ts_session', JSON.stringify(superAdminUser));
    onAuthSuccess(superAdminUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans overflow-hidden">
      
      {/* Left Branding Panel (Hidden on small screens) */}
      <div className="hidden lg:flex lg:flex-1 relative bg-slate-900 overflow-hidden items-center justify-center p-12 lg:p-24">
        <div className={`absolute inset-0 transition-colors duration-500 ${isSuperAdmin ? 'bg-indigo-950' : 'bg-primary-700'}`}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all ${isSuperAdmin ? 'bg-purple-600/50' : 'bg-purple-500/40'}`}></div>
        <div className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all ${isSuperAdmin ? 'bg-indigo-500/40' : 'bg-emerald-500/30'}`}></div>
        
        <div className="relative z-10 w-full max-w-xl text-white space-y-10">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-2xl border border-white/20">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">TalentStream</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
              {isSuperAdmin ? 'Platform Authority & Control.' : 'Build your dream team.'}
            </h1>
            <p className="text-xl text-primary-100 font-medium leading-relaxed max-w-lg">
              {isSuperAdmin 
                ? 'Pusat kendali operasional, manajemen pengguna dan otorisasi sistem tingkat tinggi.'
                : 'Join thousands of modern HR teams that use our AI-powered insights to hire faster, smarter, and more equitably.'}
            </p>
          </div>
          
          <div className="pt-8 flex items-center gap-4 border-t border-white/20">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <img key={i} src={`https://i.pravatar.cc/150?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-primary-700" alt="Avatar" />
               ))}
             </div>
             <p className="text-sm font-semibold text-primary-100">
               {isSuperAdmin ? 'Level 1 Security Clearance' : 'Trusted by 10,000+ recruiters'}
             </p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col relative w-full lg:max-w-xl xl:max-w-2xl mx-auto bg-white dark:bg-slate-950 overflow-y-auto">
        
        {/* Floating Back Button */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-all hover:pr-5 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {isId ? 'Kembali' : 'Back to Home'}
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center p-6 sm:p-10 lg:p-16 mt-16 lg:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSuperAdmin ? 'superadmin' : (isLogin ? 'login' : 'register')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm mx-auto space-y-6"
            >
              {/* Top Portal Switcher (Recruiter vs Super Admin) */}
              <div className="p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex gap-1 border border-slate-200 dark:border-slate-700/60 shadow-inner mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuperAdmin(false);
                    setError('');
                    setEmail('');
                    setPassword('');
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    !isSuperAdmin 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-primary-500" />
                  <span>{isId ? 'Recruiter' : 'Recruiter Portal'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuperAdmin(true);
                    setError('');
                    setEmail('superadmin@talentstream.com');
                    setPassword('admin123');
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    isSuperAdmin 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-200" />
                  <span>Super Admin</span>
                </button>
              </div>

              {/* Header Title */}
              <div className="text-center lg:text-left space-y-2">
                <div className="lg:hidden w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-600/20">
                  <SparklesIcon className="w-7 h-7 text-white" />
                </div>
                
                {isSuperAdmin ? (
                  <>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isId ? 'Akses Khusus Otoritas' : 'Super Admin Clearance'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isId ? 'Portal Super Admin' : 'Super Admin Portal'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                      {isId ? 'Masuk ke panel manajemen pengguna & kontrol infrastruktur.' : 'Access user management, authority controls & system metrics.'}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                      {isLogin ? 'Enter your details to access your workspace.' : 'Sign up to start transforming your hiring process.'}
                    </p>
                  </>
                )}
              </div>

              {/* Toggle Login/Register for Recruiter */}
              {!isSuperAdmin && (
                <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex">
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(''); }}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(''); }}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Sign up
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isSuperAdmin && !isLogin && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                        {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                      </label>
                      <div className="relative group">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white font-medium text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                        {language === 'id' ? 'Nomor HP / WhatsApp' : 'Phone Number'}
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white font-medium text-sm"
                          placeholder="+62 812-3456-7890"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                    {isSuperAdmin ? (isId ? 'Email Super Admin' : 'Super Admin Email') : 'Email Address'}
                  </label>
                  <div className="relative group">
                    <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white font-medium text-sm"
                      placeholder={isSuperAdmin ? 'superadmin@talentstream.com' : 'name@company.com'}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                    {!isSuperAdmin && isLogin && (
                      <button type="button" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white font-medium text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                  >
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold text-center">
                      {error}
                    </p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 text-white font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 mt-2 ${
                    isSuperAdmin
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-600/20'
                      : 'bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 shadow-slate-900/20 dark:shadow-primary-600/20'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : (
                    isSuperAdmin 
                      ? (isId ? 'Masuk sebagai Super Admin' : 'Sign in as Super Admin')
                      : (isLogin ? 'Sign In' : 'Create Account')
                  )}
                </button>
              </form>

              {/* Demo Buttons */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white dark:bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
                    {isId ? 'Akses Cepat Demo' : 'Quick Demo Access'}
                  </span>
                </div>
              </div>

              {isSuperAdmin ? (
                <button
                  type="button"
                  onClick={handleDemoSuperAdmin}
                  className="w-full py-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold rounded-xl outline outline-1 outline-purple-200 dark:outline-purple-800 transition-all flex items-center justify-center gap-2 text-sm group"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  {isId ? 'Gunakan Demo Super Admin' : 'Explore Super Admin Demo'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-3 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-bold rounded-xl outline outline-1 outline-primary-200 dark:outline-primary-800 transition-all flex items-center justify-center gap-2 text-sm group"
                >
                  <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Explore Demo Environment
                </button>
              )}
              
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
