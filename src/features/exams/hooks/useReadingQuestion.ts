import { ExamQuestion, ExamSection } from '../types';

export const useReadingQuestion = (
  question: ExamQuestion,
  section?: ExamSection
) => {
  const isReading = section?.skill === 'reading' || question.question_type.toLowerCase().includes('read');

  // Lấy nội dung passage: Ưu tiên từ render_config_json, sau đó đến prompt_rich_text (nếu câu hỏi gộp cả bài đọc), hoặc instructions của section
  const config = question.render_config_json as { passage?: string } | null;
  const passageText = config?.passage || question.prompt_rich_text || section?.instructions || null;

  const hasPassage = !!passageText;

  return {
    isReading,
    passageText,
    hasPassage
  };
};