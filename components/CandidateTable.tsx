import { getJobTitle, getSourceLabel } from '../utils/demoTranslations';
import React, { useState, useMemo } from 'react';
import { Application, Candidate, Stage, Job } from '../types';
import { TrashIcon, XCircleIcon } from './icons/Icons';

interface CandidateTableProps {
  applications: (Application & { candidate?: Candidate, stage?: Stage, job?: Job })[];
  onSelectCandidate: (app: Application & { candidate?: Candidate }) => void;
  onScheduleInterview: (app: Application & { candidate?: Candidate }) => void;
  onDeleteApplication?: (applicationId: string) => void;
  onBulkDeleteApplications?: (applicationIds: string[]) => void;
  onBulkRejectApplications?: (applicationIds: string[]) => void;
  language?: 'en' | 'id';
}

const STAGE_NAME_ID: Record<string, string> = {
  applied: 'Pendaftaran Masuk',
  screening: 'Penyaringan CV',
  assessment: 'Penilaian / Tes',
  interview: 'Wawancara',
  offer: 'Penawaran Kerja',
  hired: 'Diterima',
  rejected: 'Ditolak'
};

const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-orange-500';
};

const CandidateTable: React.FC<CandidateTableProps> = ({ 
  applications, 
  onSelectCandidate, 
  onScheduleInterview, 
  onDeleteApplication,
  onBulkDeleteApplications,
  onBulkRejectApplications,
  language = 'id' 
}) => {
  const isId = language === 'id';
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const validApps = useMemo(() => applications.filter(a => !!a.candidate), [applications]);
  const isAllSelected = validApps.length > 0 && selectedIds.length === validApps.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(validApps.map(a => a.id));
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <div className="relative bg-white dark:bg-slate-800 shadow-md rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden w-full align-middle">
      <div className="overflow-x-auto w-full align-middle">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/70 dark:text-slate-300">
            <tr>
              <th scope="col" className="w-12 px-4 py-3 text-center">
                <input 
                  type="checkbox" 
                  checked={isAllSelected} 
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  title={isId ? 'Pilih Semua' : 'Select All'}
                />
              </th>
              <th scope="col" className="px-6 py-3">{isId ? 'Kandidat' : 'Candidate'}</th>
              <th scope="col" className="px-6 py-3">{isId ? 'Posisi' : 'Position'}</th>
              <th scope="col" className="px-6 py-3">{isId ? 'Tahapan' : 'Stage'}</th>
              <th scope="col" className="px-6 py-3">{isId ? 'Tgl Melamar' : 'Applied Date'}</th>
              <th scope="col" className="px-6 py-3">{isId ? 'Sumber' : 'Source'}</th>
              <th scope="col" className="px-6 py-3 text-center">{isId ? 'Pengalaman' : 'Experience'}</th>
              <th scope="col" className="px-6 py-3 text-right">{isId ? 'Ekspektasi Gaji' : 'Expected Salary'}</th>
              <th scope="col" className="px-6 py-3 text-center">{isId ? 'Skor' : 'Score'}</th>
              <th scope="col" className="px-6 py-3 text-center">{isId ? 'Aksi' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => {
              if (!app.candidate) return null;
              const isChecked = selectedIds.includes(app.id);
              const stageLabel = isId
                ? (STAGE_NAME_ID[app.stage?.id?.toLowerCase() || ''] || STAGE_NAME_ID[app.stage?.name?.toLowerCase() || ''] || app.stage?.name)
                : app.stage?.name;

              return (
                <tr 
                  key={app.id} 
                  onClick={() => onSelectCandidate(app)}
                  className={`bg-white dark:bg-slate-800 border-b dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors ${
                    isChecked ? 'bg-primary-50/40 dark:bg-primary-950/20' : ''
                  }`}
                >
                  <td className="w-12 px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={(e) => handleToggleSelect(app.id, e as any)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                        <img className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600 object-cover" src={app.candidate.avatarUrl} alt={app.candidate.name} />
                        <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 dark:text-white">{app.candidate.name}</span>
                              {app.knockedOut && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                  {isId ? 'Ditolak' : 'Rejected'}
                                </span>
                              )}
                            </div>
                            <div className="font-normal text-xs text-slate-500">{app.candidate.email}</div>
                        </div>
                    </div>
                  </th>
                   <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                    {app.job?.title ? getJobTitle(app.job.title, language) : ''}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: app.stage?.color }}></div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{stageLabel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {new Date(app.appliedDate).toLocaleDateString(isId ? 'id-ID' : 'en-US')}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {getSourceLabel(app.source, language)}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300">
                    {app.candidate.experienceYears} {isId ? 'thn' : 'yrs'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700 dark:text-slate-300">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(app.candidate.expectedSalary)}
                  </td>
                  <td className={`px-6 py-4 font-bold text-lg text-center ${getScoreColor(app.totalScore)}`}>
                    {app.totalScore}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onScheduleInterview(app); }}
                        className="font-semibold text-xs px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                      >
                        {isId ? 'Jadwalkan' : 'Schedule'}
                      </button>

                      {onDeleteApplication && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const msg = isId 
                              ? `Hapus lamaran "${app.candidate?.name}"? Tindakan ini tidak dapat dibatalkan.`
                              : `Delete application for "${app.candidate?.name}"? This action cannot be undone.`;
                            if (window.confirm(msg)) {
                              onDeleteApplication(app.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                          title={isId ? 'Hapus' : 'Delete'}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
             {applications.length === 0 && (
                <tr>
                    <td colSpan={10} className="text-center py-10 text-slate-500 dark:text-slate-400">
                        {isId ? 'Tidak ada kandidat yang cocok dengan filter saat ini.' : 'No candidates match the current filters.'}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/70 flex items-center gap-3.5 transition-all">
          <div className="flex items-center gap-2 pr-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-xs font-bold text-white">
              {selectedIds.length}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-200 whitespace-nowrap">
              {isId ? `${selectedIds.length} pelamar dipilih` : `${selectedIds.length} selected`}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {onBulkRejectApplications && (
            <button
              type="button"
              onClick={() => {
                onBulkRejectApplications(selectedIds);
                setSelectedIds([]);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors"
            >
              <XCircleIcon className="w-4 h-4" />
              <span>{isId ? `Tolak (${selectedIds.length})` : `Reject (${selectedIds.length})`}</span>
            </button>
          )}

          {onBulkDeleteApplications && (
            <button
              type="button"
              onClick={() => {
                const msg = isId
                  ? `Hapus permanen ${selectedIds.length} lamaran yang dipilih? Tindakan ini tidak dapat dibatalkan.`
                  : `Permanently delete ${selectedIds.length} selected applications? This cannot be undone.`;
                if (window.confirm(msg)) {
                  onBulkDeleteApplications(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              <span>{isId ? `Hapus (${selectedIds.length})` : `Delete (${selectedIds.length})`}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded transition-colors ml-1"
          >
            {isId ? 'Batal' : 'Cancel'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateTable;
