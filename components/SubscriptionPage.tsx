import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCardIcon, CheckBadgeIcon, SparklesIcon, RocketLaunchIcon, BuildingOfficeIcon } from './icons/Icons';
import { translations } from '../utils/translations';
import { Transaction, User } from '../types';
import { apiCreateSnapToken, apiGetBillingTransactions, apiSimulatePaymentSuccess } from '../services/api';
import { ShieldCheck, QrCode, CreditCard, Building2, Wallet, CheckCircle2, ArrowRight, ExternalLink, RefreshCw, X } from 'lucide-react';

interface SubscriptionPageProps {
  language: 'en' | 'id';
  currentPlan: string;
  onUpgrade: (plan: string) => void;
  user?: User;
  onUpdateUser?: (updatedUser: User) => void;
  addToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ 
  language, 
  currentPlan, 
  onUpgrade,
  user,
  onUpdateUser,
  addToast
}) => {
  const t = translations[language];
  const isId = language === 'id';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [isProcessingPlan, setIsProcessingPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Midtrans Sandbox Simulator Modal State
  const [snapModalData, setSnapModalData] = useState<{
    orderId: string;
    snapToken: string;
    amount: number;
    plan: 'pro' | 'enterprise';
    redirectUrl?: string;
  } | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'qris' | 'bca_va' | 'mandiri' | 'credit_card'>('qris');
  const [isSimulatingPay, setIsSimulatingPay] = useState(false);

  // Load real transactions from backend
  const loadTransactions = async () => {
    setIsLoadingTx(true);
    try {
      const data = await apiGetBillingTransactions();
      if (data && Array.isArray(data)) {
        setTransactions(data);
      }
    } catch (err) {
      console.warn('Failed to load transactions:', err);
    } finally {
      setIsLoadingTx(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Format currency to IDR
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Trigger Midtrans Checkout
  const handleCheckoutMidtrans = async (plan: 'pro' | 'enterprise') => {
    if (plan === currentPlan) return;
    setIsProcessingPlan(plan);

    try {
      const res = await apiCreateSnapToken(plan, billingCycle);
      if (!res || !res.snap_token) {
        if (addToast) addToast(isId ? 'Gagal menghubungkan ke gateway Midtrans' : 'Failed to connect to Midtrans gateway', 'error');
        setIsProcessingPlan(null);
        return;
      }

      // If official Midtrans Snap script is loaded and token is valid from real server key
      if (window.snap && window.snap.pay && !res.snap_token.startsWith('SANDBOX-TOKEN-')) {
        window.snap.pay(res.snap_token, {
          onSuccess: async (result) => {
            await handlePaymentSuccess(res.order_id, plan);
          },
          onPending: (result) => {
            if (addToast) addToast(isId ? 'Pembayaran tertunda. Harap selesaikan transaksi.' : 'Payment pending. Please complete transaction.', 'info');
            loadTransactions();
          },
          onError: (result) => {
            if (addToast) addToast(isId ? 'Pembayaran gagal diproses.' : 'Payment processing failed.', 'error');
          },
          onClose: () => {
            if (addToast) addToast(isId ? 'Anda menutup popup pembayaran.' : 'Payment window closed.', 'info');
          }
        });
      } else {
        // Open Midtrans Sandbox Simulator Modal
        setSnapModalData({
          orderId: res.order_id,
          snapToken: res.snap_token,
          amount: res.amount,
          plan: plan,
          redirectUrl: res.redirect_url
        });
      }
    } catch (err) {
      if (addToast) addToast(isId ? 'Terjadi kesalahan sistem pembayaran' : 'Payment system error', 'error');
    } finally {
      setIsProcessingPlan(null);
    }
  };

  // Finalize payment success (Backend sync & update user session)
  const handlePaymentSuccess = async (orderId: string, plan: 'pro' | 'enterprise') => {
    setIsSimulatingPay(true);
    try {
      const ok = await apiSimulatePaymentSuccess(orderId);
      if (ok) {
        if (user && onUpdateUser) {
          const updatedUser: User = {
            ...user,
            subscription: {
              type: plan,
              status: 'active',
              expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              limitJobs: plan === 'enterprise' ? 9999 : 999,
              limitCandidates: plan === 'enterprise' ? 99999 : 9999
            }
          };
          onUpdateUser(updatedUser);
        }

        onUpgrade(plan);
        setSnapModalData(null);
        await loadTransactions();
        window.dispatchEvent(new Event('adminUsersRefresh'));

        if (addToast) {
          addToast(
            isId 
              ? `Pembayaran Berhasil! Paket Anda kini aktif sebagai ${plan.toUpperCase()}`
              : `Payment Successful! Your plan is now active as ${plan.toUpperCase()}`,
            'success'
          );
        }
      } else {
        if (addToast) addToast(isId ? 'Konfirmasi pembayaran gagal' : 'Payment confirmation failed', 'error');
      }
    } catch (err) {
      if (addToast) addToast(isId ? 'Gagal memperbarui status langganan' : 'Failed to update subscription', 'error');
    } finally {
      setIsSimulatingPay(false);
    }
  };

  const planRanks: Record<string, number> = { free: 0, pro: 1, enterprise: 2 };
  const currentRank = planRanks[currentPlan] ?? 0;

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t.dashboard.billing}</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Midtrans Snap Secured
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isId ? 'Kelola paket langganan dan faktur penagihan perusahaan Anda.' : 'Manage your subscription plans and billing history.'}
          </p>
        </div>
        <button
          onClick={loadTransactions}
          disabled={isLoadingTx}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTx ? 'animate-spin text-primary-500' : ''}`} />
          <span>{isId ? 'Segarkan Riwayat' : 'Refresh History'}</span>
        </button>
      </div>

      {/* Current Plan Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
              <RocketLaunchIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isId ? 'Paket Aktif Saat Ini' : 'Current Active Plan'}
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white capitalize mt-0.5">
                {isId ? `Paket ${currentPlan.toUpperCase()}` : `${currentPlan.toUpperCase()} Plan`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {user?.company_name || 'Perusahaan Anda'} • {user?.email || 'admin@perusahaan.com'}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
             <div className="flex items-center gap-2">
               <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="px-3.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wide rounded-full border border-emerald-200 dark:border-emerald-800">
                 {isId ? 'Status: Aktif' : 'Status: Active'}
               </span>
             </div>
             <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
               {isId ? 'Masa Berlaku: 30 Hari Kedepan' : 'Valid for 30 Days Ahead'}
             </p>
          </div>
        </div>
      </div>

            {/* Monthly / Annual Toggle Switch */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
          {isId ? 'Bulanan' : 'Monthly'}
        </span>
        <button
          type="button"
          onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
          className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-800 transition-colors duration-200 ease-in-out focus:outline-none"
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-primary-600 shadow-lg ring-0 transition duration-200 ease-in-out ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}
          />
        </button>
        <span className={`text-sm font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
          {isId ? 'Tahunan' : 'Annual'}
          <span className="px-2 py-0.5 text-xs font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full">
            {isId ? 'Hemat 20%' : 'Save 20%'}
          </span>
        </span>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PlanCard 
          title="Free"
          price="Rp 0"
          subPrice={billingCycle === 'yearly' ? "$0 / yr" : "$0 / mo"}
          priceSuffix={isId ? '/bln' : '/mo'}
          description={isId ? 'Cocok untuk tim kecil yang baru mulai menjajaki rekrutmen.' : 'Perfect for small teams starting out.'}
          features={isId 
            ? ['Maksimal 3 Lowongan Aktif', 'Hingga 100 Kandidat', 'Analitik Dasar', 'Dukungan Standar']
            : ['Up to 3 Active Jobs', 'Up to 100 Candidates', 'Basic Analytics', 'Standard Support']}
          isCurrent={currentPlan === 'free'}
          currentLabel={isId ? 'Paket Saat Ini' : 'Current Plan'}
          upgradeLabel={isId ? (currentRank > 0 ? 'Turunkan Paket' : 'Pilih Paket') : (currentRank > 0 ? 'Downgrade' : 'Select Plan')}
          onAction={() => onUpgrade('free')}
        />

        <PlanCard 
          title="Pro"
          price={billingCycle === 'yearly' ? "Rp 600.000" : "Rp 750.000"}
          subPrice={billingCycle === 'yearly' ? (isId ? "Ditagih tahunan (Rp 7.200.000/thn)" : "Billed annually ($468/yr)") : "~$49 / mo"}
          priceSuffix={isId ? '/bln' : '/mo'}
          description={isId ? 'Fitur lengkap bertenaga AI dengan kuota tak terbatas untuk tim berkembang.' : 'Complete AI-powered features for growing recruitment teams.'}
          features={isId
            ? ['Lowongan Aktif Tanpa Batas', 'Kandidat Tanpa Batas', 'Pencarian AI Sourcing (Gemini)', 'Pemeringkatan Semantik Otomatis', 'Generator Surat Penawaran', 'Dukungan Prioritas WA / Email']
            : ['Unlimited Active Jobs', 'Unlimited Candidates', 'AI Sourcing (Gemini)', 'Automatic Semantic Scoring', 'Offer Letter Generator', 'Priority WA & Email Support']}
          isCurrent={currentPlan === 'pro'}
          highlighted
          currentLabel={isId ? 'Paket Saat Ini' : 'Current Plan'}
          upgradeLabel={isId ? (currentRank > 1 ? 'Turunkan Paket' : 'Tingkatkan Sekarang') : (currentRank > 1 ? 'Downgrade' : 'Upgrade Now')}
          isLoading={isProcessingPlan === 'pro'}
          onAction={() => {
            if (currentRank > 1) {
              onUpgrade('pro');
            } else {
              handleCheckoutMidtrans('pro');
            }
          }}
        />

        <PlanCard 
          title="Enterprise"
          price={billingCycle === 'yearly' ? "Rp 2.800.000" : "Rp 3.500.000"}
          subPrice={billingCycle === 'yearly' ? (isId ? "Ditagih tahunan (Rp 33.600.000/thn)" : "Billed annually ($2,748/yr)") : "~$229 / mo"}
          priceSuffix={isId ? '/bln' : '/mo'}
          description={isId ? 'Solusi kustom dengan kapasitas skala besar dan integrasi khusus perusahaan.' : 'Tailored enterprise solutions with dedicated account manager.'}
          features={isId
            ? ['Seluruh Fitur Paket Pro', 'Kapasitas 99.999+ Kandidat', 'Alur Tahapan Rekrutmen Kustom', 'Integrasi SSO & API Dedicated', 'Account Manager Khusus', 'SLA 99.9% Uptime']
            : ['All Pro Plan Features', '99,999+ Candidates Capacity', 'Custom Stage Workflows', 'SSO & Dedicated API Access', 'Dedicated Account Manager', '99.9% SLA Uptime']}
          isCurrent={currentPlan === 'enterprise'}
          currentLabel={isId ? 'Paket Saat Ini' : 'Current Plan'}
          upgradeLabel={isId ? 'Tingkatkan Sekarang' : 'Upgrade Now'}
          isLoading={isProcessingPlan === 'enterprise'}
          onAction={() => handleCheckoutMidtrans('enterprise')}
        />
      </div>

      {/* Billing History (From Real DB) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {isId ? 'Riwayat Tagihan & Faktur' : 'Billing History'}
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {transactions.length} {isId ? 'Transaksi Tercatat' : 'Transactions'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {isLoadingTx ? (
            <div className="p-8 text-center text-slate-500 font-medium">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-500" />
              {isId ? 'Memuat riwayat transaksi dari database...' : 'Loading transactions from database...'}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <CreditCard className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="font-semibold">{isId ? 'Belum ada riwayat transaksi pembayaran.' : 'No billing transactions found.'}</p>
              <p className="text-xs">{isId ? 'Lakukan peningkatan paket di atas untuk membuat faktur pertama.' : 'Upgrade your plan above to create your first invoice.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{isId ? 'ID Faktur / Order' : 'Invoice ID'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{isId ? 'Paket' : 'Plan'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{isId ? 'Tanggal' : 'Date'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{isId ? 'Nominal (IDR)' : 'Amount'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{isId ? 'Status' : 'Status'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{isId ? 'Aksi' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map((txn) => {
                    const isSuccess = txn.status === 'success' || txn.status === 'settlement';
                    const isPending = txn.status === 'pending';
                    const amountVal = typeof txn.amount === 'string' ? parseFloat(txn.amount) : txn.amount;

                    return (
                      <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-xs text-slate-900 dark:text-white font-mono">{txn.id}</td>
                        <td className="px-6 py-4 text-sm font-semibold capitalize text-primary-600 dark:text-primary-400">
                          {txn.plan}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">{txn.date}</td>
                        <td className="px-6 py-4 font-bold text-sm text-slate-900 dark:text-white">
                          {formatIDR(amountVal)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-black uppercase rounded-full tracking-wide ${
                            isSuccess 
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : isPending
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                          }`}>
                            {isSuccess ? (isId ? 'Lunas' : 'Paid') : isPending ? (isId ? 'Menunggu' : 'Pending') : (isId ? 'Gagal' : 'Failed')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right"><button onClick={() => window.print()} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-bold text-xs hover:underline">{isId ? 'Unduh PDF' : 'Download PDF'}</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Midtrans Snap Modal Simulator */}
      <AnimatePresence>
        {snapModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-black tracking-tight">Midtrans Snap Checkout</h4>
                    <p className="text-xs text-blue-100 font-medium">Gateway Pembayaran Resmi Indonesia</p>
                  </div>
                </div>
                <button
                  onClick={() => setSnapModalData(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>ID Order / Faktur:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{snapModalData.orderId}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span>Paket Langganan:</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400 uppercase">TalentStream {snapModalData.plan}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Total Tagihan:</span>
                  <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                    {formatIDR(snapModalData.amount)}
                  </span>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="p-6 space-y-4">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Pilih Metode Pembayaran:
                </p>

                <div className="space-y-2.5">
                  <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPaymentMethod === 'qris'
                      ? 'border-primary-600 bg-primary-50/40 dark:bg-primary-950/20 ring-1 ring-primary-600'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">QRIS (Instant QR)</p>
                        <p className="text-xs text-slate-500">GoPay, OVO, ShopeePay, Dana, BCA Mobile</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="paymethod" 
                      checked={selectedPaymentMethod === 'qris'} 
                      onChange={() => setSelectedPaymentMethod('qris')} 
                      className="accent-primary-600"
                    />
                  </label>

                  <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPaymentMethod === 'bca_va'
                      ? 'border-primary-600 bg-primary-50/40 dark:bg-primary-950/20 ring-1 ring-primary-600'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">BCA Virtual Account</p>
                        <p className="text-xs text-slate-500 font-mono">No. VA: 80777{snapModalData.orderId.replace(/[^0-9]/g, '').slice(-8)}</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="paymethod" 
                      checked={selectedPaymentMethod === 'bca_va'} 
                      onChange={() => setSelectedPaymentMethod('bca_va')} 
                      className="accent-primary-600"
                    />
                  </label>

                  <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPaymentMethod === 'mandiri'
                      ? 'border-primary-600 bg-primary-50/40 dark:bg-primary-950/20 ring-1 ring-primary-600'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Mandiri Bill Payment</p>
                        <p className="text-xs text-slate-500">Kode Perusahaan: 70012</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="paymethod" 
                      checked={selectedPaymentMethod === 'mandiri'} 
                      onChange={() => setSelectedPaymentMethod('mandiri')} 
                      className="accent-primary-600"
                    />
                  </label>

                  <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPaymentMethod === 'credit_card'
                      ? 'border-primary-600 bg-primary-50/40 dark:bg-primary-950/20 ring-1 ring-primary-600'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Kartu Kredit / Debit Online</p>
                        <p className="text-xs text-slate-500">Visa, Mastercard, JCB (3D Secure)</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="paymethod" 
                      checked={selectedPaymentMethod === 'credit_card'} 
                      onChange={() => setSelectedPaymentMethod('credit_card')} 
                      className="accent-primary-600"
                    />
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => setSnapModalData(null)}
                  disabled={isSimulatingPay}
                  className="flex-1 py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-all"
                >
                  {isId ? 'Batal' : 'Cancel'}
                </button>
                <button
                  onClick={() => handlePaymentSuccess(snapModalData.orderId, snapModalData.plan)}
                  disabled={isSimulatingPay}
                  className="flex-2 py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  {isSimulatingPay ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isId ? 'Memproses Transaksi...' : 'Processing...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isId ? 'Bayar Sekarang (Simulasi Midtrans)' : 'Pay Now (Midtrans Simulation)'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlanCard: React.FC<{
  title: string;
  price: string;
  subPrice?: string;
  priceSuffix?: string;
  description: string;
  features: string[];
  isCurrent: boolean;
  highlighted?: boolean;
  currentLabel: string;
  upgradeLabel: string;
  isLoading?: boolean;
  onAction: () => void;
}> = ({ title, price, subPrice, priceSuffix = '/mo', description, features, isCurrent, highlighted, currentLabel, upgradeLabel, isLoading, onAction }) => (
  <div className={`p-8 rounded-3xl border ${highlighted ? 'border-primary-600 bg-primary-50/30 dark:bg-primary-900/10 ring-2 ring-primary-600 shadow-xl' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'} flex flex-col`}>
    <div className="flex items-center justify-between mb-1">
      <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">{title}</h4>
      {highlighted && (
        <span className="px-2.5 py-0.5 bg-primary-600 text-white text-[10px] font-black uppercase rounded-full tracking-wider">
          Paling Populer
        </span>
      )}
    </div>
    <p className="text-xs text-slate-500 mb-6 leading-relaxed">{description}</p>
    
    <div className="mb-8">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-slate-900 dark:text-white">{price}</span>
        {priceSuffix && <span className="text-xs text-slate-500 font-bold">{priceSuffix}</span>}
      </div>
      {subPrice && <p className="text-xs font-semibold text-slate-400 mt-1">{subPrice}</p>}
    </div>

    <ul className="space-y-3.5 mb-10 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
          <CheckBadgeIcon className="w-4 h-4 text-primary-600 flex-shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>

    <button
      disabled={isCurrent || isLoading}
      onClick={onAction}
      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
        isCurrent 
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
          : highlighted 
          ? 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white shadow-lg shadow-primary-600/25' 
          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
      }`}
    >
      {isLoading ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>{isId ? 'Memproses...' : 'Processing...'}</span>
        </>
      ) : (
        <span>{isCurrent ? currentLabel : upgradeLabel}</span>
      )}
    </button>
  </div>
);

export default SubscriptionPage;
