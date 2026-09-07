import { getJobTitle, getDepartmentLabel, getLevelLabel, getLocationLabel, getJobDescription } from '../utils/demoTranslations';
import React, { useState, useEffect, useMemo } from 'react';
import { Job, Application, Candidate, Stage, NewCandidateData } from '../types';
import { ArrowLeftIcon, BriefcaseIcon, MapPinIcon, UsersIcon, CalendarIcon, CurrencyDollarIcon, PencilIcon, CheckIcon, XMarkIcon, LinkIcon, ClipboardIcon, UserPlusIcon } from './icons/Icons';
import CandidateTable from './CandidateTable';
import AddCandidateModal from './AddCandidateModal';

interface JobDetailPageProps {
  job: Job;
  applications: (Application & { candidate?: Candidate; stage?: Stage })[];
  onBack: () => void;
  onUpdateJob: (jobId: string, updates: Partial<Job>) => void;
  onAddCandidateAndApplication: (candidateData: NewCandidateData, source: string) => void;
  onSelectCandidate: (app: Application & { candidate?: Candidate, job?: Job }) => void;
  onScheduleInterview: (app: Application & { candidate?: Candidate }) => void;
  language?: 'en' | 'id';
}

const JobDetailPage: React.FC<JobDetailPageProps> = ({ 
    job, applications, onBack, onUpdateJob, 
    onAddCandidateAndApplication, onSelectCandidate, onScheduleInterview,
    language = 'id'
}) => {
  const isId = language === 'id';
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleAddCandidate = (candidateData: NewCandidateData) => {
    onAddCandidateAndApplication(candidateData, isId ? 'Entri Manual' : 'Manual Entry');
    setIsAddCandidateModalOpen(false);
  };
    
  const publicUrl = `${window.location.origin}${window.location.pathname}?jobId=${job.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleViewPublicPage = () => {
    window.open(publicUrl, '_blank');
  };

  const displayTitle = getJobTitle(job.title, language);
  const displayDepartment = getDepartmentLabel(job.department, language);
  const displayLevel = getLevelLabel(job.level, language);
  const displayLocation = getLocationLabel(job.location, language);
  const displayDescription = getJobDescription(job.id, job.jobDescription || '', language);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 mb-4">
          <ArrowLeftIcon className="w-4 h-4" />
          {isId ? 'Kembali ke Tampilan Proyek' : 'Back to Project View'}
        </button>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{displayTitle}</h2>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><BriefcaseIcon className="w-4 h-4" /> {displayDepartment} &middot; {displayLevel}</span>
                    <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4" /> {displayLocation}</span>
                </div>
            </div>
            {/* Job Actions */}
             <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{isId ? 'Aksi Lowongan' : 'Actions'}</h4>
                <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2">
                    <button onClick={() => setIsAddCandidateModalOpen(true)} className="action-button-sm bg-primary-600 text-white hover:bg-primary-700 rounded-xl px-3 py-1.5 font-semibold text-xs flex items-center gap-1.5 shadow-sm">
                        <UserPlusIcon className="w-4 h-4" />
                        <span>{isId ? 'Tambah Manual' : 'Add Manually'}</span>
                    </button>
                    <button onClick={handleViewPublicPage} className="action-button-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-xl px-3 py-1.5 font-semibold text-xs flex items-center gap-1.5">
                        <LinkIcon className="w-4 h-4" />
                        <span>{isId ? 'Buka Halaman Publik' : 'View Public Page'}</span>
                    </button>
                    <button onClick={handleCopyLink} className="action-button-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 min-w-[120px] rounded-xl px-3 py-1.5 font-semibold text-xs flex items-center gap-1.5">
                        {isCopied ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <ClipboardIcon className="w-4 h-4" />}
                        <span>{isCopied ? (isId ? 'Tersalin!' : 'Copied!') : (isId ? 'Salin Tautan' : 'Copy Link')}</span>
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <EditableSection
                title={isId ? "Deskripsi Pekerjaan" : "Job Description"}
                initialValue={displayDescription}
                onSave={(value) => onUpdateJob(job.id, { jobDescription: value })}
                render={(value) => <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{value}</p>}
                editComponent="textarea"
                language={language}
            />
            <EditableSection
                title={isId ? "Kompetensi Utama" : "Key Competencies"}
                initialValue={job.competencies?.join(', ') || ''}
                onSave={(value) => onUpdateJob(job.id, { competencies: value.split(',').map(c => c.trim()).filter(Boolean) })}
                render={(value) => (
                    <div className="flex flex-wrap gap-2">
                        {value.split(',').map(c => c.trim()).filter(Boolean).map(comp => (
                            <span key={comp} className="text-sm bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">{comp}</span>
                        ))}
                    </div>
                )}
                language={language}
            />
             <EditableSection
                title={isId ? "Daftar Pertanyaan Wawancara" : "Interview Questions"}
                initialValue={
                    (job.interviewQuestions || [])
                        .map(group => `[${group.type}]\n${group.questions.join('\n')}`)
                        .join('\n\n')
                }
                onSave={(value) => {
                    const sections = value.split(/\[(.*?)\]/).filter(Boolean);
                    const interviewQuestions = [];
                    for (let i = 0; i < sections.length; i += 2) {
                        const type = sections[i].trim();
                        const questionsBlock = sections[i+1] || '';
                        const questions = questionsBlock.trim().split('\n').filter(Boolean);
                        
                        if (type && questions.length > 0) {
                            interviewQuestions.push({
                                type: type,
                                questions: questions,
                            });
                        }
                    }
                    onUpdateJob(job.id, { interviewQuestions });
                }}
                 render={(value) => <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{value}</p>}
                editComponent="textarea"
                rows={10}
                language={language}
            />
        </div>
        <div className="lg:col-span-1">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4 sticky top-6">
                 <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                   {isId ? 'Daftar Pelamar' : 'Applicants'} ({applications.length})
                 </h3>
                 <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <CandidateTable 
                        applications={applications} 
                        onSelectCandidate={onSelectCandidate}
                        onScheduleInterview={onScheduleInterview}
                    />
                 </div>
             </div>
        </div>
      </div>
       <AddCandidateModal
        isOpen={isAddCandidateModalOpen}
        onClose={() => setIsAddCandidateModalOpen(false)}
        onAddCandidate={handleAddCandidate}
      />
    </div>
  );
};

// --- Sub-components ---

interface EditableSectionProps {
    title: string;
    initialValue: string;
    onSave: (value: string) => void;
    render: (value: string) => React.ReactNode;
    editComponent?: 'input' | 'textarea';
    rows?: number;
    language: 'en' | 'id';
}

const EditableSection: React.FC<EditableSectionProps> = ({ title, initialValue, onSave, render, editComponent = 'input', rows = 6, language }) => {
    const isId = language === 'id';
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleSave = () => {
        onSave(value);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setValue(initialValue);
        setIsEditing(false);
    };

    const EditComponent = editComponent === 'textarea' ? 'textarea' : 'input';

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                        <PencilIcon className="w-4 h-4" /> {isId ? 'Ubah' : 'Edit'}
                    </button>
                )}
            </div>
            
            {isEditing ? (
                <div className="space-y-3">
                    <EditComponent 
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value)}
                        rows={rows}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                    <div className="flex justify-end items-center gap-2">
                        <button onClick={handleCancel} className="px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500 flex items-center gap-1">
                            <XMarkIcon className="w-4 h-4"/> {isId ? 'Batal' : 'Cancel'}
                        </button>
                        <button onClick={handleSave} className="px-3 py-1.5 text-sm font-semibold text-white bg-primary-600 rounded-xl shadow-sm hover:bg-primary-700 flex items-center gap-1">
                           <CheckIcon className="w-4 h-4"/> {isId ? 'Simpan' : 'Save'}
                        </button>
                    </div>
                </div>
            ) : (
                render(value)
            )}
        </div>
    );
};

export default JobDetailPage;
