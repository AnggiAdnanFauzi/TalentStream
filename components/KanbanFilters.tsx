import React from 'react';
import { Filters, DateRangeFilter } from '../types';
import { FilterIcon, ArrowPathIcon } from './icons/Icons';

interface KanbanFiltersProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  language?: 'en' | 'id';
}

const KanbanFilters: React.FC<KanbanFiltersProps> = ({ filters, onFilterChange, language = 'id' }) => {
  const isId = language === 'id';

  const handleReset = () => {
    onFilterChange({
        minExperience: 0,
        maxExperience: 15,
        minSalary: 50000,
        maxSalary: 200000,
        dateRange: 'all',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 flex-shrink-0">
            <FilterIcon className="h-5 w-5" />
            <span className="font-semibold text-lg">{isId ? 'Filter' : 'Filters'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-end gap-4 w-full">
            <FilterControl label={isId ? 'Pengalaman (Thn)' : 'Experience (Yrs)'}>
                <NumberInput value={filters.minExperience} onChange={val => onFilterChange({ minExperience: val })} />
                <span className="text-slate-400">-</span>
                <NumberInput value={filters.maxExperience} onChange={val => onFilterChange({ maxExperience: val })} />
            </FilterControl>

            <FilterControl label={isId ? 'Gaji ($k)' : 'Salary ($k)'}>
                <NumberInput value={filters.minSalary / 1000} onChange={val => onFilterChange({ minSalary: val * 1000 })} step={5} />
                <span className="text-slate-400">-</span>
                <NumberInput value={filters.maxSalary / 1000} onChange={val => onFilterChange({ maxSalary: val * 1000 })} step={5} />
            </FilterControl>

            <FilterControl label={isId ? 'Tanggal Melamar' : 'Applied Date'}>
                <select
                    value={filters.dateRange}
                    onChange={(e) => onFilterChange({ dateRange: e.target.value as DateRangeFilter })}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                >
                    <option value="all">{isId ? 'Semua Waktu' : 'All Time'}</option>
                    <option value="7d">{isId ? '7 Hari Terakhir' : 'Last 7 Days'}</option>
                    <option value="30d">{isId ? '30 Hari Terakhir' : 'Last 30 Days'}</option>
                </select>
            </FilterControl>
            
            <button 
                onClick={handleReset}
                className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center space-x-2"
            >
                <ArrowPathIcon className="h-4 w-4" />
                <span>{isId ? 'Atur Ulang' : 'Reset'}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

const FilterControl: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col space-y-1 w-full">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
        <div className="flex items-center space-x-2">
            {children}
        </div>
    </div>
);

const NumberInput: React.FC<{ value: number, onChange: (value: number) => void, step?: number }> = ({ value, onChange, step = 1 }) => (
    <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        step={step}
        min="0"
        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
    />
);

export default KanbanFilters;
