
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle, BarChart3, Users, ArrowRight, Play, Smartphone, Monitor, AlertTriangle, Zap, XCircle, Moon, Sun, Menu, X, Mail, MessageCircle, Send } from 'lucide-react';
import { translations } from '../utils/translations';
import { SparklesIcon, CheckBadgeIcon, ChartBarIcon, UsersIcon, ArrowRightIcon, FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from './icons/Icons';

interface LandingPageProps {
  language: 'en' | 'id';
  onLanguageChange: (lang: 'en' | 'id') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ language, onLanguageChange, theme, toggleTheme, onGetStarted, onLogin }) => {
  const t = translations[language];
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* Navigation */}
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="TalentStream Logo" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">TalentStream</span>
              </div>
              <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                <a href="#hero" className="hover:text-primary-600 transition-colors">Home</a>
                <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
                <a href="#solution" className="hover:text-primary-600 transition-colors">Solution</a>
                <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as 'en' | 'id')}
                  className="bg-slate-100 dark:bg-slate-800 text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-primary-500 rounded-lg px-2 py-1 sm:py-1.5 shadow-sm uppercase styling-none"
                >
                  <option value="en">EN</option>
                  <option value="id">ID</option>
                </select>
                <button
                  onClick={toggleTheme}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors shadow-sm shrink-0"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 hidden md:block mx-1"></div>
                <button onClick={onLogin} className="text-sm text-slate-600 dark:text-slate-400 font-medium hover:text-primary-600 transition-colors hidden md:block whitespace-nowrap">
                  {t.common.login}
                </button>
                <button onClick={onGetStarted} className="px-3 sm:px-5 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary-600/20 hidden sm:block whitespace-nowrap">
                  {t.common.getStarted}
                </button>
                <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="lg:hidden p-1.5 sm:p-2 ml-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors shrink-0">
                   {isMobileNavOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
              </div>
            </div>
            
            {/* Mobile Nav Area */}
            <AnimatePresence>
              {isMobileNavOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 overflow-hidden shadow-lg"
                >
                  <div className="flex flex-col space-y-4">
                    <a href="#hero" onClick={() => setIsMobileNavOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600">Home</a>
                    <a href="#features" onClick={() => setIsMobileNavOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600">Features</a>
                    <a href="#solution" onClick={() => setIsMobileNavOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600">Solution</a>
                    <a href="#pricing" onClick={() => setIsMobileNavOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600">Pricing</a>
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col space-y-3">
                       <button onClick={() => { setIsMobileNavOpen(false); onLogin(); }} className="w-full text-center py-2.5 text-sm text-slate-600 dark:text-slate-400 font-medium hover:text-primary-600 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all">
                         {t.common.login}
                       </button>
                       <button onClick={() => { setIsMobileNavOpen(false); onGetStarted(); }} className="w-full text-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary-600/20">
                         {t.common.getStarted}
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 max-w-6xl mx-auto flex items-center justify-center translate-y-20 opacity-75">
          <div className="absolute w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary-400/20 rounded-full blur-[60px] md:blur-[80px] animate-blob mix-blend-multiply dark:mix-blend-color-dodge"></div>
          <div className="absolute w-[200px] md:w-[350px] h-[200px] md:h-[350px] bg-purple-400/20 rounded-full blur-[60px] md:blur-[80px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-color-dodge translate-x-1/4 md:translate-x-1/2"></div>
          <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-400/10 rounded-full blur-[80px] md:blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-color-dodge -translate-x-1/4 md:-translate-x-1/3"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center space-y-6 z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 mb-6 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3 h-3 text-primary-600 dark:text-primary-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">TalentStream v2.0 is live! →</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] pb-2 drop-shadow-sm">
              {t.landing.heroTitle}
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t.landing.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <button onClick={onGetStarted} className="w-full sm:w-auto group relative px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-base font-bold rounded-xl transition-all shadow-[0_0_30px_-10px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 overflow-hidden hover:-translate-y-0.5">
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center gap-2">
                {t.landing.ctaButton}
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="w-full sm:w-auto px-6 py-3 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white text-base font-bold rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
              {t.common.learnMore}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Logos */}
      <section className="py-8 border-y border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/10 overflow-hidden relative px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-slate-50 dark:from-slate-950 dark:via-transparent dark:to-slate-950 z-10 pointer-events-none w-full h-full"></div>
        <div className="max-w-6xl mx-auto relative z-0 w-full">
          <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Trusted by innovative teams worldwide</p>
          <div className="flex justify-center flex-wrap gap-8 sm:gap-14 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 items-center">
             <span className="text-xl font-black font-sans text-slate-500">Google</span>
             <span className="text-xl font-black font-serif text-slate-500">Meta</span>
             <span className="text-xl font-black tracking-tighter text-slate-500">Spotify</span>
             <span className="text-xl font-black tracking-widest text-slate-500 shrink-0">Airbnb</span>
             <span className="text-xl font-black text-slate-500 shrink-0">Netflix</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.landing.featuresTitle}</h2>
            <div className="w-16 h-1 bg-primary-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
              title={(t.landing as any).feature1Title}
              description={(t.landing as any).feature1Desc}
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
              title={(t.landing as any).feature2Title}
              description={(t.landing as any).feature2Desc}
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
              title={(t.landing as any).feature3Title}
              description={(t.landing as any).feature3Desc}
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
              title={(t.landing as any).feature4Title}
              description={(t.landing as any).feature4Desc}
            />
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section id="solution" className="py-32 px-4 sm:px-6 lg:px-8 relative flex justify-center w-full overflow-hidden text-center md:text-left bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/30 transform -skew-y-2 z-0 origin-top-left -mx-10 w-[120%] border-t border-slate-100 dark:border-slate-800/50"></div>
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="p-8 md:p-10 bg-gradient-to-br from-white to-red-50 dark:from-slate-900 dark:to-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-xl shadow-red-500/5 relative overflow-hidden group flex flex-col"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-400 to-red-600"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-100/50 dark:bg-red-900/20 rounded-full blur-2xl group-hover:bg-red-200/50 transition-colors"></div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center mb-6 border border-red-200 dark:border-red-800/50 shadow-inner mx-auto md:mx-0">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 relative z-10">{(t.landing as any).problemTitle}</h3>
            <div className="space-y-4 relative z-10 text-left flex-1">
              {[
                (t.landing as any).problem1,
                (t.landing as any).problem2,
                (t.landing as any).problem3
              ].map((text, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                   className="flex items-start gap-3"
                 >
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-base text-slate-700 dark:text-slate-300 font-medium">{text}</p>
                 </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="p-8 md:p-10 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-900 dark:to-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 shadow-xl shadow-emerald-500/5 relative overflow-hidden group flex flex-col"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-2xl group-hover:bg-emerald-200/50 transition-colors"></div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mb-6 border border-emerald-200 dark:border-emerald-800/50 shadow-inner mx-auto md:mx-0">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 relative z-10">{(t.landing as any).solutionTitle}</h3>
            <div className="space-y-4 relative z-10 text-left flex-1">
              {[
                (t.landing as any).solution1,
                (t.landing as any).solution2,
                (t.landing as any).solution3
              ].map((text, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.4, delay: 0.4 + (i * 0.1) }}
                   className="flex items-start gap-3"
                 >
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-base text-slate-700 dark:text-slate-300 font-medium">{text}</p>
                 </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto relative z-10 w-full flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{(t.landing as any).demoTitle}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">{(t.landing as any).demoDesc}</p>
            <div className="flex justify-center gap-4 mt-6">
               <button onClick={() => setIsMobileView(true)} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${isMobileView ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'}`}>
                  <Smartphone className="w-4 h-4" /> Mobile
               </button>
               <button onClick={() => setIsMobileView(false)} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${!isMobileView ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'}`}>
                  <Monitor className="w-4 h-4" /> Desktop
               </button>
            </div>
          </motion.div>
          
          <motion.div 
            layout
            className={`relative rounded-3xl p-3 md:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full mx-auto ${isMobileView ? 'max-w-sm' : 'max-w-4xl'}`}
          >
           <motion.div 
             layout
             className={`bg-slate-800 rounded-2xl overflow-hidden relative group shadow-inner flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileView ? 'aspect-[9/18]' : 'aspect-video'}`}
           >
              <img src={isMobileView ? "/demo-mobile.png" : "/demo-desktop.png"} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-105" alt="Dashboard Preview" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 w-16 h-16 md:w-20 md:h-20 bg-primary-600/90 text-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_50px_rgba(37,99,235,0.8)] backdrop-blur-sm group-hover:bg-primary-500 transition-colors"
              >
                <Play className="w-6 h-6 md:w-8 md:h-8 ml-1 drop-shadow-md" />
              </motion.div>
              <div className="absolute bottom-6 left-0 right-0 text-center px-4 pointer-events-none">
                <p className="text-white font-medium text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Play {isMobileView ? "Mobile App" : "Dashboard"} Walkthrough</p>
              </div>
           </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{(t.landing as any).testimonialsTitle}</h2>
            <div className="w-16 h-1 bg-primary-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { name: 'Sarah Jenkins', role: 'Head of Talent', quote: "TalentStream reshaped how we manage engineering hiring. The AI insights alone saved us countless hours." },
               { name: 'Michael Chen', role: 'VP of People', quote: "The most intuitive cloud ATS we've ever used. Finding passive candidates is now surprisingly easy." },
               { name: 'Emma Watson', role: 'Recruiting Director', quote: "A massive game-changer. It aligns all our hiring managers perfectly on a single, transparent pipeline platform." },
               { name: 'David Miller', role: 'Founder & CEO', quote: "Aesthetically pleasing, very affordable, and extremely powerful for our fast-scaling remote startup." }
             ].map((testimonial, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -6 }}
                  className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary-600/5 transition-all relative overflow-hidden group flex flex-col justify-between"
                >
                    <div>
                      <div className="absolute text-5xl text-primary-100 dark:text-slate-800/30 top-3 left-4 font-serif leading-none group-hover:text-primary-200 dark:group-hover:text-slate-700/50 transition-colors">"</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 relative z-10 pt-4 leading-relaxed font-medium">"{testimonial.quote}"</p>
                    </div>
                    <div className="flex items-center gap-3 relative z-10 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shrink-0 shadow-sm">
                           <img src={`https://i.pravatar.cc/150?img=${30 + i}`} alt={testimonial.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{testimonial.name}</p>
                          <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold truncate">{testimonial.role}</p>
                        </div>
                    </div>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{t.landing.pricingTitle}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              {language === 'id' 
                ? 'Pilih paket yang sesuai dengan kebutuhan rekrutmen tim Anda.' 
                : 'Choose the ideal plan for your hiring team needs.'}
            </p>

            {/* Monthly / Annual Toggle Switch */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                {language === 'id' ? 'Bulanan' : 'Monthly'}
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-800 transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-primary-600 shadow-lg ring-0 transition duration-200 ease-in-out ${billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'}`}
                />
              </button>
              <span className={`text-sm font-bold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                {language === 'id' ? 'Tahunan' : 'Annual'}
                <span className="px-2 py-0.5 text-xs font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full">
                  {language === 'id' ? 'Hemat 20%' : 'Save 20%'}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard 
              title="Free"
              price="$0"
              period={billingCycle === 'annual' ? (language === 'id' ? '/tahun' : '/year') : (language === 'id' ? '/bulan' : '/month')}
              features={["Up to 3 Jobs", "100 Candidates", "Basic Analytics", "Email Support"]}
              buttonText={language === 'id' ? 'Mulai Gratis' : 'Start Free'}
              onAction={onGetStarted}
            />
            <PricingCard 
              title="Pro"
              price={billingCycle === 'annual' ? '$39' : '$49'}
              period={language === 'id' ? '/bulan' : '/month'}
              subtext={billingCycle === 'annual' ? (language === 'id' ? 'Ditagih tahunan ($468/thn)' : 'Billed annually ($468/yr)') : undefined}
              features={["Unlimited Jobs", "Unlimited Candidates", "Advanced AI Sourcing", "Priority Support", "Custom Branding"]}
              highlighted
              buttonText={language === 'id' ? 'Pilih Pro' : 'Go Pro'}
              onAction={onGetStarted}
            />
            <PricingCard 
              title="Enterprise"
              price="Custom"
              features={["SLA Guarantee", "Dedicated Manager", "API Access", "SSO Integration", "Custom Workflows"]}
              buttonText={language === 'id' ? 'Hubungi Sales' : 'Contact Sales'}
              onAction={() => {}}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-primary-600"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="max-w-6xl mx-auto text-center text-white relative z-10 space-y-6 w-full">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">{(t.landing as any).ctaTitle}</h2>
          <p className="text-lg md:text-xl text-primary-100 max-w-xl mx-auto font-medium">{(t.landing as any).ctaDesc}</p>
          <div className="pt-6">
            <button onClick={onGetStarted} className="px-8 py-4 bg-white text-primary-600 hover:bg-slate-50 font-black text-lg rounded-xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 mx-auto">
              {(t.landing as any).ctaButton}
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <p className="text-xs font-semibold text-primary-200 mt-4">{(t.landing as any).ctaNote}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="TalentStream Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold tracking-tight">TalentStream</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Building the future of recruitment with AI-driven insights and collaborative tools.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="https://www.instagram.com/contech.id/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary-600 transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://x.com/contechofficial" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary-600 transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="https://web.facebook.com/contech.id." target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary-600 transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@contechid1288" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary-600 transition-colors">
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@contech.id" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary-600 transition-colors">
                <Send className="w-5 h-5 transform -rotate-45" /> {/* TikTok placeholder if not in lucide */}
              </a>
              <a href="https://www.threads.com/@contech.id?hl=id" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-primary-600 transition-colors">
                <span className="font-black text-xs">@</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary-500" />
                <a href="https://wa.me/6287730309409" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+62 877-3030-9409</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <a href="mailto:contech.id@gmail.com" className="hover:text-white transition-colors">contech.id@gmail.com</a>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto w-full mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2024 TalentStream. Dibuat oleh <a href="https://contech.id" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 font-bold underline transition-colors">Contech ID</a>. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs">
            <button 
              type="button"
              onClick={() => setModalContent({
                title: 'Terms & Conditions',
                body: 'Selamat datang di TalentStream. Dengan menggunakan platform ini, Anda menyetujui seluruh ketentuan layanan terkait manajemen data rekrutmen, kepatuhan privasi data pelamar, serta penggunaan fitur AI secara bertanggung jawab dan beretika.'
              })} 
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </button>
            <button 
              type="button"
              onClick={() => setModalContent({
                title: 'Disclaimer',
                body: 'Hasil rekomendasi, penilaian skor, dan pertanyaan wawancara yang dihasilkan oleh AI di TalentStream merupakan alat bantu (asisten) analisis. Keputusan akhir dalam penerimaan atau penolakan kandidat tetap menjadi wewenang penuh pihak manajemen dan perekrut manusia.'
              })} 
              className="hover:text-slate-300 transition-colors"
            >
              Disclaimer
            </button>
            <button 
              type="button"
              onClick={() => setModalContent({
                title: 'Privacy Policy',
                body: 'TalentStream berkomitmen menjaga kerahasiaan berkas resume, identitas pribadi kandidat, dan catatan wawancara. Seluruh data disimpan secara terenkripsi dan tidak diperjualbelikan kepada pihak ketiga manapun.'
              })} 
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      <AnimatePresence>
        {modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{modalContent.title}</h3>
                <button onClick={() => setModalContent(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {modalContent.body}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalContent(null)}
                  className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="group relative p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
    <div className="absolute -top-8 -right-8 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-[3] group-hover:opacity-10 transition-all duration-700 ease-out text-primary-600">
      {icon}
    </div>
    <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/20 rounded-xl flex items-center justify-center mb-6 shadow-inner border border-primary-100 dark:border-primary-800/50 relative z-10 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed relative z-10 font-medium">{description}</p>
  </div>
);

const PricingCard: React.FC<{ 
  title: string; 
  price: string; 
  period?: string;
  subtext?: string;
  features: string[]; 
  highlighted?: boolean; 
  buttonText: string; 
  onAction: () => void 
}> = ({ title, price, period, subtext, features, highlighted, buttonText, onAction }) => (
  <div className={`relative p-8 rounded-3xl border ${highlighted ? 'border-primary-500 bg-white dark:bg-slate-900 ring-4 ring-primary-500/10 shadow-xl md:scale-105 z-10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'} flex flex-col transition-transform hover:scale-[1.02] duration-300`}>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{price}</span>
      {price !== 'Custom' && <span className="text-xs text-slate-500 font-bold ml-1">{period || '/month'}</span>}
    </div>
    {subtext && <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mb-5">{subtext}</p>}
    {!subtext && <div className="mb-5" />}
    <ul className="space-y-3 mb-8 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
            <CheckBadgeIcon className="w-3 h-3 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="font-semibold">{f}</span>
        </li>
      ))}
    </ul>
    <button
      onClick={onAction}
      className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all text-sm ${highlighted ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white hover:-translate-y-0.5'}`}
    >
      {buttonText}
    </button>
  </div>
);

export default LandingPage;
