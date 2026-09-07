import React from 'react';
import { Project, Job, Application } from '../types';
import { BriefcaseIcon, UsersIcon } from './icons/Icons';
import { getProjectTranslation } from '../utils/demoTranslations';

interface ProjectCardProps {
  project: Project;
  jobs: Job[];
  applications: Application[];
  onSelectProject: () => void;
  language?: 'en' | 'id';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, jobs, applications, onSelectProject, language = 'id' }) => {
  const isId = language === 'id';
  const projectJobs = jobs.filter(j => (j.projectId === project.id || (j as any).project_id === project.id));
  const projectJobIds = projectJobs.map(j => j.id);
  const totalApplicants = applications.filter(app => projectJobIds.includes(app.jobId || (app as any).job_id)).length;

  const { name: displayName, description: displayDescription } = getProjectTranslation(
    project.id,
    project.name,
    project.description,
    language
  );

  // UI label - diterjemahkan
  const statusLabel = isId
    ? (project.status === 'Active' ? 'Aktif' : project.status === 'On Hold' ? 'Ditunda' : 'Selesai')
    : project.status;

  return (
    <div onClick={onSelectProject} className="p-5 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 hover:border-primary-500 hover:shadow-md flex flex-col group">
      <div className="flex-grow">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {displayName}
          </h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
            project.status === 'Active'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
              : project.status === 'On Hold'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
          }`}>
            {statusLabel}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {displayDescription}
        </p>
        <div className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <span>{projectJobs.length} {isId ? 'Posisi Terbuka' : `Open Position${projectJobs.length !== 1 ? 's' : ''}`}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
            <span>{totalApplicants} {isId ? 'Total Pelamar' : `Total Applicant${totalApplicants !== 1 ? 's' : ''}`}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
        <button
          onClick={onSelectProject}
          className="text-sm font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{isId ? 'Lihat Detail Proyek' : 'View Project Details'}</span>
          <span aria-hidden="true">&#8594;</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
