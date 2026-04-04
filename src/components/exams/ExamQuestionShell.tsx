import React from 'react';
import { ExamQuestion, ExamSection, ExamQuestionOption, ExamAttemptResponse } from '../../features/exams/types';
import { ListeningQuestionRenderer } from './ListeningQuestionRenderer';
import { ReadingQuestionRenderer } from './ReadingQuestionRenderer';
import { WritingQuestionRenderer } from './WritingQuestionRenderer';
import { useReadingQuestion } from '../../features/exams/hooks/useReadingQuestion';
import { useWritingQuestion } from '../../features/exams/hooks/useWritingQuestion';

interface ExamQuestionShellProps {
  question: ExamQuestion;
  index: number;
  section?: ExamSection;
  options?: ExamQuestionOption[];
  response?: Partial<ExamAttemptResponse>;
  onResponseChange?: (value: string, optionId?: string, isSubjective?: boolean) => void;
}

export const ExamQuestionShell: React.FC<ExamQuestionShellProps> = ({ 
  question, 
  index,
  section,
  options = [],
  response,
  onResponseChange
}) => {
  const isListening = section?.skill === 'listening' || question.question_type.toLowerCase().includes('listen');
  const { isReading } = useReadingQuestion(question, section);
  const { isWriting } = useWritingQuestion(question, section);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in flex flex-col min-h-[50vh]">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
          {index + 1}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Loại câu hỏi: {question.question_type || 'Unknown'} {section ? `(${section.section_name})` : ''}
        </span>
      </div>

      <div className="flex-1">
        {isListening ? (
          <ListeningQuestionRenderer 
            question={question}
            section={section}
            options={options}
            response={response}
            onResponseChange={onResponseChange || (() => {})}
          />
        ) : isReading ? (
          <ReadingQuestionRenderer 
            question={question}
            section={section}
            options={options}
            response={response}
            onResponseChange={onResponseChange || (() => {})}
          />
        ) : isWriting ? (
          <WritingQuestionRenderer 
            question={question}
            section={section}
            response={response}
            onResponseChange={onResponseChange || (() => {})}
          />
        ) : (
          <div className="p-6 border-2 border-dashed border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-xl text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
              [Lỗi hiển thị]
            </p>
            <p className="text-xs text-red-500/70 dark:text-red-400/60">
              Không thể xác định loại câu hỏi để render (Listening/Reading/Writing). Vui lòng kiểm tra lại cấu hình đề thi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};