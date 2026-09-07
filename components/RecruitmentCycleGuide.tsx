import React from 'react';
import { DocumentPlusIcon, UserSearchIcon, ClipboardDocumentListIcon, UserPlusIcon, CheckBadgeIcon } from './icons/Icons';
import { translations } from '../utils/translations';

interface RecruitmentCycleGuideProps {
  language?: 'en' | 'id';
}

const RecruitmentCycleGuide: React.FC<RecruitmentCycleGuideProps> = ({ language = 'id' }) => {
    const t = translations[language]?.guides || translations.id.guides;
    const steps = [
        { name: t.step1Name, description: t.step1Desc, icon: <DocumentPlusIcon className="w-6 h-6" /> },
        { name: t.step2Name, description: t.step2Desc, icon: <UserSearchIcon className="w-6 h-6" /> },
        { name: t.step3Name, description: t.step3Desc, icon: <ClipboardDocumentListIcon className="w-6 h-6" /> },
        { name: t.step4Name, description: t.step4Desc, icon: <UserPlusIcon className="w-6 h-6" /> },
        { name: t.step5Name, description: t.step5Desc, icon: <CheckBadgeIcon className="w-6 h-6" /> },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{t.subtitle}</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                        <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 p-3 rounded-full text-primary-600 dark:text-primary-300">
                            {step.icon}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{index + 1}. {step.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecruitmentCycleGuide;
