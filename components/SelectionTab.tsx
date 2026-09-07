import React, { useMemo } from 'react';
import { Application, Candidate, Interview, InterviewStatus, Job } from '../types';
import { CalendarIcon, ClipboardDocumentCheckIcon, DocumentTextIcon, BriefcaseIcon } from './icons/Icons';
import { translations } from '../utils/translations';

type InterviewWithApp = Interview & {
    application: Application & { candidate?: Candidate, job?: Job }
};

interface SelectionTabProps {
  interviews: InterviewWithApp[];
  onOpenFeedbackModal: (interview: Interview) => void;
  language?: 'en' | 'id';
}

const SelectionTab: React.FC<SelectionTabProps> = ({ interviews, onOpenFeedbackModal, language = 'id' }) => {
    const isId = language === 'id';
    const t = translations[language]?.selection || translations.id.selection;

    const { upcoming, pendingFeedback } = useMemo(() => {
        const now = new Date();
        const upcoming: InterviewWithApp[] = [];
        const pendingFeedback: InterviewWithApp[] = [];

        interviews.forEach(iv => {
            if (iv.status === InterviewStatus.Scheduled && new Date(iv.dateTime) >= now) {
                upcoming.push(iv);
            } else if (iv.status === InterviewStatus.Completed && !iv.recommendation) {
                pendingFeedback.push(iv);
            }
        });

        // Sort upcoming interviews chronologically
        upcoming.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        // Sort pending feedback by most recently completed
        pendingFeedback.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

        return { upcoming, pendingFeedback };
    }, [interviews]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.title}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InterviewList
          title={t.upcomingInterviews}
          icon={<CalendarIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />}
          interviews={upcoming}
          onOpenFeedbackModal={onOpenFeedbackModal}
          emptyMessage={t.noUpcoming}
          language={language}
        />
        <InterviewList
          title={t.pendingFeedback}
          icon={<ClipboardDocumentCheckIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />}
          interviews={pendingFeedback}
          onOpenFeedbackModal={onOpenFeedbackModal}
          emptyMessage={t.noPending}
          language={language}
        />
      </div>
    </div>
  );
};

interface InterviewListProps {
    title: string;
    icon: React.ReactElement;
    interviews: InterviewWithApp[];
    onOpenFeedbackModal: (interview: Interview) => void;
    emptyMessage: string;
    language: 'en' | 'id';
}

const InterviewList: React.FC<InterviewListProps> = ({ title, icon, interviews, onOpenFeedbackModal, emptyMessage, language }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full">{icon}</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title} ({interviews.length})</h3>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {interviews.length > 0 ? (
                interviews.map(iv => (
                    <InterviewCard key={iv.id} interview={iv} onOpenFeedbackModal={onOpenFeedbackModal} language={language} />
                ))
            ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                    {emptyMessage}
                </div>
            )}
        </div>
    </div>
);

const InterviewCard: React.FC<{ interview: InterviewWithApp, onOpenFeedbackModal: (interview: Interview) => void, language: 'en' | 'id' }> = ({ interview, onOpenFeedbackModal, language }) => {
    const { candidate, job } = interview.application;
    const isId = language === 'id';

    if (!candidate || !job) return null;

    const isUpcoming = interview.status === InterviewStatus.Scheduled;

    return (
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-600/50">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-bold text-slate-800 dark:text-white">{candidate.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <BriefcaseIcon className="w-3 h-3"/> {job.title}
                    </p>
                </div>
                <span className="text-xs font-medium bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 px-2 py-1 rounded-full">
                    {interview.type}
                </span>
            </div>
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>{isId ? 'Tanggal:' : 'Date:'}</strong> {new Date(interview.dateTime).toLocaleString(isId ? 'id-ID' : 'en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
                <p><strong>{isId ? 'Pewawancara:' : 'Interviewers:'}</strong> {interview.interviewers.map(i => i.name).join(', ')}</p>
            </div>
            <button
                onClick={() => onOpenFeedbackModal(interview)}
                className="mt-3 w-full text-center px-3 py-2 text-sm font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/50 rounded-xl hover:bg-primary-200 dark:hover:bg-primary-900 transition-colors"
            >
                {isUpcoming ? (isId ? 'Siapkan / Tambah Catatan' : 'Prepare / Add Notes') : (isId ? 'Isi Evaluasi Umpan Balik' : 'Add Feedback')}
            </button>
        </div>
    );
};

export default SelectionTab;
