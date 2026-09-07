import React, { useState, useEffect } from 'react';
import { Application, Candidate, Interviewer, Interview, InterviewType } from '../types';
import { XMarkIcon } from './icons/Icons';

interface ScheduleInterviewModalProps {
  language?: 'en' | 'id';
  isOpen: boolean;
  onClose: () => void;
  application: (Application & { candidate?: Candidate }) | null;
  interviewers: Interviewer[];
  onSchedule: (interviewData: Omit<Interview, 'id' | 'status'>) => void;
}

const INTERVIEW_TYPE_ID: Record<string, string> = {
  [InterviewType.Screen]: 'Penyaringan Awal (Phone Screen)',
  [InterviewType.Technical]: 'Wawancara Teknis (Technical)',
  [InterviewType.CulturalFit]: 'Kesesuaian Budaya (Cultural Fit)',
  [InterviewType.Final]: 'Wawancara Akhir (Final)',
};

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({ isOpen, onClose, application, interviewers, onSchedule, language = 'id' }) => {
  const isId = language === 'id';
  const [interviewType, setInterviewType] = useState<InterviewType>(InterviewType.Screen);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [locationOrLink, setLocationOrLink] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
      if (!isOpen) {
          setInterviewType(InterviewType.Screen);
          setDate('');
          setTime('');
          setSelectedInterviewers([]);
          setLocationOrLink('');
          setNotes('');
          setErrors({});
      }
  }, [isOpen]);

  const handleInterviewerToggle = (interviewerId: string) => {
      setSelectedInterviewers(prev => 
          prev.includes(interviewerId) 
              ? prev.filter(id => id !== interviewerId) 
              : [...prev, interviewerId]
      );
  };

  const validate = (): boolean => {
      const newErrors: Record<string, string> = {};
      if (!date) newErrors.date = isId ? 'Tanggal wawancara wajib diisi' : 'Date is required';
      if (!time) newErrors.time = isId ? 'Waktu wawancara wajib diisi' : 'Time is required';
      if (selectedInterviewers.length === 0) newErrors.interviewers = isId ? 'Pilih minimal satu pewawancara' : 'At least one interviewer must be selected';
      if (!locationOrLink.trim()) newErrors.locationOrLink = isId ? 'Lokasi atau tautan pertemuan wajib diisi' : 'Location or link is required';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validate() && application) {
          const dateTime = new Date(`${date}T${time}`).toISOString();
          const assignedInterviewers = interviewers.filter(i => selectedInterviewers.includes(i.id));

          onSchedule({
              applicationId: application.id,
              type: interviewType,
              dateTime,
              interviewers: assignedInterviewers,
              locationOrLink: locationOrLink.trim(),
              notes: notes.trim() || undefined,
          });
      }
  };
  
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl transform rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all m-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700 rounded-t">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white" id="modal-title">
              {isId ? `Jadwalkan Wawancara untuk ${application.candidate?.name}` : `Schedule Interview for ${application.candidate?.name}`}
            </h3>
            <button type="button" onClick={onClose} className="p-1 ml-auto bg-transparent rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-600 dark:hover:text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
             <div>
                <label htmlFor="interviewType" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                  {isId ? 'Tipe Wawancara' : 'Interview Type'}
                </label>
                <select id="interviewType" value={interviewType} onChange={e => setInterviewType(e.target.value as InterviewType)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white">
                    {Object.values(InterviewType).map(type => (
                      <option key={type} value={type}>
                        {isId ? (INTERVIEW_TYPE_ID[type] || type) : type}
                      </option>
                    ))}
                </select>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                      {isId ? 'Tanggal *' : 'Date *'}
                    </label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={`bg-slate-50 border ${errors.date ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white`} />
                    {errors.date && <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.date}</p>}
                </div>
                <div>
                    <label htmlFor="time" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                      {isId ? 'Waktu *' : 'Time *'}
                    </label>
                    <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className={`bg-slate-50 border ${errors.time ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white`} />
                    {errors.time && <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.time}</p>}
                </div>
             </div>

             <div>
                <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                  {isId ? 'Pewawancara *' : 'Interviewers *'}
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-slate-300 dark:border-slate-600 max-h-40 overflow-y-auto">
                    {interviewers.map(interviewer => (
                        <label key={interviewer.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                            <input type="checkbox" checked={selectedInterviewers.includes(interviewer.id)} onChange={() => handleInterviewerToggle(interviewer.id)} className="w-4 h-4 text-primary-600 bg-slate-100 border-slate-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
                            <span>{interviewer.name} <span className="text-slate-500 dark:text-slate-400 text-xs">({interviewer.role})</span></span>
                        </label>
                    ))}
                </div>
                {errors.interviewers && <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.interviewers}</p>}
             </div>
            
            <div>
                <label htmlFor="locationOrLink" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                  {isId ? 'Lokasi / Tautan Pertemuan *' : 'Location / Meeting Link *'}
                </label>
                <input type="text" id="locationOrLink" value={locationOrLink} onChange={e => setLocationOrLink(e.target.value)} className={`bg-slate-50 border ${errors.locationOrLink ? 'border-red-500' : 'border-slate-300'} text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white`} placeholder={isId ? 'misal: Google Meet, Zoom, atau Ruang Meeting A' : 'e.g., https://meet.google.com/xyz'} />
                {errors.locationOrLink && <p className="mt-1 text-xs text-red-600 dark:text-red-500">{errors.locationOrLink}</p>}
            </div>

            <div>
                <label htmlFor="notes" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                  {isId ? 'Catatan untuk Pewawancara (Opsional)' : 'Notes for Interviewers (Optional)'}
                </label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white" placeholder={isId ? 'misal: fokus pada kemampuan arsitektur sistem dan kesesuaian budaya kerja' : 'e.g., focus on system design skills'}></textarea>
            </div>
          </div>
          
          <div className="flex items-center justify-end p-5 space-x-2 border-t border-slate-200 dark:border-slate-700 rounded-b">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500">
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700">
              {isId ? 'Jadwalkan & Kirim Undangan' : 'Schedule & Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
