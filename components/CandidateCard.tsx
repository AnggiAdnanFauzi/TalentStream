import React from 'react';
import { Application, Candidate } from '../types';
import { CalendarIcon } from './icons/Icons';
import { getJobTitle } from '../utils/demoTranslations';

interface CandidateCardProps {
  language?: 'en' | 'id';
  application: Application & { candidate?: Candidate, job?: { title: string } };
  onSelectCandidate: () => void;
  onScheduleInterview: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ application, onSelectCandidate, onScheduleInterview, language = 'id' }) => {
  const isId = language === 'id';
  const { candidate, totalScore, job } = application;

  if (!candidate) {
    return null;
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const displayJobTitle = job?.title ? getJobTitle(job.title, language) : '';

  return (
    <div 
        onClick={onSelectCandidate}
        className="group bg-white dark:bg-slate-700 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:ring-2 hover:ring-primary-500 transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        <img
          src={candidate.avatarUrl}
          alt={candidate.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-slate-800 dark:text-white">{candidate.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{displayJobTitle}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{candidate.experienceYears} {isId ? 'tahun pengalaman' : 'years experience'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onScheduleInterview(); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 focus:opacity-100 focus:ring-2 focus:ring-primary-500"
            title={isId ? "Jadwalkan Wawancara" : "Schedule Interview"}
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
          <div className={`text-lg font-bold ${getScoreColor(totalScore)}`}>
              {totalScore}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
