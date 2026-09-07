import React, { useState, useEffect } from 'react';
import { Candidate } from '../types';
import { XMarkIcon } from './icons/Icons';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  language?: 'en' | 'id';
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({ isOpen, onClose, candidate, language = 'id' }) => {
  const isId = language === 'id';
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setMessage('');
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!message.trim() || !candidate) return;
    console.log(`Sending message to ${candidate.name} (${candidate.phone}):\n${message}`);
    onClose();
  };
  
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg transform rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all m-4">
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700 rounded-t">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white" id="modal-title">
            {isId ? `Kirim Pesan ke ${candidate.name}` : `Send Message to ${candidate.name}`}
          </h3>
          <button type="button" onClick={onClose} className="p-1 ml-auto bg-transparent rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-600 dark:hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
           <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isId ? `Kepada: ${candidate.phone}` : `To: ${candidate.phone}`}
              </p>
           </div>
           <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                {isId ? 'Isi Pesan' : 'Message'}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                placeholder={isId ? 'Tulis pesan Anda di sini...' : 'Type your message here...'}
              />
           </div>
        </div>
        
        <div className="flex items-center justify-end p-5 space-x-2 border-t border-slate-200 dark:border-slate-700 rounded-b">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500">
            {isId ? 'Batal' : 'Cancel'}
          </button>
          <button 
            type="button" 
            onClick={handleSend} 
            disabled={!message.trim()}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isId ? 'Kirim' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageModal;
