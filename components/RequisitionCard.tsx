import React from 'react';
import { Requisition } from '../types';
import { MapPinIcon, UsersIcon, CalendarIcon, CheckCircleIcon, SparklesIcon } from './icons/Icons';
import { getRequisitionTitle, getDepartmentLabel, getLevelLabel, getLocationLabel } from '../utils/demoTranslations';

interface RequisitionCardProps {
  requisition: Requisition;
  onApprove: () => void;
  onCreateJob: () => void;
  language?: 'en' | 'id';
}

const STATUS_STYLES: Record<Requisition['status'], string> = {
    Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    Approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    Rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
};

const RequisitionCard: React.FC<RequisitionCardProps> = ({ requisition, onApprove, onCreateJob, language = 'id' }) => {
  const isId = language === 'id';
  const jobId = requisition.jobId || (requisition as any).job_id;
  const rawLevel = requisition.experienceLevel || (requisition as any).experience_level || 'Mid-level';
  const headcount = requisition.headcount || 1;

  const displayTitle = getRequisitionTitle(requisition.title, language);
  const displayDepartment = getDepartmentLabel(requisition.department, language);
  const displayLevel = getLevelLabel(rawLevel, language);
  const displayLocation = getLocationLabel(requisition.location, language);

  // UI label - diterjemahkan
  const statusLabel = isId
    ? (requisition.status === 'Approved' ? 'Disetujui' : requisition.status === 'Pending' ? 'Menunggu' : 'Ditolak')
    : requisition.status;

  const renderFooter = () => {
    if (jobId) {
      return (
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1.5">
          <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
          <span>{isId ? 'Lowongan Diterbitkan' : 'Job Posted'}</span>
        </span>
      );
    }

    switch (requisition.status) {
      case 'Pending':
        return (
          <button
            onClick={onApprove}
            className="inline-flex items-center justify-center gap-x-2 px-3.5 py-1.5 text-sm font-bold text-white bg-emerald-600 rounded-xl shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <CheckCircleIcon className="h-4 w-4" />
            <span>{isId ? 'Setujui Permintaan' : 'Approve'}</span>
          </button>
        );
      case 'Approved':
        return (
          <button
            onClick={onCreateJob}
            className="inline-flex items-center justify-center gap-x-2 px-3.5 py-1.5 text-sm font-bold text-white bg-primary-600 rounded-xl shadow-sm hover:bg-primary-700 transition-colors"
          >
            <SparklesIcon className="h-4 w-4" />
            <span>{isId ? 'Buat Lowongan' : 'Create Job'}</span>
          </button>
        );
      default:
        return null;
    }
  };

  const formattedDate = requisition.deadline
    ? new Date(requisition.deadline + (requisition.deadline.includes('T') ? '' : 'T00:00:00')).toLocaleDateString(isId ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

  return (
    <div className="p-5 rounded-2xl shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{displayTitle}</h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[requisition.status] || STATUS_STYLES.Pending}`}>
            {statusLabel}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{displayDepartment} &middot; {displayLevel}</p>
        <div className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <span>{headcount} {isId ? 'Kuota / Formasi' : 'Headcount'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <span>{displayLocation}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <span>{isId ? 'Batas Waktu' : 'Deadline'}: {formattedDate}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
        {renderFooter()}
      </div>
    </div>
  );
};

export default RequisitionCard;
