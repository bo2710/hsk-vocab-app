import React from 'react';
import { ExamQuestion, ExamSection, ExamAttemptResponse } from '../../features/exams/types';
import { useWritingQuestion } from '../../features/exams/hooks/useWritingQuestion';
import { WritingPromptPanel } from './WritingPromptPanel';
import { WritingAnswerInput } from './WritingAnswerInput';
import { WritingQuestionFallback } from './WritingQuestionFallback';

interface Props {
  question: ExamQuestion;
  section?: ExamSection;
  response?: Partial<ExamAttemptResponse>;
  onResponseChange: (value: string, optionId?: string, isSubjective?: boolean) => void;
}

export const WritingQuestionRenderer: React.FC<Props> = ({
  question,
  section,
  response,
  onResponseChange
}) => {
  const { hasContent, sectionInstruction, promptContent, config } = useWritingQuestion(question, section);

  return (
    <div className="animate-fade-in flex flex-col h-full">
      {!hasContent ? (
        <WritingQuestionFallback message="Câu hỏi này thiếu yêu cầu hoặc nội dung đề bài." />
      ) : (
        <WritingPromptPanel 
          instruction={sectionInstruction}
          content={promptContent}
          imageUrl={config?.image_url}
          wordLimit={config?.word_limit}
        />
      )}

      <div className="flex-1 mt-4">
        <WritingAnswerInput 
          value={response?.subjective_answer_text || response?.selected_text || ''}
          onChange={(text) => onResponseChange(text, undefined, true)}
        />
      </div>
    </div>
  );
};