// filepath: src/features/exams/hooks/useExamQuestionNavigator.ts
// CẦN TẠO MỚI
import { useMemo } from 'react';
import { ExamQuestion, ExamSection, ExamAttemptResponse } from '../types';

export type QuestionGridCellState = 
  | 'current' 
  | 'answered' 
  | 'unanswered' 
  | 'marked' 
  | 'correct' 
  | 'wrong';

export interface QuestionGridCell {
  id: string;
  index: number;
  order: number;
  sectionId: string;
  state: QuestionGridCellState;
}

export interface QuestionGridSection {
  id: string;
  name: string;
  cells: QuestionGridCell[];
}

export const useExamQuestionNavigator = (
  mode: 'session' | 'review',
  questions: ExamQuestion[],
  sections: ExamSection[],
  responses: Record<string, Partial<ExamAttemptResponse>> | Partial<ExamAttemptResponse>[],
  currentIndex: number
) => {
  
  const gridData = useMemo(() => {
    // Chuyển responses thành Map truy cập cho lẹ
    const responseMap = new Map<string, Partial<ExamAttemptResponse>>();
    if (Array.isArray(responses)) {
      responses.forEach(r => {
        if (r.exam_question_id) responseMap.set(r.exam_question_id, r);
      });
    } else {
      Object.values(responses).forEach(r => {
        if (r.exam_question_id) responseMap.set(r.exam_question_id, r);
      });
    }

    const sectionMap = new Map<string, QuestionGridSection>();
    
    sections.forEach(s => {
      sectionMap.set(s.id, { id: s.id, name: s.section_name, cells: [] });
    });

    let markedCount = 0;
    let answeredCount = 0;
    let correctCount = 0;
    let wrongCount = 0;

    questions.forEach((q, idx) => {
      const resp = responseMap.get(q.id);
      const isCurrent = idx === currentIndex;
      let state: QuestionGridCellState = 'unanswered';

      const hasAnswered = !!(resp?.selected_option_id || resp?.selected_text || resp?.subjective_answer_text);
      const isMarked = resp?.is_marked_for_later;

      if (mode === 'session') {
        if (isCurrent) {
          state = 'current';
        } else if (isMarked) {
          state = 'marked';
        } else if (hasAnswered) {
          state = 'answered';
        }
      } else {
        // mode === 'review'
        if (isCurrent) {
          state = 'current';
        } else if (!hasAnswered) {
          state = 'unanswered';
        } else if (resp?.is_correct) {
          state = 'correct';
        } else if (resp?.is_correct === false) {
          state = 'wrong';
        } else {
           // Fallback nếu câu tự luận chưa chấm, tạm coi là answered
          state = 'answered';
        }
      }

      // Counts
      if (hasAnswered) answeredCount++;
      if (isMarked) markedCount++;
      if (resp?.is_correct) correctCount++;
      if (resp?.is_correct === false) wrongCount++;

      const cell: QuestionGridCell = {
        id: q.id,
        index: idx,
        order: q.question_order,
        sectionId: q.exam_section_id,
        state
      };

      if (sectionMap.has(q.exam_section_id)) {
        sectionMap.get(q.exam_section_id)!.cells.push(cell);
      }
    });

    // Chỉ giữ lại những section có câu hỏi
    const activeSections = Array.from(sectionMap.values()).filter(s => s.cells.length > 0);

    return {
      gridData: activeSections,
      stats: {
        total: questions.length,
        answered: answeredCount,
        unanswered: questions.length - answeredCount,
        marked: markedCount,
        correct: correctCount,
        wrong: wrongCount
      }
    };
  }, [mode, questions, sections, responses, currentIndex]);

  return gridData;
};