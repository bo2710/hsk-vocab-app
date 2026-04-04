// filepath: src/components/exams/ReadingQuestionRenderer.tsx
import React from 'react';
import { ExamQuestion, ExamSection, ExamQuestionOption, ExamAttemptResponse } from '../../features/exams/types';
import { useReadingQuestion } from '../../features/exams/hooks/useReadingQuestion';
import { ReadingPassagePanel } from './ReadingPassagePanel';
import { ReadingChoiceList } from './ReadingChoiceList';
import { ReadingQuestionFallback } from './ReadingQuestionFallback';

interface Props {
  question: ExamQuestion;
  section?: ExamSection;
  options: ExamQuestionOption[];
  response?: Partial<ExamAttemptResponse>;
  onResponseChange: (value: string, optionId?: string) => void;
}

export const ReadingQuestionRenderer: React.FC<Props> = ({
  question,
  section,
  options,
  response,
  onResponseChange
}) => {
  const { passageText, hasPassage } = useReadingQuestion(question, section);

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-6">
      {/* Cột trái: Đoạn văn (nếu có) - Chiếm nửa màn hình trên Desktop */}
      {hasPassage && passageText && (
        <div className="w-full lg:w-1/2">
          <ReadingPassagePanel content={passageText} />
        </div>
      )}

      {/* Cột phải: Câu hỏi và Lựa chọn */}
      <div className={`w-full ${hasPassage ? 'lg:w-1/2' : ''}`}>
        {!hasPassage && !question.prompt_text && (
          <ReadingQuestionFallback message="Câu hỏi này thiếu nội dung bài đọc hoặc câu dẫn." />
        )}

        {question.prompt_text && (
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-lg text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              {question.prompt_text}
            </p>
          </div>
        )}

        {options.length > 0 ? (
          <ReadingChoiceList 
            options={options}
            selectedOptionId={response?.selected_option_id || null}
            onSelect={(optId, text) => onResponseChange(text, optId)}
          />
        ) : (
          /* Fallback cho dạng câu hỏi điền từ nếu Reading có yêu cầu input text */
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nhập câu trả lời của bạn:
            </label>
            <input 
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100"
              placeholder="Nhập nội dung..."
              value={response?.selected_text || ''}
              onChange={(e) => onResponseChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};