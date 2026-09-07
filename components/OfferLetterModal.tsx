import React, { useState, useEffect } from 'react';
import { Application, Candidate, Job } from '../types';
import { useOfferLetterGenerator } from '../hooks/useOfferLetterGenerator';
import { XMarkIcon, SparklesIcon, ClipboardIcon, CheckIcon } from './icons/Icons';

interface OfferLetterModalProps {
  language?: 'en' | 'id';
  isOpen: boolean;
  onClose: () => void;
  application: (Application & { candidate?: Candidate; job?: Job }) | null;
}

const OfferLetterModal: React.FC<OfferLetterModalProps> = ({ isOpen, onClose, application, language = 'id' }) => {
  const isId = language === 'id';
  const { isLoading, error, offerLetterText, generateLetter, reset } = useOfferLetterGenerator();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen && application?.candidate && application.job) {
      generateLetter(
        application.candidate.name,
        application.job.title,
        application.job.salaryMin,
        application.job.salaryMax
      );
    } else {
        reset();
    }
  }, [isOpen, application]);

  const handleCopy = () => {
    if (!offerLetterText) return;
    navigator.clipboard.writeText(offerLetterText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleSend = () => {
    alert(isId ? 'Fitur ini akan terintegrasi dengan layanan email untuk mengirim penawaran kerja.' : 'This would integrate with an email service to send the offer.');
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl transform rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all m-4">
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700 rounded-t">
          <div className="flex items-center space-x-2">
             <SparklesIcon className="h-6 w-6 text-primary-500" />
             <h3 className="text-xl font-semibold text-slate-900 dark:text-white" id="modal-title">
               {isId ? 'Generator Surat Penawaran AI' : 'AI Offer Letter Generator'}
             </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 ml-auto bg-transparent rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-600 dark:hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {isId ? (
              <>
                Draf surat penawaran kerja dibuat untuk <span className="font-semibold">{application.candidate?.name}</span> pada posisi <span className="font-semibold">{application.job?.title}</span>. Silakan tinjau dan edit bila diperlukan sebelum dikirim.
              </>
            ) : (
              <>
                Generated offer letter for <span className="font-semibold">{application.candidate?.name}</span> for the position of <span className="font-semibold">{application.job?.title}</span>. Please review and edit as necessary before sending.
              </>
            )}
          </p>
          <div className="w-full h-96 bg-slate-50 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 p-4 overflow-y-auto">
            {isLoading && <p className="text-slate-500">{isId ? 'Sedang membuat draf surat...' : 'Generating...'}</p>}
            {error && <p className="text-red-500">{error}</p>}
            {offerLetterText && (
                <textarea
                    readOnly={isLoading}
                    value={offerLetterText}
                    className="w-full h-full bg-transparent border-0 text-slate-800 dark:text-slate-200 text-sm font-mono focus:ring-0 resize-none"
                />
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-end p-5 space-x-2 border-t border-slate-200 dark:border-slate-700 rounded-b">
          <button 
            type="button" 
            onClick={handleCopy} 
            disabled={!offerLetterText}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-500 disabled:opacity-50"
          >
            {isCopied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardIcon className="w-5 h-5" />}
            {isCopied ? (isId ? 'Tersalin!' : 'Copied!') : (isId ? 'Salin Teks' : 'Copy Text')}
          </button>
          <button 
            type="button" 
            onClick={handleSend} 
            disabled={!offerLetterText}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 disabled:bg-slate-400"
          >
            {isId ? 'Kirim Penawaran' : 'Send Offer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferLetterModal;
