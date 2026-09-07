import React, { useState, useEffect } from 'react';
import { Interview, Job, Recommendation, CompetencyFeedback, InterviewStatus } from '../types';
import { XMarkIcon } from './icons/Icons';

interface InterviewFeedbackModalProps {
  language?: 'en' | 'id';
  isOpen: boolean;
  onClose: () => void;
  interview: Interview | null;
  job: Job | null;
  onSave: (interviewId: string, updates: Partial<Omit<Interview, 'id'>>) => void;
}

const RECOMMENDATION_ID: Record<string, string> = {
  [Recommendation.StrongHire]: 'Sangat Direkomendasikan (Strong Hire)',
  [Recommendation.Hire]: 'Direkomendasikan (Hire)',
  [Recommendation.NoHire]: 'Tidak Direkomendasikan (No Hire)',
};

const InterviewFeedbackModal: React.FC<InterviewFeedbackModalProps> = ({ isOpen, onClose, interview, job, onSave, language = 'id' }) => {
  const isId = language === 'id';
  const [feedback, setFeedback] = useState<CompetencyFeedback[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation>(Recommendation.Hire);

  useEffect(() => {
    if (isOpen && job?.competencies && interview) {
      const initialFeedback = job.competencies.map(comp => {
        const existing = interview.scorecard?.find(s => s.competency === comp);
        return {
          competency: comp,
          rating: existing?.rating || 3,
          notes: existing?.notes || ''
        };
      });
      setFeedback(initialFeedback);
      setRecommendation(interview.recommendation || Recommendation.Hire);
    }
  }, [isOpen, job, interview]);

  const handleRatingChange = (competency: string, rating: number) => {
    setFeedback(prev => prev.map(fb => fb.competency === competency ? { ...fb, rating } : fb));
  };
  
  const handleNotesChange = (competency: string, notes: string) => {
    setFeedback(prev => prev.map(fb => fb.competency === competency ? { ...fb, notes } : fb));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interview) return;
    onSave(interview.id, {
        status: InterviewStatus.Completed,
        scorecard: feedback,
        recommendation: recommendation,
    });
  };

  if (!isOpen || !interview || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl transform rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all m-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700 rounded-t">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white" id="modal-title">
              {isId ? `Masukan Wawancara untuk ${interview.type}` : `Interview Feedback for ${interview.type}`}
            </h3>
            <button type="button" onClick={onClose} className="p-1 ml-auto bg-transparent rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-600 dark:hover:text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {feedback.map(({ competency, rating, notes }) => (
                <div key={competency}>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white">{competency}</label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {isId ? '1 = Kurang Memenuhi, 3 = Sesuai Ekspektasi, 5 = Melebihi Ekspektasi' : '1 = Does not meet, 3 = Meets, 5 = Exceeds Expectations'}
                    </p>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map(star => (
                             <button type="button" key={star} onClick={() => handleRatingChange(competency, star)}>
                                <svg className={`w-6 h-6 ${rating >= star ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-500'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            </button>
                        ))}
                    </div>
                    <textarea 
                        value={notes}
                        onChange={(e) => handleNotesChange(competency, e.target.value)}
                        rows={2}
                        placeholder={isId ? `Catatan evaluasi untuk ${competency}...` : `Notes on ${competency}...`}
                        className="mt-2 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                    />
                </div>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <label htmlFor="recommendation" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  {isId ? 'Rekomendasi Keseluruhan' : 'Overall Recommendation'}
                </label>
                <select 
                    id="recommendation" 
                    value={recommendation}
                    onChange={e => setRecommendation(e.target.value as Recommendation)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600"
                >
                    {Object.values(Recommendation).map(rec => (
                      <option key={rec} value={rec}>
                        {isId ? (RECOMMENDATION_ID[rec] || rec) : rec}
                      </option>
                    ))}
                </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end p-5 space-x-2 border-t border-slate-200 dark:border-slate-700 rounded-b">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500">
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700">
              {isId ? 'Simpan Masukan' : 'Save Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewFeedbackModal;
