// filepath: src/components/exams/ExamAnswerComparisonCard.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { ExamQuestionOption, ExamAttemptResponse, ExamQuestion } from '../../features/exams/types';

interface Props {
  question: ExamQuestion;
  options: ExamQuestionOption[];
  response: ExamAttemptResponse | null;
}

export const ExamAnswerComparisonCard: React.FC<Props> = ({ question, options, response }) => {
  const isSubjective = !options.length;

  if (isSubjective) {
    const userAnswer = response?.subjective_answer_text || "Chưa làm";
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center justify-between">
          <span>Câu hỏi Tự luận (Chờ chấm)</span>
          <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-400">{question.question_type}</span>
        </h4>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Bài làm của bạn:</p>
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-medium">{userAnswer}</p>
        </div>
      </div>
    );
  }

  // FIX LỖI "KHÔNG CHỌN GÌ VẪN BÁO ĐÚNG" (UI LEVEL)
  // Trong trường hợp bỏ trống, response?.is_correct sẽ là null. Component không được tự động mặc định null = true.
  const isCorrect = response?.is_correct === true;
  const isWrong = response?.is_correct === false;
  const isUnanswered = response?.is_correct === null || response?.selected_option_id === null || !response;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <span>Đối chiếu đáp án</span>
          <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-400 normal-case">{question.question_type}</span>
        </h4>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
          isWrong ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
          'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {isCorrect ? 'Đúng' : isWrong ? 'Sai' : 'Bỏ qua'}
        </span>
      </div>

      <div className="space-y-3">
        {options.map(opt => {
          // Bỏ trống thì không option nào được tính là user choice
          const isUserChoice = !isUnanswered && response?.selected_option_id === opt.id;
          const isCorrectChoice = opt.is_correct;

          let borderClass = "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60";
          let badge = null;

          if (isCorrectChoice) {
            borderClass = "border-green-500 bg-green-50 dark:bg-green-900/20";
            badge = <span className="text-green-600 dark:text-green-400 font-bold ml-auto text-sm">✓ Đáp án đúng</span>;
          } else if (isUserChoice && isWrong) {
            borderClass = "border-red-500 bg-red-50 dark:bg-red-900/20";
            badge = <span className="text-red-600 dark:text-red-400 font-bold ml-auto text-sm">✗ Đã chọn</span>;
          }

          return (
            <div key={opt.id} className={`flex items-center gap-3 p-4 rounded-xl border ${borderClass} transition-colors`}>
              <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${
                isCorrectChoice ? 'bg-green-500 text-white' : 
                (isUserChoice && isWrong) ? 'bg-red-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-white'
              }`}>
                {opt.option_key}
              </div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {opt.option_text}
              </div>
              {badge}
            </div>
          );
        })}
      </div>
    </div>
  );
};