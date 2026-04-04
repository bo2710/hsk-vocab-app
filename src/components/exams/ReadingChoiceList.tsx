import React from 'react';
import { ExamQuestionOption } from '../../features/exams/types';

interface Props {
  options: ExamQuestionOption[];
  selectedOptionId: string | null;
  onSelect: (optionId: string, text: string) => void;
}

export const ReadingChoiceList: React.FC<Props> = ({ options, selectedOptionId, onSelect }) => {
  if (!options || options.length === 0) {
    return null;
  }

  const sortedOptions = [...options].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-3 mt-5">
      {sortedOptions.map(opt => {
        const isSelected = selectedOptionId === opt.id;
        return (
          <label 
            key={opt.id}
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              isSelected 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-sm' 
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <input 
                type="radio" 
                name={`reading_choice_${opt.exam_question_id}`} 
                value={opt.id}
                checked={isSelected}
                onChange={() => onSelect(opt.id, opt.option_text || opt.option_key)}
                className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 bg-white dark:bg-gray-900"
              />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                <span className="font-bold mr-2">{opt.option_key}.</span>
                {opt.option_text}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
};