import React, { useState } from 'react';
import { Job, JobStatus } from '../types';
import { UsersIcon, MapPinIcon, ClipboardIcon, CheckIcon, CalendarIcon, CurrencyDollarIcon } from './icons/Icons';
import { getJobTitle, getDepartmentLabel, getLevelLabel, getLocationLabel } from '../utils/demoTranslations';

interface JobPostingCardProps {
  job: Job;
  onSelect: () => void;
  language?: 'en' | 'id';
}

const STATUS_STYLES: Record<JobStatus, string> = {
    [JobStatus.Open]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    [JobStatus.OnHold]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    [JobStatus.Closed]: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

const JobPostingCard: React.FC<JobPostingCardProps> = ({ job, onSelect, language = 'id' }) => {
  const isId = language === 'id';
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onSelect from firing
    const url = `${window.location.origin}${window.location.pathname}?jobId=${job.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const displayTitle = getJobTitle(job.title, language);
  const displayDepartment = getDepartmentLabel(job.department, language);
  const displayLevel = getLevelLabel(job.level, language);
  const displayLocation = getLocationLabel(job.location, language);

  const statusLabel = isId
    ? (job.status === JobStatus.Open ? 'Dibuka' : job.status === JobStatus.OnHold ? 'Ditunda' : 'Ditutup')
    : job.status;

  const formattedDeadline = job.deadline
    ? new Date(job.deadline + (job.deadline.includes('T') ? '' : 'T00:00:00')).toLocaleDateString(isId ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div
      onClick={onSelect}
      className="p-5 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 hover:border-primary-500 hover:shadow-md flex flex-col group"
    >
      <div className="flex-grow">
        <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {displayTitle}
            </h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[job.status] || STATUS_STYLES[JobStatus.Open]}`}>
                {statusLabel}
            </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{displayDepartment} &middot; {displayLevel}</p>
        <div className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <span>{job.totalApplicants} {isId ? 'Pelamar' : `Applicant${job.totalApplicants !== 1 ? 's' : ''}`}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <span>{displayLocation}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <span>{`$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`}</span>
          </div>
          {formattedDeadline && (
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
              <span>{isId ? 'Batas Waktu:' : 'Deadline:'} {formattedDeadline}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center text-sm font-semibold text-center">
        <button 
          onClick={handleCopyLink} 
          className="w-full flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
            {isCopied ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <ClipboardIcon className="w-4 h-4" />}
            <span className="truncate">{isCopied ? (isId ? 'Tautan Disalin!' : 'Copied Link!') : (isId ? 'Salin Tautan Publik' : 'Copy Public Link')}</span>
        </button>
      </div>
    </div>
  );
};

export default JobPostingCard;
