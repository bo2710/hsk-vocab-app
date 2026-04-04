// filepath: src/features/exams/hooks/useExamReadingPassage.ts
import { ExamQuestion } from '../types';

/**
 * Trích xuất đoạn văn đọc hiểu đã được hệ thống Normalizer chuẩn hóa.
 */
export const useExamReadingPassage = (question: ExamQuestion) => {
  const config = question.render_config_json as { passage?: string } | null;
  
  // 1. Chỉ lấy đúng passage đã được mapper đóng gói cẩn thận.
  // 2. Kế tiếp dùng prompt_rich_text nếu câu hỏi có.
  // TUYỆT ĐỐI KHÔNG dùng fallback section.instructions để bảo vệ sự tinh khiết của các câu độc lập (61-70).
  const passageText = config?.passage || question.prompt_rich_text || null;

  return {
    passageText,
    hasPassage: !!passageText
  };
};