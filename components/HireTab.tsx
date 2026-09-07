import React, { useMemo } from 'react';
import { Application, Candidate, Job, Stage } from '../types';
import { BriefcaseIcon, CheckCircleIcon, DocumentTextIcon, SparklesIcon, XCircleIcon } from './icons/Icons';
import { translations } from '../utils/translations';

type AppWithDetails = Application & { candidate?: Candidate; job?: Job };

interface HireTabProps {
  applications: AppWithDetails[];
  stages: Stage[];
  onUpdateApplication: (applicationId: string, updates: Partial<Application>) => void;
  onOpenOfferModal: (application: AppWithDetails) => void;
  language?: 'en' | 'id';
}

const HireTab: React.FC<HireTabProps> = ({ applications, stages, onUpdateApplication, onOpenOfferModal, language = 'id' }) => {
  const isId = language === 'id';
  const t = translations[language]?.hire || translations.id.hire;

  const { pendingOffers, hiredCandidates } = useMemo(() => {
    const offerStageId = stages.find(s => s.name.toLowerCase() === 'offer')?.id;
    const hiredStageId = stages.find(s => s.name.toLowerCase() === 'hired')?.id;
    
    return {
      pendingOffers: applications.filter(app => app.stageId === offerStageId && !app.knockedOut),
      hiredCandidates: applications.filter(app => app.stageId === hiredStageId),
    };
  }, [applications, stages]);

  const handleMarkAsHired = (app: AppWithDetails) => {
    const hiredStageId = stages.find(s => s.name.toLowerCase() === 'hired')?.id;
    if (hiredStageId) {
      onUpdateApplication(app.id, { stageId: hiredStageId });
    }
  };

  const handleDeclineOffer = (app: AppWithDetails) => {
    const confirmMsg = isId 
      ? `Apakah Anda yakin ingin menandai penawaran untuk ${app.candidate?.name || 'kandidat'} ditolak? Tindakan ini akan mengeluarkan kandidat dari alur seleksi.`
      : `Are you sure you want to mark ${app.candidate?.name || 'candidate'}'s offer as declined? This will knock them out of the pipeline.`;

    if (window.confirm(confirmMsg)) {
        onUpdateApplication(app.id, { knockedOut: true });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.title}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Column
          title={t.pendingOffers}
          apps={pendingOffers}
          emptyMessage={t.noPendingOffers}
        >
          {(app) => (
            <CandidateOfferCard
              key={app.id}
              app={app}
              onGenerateOffer={() => onOpenOfferModal(app)}
              onMarkAsHired={() => handleMarkAsHired(app)}
              onDeclineOffer={() => handleDeclineOffer(app)}
              language={language}
            />
          )}
        </Column>

        <Column
          title={t.hiredCandidates}
          apps={hiredCandidates}
          emptyMessage={t.noHiredCandidates}
        >
          {(app) => <HiredCandidateCard key={app.id} app={app} language={language} />}
        </Column>
      </div>
    </div>
  );
};

// --- Sub-components ---

interface ColumnProps {
  title: string;
  apps: AppWithDetails[];
  emptyMessage: string;
  children: (app: AppWithDetails) => React.ReactNode;
}

const Column: React.FC<ColumnProps> = ({ title, apps, emptyMessage, children }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title} ({apps.length})</h3>
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      {apps.length > 0 ? (
        apps.map(children)
      ) : (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">{emptyMessage}</div>
      )}
    </div>
  </div>
);

interface CandidateOfferCardProps {
  app: AppWithDetails;
  onGenerateOffer: () => void;
  onMarkAsHired: () => void;
  onDeclineOffer: () => void;
  language: 'en' | 'id';
}

const CandidateOfferCard: React.FC<CandidateOfferCardProps> = ({ app, onGenerateOffer, onMarkAsHired, onDeclineOffer, language }) => {
  const isId = language === 'id';
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-600/50">
      <div className="flex items-center space-x-4">
        <img src={app.candidate?.avatarUrl} alt={app.candidate?.name} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-600" />
        <div>
          <p className="font-bold text-slate-800 dark:text-white">{app.candidate?.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            <BriefcaseIcon className="w-3 h-3" /> {app.job?.title}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm font-semibold">
        <button onClick={onGenerateOffer} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-colors">
          <DocumentTextIcon className="w-4 h-4" />
          {isId ? 'Surat Tawaran' : 'Offer Letter'}
        </button>
        <button onClick={onMarkAsHired} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 transition-colors">
          <CheckCircleIcon className="w-4 h-4" />
          {isId ? 'Diterima' : 'Hired'}
        </button>
        <button onClick={onDeclineOffer} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/60 transition-colors">
          <XCircleIcon className="w-4 h-4" />
          {isId ? 'Ditolak' : 'Declined'}
        </button>
      </div>
    </div>
  );
};

const HiredCandidateCard: React.FC<{ app: AppWithDetails, language: 'en' | 'id' }> = ({ app, language }) => {
  const isId = language === 'id';
  return (
    <div className="bg-emerald-50/70 dark:bg-emerald-900/20 p-4 rounded-xl flex items-center space-x-4 border border-emerald-200 dark:border-emerald-500/30">
        <img src={app.candidate?.avatarUrl} alt={app.candidate?.name} className="w-12 h-12 rounded-full border border-emerald-300 dark:border-emerald-600" />
        <div>
            <p className="font-bold text-slate-800 dark:text-white">{app.candidate?.name}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{app.job?.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isId ? 'Diterima pada:' : 'Hired on:'} {app.stageHistory?.slice(-1)[0]?.date ? new Date(app.stageHistory.slice(-1)[0].date).toLocaleDateString(isId ? 'id-ID' : 'en-US') : 'N/A'}
            </p>
        </div>
    </div>
  );
};

export default HireTab;
