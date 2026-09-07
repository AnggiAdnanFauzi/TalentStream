import React from 'react';
import { LightBulbIcon } from './icons/Icons';
import { translations } from '../utils/translations';

interface BlueprintInsightProps {
  language?: 'en' | 'id';
}

const BlueprintInsight: React.FC<BlueprintInsightProps> = ({ language = 'id' }) => {
    const t = translations[language]?.guides || translations.id.guides;
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-full">
            <LightBulbIcon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.blueprintTitle}</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {t.blueprintDesc}
        </p>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
          <li><span className="font-semibold text-slate-700 dark:text-slate-200">{t.principle1Title}:</span> {t.principle1Desc}</li>
          <li><span className="font-semibold text-slate-700 dark:text-slate-200">{t.principle2Title}:</span> {t.principle2Desc}</li>
          <li><span className="font-semibold text-slate-700 dark:text-slate-200">{t.principle3Title}:</span> {t.principle3Desc}</li>
          <li><span className="font-semibold text-slate-700 dark:text-slate-200">{t.principle4Title}:</span> {t.principle4Desc}</li>
        </ul>
      </div>
    );
};

export default BlueprintInsight;
