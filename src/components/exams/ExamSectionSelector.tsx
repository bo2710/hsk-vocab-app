import React from 'react';
import { ExamSection } from '../../features/exams/types';
import { ExamSectionCard } from './ExamSectionCard';
import { Button } from '../ui/Button';

interface ExamSectionSelectorProps {
  sections: ExamSection[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
}

export const ExamSectionSelector: React.FC<ExamSectionSelectorProps> = ({ 
  sections, selectedIds, onToggle, onSelectAll 
}) => {
  const isAllSelected = sections.length > 0 && selectedIds.length === sections.length;

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Các phần thi ({sections.length})
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSelectAll}
          disabled={isAllSelected || sections.length === 0}
        >
          Chọn tất cả
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(section => (
          <ExamSectionCard 
            key={section.id} 
            section={section} 
            isSelected={selectedIds.includes(section.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};