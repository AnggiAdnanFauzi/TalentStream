import React from 'react';
import { Application, Candidate, Stage } from '../types';
import CandidateCard from './CandidateCard';

const STAGE_NAME_ID: Record<string, string> = {
  'applied': 'Pendaftaran Masuk',
  'screening': 'Penyaringan CV',
  'assessment': 'Penilaian / Tes',
  'interview': 'Wawancara',
  'offer': 'Penawaran Kerja',
  'hired': 'Diterima',
  'rejected': 'Ditolak'
};

interface KanbanColumnProps {
  language?: 'en' | 'id';
  stage: Stage;
  applications: (Application & { candidate?: Candidate })[];
  onSelectCandidate: (app: Application & { candidate?: Candidate }) => void;
  onScheduleInterview: (app: Application & { candidate?: Candidate }) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, applications, onSelectCandidate, onScheduleInterview, language = 'id' }) => {
  const isId = language === 'id';
  const stageName = isId
    ? (STAGE_NAME_ID[stage.id?.toLowerCase()] || STAGE_NAME_ID[stage.name?.toLowerCase()] || stage.name)
    : stage.name;

  return (
    <div className="w-80 flex-shrink-0">
        <div 
          className="px-3 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 rounded-t-lg border-t-4 flex justify-between items-center"
          style={{ borderTopColor: stage.color }}
        >
            <h3 className="text-slate-700 dark:text-slate-200">{stageName}</h3>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">{applications.length}</span>
        </div>
      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-b-lg space-y-3 h-full overflow-y-auto" style={{maxHeight: 'calc(100vh - 250px)'}}>
        {applications.map(app => (
          <CandidateCard 
            language={language}
            key={app.id}
            application={app}
            onSelectCandidate={() => onSelectCandidate(app)}
            onScheduleInterview={() => onScheduleInterview(app)}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
