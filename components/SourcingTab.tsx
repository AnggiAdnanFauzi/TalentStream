import React, { useState, useMemo } from 'react';
import { Job, NewCandidateData, ActiveTab } from '../types';
import { useAISourcing } from '../hooks/useAISourcing';
import { SparklesIcon, ClipboardIcon, CheckIcon, UserPlusIcon, BriefcaseIcon, MapPinIcon } from './icons/Icons';
import { translations } from '../utils/translations';

interface SourcingTabProps {
  jobs: Job[];
  onAddCandidateToJob: (jobId: string, candidateData: NewCandidateData, source: string) => void;
  onTabChange: (tab: ActiveTab) => void;
  language?: 'en' | 'id';
  subscriptionType?: string;
}

const SourcingTab: React.FC<SourcingTabProps> = ({ jobs, onAddCandidateToJob, onTabChange, language = 'id', subscriptionType = 'pro' }) => {
    const isId = language === 'id';
    const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id || null);
    const [addedCandidates, setAddedCandidates] = useState<string[]>([]);
    const selectedJob = useMemo(() => jobs.find(j => j.id === selectedJobId), [jobs, selectedJobId]);

    const { isLoading, error, sourcingResults, generateSourcingStrategy, reset } = useAISourcing();

    const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedJobId(e.target.value);
        reset();
        setAddedCandidates([]);
    };

    const handleGenerate = () => {
        if (selectedJob?.jobDescription) {
            generateSourcingStrategy(selectedJob.jobDescription);
        }
    };

    const handleAddCandidate = (candidateData: NewCandidateData) => {
        if (!selectedJobId) return;
        const candidateKey = `${candidateData.name}-${candidateData.email}`;
        onAddCandidateToJob(selectedJobId, candidateData, 'AI Sourced');
        setAddedCandidates(prev => [...prev, candidateKey]);
    };

    const copyToClipboard = (text: string, elementId: string) => {
        navigator.clipboard.writeText(text);
        const button = document.getElementById(elementId);
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-emerald-500"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg> <span>${isId ? 'Tersalin!' : 'Copied!'}</span>`;
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Controls */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                            <SparklesIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {isId ? 'Asisten AI Sourcing' : 'AI Sourcing Assistant'}
                        </h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      {isId 
                        ? 'Pilih lowongan aktif untuk membuat kata kunci pencarian, string boolean optimal, dan profil kandidat potensial secara otomatis.' 
                        : 'Select an open job to generate keywords, boolean search strings, and sample candidate profiles.'}
                    </p>
                    
                    <div>
                        <label htmlFor="job-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          {isId ? 'Pilih Lowongan Pekerjaan' : 'Select a Job Posting'}
                        </label>
                        <select
                            id="job-select"
                            value={selectedJobId || ''}
                            onChange={handleJobChange}
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            disabled={jobs.length === 0}
                        >
                            {jobs.length > 0 ? jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            )) : (
                                <option>{isId ? 'Tidak ada lowongan terbuka' : 'No open jobs available'}</option>
                            )}
                        </select>
                    </div>

                    
                    {subscriptionType === 'free' ? (
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-3 text-center">
                        <SparklesIcon className="w-8 h-8 text-slate-400" />
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">{isId ? 'Fitur AI Terkunci' : 'AI Feature Locked'}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">{isId ? 'Pencarian kandidat menggunakan AI eksklusif untuk paket Pro. Upgrade sekarang untuk menghemat waktu.' : 'AI candidate sourcing is exclusive to the Pro plan. Upgrade now to save time.'}</p>
                        </div>
                        <button onClick={() => onTabChange('billing' as any)} className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm">
                          {isId ? 'Upgrade ke Pro' : 'Upgrade to Pro'}
                        </button>
                      </div>
                    ) : (
                      <button
                          onClick={handleGenerate}
                          disabled={isLoading || !selectedJobId}
                          className="w-full flex items-center justify-center gap-x-2 px-4 py-3 text-sm font-semibold text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                          <SparklesIcon className="w-5 h-5" />
                          <span>{isId ? 'Hasilkan Strategi Pencarian' : 'Generate Sourcing Strategy'}</span>
                      </button>
                    )}
                </div>
            </div>

            {/* Right Panel: Results */}
            <div className="lg:col-span-2 space-y-6">
                {isLoading && (
                    <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400">{isId ? 'AI sedang berpikir... mohon tunggu.' : 'AI is thinking... please wait.'}</p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-2xl">
                        <p className="font-bold">{isId ? 'Terjadi Kesalahan' : 'Error'}</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                {!isLoading && !error && !sourcingResults && (
                     <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 text-center p-4">
                          {isId ? 'Hasil pencarian talenta akan muncul di sini setelah Anda mengklik tombol strategi.' : 'Your sourcing results will appear here.'}
                        </p>
                    </div>
                )}
                {sourcingResults && (
                    <>
                        <SourcingResultCard title={isId ? "Pencarian Boolean LinkedIn" : "LinkedIn Boolean Search"}>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                              {isId ? 'Salin dan tempel string ini ke kolom pencarian LinkedIn untuk menemukan profil yang relevan.' : 'Copy and paste this string into the LinkedIn search bar to find relevant profiles.'}
                            </p>
                            <pre className="text-sm bg-slate-100 dark:bg-slate-700 p-3 rounded-xl whitespace-pre-wrap font-mono relative">
                                {sourcingResults.booleanSearch}
                                <button id="copy-boolean" onClick={() => copyToClipboard(sourcingResults.booleanSearch, 'copy-boolean')} className="absolute top-2 right-2 flex items-center gap-1.5 text-xs bg-white dark:bg-slate-600 px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors">
                                    <ClipboardIcon className="w-4 h-4" /> <span>{isId ? 'Salin' : 'Copy'}</span>
                                </button>
                            </pre>
                        </SourcingResultCard>
                        
                        <SourcingResultCard title={isId ? "Kata Kunci Portal Kerja" : "Job Board Keywords"}>
                            <div className="flex flex-wrap gap-2">
                                {sourcingResults.keywords.map(kw => (
                                    <span key={kw} className="text-sm bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">{kw}</span>
                                ))}
                            </div>
                        </SourcingResultCard>

                        <SourcingResultCard title={isId ? "Rekomendasi Kandidat Potensial" : "Suggested Candidates"}>
                            <div className="space-y-4">
                                {sourcingResults.suggestedCandidates.map((candidate, index) => {
                                    const candidateKey = `${candidate.name}-${candidate.email}`;
                                    const isAdded = addedCandidates.includes(candidateKey);
                                    return (
                                        <div key={index} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-600/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-800 dark:text-white">{candidate.name}</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{candidate.summary}</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {candidate.skills?.split(',').map(skill => (
                                                        <span key={skill} className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-2 py-1 rounded-full">{skill.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAddCandidate(candidate)}
                                                disabled={isAdded}
                                                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm ${
                                                    isAdded 
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' 
                                                    : 'bg-primary-600 text-white hover:bg-primary-700'
                                                }`}
                                            >
                                                {isAdded ? (
                                                    <>
                                                        <CheckIcon className="w-4 h-4" />
                                                        {isId ? 'Tersimpan' : 'Added'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlusIcon className="w-4 h-4" />
                                                        {isId ? 'Tambah ke Pipeline' : 'Add to Pipeline'}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </SourcingResultCard>
                    </>
                )}
            </div>
        </div>
    );
};

const SourcingResultCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {children}
    </div>
);

export default SourcingTab;