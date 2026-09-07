import React, { useState, useMemo } from 'react';
import { Application, Candidate, Interviewer, Interview, InterviewStatus, Recommendation, Job, Task, TaskStatus, Stage } from '../types';
import { XMarkIcon, EnvelopeIcon, PhoneIcon, LinkIcon, DocumentTextIcon, ClockIcon, VideoCameraIcon, IdentificationIcon, LightBulbIcon, AcademicCapIcon, LinkedInIcon, ChatBubbleOvalLeftEllipsisIcon, ChevronDownIcon, ClipboardDocumentCheckIcon, PencilIcon, TrashIcon, XCircleIcon, DocumentPlusIcon, ArrowPathIcon } from './icons/Icons';
import ScoreChart from './ScoreChart';
import SendMessageModal from './SendMessageModal';

export const STAGE_NAME_ID: Record<string, string> = {
  applied: 'Pendaftaran Masuk',
  screening: 'Penyaringan CV',
  assessment: 'Penilaian / Tes',
  interview: 'Wawancara',
  offer: 'Penawaran Kerja',
  hired: 'Diterima',
  rejected: 'Ditolak'
};

export const getStageLabel = (stage: { id?: string; name?: string } | null | undefined, isId: boolean) => {
  if (!stage) return '';
  if (!isId) return stage.name || stage.id || '';
  const idKey = stage.id?.toLowerCase() || '';
  const nameKey = stage.name?.toLowerCase() || '';
  return STAGE_NAME_ID[idKey] || STAGE_NAME_ID[nameKey] || stage.name || stage.id || '';
};

let isId = true;

interface CandidateProfileProps {
  language?: 'en' | 'id';
  application: (Application & { candidate?: Candidate, job?: Job, tasks?: Task[], stage: Stage }) | null;
  onClose: () => void;
  interviewers: Interviewer[];
  stages: Stage[];
  onOpenScheduleModal: (application: Application & { candidate?: Candidate }) => void;
  onOpenFeedbackModal: (interview: Interview) => void;
  onUpdateApplication: (applicationId: string, updates: Partial<Application>) => void;
  onDeleteApplication?: (applicationId: string) => void;
  onUpdateInterview: (interviewId: string, updates: Partial<Omit<Interview, 'id'>>) => void;
  onAddTask: (taskData: Omit<Task, 'id' | 'status'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const CandidateProfile: React.FC<CandidateProfileProps> = ({ application, onClose, interviewers, stages, onOpenScheduleModal, onOpenFeedbackModal, onUpdateApplication, onDeleteApplication, onUpdateInterview, onAddTask, onUpdateTask, onDeleteTask, language = 'id' }) => {
  isId = language === 'id';
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const activityFeed = useMemo(() => {
    if (!application) return [];

    type Activity = {
      type: 'created' | 'stageChange' | 'note';
      date: Date;
      data: any;
    };

    const activities: Activity[] = [];

    // 1. Application Created
    activities.push({
        type: 'created',
        date: new Date(application.appliedDate),
        data: { source: application.source },
    });

    // 2. Stage Changes
    application.stageHistory?.forEach(history => {
        activities.push({
            type: 'stageChange',
            date: new Date(history.date),
            data: history,
        });
    });

    // 3. Notes
    application.notes?.forEach(note => {
        activities.push({
            type: 'note',
            date: new Date(note.date),
            data: note,
        });
    });
    
    // Sort descending by date
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [application]);
  
  if (!application || !application.candidate) {
    return null;
  }

  const { candidate, scorecard, totalScore, job } = application;
  const show = !!application;
  
  const skills = candidate.skills ? candidate.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStageId = e.target.value;
    onUpdateApplication(application.id, { stageId: newStageId });
  };
  
  const currentStageIndex = stages.findIndex(s => s.id === application.stageId);
  const nextStage = currentStageIndex !== -1 && currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : null;
  const isHired = application.stage.name.toLowerCase() === 'hired';

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <img src={candidate.avatarUrl} alt={candidate.name} className="h-16 w-16 rounded-full object-cover" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{candidate.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-slate-500 dark:text-slate-400">{isId ? `Melamar posisi ${job?.title || ''}` : `Applied for ${job?.title}`}</p>
                   <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                    <select
                        value={application.stageId}
                        onChange={handleStageChange}
                        className="text-sm font-semibold bg-transparent border-none rounded-md focus:ring-0 p-0 pr-7 appearance-none dark:text-slate-300"
                        style={{ color: application.stage.color }}
                    >
                        {stages.map(stage => (
                        <option key={stage.id} value={stage.id} className="text-black dark:text-white bg-white dark:bg-slate-700">{getStageLabel(stage, isId)}</option>
                        ))}
                    </select>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newKnockedOut = !application.knockedOut;
                  onUpdateApplication(application.id, { knockedOut: newKnockedOut });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  application.knockedOut
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                    : "bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20"
                }`}
                title={application.knockedOut ? (isId ? "Batalkan Tolak" : "Undo Reject") : (isId ? "Tolak Lamaran" : "Reject Application")}
              >
                <XCircleIcon className="h-4 w-4" />
                <span>{application.knockedOut ? (isId ? "Ditolak" : "Rejected") : (isId ? "Tolak" : "Reject")}</span>
              </button>

              {onDeleteApplication && (
                <button
                  type="button"
                  onClick={() => {
                    const confirmMsg = isId
                      ? `Hapus permanen berkas lamaran "${candidate.name}"? Tindakan ini tidak dapat dibatalkan.`
                      : `Permanently delete application for "${candidate.name}"? This action cannot be undone.`;
                    if (window.confirm(confirmMsg)) {
                      onDeleteApplication(application.id);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 dark:hover:bg-rose-900/40 transition-all"
                  title={isId ? "Hapus Lamaran" : "Delete Application"}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>{isId ? "Hapus" : "Delete"}</span>
                </button>
              )}

              <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Knocked out banner */}
          {application.knockedOut && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 px-6 py-2.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
              <div className="flex items-center gap-2 font-medium">
                <XCircleIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>{isId ? 'Pelamar ini telah ditandai ditolak (Rejected).' : 'This applicant has been marked as rejected.'}</span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateApplication(application.id, { knockedOut: false })}
                className="font-semibold underline hover:no-underline ml-2"
              >
                {isId ? 'Batalkan Penolakan' : 'Undo Rejection'}
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoItem icon={<EnvelopeIcon/>} label={candidate.email} />
                <InfoItem icon={<PhoneIcon/>} label={candidate.phone} />
                {candidate.linkedinUrl && <InfoItem icon={<LinkedInIcon/>} label="LinkedIn" href={candidate.linkedinUrl}/>}
                {candidate.portfolioUrl && <InfoItem icon={<LinkIcon/>} label="Portfolio" href={candidate.portfolioUrl}/>}
                {candidate.cvUrl && <InfoItem icon={<DocumentTextIcon/>} label={isId ? "Resume / CV" : "Resume"} href={candidate.cvUrl}/>}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                 <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">{isId ? 'Keahlian' : 'Skills'}</h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span key={skill} className="text-sm bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">{skill}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Scorecard */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">{isId ? 'Kartu Skor Evaluasi' : 'Candidate Scorecard'}</h3>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex items-center">
                    <div className="w-1/2">
                        <ScoreChart data={scorecard} language={isId ? 'id' : 'en'} />
                    </div>
                    <div className="w-1/2 flex flex-col items-center justify-center">
                        <p className="text-slate-500 dark:text-slate-400">{isId ? 'Total Skor' : 'Total Score'}</p>
                        <p className="text-6xl font-bold text-primary-600 dark:text-primary-400">{totalScore}</p>
                    </div>
                </div>
            </div>

            {/* Interviews Section */}
            <div>
                <h3 className="flex items-center space-x-2 text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    <VideoCameraIcon className="h-6 w-6" />
                    <span>{isId ? 'Jadwal Wawancara' : 'Interviews'}</span>
                </h3>
                <div className="space-y-4">
                  {(application.interviews && application.interviews.length > 0) ? (
                     application.interviews
                      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
                      .map(interview => (
                        <InterviewItem 
                          key={interview.id} 
                          interview={interview} 
                          onAddFeedback={() => onOpenFeedbackModal(interview)} 
                        />
                      ))
                  ) : (
                    <div className="text-sm ml-8 border-l border-slate-200 dark:border-slate-700 pl-6 py-2">
                        <p className="text-slate-500 dark:text-slate-400">{isId ? 'Belum ada wawancara yang dijadwalkan.' : 'No interviews scheduled yet.'}</p>
                    </div>
                  )}
                </div>
            </div>
            
            {/* Tasks Section */}
            <DetailsSection icon={<ClipboardDocumentCheckIcon />} title={isId ? 'Daftar Tugas' : 'Tasks'}>
                <div className="space-y-3">
                    {(application.tasks && application.tasks.length > 0) ? (
                        application.tasks
                        .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .map(task => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                interviewers={interviewers} 
                                onUpdateTask={onUpdateTask}
                                onDeleteTask={onDeleteTask}
                            />
                        ))
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{isId ? 'Belum ada tugas untuk kandidat ini.' : 'No tasks for this candidate.'}</p>
                    )}
                </div>
                <AddTaskForm
                    applicationId={application.id}
                    interviewers={interviewers}
                    onAddTask={onAddTask}
                />
            </DetailsSection>

            {/* Activity Timeline */}
            <DetailsSection icon={<ClockIcon />} title={isId ? 'Linimasa Aktivitas' : 'Activity Timeline'}>
                <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 py-4 space-y-8">
                    {activityFeed.map((item, index) => (
                        <ActivityItem 
                            key={index} 
                            item={item} 
                            stages={stages} 
                        />
                    ))}
                </div>
                <AddNoteForm application={application} onUpdateApplication={onUpdateApplication} />
            </DetailsSection>

             {/* Personal Details */}
            <DetailsSection icon={<IdentificationIcon />} title={isId ? 'Informasi Pribadi' : 'Personal Details'}>
                 {candidate.dateOfBirth && <DetailItem label={isId ? 'Tanggal Lahir' : 'Date of Birth'} value={new Date(candidate.dateOfBirth).toLocaleDateString()} />}
                 {candidate.major && <DetailItem label={isId ? 'Pendidikan / Jurusan' : 'Major'} value={candidate.major} />}
                 {candidate.address && <DetailItem label={isId ? 'Alamat' : 'Address'} value={candidate.address} />}
                 {candidate.hobbies && <DetailItem label={isId ? 'Hobi' : 'Hobbies'} value={candidate.hobbies} />}
            </DetailsSection>
            
            {/* Self Assessment */}
            <DetailsSection icon={<LightBulbIcon />} title={isId ? 'Penilaian Diri' : 'Self Assessment'}>
                {candidate.aspirations && <DetailItem label={isId ? 'Aspirasi Karier' : 'Aspirations'} value={candidate.aspirations} />}
                {candidate.strengths && <DetailItem label={isId ? 'Kelebihan Diri' : 'Strengths'} value={candidate.strengths} />}
                {candidate.weaknesses && <DetailItem label={isId ? 'Kelemahan Diri' : 'Weaknesses'} value={candidate.weaknesses} />}
            </DetailsSection>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end space-x-3 flex-wrap gap-2">
            <button 
                onClick={() => setIsMessageModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500"
            >
                <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
                {isId ? 'Kirim Pesan' : 'Send Message'}
            </button>
            <button 
              onClick={() => onOpenScheduleModal(application)}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500"
            >
              {isId ? 'Jadwalkan Wawancara' : 'Schedule Interview'}
            </button>
            <button
                onClick={() => onUpdateApplication(application.id, { knockedOut: !application.knockedOut })}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm ${application.knockedOut ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {application.knockedOut ? (isId ? 'Batalkan Tolak' : 'Re-engage Candidate') : (isId ? 'Tolak Lamaran' : 'Knock Out')}
            </button>

            {isHired ? (
                <span className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm">
                    {isId ? 'Diterima' : 'Hired'}
                </span>
            ) : nextStage && !application.knockedOut && (
                <button
                    onClick={() => onUpdateApplication(application.id, { stageId: nextStage.id })}
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700"
                >
                    {isId ? `Lanjutkan ke ${getStageLabel(nextStage, true)}` : `Advance to ${nextStage.name}`}
                </button>
            )}
          </div>
        </div>
      </div>
      
      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        candidate={candidate}
        language={isId ? 'id' : 'en'}
      />
    </>
  );
};

// --- Sub-components ---

const ActivityItem: React.FC<{
    item: { type: string; date: Date; data: any; };
    stages: Stage[];
}> = ({ item, stages }) => {

    const renderContent = () => {
        switch (item.type) {
            case 'created':
                return <p>{isId ? <>Lamaran diterima melalui <span className="font-semibold">{item.data.source}</span>.</> : <>Application received via <span className="font-semibold">{item.data.source}</span>.</>}</p>;
            case 'stageChange':
                const stage = stages.find(s => s.id === item.data.stageId);
                return <p>{isId ? <>Tahapan diubah ke <span className="font-semibold" style={{ color: stage?.color }}>{getStageLabel(stage, true) || item.data.stageId}</span> oleh {item.data.changedBy}.</> : <>Stage changed to <span className="font-semibold" style={{ color: stage?.color }}>{stage?.name || item.data.stageId}</span> by {item.data.changedBy}.</>}</p>;
            case 'note':
                return <NoteItem note={item.data} />;
            default:
                return null;
        }
    };

    const ICONS: Record<string, React.ReactElement> = {
        created: <DocumentPlusIcon className="h-5 w-5" />,
        stageChange: <ArrowPathIcon className="h-5 w-5" />,
        note: <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />,
    };

    return (
        <div className="relative pl-10">
            <div className="absolute -left-4 top-1 h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300">
                {ICONS[item.type]}
            </div>
            <div className="text-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                {renderContent()}
            </div>
        </div>
    );
};

const NoteItem: React.FC<{ note: { author: string; content: string; date: string } }> = ({ note }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
        <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{note.content}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right">
            - {note.author}
        </p>
    </div>
);

// AddNoteForm
const AddNoteForm: React.FC<{
  application: Application;
  onUpdateApplication: (applicationId: string, updates: Partial<Application>) => void;
}> = ({ application, onUpdateApplication }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        const newNote = {
            author: 'Alex Greene', // Hardcoded current user
            content: content.trim(),
            date: new Date().toISOString(),
        };

        const updatedNotes = [...(application.notes || []), newNote];
        onUpdateApplication(application.id, { notes: updatedNotes });
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 space-y-3">
            <label htmlFor="note-content" className="text-sm font-semibold text-slate-700 dark:text-slate-200">{isId ? 'Tambah Catatan Baru' : 'Add a new note'}</label>
            <textarea
                id="note-content"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={3}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                placeholder={isId ? 'Tulis catatan Anda di sini...' : 'Type your note here...'}
                required
            />
            <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700">
                    {isId ? 'Tambah Catatan' : 'Add Note'}
                </button>
            </div>
        </form>
    );
};

const AddTaskForm: React.FC<{
    applicationId: string;
    interviewers: Interviewer[];
    onAddTask: (taskData: Omit<Task, 'id' | 'status'>) => void;
}> = ({ applicationId, interviewers, onAddTask }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assigneeId, setAssigneeId] = useState(interviewers[0]?.id || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !dueDate || !assigneeId) return;
        
        onAddTask({
            applicationId,
            title: title.trim(),
            dueDate,
            assigneeId,
        });

        setTitle('');
        setDueDate('');
    };

    return (
         <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{isId ? 'Tambah Tugas Baru' : 'Add a new task'}</h4>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                placeholder={isId ? 'Judul tugas...' : 'Task title...'}
                required
            />
            <div className="grid grid-cols-2 gap-3">
                <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                    required
                />
                 <select
                    value={assigneeId}
                    onChange={e => setAssigneeId(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                    required
                >
                    <option value="" disabled>{isId ? 'Tugaskan ke...' : 'Assign to...'}</option>
                    {interviewers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
            </div>
            <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700">
                    {isId ? 'Tambah Tugas' : 'Add Task'}
                </button>
            </div>
        </form>
    );
};

const TaskItem: React.FC<{
  task: Task;
  interviewers: Interviewer[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}> = ({ task, interviewers, onUpdateTask, onDeleteTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({
        title: task.title,
        dueDate: task.dueDate,
        assigneeId: task.assigneeId
    });

    const assignee = interviewers.find(i => i.id === task.assigneeId);
    const isCompleted = task.status === TaskStatus.Completed;
    const isOverdue = !isCompleted && new Date(task.dueDate + 'T23:59:59') < new Date();

    const handleToggleStatus = () => {
        onUpdateTask(task.id, {
            status: isCompleted ? TaskStatus.ToDo : TaskStatus.Completed,
        });
    };

    const handleDelete = () => {
        if (window.confirm(isId ? 'Apakah Anda yakin ingin menghapus tugas ini?' : 'Are you sure you want to delete this task?')) {
            onDeleteTask(task.id);
        }
    };
    
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdateTask(task.id, editedTask);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedTask({
            title: task.title,
            dueDate: task.dueDate,
            assigneeId: task.assigneeId
        });
    };
    
    const inputStyles = "bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white";

    if (isEditing) {
        return (
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50 space-y-3">
                <input
                    type="text"
                    name="title"
                    value={editedTask.title}
                    onChange={handleEditChange}
                    className={inputStyles}
                />
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="date"
                        name="dueDate"
                        value={editedTask.dueDate}
                        onChange={handleEditChange}
                        className={inputStyles}
                    />
                    <select
                        name="assigneeId"
                        value={editedTask.assigneeId}
                        onChange={handleEditChange}
                        className={inputStyles}
                    >
                        {interviewers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={handleCancel} className="px-3 py-1 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500">{isId ? 'Batal' : 'Cancel'}</button>
                    <button onClick={handleSave} className="px-3 py-1 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700">{isId ? 'Simpan' : 'Save'}</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`group flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 ${isCompleted ? 'bg-slate-50 dark:bg-slate-700/30' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
            <input
                type="checkbox"
                checked={isCompleted}
                onChange={handleToggleStatus}
                className="mt-1 w-5 h-5 text-primary-600 bg-slate-200 border-slate-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-600 dark:border-slate-500"
            />
            <div className="flex-1">
                <p className={`text-sm ${isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                    {task.title}
                </p>
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
                        {isId ? 'Batas waktu:' : 'Due:'} {new Date(task.dueDate + 'T00:00:00').toLocaleDateString(isId ? 'id-ID' : undefined)}
                    </span>
                    <span>&bull;</span>
                    <span>To: {assignee?.name || 'Unassigned'}</span>
                </div>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setIsEditing(true)} className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded">
                    <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={handleDelete} className="p-1 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500 rounded">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const InterviewItem: React.FC<{
    interview: Interview;
    onAddFeedback: () => void;
}> = ({ interview, onAddFeedback }) => {
    const statusColor = interview.status === InterviewStatus.Completed ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
    
    const recommendationColor = {
        [Recommendation.StrongHire]: 'text-green-500',
        [Recommendation.Hire]: 'text-emerald-500',
        [Recommendation.NoHire]: 'text-red-500',
    };

    const hasFeedback = interview.scorecard && interview.scorecard.length > 0;
    const isCompleted = interview.status === InterviewStatus.Completed;
    const feedbackButtonText = isCompleted ? "Add/Edit Feedback" : "Add Feedback";

    return (
         <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{interview.type}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {new Date(interview.dateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>{isId ? (interview.status === InterviewStatus.Completed ? 'Selesai' : 'Dijadwalkan') : interview.status}</span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                    <p><strong>{isId ? 'Lokasi / Tautan:' : 'Location/Link:'}</strong> {interview.locationOrLink}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{isId ? 'Pewawancara:' : 'Interviewers:'}</p>
                    <div className="flex flex-wrap gap-2">
                        {interview.interviewers.map(interviewer => (
                            <span key={interviewer.id} className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-2 py-1 rounded-full">{interviewer.name}</span>
                        ))}
                    </div>
                </div>
            </div>

            {isCompleted && hasFeedback && (
                <div className="px-4 pb-4 pt-3 border-t border-slate-200 dark:border-slate-600 space-y-4">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{isId ? 'Ringkasan Umpan Balik' : 'Feedback Summary'}</h4>
                    {interview.recommendation && (
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{isId ? 'Rekomendasi' : 'Recommendation'}</p>
                            <p className={`font-bold text-lg ${recommendationColor[interview.recommendation]}`}>
      {isId ? {
        [Recommendation.StrongHire]: 'Sangat Direkomendasikan',
        [Recommendation.Hire]: 'Direkomendasikan',
        [Recommendation.NoHire]: 'Tidak Direkomendasikan',
      }[interview.recommendation as Recommendation] || interview.recommendation : interview.recommendation}
    </p>
                        </div>
                    )}
                    {interview.scorecard?.map(fb => (
                        <div key={fb.competency}>
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{fb.competency}</p>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-4 h-4 ${i < fb.rating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-500'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                            </div>
                           {fb.notes && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 pl-2 border-l-2 border-slate-200 dark:border-slate-600">{fb.notes}</p>}
                        </div>
                    ))}
                </div>
            )}

            <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <button onClick={onAddFeedback} className="w-full text-center px-3 py-1.5 text-sm font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/50 rounded-md hover:bg-primary-200 dark:hover:bg-primary-900">
                    {isId ? (isCompleted ? 'Ubah Umpan Balik' : 'Beri Umpan Balik') : feedbackButtonText}
                </button>
            </div>
         </div>
    );
};


interface InfoItemProps {
    icon: React.ReactElement<{ className?: string }>;
    label: string;
    href?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, href }) => {
    const content = (
        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
            {React.cloneElement(icon, { className: "h-5 w-5 text-slate-400" })}
            <span className="truncate">{label}</span>
        </div>
    );
    return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-primary-500">{content}</a> : content;
}

const DetailsSection: React.FC<{ icon: React.ReactElement<{ className?: string }>, title: string, children: React.ReactNode }> = ({ icon, title, children }) => {
    const hasContent = React.Children.toArray(children).some(child => {
        if (!React.isValidElement(child)) return true; // for simple text nodes or fragments
        const childProps = child.props as { value?: any; children?: React.ReactNode; items?: any[] };
        if (childProps.value) return true;
        if (childProps.items && childProps.items.length > 0) return true;
        if (childProps.children) return React.Children.count(childProps.children) > 0;
        return false;
    });

    if (!hasContent && title !== "Activity Timeline" && title !== "Tasks") return null;
    
    return (
        <div>
            <h3 className="flex items-center space-x-2 text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                {React.cloneElement(icon, { className: "h-6 w-6" })}
                <span>{title}</span>
            </h3>
            <div className="space-y-3 text-sm ml-8 border-l border-slate-200 dark:border-slate-700 pl-6 py-2">
                {children}
            </div>
        </div>
    );
}

const DetailItem: React.FC<{label: string, value?: string}> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">{label}</p>
            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{value}</p>
        </div>
    );
}

export default CandidateProfile;
