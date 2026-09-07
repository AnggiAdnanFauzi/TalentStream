import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShareIcon, UsersIcon, BanknotesIcon, ChartBarIcon, ClipboardDocumentIcon, CheckIcon } from './icons/Icons';
import { AffiliateStats } from '../types';
import { translations } from '../utils/translations';

interface AffiliatePageProps {
  referralCode: string;
  language?: 'en' | 'id';
}

const AffiliatePage: React.FC<AffiliatePageProps> = ({ referralCode, language = 'id' }) => {
  const t = translations[language]?.affiliate || translations.id.affiliate;
  const [copied, setCopied] = useState(false);

  const stats: AffiliateStats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalCommission: 392,
    pendingCommission: 49,
  };

  const referralLink = `https://talentstream.app/ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t.subtitle}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title={t.totalReferrals} value={stats.totalReferrals} icon={<UsersIcon className="w-6 h-6 text-blue-600" />} color="blue" />
        <StatCard title={t.activeSubs} value={stats.activeReferrals} icon={<ShareIcon className="w-6 h-6 text-green-600" />} color="green" />
        <StatCard title={t.totalEarned} value={`$${stats.totalCommission}`} icon={<BanknotesIcon className="w-6 h-6 text-primary-600" />} color="primary" />
        <StatCard title={t.pending} value={`$${stats.pendingCommission}`} icon={<ChartBarIcon className="w-6 h-6 text-orange-600" />} color="orange" />
      </div>

      {/* Referral Link Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.linkTitle}</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 font-mono text-slate-600 dark:text-slate-300 flex items-center overflow-x-auto select-all">
            {referralLink}
          </div>
          <button
            onClick={copyToClipboard}
            className={`px-8 py-4 ${copied ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary-600 hover:bg-primary-700'} text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2 whitespace-nowrap`}
          >
            {copied ? (
              <>
                <CheckIcon className="w-5 h-5 text-white" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-5 h-5" />
                <span>{t.copyLink}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.howItWorks}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard 
            number="1"
            title={t.step1Title}
            description={t.step1Desc}
          />
          <StepCard 
            number="2"
            title={t.step2Title}
            description={t.step2Desc}
          />
          <StepCard 
            number="3"
            title={t.step3Title}
            description={t.step3Desc}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className={`w-12 h-12 bg-${color}-50 dark:bg-${color}-900/20 rounded-2xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
  </div>
);

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 relative">
    <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-600 text-white font-bold rounded-full flex items-center justify-center shadow-lg">
      {number}
    </div>
    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

export default AffiliatePage;
