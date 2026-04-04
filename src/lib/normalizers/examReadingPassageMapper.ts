// filepath: src/lib/normalizers/examReadingPassageMapper.ts
import { ExamJsonHandoffSection, ExamJsonHandoffQuestion } from '../../features/exams/types';

/**
 * Thuật toán map bài đọc hoàn chỉnh cho mọi dạng đề HSK (1-6).
 * Đã áp dụng cơ chế quyét vùng phủ sóng (question_range) để đảm bảo độ chính xác 100%.
 */
export const mapSectionReadingPassages = (section: ExamJsonHandoffSection): ExamJsonHandoffQuestion[] => {
  // 1. Xây dựng index thông minh từ mảng passages của JSON
  const passageMapById = new Map<string, string>();
  const passageRanges: { start: number; end: number; text: string }[] = [];
  
  if (section.passages && Array.isArray(section.passages)) {
    section.passages.forEach(p => {
      // Index 1: Lưu theo ID nếu có
      if (p.passage_id && p.text) {
        passageMapById.set(p.passage_id, p.text);
      }
      // Index 2 (Chắc chắn nhất): Lưu theo khoảng câu hỏi (question_range)
      if (p.question_range && Array.isArray(p.question_range) && p.question_range.length === 2 && p.text) {
        passageRanges.push({
          start: p.question_range[0],
          end: p.question_range[1],
          text: p.text
        });
      }
    });
  }

  return section.questions.map(q => {
    let activePassageForThisQuestion: string | null = null;

    // Ưu tiên 1: Câu hỏi được AI nhét sẵn đoạn văn bên trong
    if (q.passage_text) {
      activePassageForThisQuestion = q.passage_text;
    } 
    // Ưu tiên 2: Câu hỏi có ID khớp với từ điển
    else if (q.passage_id && passageMapById.has(q.passage_id)) {
      activePassageForThisQuestion = passageMapById.get(q.passage_id)!;
    }
    // Ưu tiên 3 (Phép màu HSK): Số thứ tự câu hỏi rớt đúng vào vùng phủ sóng của bài đọc
    else {
      const matchedPassage = passageRanges.find(
        pr => q.question_order >= pr.start && q.question_order <= pr.end
      );
      if (matchedPassage) {
        activePassageForThisQuestion = matchedPassage.text;
      }
    }

    // 3. Đóng gói vào config để ghi xuống DB
    const renderConfig = q.render_config_json ? { ...q.render_config_json } : {};

    if (activePassageForThisQuestion) {
      renderConfig.passage = activePassageForThisQuestion;
    } else {
      // RẤT QUAN TRỌNG: Dọn sạch trường passage nếu là câu hỏi độc lập (như câu 61-70)
      // Để giao diện chỉ hiện câu hỏi chứ không hiện panel đoạn văn.
      delete renderConfig.passage;
    }

    return {
      ...q,
      render_config_json: Object.keys(renderConfig).length > 0 ? renderConfig : null,
    };
  });
};