// filepath: src/lib/validators/exams.ts
// CẦN CHỈNH SỬA
import { ExamPaper, ExamQuestion, EXAM_PAPER_STATUSES } from '../../features/exams/types';
import { ValidationResult } from './vocabulary';

export const validateExamPaperDraft = (data: Partial<ExamPaper>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Tên đề thi không được để trống.';
  }

  if (!data.exam_type || data.exam_type.trim().length === 0) {
    errors.exam_type = 'Loại đề thi không được để trống.';
  }

  if (data.status && !(EXAM_PAPER_STATUSES as readonly string[]).includes(data.status)) {
    errors.status = 'Trạng thái đề thi không hợp lệ.';
  }

  if (data.total_duration_seconds !== undefined && data.total_duration_seconds !== null && data.total_duration_seconds < 0) {
    errors.total_duration_seconds = 'Thời gian thi không được là số âm.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateExamQuestionDraft = (data: Partial<ExamQuestion>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.exam_paper_id) {
    errors.exam_paper_id = 'Câu hỏi phải thuộc về một đề thi (Thiếu exam_paper_id).';
  }

  if (!data.exam_section_id) {
    errors.exam_section_id = 'Câu hỏi phải thuộc về một phần thi (Thiếu exam_section_id).';
  }

  if (!data.question_type || data.question_type.trim().length === 0) {
    errors.question_type = 'Loại câu hỏi không được để trống.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// TASK-029: Deep validation for ChatGPT JSON handoff envelope
export const validateJsonHandoffEnvelope = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data) {
    return { isValid: false, errors: { payload: 'Dữ liệu trống.' } };
  }

  if (!data.title) errors.title = 'Thiếu tiêu đề đề thi (title).';
  
  if (!data.sections || !Array.isArray(data.sections) || data.sections.length === 0) {
    errors.sections = 'Đề thi phải có ít nhất 1 phần thi (sections).';
  } else {
    let expectedOrder = 1;
    for (let i = 0; i < data.sections.length; i++) {
      const sec = data.sections[i];
      if (!sec.questions || !Array.isArray(sec.questions)) {
        errors[`sections[${i}].questions`] = `Phần thi thứ ${i+1} không có danh sách câu hỏi.`;
        continue;
      }
      for (let j = 0; j < sec.questions.length; j++) {
        const q = sec.questions[j];
        if (q.question_order !== expectedOrder) {
          errors[`question_order_${expectedOrder}`] = `Lệch số thứ tự câu hỏi: mong đợi câu ${expectedOrder} nhưng nhận được câu ${q.question_order}. Cảnh báo bỏ sót câu.`;
        }
        expectedOrder++;
        
        // Chống lộ đáp án (leakage check)
        const textToCheck = (q.prompt_text || '') + ' ' + (q.options?.map((o:any)=>o.option_text).join(' ') || '');
        if (textToCheck.includes('答案') || textToCheck.includes('Answer Key') || textToCheck.includes('Correct:')) {
           errors[`question_${q.question_order}_leak`] = `Câu hỏi số ${q.question_order} có dấu hiệu lộ đáp án trong nội dung văn bản. Vui lòng xóa nội dung đáp án khỏi câu hỏi và dán lại.`;
        }
      }
    }
  }

  if (!data.review_only || !data.review_only.answer_keys || !Array.isArray(data.review_only.answer_keys)) {
    errors.review_only = 'Thiếu vùng dữ liệu review_only.answer_keys. Bắt buộc tách đáp án khỏi câu hỏi.';
  } else {
    if (data.total_questions && data.review_only.answer_keys.length < data.total_questions) {
      errors.review_only_count = `Cảnh báo: Đề khai báo ${data.total_questions} câu hỏi nhưng vùng review_only chỉ có ${data.review_only.answer_keys.length} đáp án.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};