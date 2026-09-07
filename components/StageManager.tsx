import React, { useState } from 'react';
import { Stage } from '../types';
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from './icons/Icons';

interface StageManagerProps {
  stages: Stage[];
  onSetStages: (stages: Stage[]) => void;
}

const StageManager: React.FC<StageManagerProps> = ({ stages, onSetStages }) => {
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('#64748b');

  const handleUpdateStage = (id: string, updates: Partial<Stage>) => {
    onSetStages(stages.map(stage => stage.id === id ? { ...stage, ...updates } : stage));
  };

  const handleDeleteStage = (id: string) => {
    if (stages.length <= 1) {
        alert("You must have at least one stage.");
        return;
    }
    if (window.confirm("Are you sure you want to delete this stage? This action cannot be undone. Candidates in this stage will need to be reassigned.")) {
        onSetStages(stages.filter(stage => stage.id !== id));
    }
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;
    const newStage: Stage = {
        id: newStageName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        name: newStageName.trim(),
        color: newStageColor,
    };
    onSetStages([...stages, newStage]);
    setNewStageName('');
    setNewStageColor('#64748b');
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === stages.length - 1)) {
        return;
    }
    
    const newStages = [...stages];
    const item = newStages.splice(index, 1)[0];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newStages.splice(newIndex, 0, item);
    onSetStages(newStages);
  };
  
  const inputStyles = "bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white";

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Interview Stage Configuration</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Define and order the stages in your hiring pipeline. Changes are saved automatically and will be reflected across the entire application.</p>
      
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center space-x-2 md:space-x-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="flex flex-col">
                <button onClick={() => handleMoveStage(index, 'up')} disabled={index === 0} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"><ArrowUpIcon className="w-4 h-4" /></button>
                <button onClick={() => handleMoveStage(index, 'down')} disabled={index === stages.length - 1} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"><ArrowDownIcon className="w-4 h-4" /></button>
            </div>
            <input type="color" value={stage.color} onChange={e => handleUpdateStage(stage.id, { color: e.target.value })} className="p-0 h-8 w-8 block bg-transparent border-none cursor-pointer rounded-lg" title="Change color"/>
            <div className="flex-1">
                <input type="text" value={stage.name} onChange={e => handleUpdateStage(stage.id, { name: e.target.value })} className={inputStyles} />
            </div>
            <button onClick={() => handleDeleteStage(stage.id)} className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500 rounded"><TrashIcon className="w-5 h-5" /></button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddStage} className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">Add New Stage</h4>
          <div className="flex items-center space-x-2 md:space-x-3">
              <input type="color" value={newStageColor} onChange={e => setNewStageColor(e.target.value)} className="p-0 h-10 w-10 block bg-transparent border-none cursor-pointer rounded-lg"/>
              <div className="flex-1">
                 <input type="text" value={newStageName} onChange={e => setNewStageName(e.target.value)} placeholder="New stage name" className={inputStyles} required />
              </div>
              <button type="submit" className="p-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800"><PlusIcon className="w-6 h-6"/></button>
          </div>
      </form>
    </div>
  );
};

export default StageManager;
