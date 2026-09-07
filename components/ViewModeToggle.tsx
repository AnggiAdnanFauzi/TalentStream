import React from 'react';
import { Squares2X2Icon, ListBulletIcon } from './icons/Icons';

interface ViewModeToggleProps {
  viewMode: 'kanban' | 'list';
  onViewModeChange: (mode: 'kanban' | 'list') => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
      <button
        onClick={() => onViewModeChange('kanban')}
        aria-label="Kanban View"
        className={`p-2 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
      >
        <Squares2X2Icon className="h-5 w-5" />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        aria-label="List View"
        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
      >
        <ListBulletIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ViewModeToggle;
