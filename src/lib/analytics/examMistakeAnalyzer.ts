import { ExamAttempt, ExamAttemptResponse, ExamPaperContentBundle, AggregateMistakeInsight } from '../../features/exams/types';

export const analyzeMistakes = (
  attempt: ExamAttempt,
  responses: ExamAttemptResponse[],
  bundle: ExamPaperContentBundle
): AggregateMistakeInsight[] => {
  const insights: AggregateMistakeInsight[] = [];
  if (!attempt || !responses.length || !bundle.questions.length) return insights;

  // 1. Analyze Unanswered Questions
  const totalQuestions = bundle.questions.length;
  const unansweredCount = totalQuestions - responses.length;
  if (unansweredCount > 0) {
    const percentage = Math.round((unansweredCount / totalQuestions) * 100);
    insights.push({
      id: 'unanswered-insight',
      insight_type: 'unanswered',
      title: 'Bỏ trống nhiều câu hỏi',
      description: `Bạn đã bỏ trống ${unansweredCount} câu (${percentage}%). Hãy cố gắng quản lý thời gian để hoàn thành toàn bộ bài thi.`,
      severity: percentage > 15 ? 'high' : 'medium'
    });
  }

  // 2. Analyze Section Weakness
  const sectionStats: Record<string, { total: number; correct: number; time: number }> = {};
  bundle.sections.forEach(sec => {
    sectionStats[sec.id] = { total: 0, correct: 0, time: 0 };
  });

  responses.forEach(resp => {
    const q = bundle.questions.find(x => x.id === resp.exam_question_id);
    if (q && sectionStats[q.exam_section_id]) {
      sectionStats[q.exam_section_id].total += 1;
      sectionStats[q.exam_section_id].time += (resp.time_spent_seconds || 0);
      if (resp.is_correct) {
        sectionStats[q.exam_section_id].correct += 1;
      }
    }
  });

  const weakSections: string[] = [];
  bundle.sections.forEach(sec => {
    const stats = sectionStats[sec.id];
    // We only analyze sections where the user actually answered questions or was supposed to
    const totalAssigned = bundle.questions.filter(q => q.exam_section_id === sec.id).length;
    
    if (totalAssigned > 0) {
      const correct = stats ? stats.correct : 0;
      const accuracy = Math.round((correct / totalAssigned) * 100);
      
      if (accuracy < 60) {
        weakSections.push(sec.id);
        insights.push({
          id: `weak-section-${sec.id}`,
          insight_type: 'section_weakness',
          title: `Kỹ năng yếu: ${sec.section_name}`,
          description: `Độ chính xác của bạn ở phần này chỉ đạt ${accuracy}%. Đây là khu vực cần ưu tiên ôn tập.`,
          severity: accuracy < 40 ? 'high' : 'medium',
          related_section_ids: [sec.id]
        });
      }
    }
  });

  // 3. Analyze Time Management (Simple heuristic: high time spent but still incorrect)
  let strugglingTime = 0;
  let strugglingCount = 0;
  responses.forEach(resp => {
    if (resp.is_correct === false && resp.time_spent_seconds > 60) {
      strugglingTime += resp.time_spent_seconds;
      strugglingCount++;
    }
  });

  if (strugglingCount > 3) {
    insights.push({
      id: 'time-management-insight',
      insight_type: 'time_management',
      title: 'Kẹt ở các câu khó',
      description: `Bạn đã dành quá nhiều thời gian (>1 phút/câu) cho ${strugglingCount} câu sai. Cần cải thiện chiến lược bỏ qua câu khó.`,
      severity: 'medium'
    });
  }

  // Sort by severity (high first)
  insights.sort((a, b) => {
    const score = { high: 3, medium: 2, low: 1 };
    return score[b.severity] - score[a.severity];
  });

  return insights;
};