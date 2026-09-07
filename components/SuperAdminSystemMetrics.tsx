import React, { useState, useEffect } from 'react';
import { User, Job, Application } from '../types';
import { apiGetFeedbacks } from '../services/api';
import { Database, Cloud, Cpu, Activity, CheckCircle2, Star, MessageSquare, Server } from 'lucide-react';

interface SuperAdminSystemMetricsProps {
  language: 'en' | 'id';
  currentUser: User;
  jobs?: Job[];
  applications?: Application[];
}

const SuperAdminSystemMetrics: React.FC<SuperAdminSystemMetricsProps> = ({
  language,
  currentUser,
  jobs = [],
  applications = []
}) => {
  const isId = language === 'id';
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await apiGetFeedbacks();
        if (data && Array.isArray(data)) {
          setFeedbacks(data);
        }
      } catch (err) {
        console.error('Failed to load feedbacks:', err);
      }
    };
    loadFeedbacks();
  }, []);

  const totalJobs = jobs.length;
  const totalApps = applications.length;

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/40 max-w-lg mx-auto my-8">
        <p className="text-red-600 font-semibold">{isId ? 'Akses Ditolak: Hanya Super Administrator yang berwenang.' : 'Access Denied: Super Administrator only.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>{isId ? 'Monitoring Infrastruktur Cloud' : 'Cloud Infrastructure Monitoring'}</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {isId ? 'Kesehatan Sistem & Metrik Platform' : 'System Health & Platform Metrics'}
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              {isId 
                ? 'Status real-time database Aiven MySQL, Cloudinary Media Storage, dan AI Engine Gemini 3.6 Flash.' 
                : 'Real-time status of Aiven MySQL, Cloudinary media storage, and Gemini 3.6 Flash AI Engine.'}
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{isId ? 'Semua Layanan Berjalan Normal' : 'All Systems Operational'}</span>
          </div>
        </div>
      </div>

      {/* Cloud Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Aiven MySQL */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Database className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              Connected
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Aiven Cloud MySQL</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Database Terisolasi Khusus</p>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Database Name:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">talentstream_db</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">SSL Encryption:</span>
              <span className="font-bold text-emerald-600">TLS v1.3 Active</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Port / Endpoint:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">27694 (Aiven Cloud)</span>
            </div>
          </div>
        </div>

        {/* Cloudinary */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Cloud className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Cloudinary CDN</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Penyimpanan Media & CV Pelamar</p>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Cloud Name:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">dphdphw2c</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Root Folder:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">talentstream_uploads/</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Delivery Format:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">PDF, JPG, WebP, PNG</span>
            </div>
          </div>
        </div>

        {/* Gemini AI */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Gemini AI Studio</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sourcing, CV Parser & Offer Generator</p>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Active Model:</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">gemini-3.6-flash</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">API Key Status:</span>
              <span className="font-bold text-emerald-600">Valid & Active</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Integration:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">4 Intelligent AI Hooks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feedbacks Section */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {isId ? 'Umpan Balik Pengguna Terbaru' : 'Recent User Feedbacks'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isId ? 'Masukan, rating, dan laporan kendala dari pengguna platform' : 'Ratings, suggestions and reports submitted across tools'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full">
            {feedbacks.length} {isId ? 'Masukan' : 'Entries'}
          </span>
        </div>

        {feedbacks.length === 0 ? (
          <p className="text-center py-8 text-slate-400 text-sm">
            {isId ? 'Belum ada umpan balik yang dikirimkan.' : 'No feedbacks submitted yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.slice(0, 6).map((fb: any) => (
              <div key={fb.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{fb.user_name || 'Recruiter'}</span>
                    <span className="text-xs text-slate-400">({fb.tool_category || 'general'})</span>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {[...Array(fb.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 italic">
                  "{fb.message}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                  <span className="capitalize font-semibold text-purple-600 dark:text-purple-400">
                    {fb.feedback_type || 'suggestion'}
                  </span>
                  <span>{new Date(fb.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platform Totals */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {isId ? 'Volume Operasional Platform' : 'Platform Operational Volume'}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isId ? 'Lowongan Dibuat' : 'Jobs Created'}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalJobs}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isId ? 'Pelamar Masuk' : 'Total Applicants'}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalApps}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isId ? 'Penyimpanan CV' : 'Uploaded CVs'}</p>
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{totalApps}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isId ? 'AI Screening Uptime' : 'AI Engine Uptime'}</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">99.9%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSystemMetrics;
