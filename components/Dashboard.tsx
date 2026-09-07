import { ShieldAlert } from 'lucide-react';
import { getProjectTranslation } from '../utils/demoTranslations';
﻿import SuperAdminUserManagement from './SuperAdminUserManagement';
import SuperAdminSystemMetrics from './SuperAdminSystemMetrics';
import React, { useState, useMemo } from 'react';
import { Application, Candidate, Job, NewCandidateData, Interviewer, Interview, Filters, Task, Stage, Requisition, NewRequisitionData, ActiveTab, Project, NewJobData, User } from '../types';
import SubscriptionPage from './SubscriptionPage';
import AffiliatePage from './AffiliatePage';
import KanbanBoard from './KanbanBoard';
import CandidateProfile from './CandidateProfile';
import AddCandidateModal from './AddCandidateModal';
import KanbanFilters from './KanbanFilters';
import JobPostingCard from './JobPostingCard';
import CandidateTable from './CandidateTable';
import { DocumentMagnifyingGlassIcon, ArrowLeftIcon } from './icons/Icons';
import ViewModeToggle from './ViewModeToggle';
import AnalyticsDashboard from './AnalyticsDashboard';
import ATSListingControls from './ATSListingControls';
import { exportToCSV } from '../utils/export';
import SettingsTab from './SettingsTab';
import RecruitmentCycleGuide from './RecruitmentCycleGuide';
import BlueprintInsight from './BlueprintInsight';
import RequisitionFormModal from './RequisitionFormModal';
import RequisitionCard from './RequisitionCard';
import SourcingTab from './SourcingTab';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import SelectionTab from './SelectionTab';
import InterviewFeedbackModal from './InterviewFeedbackModal';
import HireTab from './HireTab';
import OfferLetterModal from './OfferLetterModal';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';
import AddJobModal from './AddJobModal';
import JobDetailPage from './JobDetailPage';
import SupportPage from './SupportPage';

interface DashboardProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  jobs: Job[];
  projects: Project[];
  applications: (Application & { candidate?: Candidate, job?: Job, tasks?: Task[], stage?: Stage, interviews?: Interview[] })[];
  interviewers: Interviewer[];
  stages: Stage[];
  requisitions: Requisition[];
  onSetStages: (stages: Stage[]) => void;
  onAddCandidate: (candidateData: NewCandidateData) => void;
  onAddCandidateAndApplication: (jobId: string, candidateData: NewCandidateData, source: string) => void;
  onAddProject: (projectData: Omit<Project, 'id'>, requisitionIds: string[]) => void;
  onAddJob: (jobData: NewJobData, projectId: string, requisitionId?: string) => Job;
  onUpdateJob: (jobId: string, updates: Partial<Job>) => void;
  onAddRequisition: (data: NewRequisitionData) => void;
  onUpdateRequisition: (requisitionId: string, updates: Partial<Requisition>) => void;
  onScheduleInterview: (interviewData: Omit<Interview, 'id' | 'status'>) => void;
  onUpdateApplication: (applicationId: string, updates: Partial<Application>) => void;
  onDeleteApplication?: (applicationId: string) => void;
  onBulkDeleteApplications?: (applicationIds: string[]) => void;
  onBulkRejectApplications?: (applicationIds: string[]) => void;
  onUpdateInterview: (interviewId: string, updates: Partial<Omit<Interview, 'id'>>) => void;
  onAddTask: (taskData: Omit<Task, 'id' | 'status'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  user: User;
  onUpgrade: (planType: string) => void;
  language: 'en' | 'id';
  onLanguageChange?: (lang: 'en' | 'id') => void;
  onResetData?: () => void;
  onUpdateUser?: (updatedUser: User) => void;
  addToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const operationTabs: ActiveTab[] = ['requisition', 'sourcing', 'screening', 'selection', 'hire'];

import { translations } from '../utils/translations';

const Dashboard: React.FC<DashboardProps> = ({ 
    activeTab, onTabChange, jobs, projects, applications, interviewers, stages, requisitions, 
    onSetStages, onAddCandidate, onAddCandidateAndApplication, onAddProject, onAddJob, onUpdateJob, 
    onAddRequisition, onUpdateRequisition, onScheduleInterview, onUpdateApplication, onDeleteApplication, onBulkDeleteApplications, onBulkRejectApplications, 
    onUpdateInterview, onAddTask, onUpdateTask, onDeleteTask, user, onUpgrade, language, onLanguageChange, onResetData, onUpdateUser, addToast
}) => {
  const t = translations[language].dashboard;
  const isId = language === 'id';
  const isSuperAdmin = user?.role === 'super_admin';
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<(Application & { candidate?: Candidate, job?: Job, tasks?: Task[], stage?: Stage }) | null>(null);
  const [appToSchedule, setAppToSchedule] = useState<(Application & { candidate?: Candidate }) | null>(null);
  const [feedbackModalOpenFor, setFeedbackModalOpenFor] = useState<Interview | null>(null);
  const [offerModalForApp, setOfferModalForApp] = useState<(Application & { candidate?: Candidate; job?: Job }) | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [initialJobData, setInitialJobData] = useState<{data: Partial<NewJobData>, requisitionId?: string} | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  
  const [filters, setFilters] = useState<Filters>({
    minExperience: 0,
    maxExperience: 15,
    minSalary: 0,
    maxSalary: 250000,
    dateRange: 'all',
  });

  // ATS Listing Filters
  const [showKnockedOut, setShowKnockedOut] = useState(false);
  const [minScore, setMinScore] = useState<number | null>(null);
  const [validSalaryFit, setValidSalaryFit] = useState(false);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const selectedProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [projects, selectedProjectId]);
  const selectedJob = useMemo(() => jobs.find(j => j.id === selectedJobId), [jobs, selectedJobId]);

  const jobsForSelectedProject = useMemo(() => {
    if (!selectedProjectId) return [];
    return jobs.filter(j => j.projectId === selectedProjectId);
  }, [jobs, selectedProjectId]);

  const applicationsForSelectedProject = useMemo(() => {
    if (!selectedProjectId) return [];
    const projectJobIds = jobsForSelectedProject.map(j => j.id);
    return applications.filter(app => projectJobIds.includes(app.jobId));
  }, [applications, jobsForSelectedProject, selectedProjectId]);
  
  const applicationsForSelectedJob = useMemo(() => {
    if (!selectedJobId) return [];
    return applications.filter(app => app.jobId === selectedJobId);
  }, [applications, selectedJobId]);

  const uniqueSources = useMemo(() => {
    const sources = new Set(applications.map(app => app.source).filter(Boolean));
    return Array.from(sources);
  }, [applications]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const filteredApplications = useMemo(() => {
    let apps = applicationsForSelectedProject;
    
    // Regular Kanban filters
    apps = apps.filter(app => {
      if (!app.candidate) return false;
      if (app.candidate.experienceYears < filters.minExperience || app.candidate.experienceYears > filters.maxExperience) return false;
      if (app.candidate.expectedSalary < filters.minSalary || app.candidate.expectedSalary > filters.maxSalary) return false;
      
      if (filters.dateRange !== 'all') {
        const appliedDate = new Date(app.appliedDate);
        const now = new Date();
        const daysAgo = (now.getTime() - appliedDate.getTime()) / (1000 * 3600 * 24);
        if (filters.dateRange === '7d' && daysAgo > 7) return false;
        if (filters.dateRange === '30d' && daysAgo > 30) return false;
      }
      
      return true;
    });

    // ATS Listing quick filters
    if (viewMode === 'list') {
      if (!showKnockedOut) {
        apps = apps.filter(app => !app.knockedOut);
      }
      if (minScore !== null) {
        apps = apps.filter(app => app.totalScore >= minScore);
      }
      if (validSalaryFit) {
        apps = apps.filter(app => {
          if (!app.job || !app.candidate) return false;
          return app.candidate.expectedSalary <= app.job.salaryMax;
        });
      }
      if (stageFilter !== 'all') {
        apps = apps.filter(app => app.stageId === stageFilter);
      }
      if (sourceFilter !== 'all') {
        apps = apps.filter(app => app.source === sourceFilter);
      }
    }

    return apps;
  }, [applicationsForSelectedProject, filters, viewMode, showKnockedOut, minScore, validSalaryFit, stageFilter, sourceFilter]);

  const handleExport = (format: 'csv' | 'xls' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV(filteredApplications, `talentstream-export-${selectedProject?.name || 'all'}.csv`);
    } else {
      alert(`${format.toUpperCase()} export is not implemented yet.`);
    }
  };

  const handleSelectCandidate = (app: Application & { candidate?: Candidate, job?: Job }) => {
    setSelectedApplication(app);
  };

  const handleCloseProfile = () => {
    setSelectedApplication(null);
  };
  
  const handleOpenScheduleModal = (app: Application & { candidate?: Candidate }) => {
    setAppToSchedule(app);
  };
  
  const handleOpenFeedbackModal = (interview: Interview) => {
    setFeedbackModalOpenFor(interview);
  };
  
  const handleOpenOfferModal = (app: Application & { candidate?: Candidate; job?: Job }) => {
    setOfferModalForApp(app);
  };

  const handleScheduleAndClose = (interviewData: Omit<Interview, 'id' | 'status'>) => {
    onScheduleInterview(interviewData);
    setAppToSchedule(null);
  };
  
  const handleSaveFeedbackAndClose = (interviewId: string, updates: Partial<Omit<Interview, 'id'>>) => {
    onUpdateInterview(interviewId, updates);
    setFeedbackModalOpenFor(null);
  };

  const handleAddRequisitionAndClose = (data: NewRequisitionData) => {
    onAddRequisition(data);
    setIsRequisitionModalOpen(false);
  };

  const handleAddCandidateAndClose = (candidateData: NewCandidateData) => {
    onAddCandidate(candidateData);
    setIsAddModalOpen(false);
  };
  
  const handleAddJobAndClose = (jobData: NewJobData) => {
    if (selectedProjectId) {
      onAddJob(jobData, selectedProjectId, initialJobData?.requisitionId);
    }
    setIsAddJobModalOpen(false);
    setInitialJobData(null);
  };

  const handleApproveRequisition = (requisitionId: string) => {
    onUpdateRequisition(requisitionId, { status: 'Approved' });
  };
  
  const handleCreateJobFromRequisition = (requisition: Requisition) => {
    const jobData: Partial<NewJobData> = {
        title: requisition.title,
        department: requisition.department,
        level: requisition.experienceLevel,
        location: requisition.location,
        employmentType: requisition.employmentType,
        salaryMin: requisition.salaryMin,
        salaryMax: requisition.salaryMax,
        deadline: requisition.deadline,
        jobDescription: `Based on approved requisition #${requisition.id}. Please elaborate on the responsibilities and requirements.`
    };

    // Find the project this job should belong to. 
    // This is a simplification; in a real app, you might need a project selector.
    // For now, let's assume we can find a project or default to the first one.
    const projectForReq = projects[0];
    if (projectForReq) {
        setSelectedProjectId(projectForReq.id);
        setInitialJobData({ data: jobData, requisitionId: requisition.id });
        setIsAddJobModalOpen(true);
    } else {
        alert("No active project found. Please create a project first.");
    }
  };

  const handleBackToProjectView = () => {
    setSelectedJobId(null);
  };

  const renderProjectListView = () => (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.hiringProjects}</h2>
                <p className="text-slate-500 dark:text-slate-400">{t.hiringProjectsDesc}</p>
            </div>
            
            {user.subscription.type === 'free' && user.id !== 'demo-user' && projects.length >= user.subscription.limitJobs ? (
              <button 
                onClick={() => {
                  if (addToast) addToast(language === 'id' ? 'Batas maksimal proyek tercapai untuk akun Gratis. Silakan Upgrade.' : 'Max projects reached for Free plan. Please upgrade.', 'error');
                  onTabChange('billing');
                }}
                className="inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-semibold text-white bg-slate-400 cursor-not-allowed rounded-md shadow-sm"
              >
                + {t.createProject} (Upgrade to Pro)
              </button>
            ) : (
              <button 
                onClick={() => setIsProjectModalOpen(true)}
                className="inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
              >
                + {t.createProject}
              </button>
            )}

        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {projects.map(proj => (
                <ProjectCard 
                  key={proj.id} 
                  project={proj} 
                  jobs={jobs}
                  applications={applications} 
                  onSelectProject={() => setSelectedProjectId(proj.id)}
                  language={language}
                />
            ))}
            {projects.length === 0 && (
                <p className="text-slate-500 md:col-span-full">{t.noProjects} - {t.noProjectsDesc}</p>
            )}
        </div>
         {/* Requisitions Section */}
        <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.reqTitle}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{t.reqSubtitle}</p>
                </div>
                {user.subscription.type === 'free' && user.id !== 'demo-user' && requisitions.length >= user.subscription.limitJobs ? (
                <button
                  onClick={() => { if (addToast) addToast(language === 'id' ? 'Batas maksimal permintaan SDM untuk akun Gratis. Silakan Upgrade ke Pro.' : 'Max requisitions reached for Free plan. Please upgrade.', 'error'); onTabChange('billing'); }}
                  className="inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-semibold text-white bg-slate-400 cursor-not-allowed rounded-md shadow-sm"
                >
                  <DocumentMagnifyingGlassIcon className="h-5 w-5 -ml-1" />
                  {t.createReq} (Upgrade)
                </button>
              ) : (
                <button 
                  onClick={() => setIsRequisitionModalOpen(true)}
                  className="inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-semibold text-white bg-slate-600 rounded-md shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-900"
                >
                  <DocumentMagnifyingGlassIcon className="h-5 w-5 -ml-1" />
                  {t.createReq}
                </button>
              )}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {requisitions.map(req => (
                    <RequisitionCard 
                      key={req.id} 
                      requisition={req} 
                      onApprove={() => handleApproveRequisition(req.id)}
                      onCreateJob={() => handleCreateJobFromRequisition(req)}
                      language={language}
                    />
                ))}
                {requisitions.length === 0 && (
                    <p className="text-slate-500 md:col-span-full">{t.reqEmpty}</p>
                )}
            </div>
        </div>
    </div>
  );

  const renderProjectDetailView = () => {
    if (!selectedProject) {
      return (
        <div className="p-8 text-center">
          <p className="text-slate-500 mb-4">{isId ? 'Proyek tidak ditemukan.' : 'Project not found.'}</p>
          <button onClick={() => setSelectedProjectId(null)} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold text-sm">
            {isId ? 'Kembali ke Daftar Proyek' : 'Back to Projects'}
          </button>
        </div>
      );
    }
    const { name: displayProjectName, description: displayProjectDesc } = getProjectTranslation(
      selectedProject.id,
      selectedProject.name,
      selectedProject.description,
      language
    );

    if (selectedJob) {
        return (
            <JobDetailPage 
                job={selectedJob}
                applications={applicationsForSelectedJob}
                onBack={handleBackToProjectView}
                onUpdateJob={onUpdateJob}
                onAddCandidateAndApplication={(candidateData, source) => onAddCandidateAndApplication(selectedJob.id, candidateData, source)}
                onSelectCandidate={handleSelectCandidate}
                onScheduleInterview={handleOpenScheduleModal}
                language={language}
            />
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <button onClick={() => { setSelectedProjectId(null); setSelectedJobId(null); }} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 mb-4">
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t.backToProjects}
                </button>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isId ? 'Proyek: ' : 'Project: '}{displayProjectName}</h2>
                        <p className="text-slate-500 dark:text-slate-400">{displayProjectDesc}</p>
                    </div>
                    <button 
                        onClick={() => { setInitialJobData(null); setIsAddJobModalOpen(true); }}
                        className="inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
                    >
                      + {t.addJob}
                    </button>
                </div>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{t.openPositions} ({jobsForSelectedProject.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobsForSelectedProject.map(job => (
                        <JobPostingCard 
                            key={job.id}
                            job={job}
                            onSelect={() => setSelectedJobId(job.id)}
                            language={language}
                        />
                    ))}
                     {jobsForSelectedProject.length === 0 && (
                        <p className="text-slate-500">{t.noJobs}</p>
                    )}
                </div>
            </div>
            
              <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.pipeline}</h2>
                         <p className="text-slate-500 dark:text-slate-400">{t.pipelineDesc}</p>
                    </div>
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                        <button 
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
                        >
                          + {t.addCandidate}
                        </button>
                    </div>
                </div>
                
                {viewMode === 'kanban' ? (
                    <KanbanFilters filters={filters} onFilterChange={handleFilterChange} language={language} />
                ) : (
                    <ATSListingControls 
                        showKnockedOut={showKnockedOut}
                        onToggleKnockedOut={() => setShowKnockedOut(p => !p)}
                        minScore={minScore}
                        onSetMinScore={(score) => setMinScore(score)}
                        validSalaryFit={validSalaryFit}
                        onToggleValidSalaryFit={() => setValidSalaryFit(p => !p)}
                        onExport={handleExport}
                        stageFilter={stageFilter}
                        onStageFilterChange={setStageFilter}
                        stages={stages}
                        sources={uniqueSources}
                        sourceFilter={sourceFilter}
                        onSourceFilterChange={setSourceFilter}
                        language={language}
                    />
                )}
                
                {viewMode === 'kanban' ? (
                    <KanbanBoard applications={filteredApplications} onSelectCandidate={handleSelectCandidate} onScheduleInterview={handleOpenScheduleModal} stages={stages} language={language} />
                ) : (
                    <CandidateTable applications={filteredApplications} onSelectCandidate={handleSelectCandidate} onScheduleInterview={handleOpenScheduleModal} onDeleteApplication={onDeleteApplication} onBulkDeleteApplications={onBulkDeleteApplications} onBulkRejectApplications={onBulkRejectApplications} language={language} />
                )}

              </div>
        </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'sourcing') {
      return (
        <SourcingTab 
          jobs={jobs.filter(j => j.status === 'Open')} 
          onAddCandidateToJob={onAddCandidateAndApplication} 
          onTabChange={onTabChange} 
          language={language}
          subscriptionType={user.id === 'demo-user' ? 'pro' : user.subscription.type}
        />
      );
    }
    
    if (activeTab === 'selection') {
      const allInterviews = applications.flatMap(app => app.interviews?.map(iv => ({...iv, application: app})) ?? []);
      return (
         <SelectionTab
            interviews={allInterviews}
            onOpenFeedbackModal={handleOpenFeedbackModal}
            language={language}
         />
      );
    }

    if (activeTab === 'hire') {
        const offerStageId = stages.find(s => s.name.toLowerCase() === 'offer')?.id;
        const hiredStageId = stages.find(s => s.name.toLowerCase() === 'hired')?.id;
        const hireRelatedApps = applications.filter(app => app.stageId === offerStageId || app.stageId === hiredStageId);
        
        return (
            <HireTab
                applications={hireRelatedApps}
                stages={stages}
                onUpdateApplication={onUpdateApplication}
                onOpenOfferModal={handleOpenOfferModal}
                language={language}
            />
        );
    }
    
    if (operationTabs.includes(activeTab)) {
        return selectedProjectId ? renderProjectDetailView() : renderProjectListView();
    }
    if (activeTab === 'guides') {
        return (
          <div className="space-y-8">
            <RecruitmentCycleGuide language={language} />
            <BlueprintInsight language={language} />
          </div>
        );
    }
    if (activeTab === 'billing') {
        return (
          <SubscriptionPage 
            language={language} 
            currentPlan={user.subscription.type} 
            onUpgrade={onUpgrade}
            user={user}
            onUpdateUser={onUpdateUser}
            addToast={addToast}
          />
        );
    }
    if (activeTab === 'affiliate') {
        return <AffiliatePage referralCode={user.referralCode || 'TS-DEMO'} language={language} />;
    }
    if (activeTab === 'analytics') {
        return <AnalyticsDashboard jobs={jobs} applications={applications} stages={stages} language={language} />;
    }
    if (activeTab === 'support') {
        return <SupportPage language={language} />;
    }
    if (activeTab === 'admin_users') {
        if (!isSuperAdmin) {
            return (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/40 max-w-xl mx-auto mt-12 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {isId ? 'Akses Terbatas: Khusus Super Admin' : 'Restricted Access: Super Admin Only'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  {isId 
                    ? 'Halaman ini khusus untuk manajemen sistem platform global. Akun Anda adalah akun Client Admin.' 
                    : 'This page is reserved for global platform system management. Your account is a Client Admin.'}
                </p>
                <button
                  onClick={() => onTabChange('requisition')}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary-500/20"
                >
                  {isId ? 'Kembali ke Alur Rekrutmen' : 'Return to Recruitment'}
                </button>
              </div>
            );
        }
        return <SuperAdminUserManagement language={language} currentUser={user} addToast={addToast} />;
    }
    if (activeTab === 'admin_analytics') {
        if (!isSuperAdmin) {
            return (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/40 max-w-xl mx-auto mt-12 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {isId ? 'Akses Terbatas: Khusus Super Admin' : 'Restricted Access: Super Admin Only'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  {isId 
                    ? 'Halaman ini khusus untuk metrik infrastruktur server cloud. Akun Anda adalah akun Client Admin.' 
                    : 'This page is reserved for cloud server infrastructure metrics. Your account is a Client Admin.'}
                </p>
                <button
                  onClick={() => onTabChange('requisition')}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary-500/20"
                >
                  {isId ? 'Kembali ke Alur Rekrutmen' : 'Return to Recruitment'}
                </button>
              </div>
            );
        }
        return <SuperAdminSystemMetrics language={language} currentUser={user} jobs={jobs} applications={applications} />;
    }
    if (activeTab === 'settings') {
        return (
          <SettingsTab 
            stages={stages} 
            onSetStages={onSetStages} 
            language={language}
            onLanguageChange={onLanguageChange || (() => {})}
            onResetData={onResetData || (() => {})}
            user={user}
            onUpdateUser={onUpdateUser}
            addToast={addToast}
          />
        );
    }
    return null;
  };

  return (
    <>
      <div className="space-y-6">
        {renderContent()}
      </div>

      <CandidateProfile
        application={selectedApplication}
        onClose={handleCloseProfile}
        interviewers={interviewers}
        stages={stages}
        onOpenScheduleModal={handleOpenScheduleModal}
        onOpenFeedbackModal={handleOpenFeedbackModal}
        onUpdateApplication={onUpdateApplication}
        onDeleteApplication={onDeleteApplication}
        onUpdateInterview={onUpdateInterview}
        onAddTask={onAddTask}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
      
      <AddCandidateModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCandidate={handleAddCandidateAndClose}
        language={language}
      />

      <ScheduleInterviewModal 
        isOpen={!!appToSchedule}
        onClose={() => setAppToSchedule(null)}
        application={appToSchedule}
        interviewers={interviewers}
        onSchedule={handleScheduleAndClose}
      />

      <InterviewFeedbackModal
        isOpen={!!feedbackModalOpenFor}
        onClose={() => setFeedbackModalOpenFor(null)}
        interview={feedbackModalOpenFor}
        job={applications.find(a => a.id === feedbackModalOpenFor?.applicationId)?.job ?? null}
        onSave={handleSaveFeedbackAndClose}
      />

       <OfferLetterModal
        isOpen={!!offerModalForApp}
        onClose={() => setOfferModalForApp(null)}
        application={offerModalForApp}
      />
      
       <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onAddProject={onAddProject}
        requisitions={requisitions}
        interviewers={interviewers}
        language={language}
      />

      <RequisitionFormModal
        isOpen={isRequisitionModalOpen}
        onClose={() => setIsRequisitionModalOpen(false)}
        onAddRequisition={handleAddRequisitionAndClose}
        language={language}
      />

      <AddJobModal
        isOpen={isAddJobModalOpen}
        onClose={() => { setIsAddJobModalOpen(false); setInitialJobData(null); }}
        onAddJob={handleAddJobAndClose}
        initialData={initialJobData?.data}
        language={language}
      />
    </>
  );
};

export default Dashboard;