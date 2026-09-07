import React, { useState, useMemo } from 'react';
import { Application, Candidate, Job, NewCandidateData, Interviewer, Interview, Filters, Task, Stage, Requisition, NewRequisitionData, ActiveTab, Project } from './types';
import KanbanBoard from './components/KanbanBoard';
import CandidateProfile from './components/CandidateProfile';
import AddCandidateModal from './components/AddCandidateModal';
import KanbanFilters from './components/KanbanFilters';
import JobPostingCard from './components/JobPostingCard';
import CandidateTable from './components/CandidateTable';
import { DocumentMagnifyingGlassIcon, ArrowLeftIcon, PlusIcon, Squares2X2Icon, ListBulletIcon, SparklesIcon } from './components/icons/Icons';
import ViewModeToggle from './components/ViewModeToggle';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ATSListingControls from './components/ATSListingControls';
import { exportToCSV } from './utils/export';
import SettingsTab from './components/SettingsTab';
import RecruitmentCycleGuide from './components/RecruitmentCycleGuide';
import BlueprintInsight from './components/BlueprintInsight';
import RequisitionFormModal from './components/RequisitionFormModal';
import RequisitionCard from './components/RequisitionCard';
import SourcingTab from './components/SourcingTab';
import ScheduleInterviewModal from './components/ScheduleInterviewModal';
import SelectionTab from './components/SelectionTab';
import InterviewFeedbackModal from './components/InterviewFeedbackModal';
import HireTab from './components/HireTab';
import OfferLetterModal from './components/OfferLetterModal';
import ProjectCard from './components/ProjectCard';
import CreateProjectModal from './components/CreateProjectModal';
import SubscriptionPage from './components/SubscriptionPage';
import AffiliatePage from './components/AffiliatePage';
import SupportPage from './components/SupportPage';
import { motion, AnimatePresence } from 'motion/react';
import { User } from './types';

interface DashboardProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  jobs: Job[];
  projects: Project[];
  applications: (Application & { candidate?: Candidate, job?: Job, tasks?: Task[], stage?: Stage, interviews?: Interview[] })[];
  interviewers: Interviewer[];
  stages: Stage[];
  requisitions: Requisition[];
  language: 'en' | 'id';
  onLanguageChange: (lang: 'en' | 'id') => void;
  user: User;
  onUpgrade: (plan: string) => void;
  onResetData: () => void;
  onSetStages: (stages: Stage[]) => void;
  onAddCandidate: (candidateData: NewCandidateData) => void;
  onAddCandidateAndApplication: (jobId: string, candidateData: NewCandidateData, source: string) => void;
  onAddProject: (projectData: Omit<Project, 'id'>, requisitionIds: string[]) => void;
  onAddRequisition: (data: NewRequisitionData) => void;
  onUpdateRequisition: (requisitionId: string, updates: Partial<Requisition>) => void;
  onScheduleInterview: (interviewData: Omit<Interview, 'id' | 'status'>) => void;
  onUpdateApplication: (applicationId: string, updates: Partial<Application>) => void;
  onUpdateInterview: (interviewId: string, updates: Partial<Omit<Interview, 'id'>>) => void;
  onAddTask: (taskData: Omit<Task, 'id' | 'status'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteApplication?: (applicationId: string) => void;
  onBulkDeleteApplications?: (applicationIds: string[]) => void;
  onBulkRejectApplications?: (applicationIds: string[]) => void;
}

const operationTabs: ActiveTab[] = ['requisition', 'sourcing', 'screening', 'selection', 'hire'];

const EmptyState: React.FC<{ title: string, description: string, actionLabel?: string, onAction?: () => void }> = ({ title, description, actionLabel, onAction }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <SparklesIcon className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">{description}</p>
        {actionLabel && onAction && (
            <button
                onClick={onAction}
                className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-600/20"
            >
                <PlusIcon className="w-5 h-5" />
                <span>{actionLabel}</span>
            </button>
        )}
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ 
  activeTab, 
  onTabChange, 
  jobs, 
  projects, 
  applications, 
  interviewers, 
  stages, 
  requisitions, 
  language, 
  onLanguageChange, 
  user, 
  onUpgrade, 
  onResetData, 
  onSetStages, 
  onAddCandidate, 
  onAddCandidateAndApplication, 
  onAddProject, 
  onAddRequisition, 
  onUpdateRequisition, 
  onScheduleInterview, 
  onUpdateApplication, 
  onDeleteApplication,
  onBulkDeleteApplications,
  onBulkRejectApplications,
  onUpdateInterview, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask 
}) => {
  const isId = language === 'id';
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<(Application & { candidate?: Candidate, job?: Job, tasks?: Task[], stage?: Stage }) | null>(null);
  const [appToSchedule, setAppToSchedule] = useState<(Application & { candidate?: Candidate }) | null>(null);
  const [feedbackModalOpenFor, setFeedbackModalOpenFor] = useState<Interview | null>(null);
  const [offerModalForApp, setOfferModalForApp] = useState<(Application & { candidate?: Candidate; job?: Job }) | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const jobsForSelectedProject = useMemo(() => {
    if (!selectedProjectId) return [];
    return jobs.filter(j => j.projectId === selectedProjectId);
  }, [jobs, selectedProjectId]);

  const applicationsForSelectedProject = useMemo(() => {
    if (!selectedProjectId) return [];
    const projectJobIds = jobsForSelectedProject.map(j => j.id);
    return applications.filter(app => projectJobIds.includes(app.jobId));
  }, [applications, jobsForSelectedProject, selectedProjectId]);
  
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

  const handleApproveRequisition = (requisitionId: string) => {
    onUpdateRequisition(requisitionId, { status: 'Approved' });
  };
  
  const renderProjectListView = () => (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isId ? 'Proyek Perekrutan' : 'Hiring Projects'}</h2>
                <p className="text-slate-500 dark:text-slate-400">{isId ? 'Kelola inisiatif dan lowongan perekrutan Anda.' : 'Manage your high-level recruitment initiatives.'}</p>
            </div>
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
            >
              {isId ? '+ Buat Proyek' : '+ Create Project'}
            </button>
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
        </div>
        {projects.length === 0 && (
            <EmptyState 
                title={isId ? 'Tidak ada proyek aktif' : 'No active projects'} 
                description={isId ? 'Buat proyek untuk mengelompokkan lowongan kerja terkait dan mengelolanya bersama.' : 'Create a project to group related job postings and manage them together.'}
                actionLabel={isId ? 'Buat Proyek' : 'Create Project'}
                onAction={() => setIsProjectModalOpen(true)}
            />
        )}
         {/* Requisitions Section */}
        <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isId ? 'Kebutuhan SDM (Requisitions)' : 'Requisitions'}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{isId ? 'Setujui permintaan lowongan agar siap dibuka sebagai posisi baru.' : 'Approve requests to make them available for new projects.'}</p>
                </div>
                <button 
                  onClick={() => setIsRequisitionModalOpen(true)}
                  className="inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-semibold text-white bg-slate-600 rounded-md shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-900"
                >
                  <DocumentMagnifyingGlassIcon className="h-5 w-5 -ml-1" />
                  {isId ? 'Buat Kebutuhan SDM' : 'Create Requisition'}
                </button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {requisitions.map(req => (
                    <RequisitionCard 
                      key={req.id} 
                      requisition={req} 
                      onApprove={() => handleApproveRequisition(req.id)}
                      language={language}
                    />
                ))}
            </div>
            {requisitions.length === 0 && (
                <EmptyState 
                    title={isId ? 'Belum ada kebutuhan SDM' : 'No requisitions'} 
                    description={isId ? 'Kirim permintaan kebutuhan SDM untuk menambah posisi atau merekrut karyawan baru.' : 'Submit a requisition to request a new hire or job posting.'}
                    actionLabel={isId ? 'Buat Kebutuhan SDM' : 'Create Requisition'}
                    onAction={() => setIsRequisitionModalOpen(true)}
                />
            )}
        </div>
    </div>
  );

  const renderProjectDetailView = () => {
    if (!selectedProject) return null;
    return (
        <div className="space-y-8">
            <div>
                <button onClick={() => setSelectedProjectId(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 mb-4">
                    <ArrowLeftIcon className="w-4 h-4" />
                    {isId ? 'Kembali ke Semua Proyek' : 'Back to All Projects'}
                </button>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isId ? `Proyek: ${selectedProject.name}` : `Project: ${selectedProject.name}`}</h2>
                <p className="text-slate-500 dark:text-slate-400">{selectedProject.description}</p>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{isId ? `Lowongan Terbuka (${jobsForSelectedProject.length})` : `Open Positions (${jobsForSelectedProject.length})`}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobsForSelectedProject.map(job => (
                        <JobPostingCard 
                            key={job.id}
                            job={job}
                            language={language}
                        />
                    ))}
                </div>
            </div>
            
              <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isId ? 'Pipa Kandidat Terpadu' : 'Consolidated Candidate Pipeline'}</h2>
                         <p className="text-slate-500 dark:text-slate-400">{isId ? `Semua pelamar untuk seluruh posisi pada proyek "${selectedProject.name}".` : `All candidates for all positions in the "${selectedProject.name}" project.`}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                        <button 
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
                        >
                          {isId ? '+ Tambah Kandidat' : '+ Add Candidate'}
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
      return <SourcingTab jobs={jobs.filter(j => j.status === 'Open')} onAddCandidateToJob={onAddCandidateAndApplication} onTabChange={onTabChange} language={language} />;
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
    if (activeTab === 'analytics') {
        return <AnalyticsDashboard jobs={jobs} applications={applications} stages={stages} language={language} />;
    }
    if (activeTab === 'billing') {
        return <SubscriptionPage language={language} currentPlan={user.subscription.type} onUpgrade={onUpgrade} />;
    }
    if (activeTab === 'affiliate') {
        return <AffiliatePage referralCode={user.referralCode || 'REF123'} language={language} />;
    }
    if (activeTab === 'support') {
        return <SupportPage language={language} />;
    }
    if (activeTab === 'settings') {
        return <SettingsTab stages={stages} onSetStages={onSetStages} language={language} onLanguageChange={onLanguageChange} onResetData={onResetData} />;
    }
    return null;
  };

  return (
    <div className="pb-20">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>

      <CandidateProfile
        application={selectedApplication}
        onClose={handleCloseProfile}
        interviewers={interviewers}
        stages={stages}
        onOpenScheduleModal={handleOpenScheduleModal}
        onOpenFeedbackModal={handleOpenFeedbackModal}
        onUpdateApplication={onUpdateApplication}
        onUpdateInterview={onUpdateInterview}
        onAddTask={onAddTask}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        onDeleteApplication={onDeleteApplication}
        language={language}
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
        language={language}
      />

      <InterviewFeedbackModal
        isOpen={!!feedbackModalOpenFor}
        onClose={() => setFeedbackModalOpenFor(null)}
        interview={feedbackModalOpenFor}
        job={applications.find(a => a.id === feedbackModalOpenFor?.applicationId)?.job ?? null}
        onSave={handleSaveFeedbackAndClose}
        language={language}
      />

       <OfferLetterModal
        isOpen={!!offerModalForApp}
        onClose={() => setOfferModalForApp(null)}
        application={offerModalForApp}
        language={language}
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
    </div>
  );
};

export default Dashboard;