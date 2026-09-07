

import React from 'react';
import { Application, Candidate, Stage } from '../types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  language?: 'en' | 'id';
  applications: (Application & { candidate?: Candidate })[];
  onSelectCandidate: (app: Application & { candidate?: Candidate }) => void;
  onScheduleInterview: (app: Application & { candidate?: Candidate }) => void;
  stages: Stage[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ applications, onSelectCandidate, onScheduleInterview, stages, language = 'id' }) => {
  return (
    <div className="flex overflow-x-auto space-x-4 pb-4">
      {stages.map(stage => {
        const stageApplications = applications.filter(app => app.stageId === stage.id);
        return (
          <KanbanColumn language={language}
            key={stage.id}
            stage={stage}
            applications={stageApplications}
            onSelectCandidate={onSelectCandidate}
            onScheduleInterview={onScheduleInterview}
          />
        );
      })}
    </div>
  );
};

export default KanbanBoard;