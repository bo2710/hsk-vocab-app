// filepath: src/components/exams/ListeningQuestionRenderer.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { ExamQuestion, ExamSection, ExamQuestionOption, ExamAttemptResponse } from '../../features/exams/types';
import { useListeningQuestion } from '../../features/exams/hooks/useListeningQuestion';
import { ListeningAudioPanel } from './ListeningAudioPanel';
import { ListeningChoiceList } from './ListeningChoiceList';
import { ListeningQuestionFallback } from './ListeningQuestionFallback';

interface Props {
  question: ExamQuestion;
  section?: ExamSection;
  options: ExamQuestionOption[];
  response?: Partial<ExamAttemptResponse>;
  onResponseChange: (value: string, optionId?: string) => void;
  allowAudioSeek?: boolean; // New prop for TASK-032
}

export const ListeningQuestionRenderer: React.FC<Props> = ({
  question,
  section,
  options,
  response,
  onResponseChange,
  allowAudioSeek = true
}) => {
  const { audioUrl, hasAudio } = useListeningQuestion(question, section);

  // Lưu ý: audioUrl ở đây thường lấy từ cấp section hoặc câu hỏi. 
  // Đối với audio cấp bài thi (paper), UI sẽ render panel ở tầng trên (ExamSession/Review), 
  // nhưng nếu renderer này có local audio thì áp dụng luật seek bình thường.

  return (
    <div className="animate-fade-in">
      {hasAudio && audioUrl ? (
        <ListeningAudioPanel audioUrl={audioUrl} allowSeek={allowAudioSeek} />
      ) : (
        <div className="mb-6">
          <ListeningQuestionFallback message="Audio không khả dụng cho câu hỏi này." />
        </div>
      )}

      {question.prompt_text && (
        <div className="prose dark:prose-invert max-w-none mb-6">
          <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
            {question.prompt_text}
          </p>
        </div>
      )}

      {options.length > 0 ? (
        <ListeningChoiceList 
          options={options}
          selectedOptionId={response?.selected_option_id || null}
          onSelect={(optId, text) => onResponseChange(text, optId)}
        />
      ) : (
        /* Fallback khi câu hỏi không có options (ví dụ tự luận ngắn) */
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
  );
};