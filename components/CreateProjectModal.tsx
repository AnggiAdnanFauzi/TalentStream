import React, { useState, useEffect } from 'react';
import { Project, Requisition, Interviewer } from '../types';
import { XMarkIcon } from './icons/Icons';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (projectData: Omit<Project, 'id'>, requisitionIds: string[]) => void;
  requisitions: Requisition[];
  interviewers: Interviewer[];
  language?: 'en' | 'id';
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onAddProject, requisitions, interviewers, language = 'id' }) => {
  const isId = language === 'id';
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ownerId, setOwnerId] = useState(interviewers[0]?.id || '');
  const [selectedReqs, setSelectedReqs] = useState<string[]>([]);
  const [error, setError] = useState('');

  const approvedRequisitions = requisitions.filter(r => r.status === 'Approved' && !r.jobId);
  
  useEffect(() => {
    if (!isOpen) {
        setName('');
        setDescription('');
        setSelectedReqs([]);
        setError('');
        setOwnerId(interviewers[0]?.id || '');
    }
  }, [isOpen, interviewers]);

  const handleReqToggle = (reqId: string) => {
    setSelectedReqs(prev => prev.includes(reqId) ? prev.filter(id => id !== reqId) : [...prev, reqId]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ownerId || selectedReqs.length === 0) {
        setError(isId 
          ? "Mohon masukkan nama proyek, pilih penanggung jawab, dan pilih minimal satu permintaan lowongan." 
          : "Please provide a project name, select an owner, and choose at least one requisition.");
        return;
    }
    const projectData = {
        name: name.trim(),
        description: description.trim(),
        status: 'Active' as const,
        ownerId,
        createdDate: new Date().toISOString(),
    };
    onAddProject(projectData, selectedReqs);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl transform rounded-2xl bg-white dark:bg-slate-800 text-left shadow-2xl transition-all m-4 border border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700 rounded-t">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white" id="modal-title">
              {isId ? 'Buat Proyek Rekrutmen Baru' : 'Create New Hiring Project'}
            </h3>
            <button type="button" onClick={onClose} className="p-1.5 ml-auto bg-transparent rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
             <div>
                <label htmlFor="projectName" className="block mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {isId ? 'Nama Proyek' : 'Project Name'}
                </label>
                <input type="text" id="projectName" value={name} onChange={e => setName(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
             </div>
             <div>
                <label htmlFor="projectDesc" className="block mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {isId ? 'Deskripsi (Opsional)' : 'Description (Optional)'}
                </label>
                <textarea id="projectDesc" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
             </div>
             <div>
                <label htmlFor="projectOwner" className="block mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {isId ? 'Penanggung Jawab Proyek' : 'Project Owner'}
                </label>
                <select id="projectOwner" value={ownerId} onChange={e => setOwnerId(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:text-white" required>
                    {interviewers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
             </div>
             <div>
                <label className="block mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {isId ? 'Pilih Permintaan Kebutuhan SDM yang Disetujui' : 'Select Approved Requisitions to Include'}
                </label>
                <div className="grid grid-cols-1 gap-2 p-3 rounded-xl border border-slate-300 dark:border-slate-600 max-h-40 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/30">
                    {approvedRequisitions.length > 0 ? approvedRequisitions.map(req => (
                        <label key={req.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                            <input type="checkbox" checked={selectedReqs.includes(req.id)} onChange={() => handleReqToggle(req.id)} className="w-4 h-4 text-primary-600 bg-slate-100 border-slate-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{req.title} <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">({req.department})</span></span>
                        </label>
                    )) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                          {isId ? 'Tidak ada permintaan kebutuhan yang tersedia.' : 'No approved requisitions available.'}
                        </p>
                    )}
                </div>
             </div>
             {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
          </div>
          
          <div className="flex items-center justify-end p-5 space-x-3 border-t border-slate-200 dark:border-slate-700 rounded-b">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 rounded-xl shadow-sm hover:bg-primary-700 transition-colors">
              {isId ? 'Buat Proyek & Terbitkan Lowongan' : 'Create Project & Publish Jobs'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;