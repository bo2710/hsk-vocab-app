import { ExamQuestion, ExamSection } from '../types';

export const useWritingQuestion = (
  question: ExamQuestion,
  section?: ExamSection
) => {
  const isWriting = section?.skill === 'writing' || question.question_type.toLowerCase().includes('writ');

  // Lấy instruction cho phần viết từ section (ví dụ: "Viết đoạn văn 80 từ dựa trên bức tranh")
  const sectionInstruction = section?.instructions || null;
  
  // Lấy đề bài cụ thể của câu hỏi. Ưu tiên prompt_rich_text nếu có image/format, nếu không dùng prompt_text
  const promptContent = question.prompt_rich_text || question.prompt_text || null;
  const config = question.render_config_json as { image_url?: string, word_limit?: number } | null;
  
  const hasContent = !!(promptContent || sectionInstruction || config?.image_url);

  return {
    isWriting,
    sectionInstruction,
    promptContent,
    config,
    hasContent
  };
};