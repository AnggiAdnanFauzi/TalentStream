import React, { useState } from 'react';
import { User, ActiveTab } from '../types';
import { apiSubmitFeedback } from '../services/api';
import { MessageSquarePlus, Star, X, CheckCircle2, Sparkles, Bug, Lightbulb, HeartHandshake } from 'lucide-react';
import { ArrowPathIcon } from './icons/Icons';

interface FeedbackWidgetProps {
  currentTab: ActiveTab;
  user?: User | null;
  language: 'en' | 'id';
  addToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  currentTab,
  user,
  language,
  addToast
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [toolCategory, setToolCategory] = useState<string>(currentTab || 'general');
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'praise'>('suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isId = language === 'id';

  // Synchronize category with active tab when opened
  const handleOpen = () => {
    setToolCategory(currentTab || 'general');
    setIsSubmitted(false);
    setIsOpen(true);
  };

  const getRatingLabel = (stars: number) => {
    if (isId) {
      switch (stars) {
        case 1: return 'Sangat Buruk';
        case 2: return 'Perlu Ditingkatkan';
        case 3: return 'Cukup Baik';
        case 4: return 'Bagus & Memuaskan';
        case 5: return 'Sangat Puas & Luar Biasa!';
        default: return '';
      }
    } else {
      switch (stars) {
        case 1: return 'Very Poor';
        case 2: return 'Needs Improvement';
        case 3: return 'Average';
        case 4: return 'Good & Helpful';
        case 5: return 'Outstanding Experience!';
        default: return '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      if (addToast) addToast(isId ? 'Harap tuliskan masukan Anda.' : 'Please write your feedback message.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        tool_category: toolCategory,
        rating,
        feedback_type: feedbackType,
        message: message.trim(),
        user_id: user?.id || 'guest',
        user_name: user?.name || 'Recruiter',
        user_email: user?.email || 'recruiter@talentstream.com',
      };

      const res = await apiSubmitFeedback(payload);

      // Save locally as well
      try {
        const saved = JSON.parse(localStorage.getItem('ts_feedbacks') || '[]');
        saved.unshift({ ...payload, id: 'fb-' + Date.now(), createdAt: new Date().toISOString() });
        localStorage.setItem('ts_feedbacks', JSON.stringify(saved));
      } catch (e) {
        // ignore
      }

      setIsSubmitted(true);
      if (addToast) {
        addToast(isId ? 'Terima kasih atas masukan berharga Anda!' : 'Thank you for your valuable feedback!', 'success');
      }

      setTimeout(() => {
        setIsOpen(false);
        setMessage('');
        setIsSubmitted(false);
      }, 2000);
    } catch (err: any) {
      if (addToast) {
        addToast(isId ? 'Gagal mengirim masukan: ' + err.message : 'Failed to submit feedback', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpen}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-2xl shadow-xl shadow-primary-600/30 hover:shadow-primary-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold text-sm"
          title={isId ? 'Kirim Umpan Balik / Saran' : 'Send Feedback'}
        >
          <div className="relative">
            <MessageSquarePlus className="w-5 h-5 text-white transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
          </div>
          <span className="hidden sm:inline-block tracking-wide">
            {isId ? 'Beri Masukan' : 'Feedback'}
          </span>
        </button>
      </div>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {isId ? 'Umpan Balik & Masukan Fitur' : 'Tool & Feature Feedback'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isId ? 'Bantu kami meningkatkan kualitas tools TalentStream' : 'Help us elevate your TalentStream recruitment experience'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            {isSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isId ? 'Terima Kasih Banyak!' : 'Thank You!'}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {isId 
                    ? 'Masukan Anda telah berhasil dikirim ke tim pengembangan TalentStream.' 
                    : 'Your insights have been successfully transmitted to the TalentStream team.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Tool Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {isId ? 'Fitur / Tool Terkait' : 'Target Tool / Feature'}
                  </label>
                  <select
                    value={toolCategory}
                    onChange={(e) => setToolCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                  >
                    <option value="requisition">AI Job Requisition Assistant</option>
                    <option value="sourcing">AI Talent Sourcing</option>
                    <option value="screening">AI CV Parser & Screening</option>
                    <option value="selection">Interview Scheduler & Candidate Selection</option>
                    <option value="hire">Offer Letter Generator (Hire)</option>
                    <option value="analytics">Recruitment Analytics Dashboard</option>
                    <option value="settings">Settings & Backup/Restore</option>
                    <option value="general">{isId ? 'Pengalaman Umum Platform' : 'Overall Platform Experience'}</option>
                  </select>
                </div>

                {/* Rating Stars */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {isId ? 'Rating Kepuasan' : 'Satisfaction Rating'}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-110 active:scale-95 transition-all text-slate-300 dark:text-slate-700"
                          >
                            <Star 
                              className={`w-7 h-7 transition-colors ${
                                isFilled 
                                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]' 
                                  : 'text-slate-300 dark:text-slate-600'
                              }`} 
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                      {getRatingLabel(hoverRating || rating)}
                    </span>
                  </div>
                </div>

                {/* Feedback Type Chips */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {isId ? 'Kategori Masukan' : 'Feedback Category'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFeedbackType('suggestion')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        feedbackType === 'suggestion'
                          ? 'bg-primary-50 dark:bg-primary-950 border-primary-500 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{isId ? 'Saran Fitur' : 'Suggestion'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFeedbackType('bug')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        feedbackType === 'bug'
                          ? 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-600 dark:text-red-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Bug className="w-3.5 h-3.5" />
                      <span>{isId ? 'Kendala / Bug' : 'Issue / Bug'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFeedbackType('praise')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        feedbackType === 'praise'
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>{isId ? 'Pujian / Review' : 'Compliment'}</span>
                    </button>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {isId ? 'Pesan & Saran Anda' : 'Your Message & Insights'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isId 
                        ? 'Ceritakan pengalaman Anda, kendala yang ditemukan, atau ide fitur baru yang Anda butuhkan...' 
                        : 'Share your thoughts, suggestions, or any issue you encountered...'
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm shadow-sm resize-none"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors"
                  >
                    {isId ? 'Batal' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                    <span>{isSubmitting ? (isId ? 'Mengirim...' : 'Submitting...') : (isId ? 'Kirim Masukan' : 'Submit Feedback')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;
