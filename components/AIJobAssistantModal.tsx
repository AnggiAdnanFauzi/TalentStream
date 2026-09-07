
import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { useAIJobAssistant } from '../hooks/useAIJobAssistant';
import { XMarkIcon, SparklesIcon } from './icons/Icons';

interface AIJobAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: Omit<Job, 'id' | 'totalApplicants' | 'daysOpen' | 'status'>) => void;
  initialData?: Partial<Job>;
  requisitionId?: string;
}

const AIJobAssistantModal: React.FC<AIJobAssistantModalProps> = ({ isOpen, onClose, onSave, initialData, requisitionId }) => {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('Mid-level');
  const [industry, setIndustry] = useState('Technology');
  const { isLoading, error, generatedContent, generateJobDetails, reset } = useAIJobAssistant();
  const [activeTab, setActiveTab] = useState('jd');
  
  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setTitle(initialData.title || '');
            setLevel(initialData.level || 'Mid-level');
            setIndustry(initialData.department || 'Technology');
        } else {
            setTitle('');
            setLevel('Mid-level');
            setIndustry('Technology');
        }
    } else {
        reset(); // Clear AI content when modal is closed
    }
  }, [isOpen, initialData]);

  const handleGenerate = async () => {
    if (!title) return;
    await generateJobDetails(title, level, industry);
  };

  const handleSave = () => {
    if (!generatedContent || !title) return;
    onSave({
        title,
        level,
        department: industry, // Using industry as department for simplicity
        location: initialData?.location || 'Remote', // Use initial data location or default
        jobDescription: generatedContent.jobDescription,
        competencies: generatedContent.competencies,
        interviewQuestions: generatedContent.interviewQuestions,
        salaryMin: initialData?.salaryMin ?? 80000,
        salaryMax: initialData?.salaryMax ?? 120000,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add a toast notification here in a real app
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl transform rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all m-4">
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700 rounded-t">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-6 w-6 text-primary-500" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white" id="modal-title">
              AI Job Requirements Builder
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 ml-auto bg-transparent rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-600 dark:hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Inputs Column */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">1. Define the Role</h4>
            <FormInput label="Job Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Customer Service" />
            <FormSelect label="Level" value={level} onChange={e => setLevel(e.target.value)}>
                <option>Junior</option>
                <option>Mid-level</option>
                <option>Senior</option>
                <option>Lead</option>
            </FormSelect>
             <FormSelect label="Industry / Department" value={industry} onChange={e => setIndustry(e.target.value)}>
                <option>Technology</option>
                <option>Finance</option>
                <option>Digital Marketing</option>
                <option>Customer Service</option>
                <option>Sales</option>
                <option>Design</option>
            </FormSelect>
            <button onClick={handleGenerate} disabled={isLoading || !title} className="w-full inline-flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
              {isLoading ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          
          {/* Results Column */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">2. Review & Refine</h4>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg h-[50vh] flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-slate-500">Generating content...</p>
                </div>
              ) : error ? (
                <div className="flex-1 flex items-center justify-center text-red-500 p-4">{error}</div>
              ) : generatedContent ? (
                <>
                    <div className="border-b border-slate-200 dark:border-slate-700">
                        <nav className="flex space-x-1 p-1">
                            <TabButton active={activeTab === 'jd'} onClick={() => setActiveTab('jd')}>Description</TabButton>
                            <TabButton active={activeTab === 'comp'} onClick={() => setActiveTab('comp')}>Competencies</TabButton>
                            <TabButton active={activeTab === 'qa'} onClick={() => setActiveTab('qa')}>Interview Qs</TabButton>
                        </nav>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 prose prose-sm dark:prose-invert max-w-none">
                        {activeTab === 'jd' && <ContentDisplay content={generatedContent.jobDescription} onCopy={copyToClipboard} />}
                        {activeTab === 'comp' && <ContentDisplay content={generatedContent.competencies.join('\n')} onCopy={copyToClipboard} />}
                        {activeTab === 'qa' && <ContentDisplay content={generatedContent.interviewQuestions.map(sec => `**${sec.type}**\n${sec.questions.join('\n')}`).join('\n\n')} onCopy={copyToClipboard} />}
                    </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-slate-500 text-center p-4">Fill in the role details and click "Generate with AI" to create job requirements.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-5 space-x-2 border-t border-slate-200 dark:border-slate-700 rounded-b">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!generatedContent} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
            Save Job Posting
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper components
const FormInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; }> = ({ label, ...props }) => (
    <div>
        <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <input {...props} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white"/>
    </div>
);
const FormSelect: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; }> = ({ label, ...props }) => (
    <div>
        <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <select {...props} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
    </div>
);
const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-3 py-1.5 text-sm font-medium rounded-md ${active ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
        {children}
    </button>
);

const ContentDisplay: React.FC<{ content: string, onCopy: (text: string) => void }> = ({ content, onCopy }) => (
    <div className="relative">
        <button onClick={() => onCopy(content)} className="absolute top-0 right-0 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1 bg-slate-100 dark:bg-slate-700 rounded-md">Copy</button>
        <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300">{content}</pre>
    </div>
);

export default AIJobAssistantModal;