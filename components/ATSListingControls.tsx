import React from 'react';
import { Stage } from '../types';

interface ATSListingControlsProps {
  showKnockedOut: boolean;
  onToggleKnockedOut: () => void;
  minScore: number | null;
  onSetMinScore: (score: number | null) => void;
  validSalaryFit: boolean;
  onToggleValidSalaryFit: () => void;
  onExport: (format: 'csv' | 'xls' | 'pdf') => void;
  stageFilter: string;
  onStageFilterChange: (stageId: string) => void;
  stages: Stage[];
  sources: string[];
  sourceFilter: string;
  onSourceFilterChange: (source: string) => void;
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

const ATSListingControls: React.FC<ATSListingControlsProps> = ({
  showKnockedOut,
  onToggleKnockedOut,
  minScore,
  onSetMinScore,
  validSalaryFit,
  onToggleValidSalaryFit,
  onExport,
  stageFilter,
  onStageFilterChange,
  stages,
  sources,
  sourceFilter,
  onSourceFilterChange,
  language = 'id'
}) => {
  const isId = language === 'id';

  const handleScoreToggle = () => {
    onSetMinScore(minScore === null ? 75 : null);
  };
  
  const handleExportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const format = e.target.value as 'csv' | 'xls' | 'pdf' | '';
    if (format) {
      onExport(format);
      e.target.value = ''; // Reset dropdown
    }
  };
  
  const selectStyles = "bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full pl-3 pr-8 py-2 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white";

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-4 w-full">
            <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
                <span className="font-semibold text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300 mr-1 w-full sm:w-auto">
                  {isId ? 'Filter Cepat:' : 'Quick Filters:'}
                </span>
                <FilterButton label={isId ? 'Gugur / Ditolak' : 'Knocked Out'} isActive={showKnockedOut} onClick={onToggleKnockedOut} />
                <FilterButton label={isId ? 'Skor ? 75' : 'Score ? 75'} isActive={minScore !== null} onClick={handleScoreToggle} />
                <FilterButton label={isId ? 'Kesesuaian Gaji' : 'Valid Salary Fit'} isActive={validSalaryFit} onClick={onToggleValidSalaryFit} />
            </div>
            
            <div className="flex items-center flex-wrap gap-2">
                <select
                    value={stageFilter}
                    onChange={(e) => onStageFilterChange(e.target.value)}
                    className={selectStyles}
                    aria-label={isId ? 'Filter berdasarkan Tahapan' : 'Filter by Stage'}
                >
                    <option value="all">{isId ? 'Semua Tahapan' : 'All Stages'}</option>
                    {stages.map(stage => {
                        const stageLabel = isId
                          ? (STAGE_NAME_ID[stage.id?.toLowerCase()] || STAGE_NAME_ID[stage.name?.toLowerCase()] || stage.name)
                          : stage.name;
                        return (
                          <option key={stage.id} value={stage.id}>{stageLabel}</option>
                        );
                    })}
                </select>

                <select
                    value={sourceFilter}
                    onChange={(e) => onSourceFilterChange(e.target.value)}
                    className={selectStyles}
                    aria-label={isId ? 'Filter berdasarkan Sumber' : 'Filter by Source'}
                >
                    <option value="all">{isId ? 'Semua Sumber' : 'All Sources'}</option>
                    {sources.map(source => (
                        <option key={source} value={source}>{source}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <div className="relative">
                <select 
                    onChange={handleExportChange}
                    defaultValue=""
                    className="appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full pl-3 pr-8 py-2 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white font-medium"
                >
                    <option value="" disabled>{isId ? 'Ekspor Format...' : 'Export As...'}</option>
                    <option value="csv">CSV</option>
                    <option value="xls">XLS (Excel)</option>
                    <option value="pdf">PDF</option>
                </select>
            </div>
        </div>
    </div>
  );
};

const FilterButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-sm ${
            isActive
                ? 'bg-primary-600 text-white shadow-primary-500/20'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
        }`}
    >
        {label}
    </button>
);

export default ATSListingControls;
