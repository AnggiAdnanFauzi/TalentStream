import React from 'react';
import { ChevronDownIcon } from './icons/Icons';

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, isOpen, onToggle, children }) => (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
        <button type="button" onClick={onToggle} className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-800 dark:text-slate-100">
            {title}
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && <div className="p-4 border-t border-slate-200 dark:border-slate-700">{children}</div>}
    </div>
);

export default AccordionSection;
