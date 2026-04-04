import { AggregateMistakeInsight, ReviewRecommendation, ExamPaperContentBundle } from '../../features/exams/types';

export const generateRecommendations = (
  insights: AggregateMistakeInsight[],
  bundle: ExamPaperContentBundle
): ReviewRecommendation[] => {
  const recommendations: ReviewRecommendation[] = [];

  if (!insights.length) {
    return [{
      id: 'rec-all-good',
      action_text: 'Duy trì phong độ hiện tại',
      rationale: 'Bạn làm bài khá tốt, không phát hiện lỗi sai hệ thống nghiêm trọng nào.',
      priority: 'low'
    }];
  }

  insights.forEach((insight, index) => {
    if (insight.insight_type === 'unanswered') {
      recommendations.push({
        id: `rec-unanswered-${index}`,
        action_text: 'Luyện tập phân bổ thời gian (Time Pacing)',
        rationale: insight.description,
        priority: insight.severity
      });
    }

    if (insight.insight_type === 'section_weakness' && insight.related_section_ids?.length) {
      const secId = insight.related_section_ids[0];
      const section = bundle.sections.find(s => s.id === secId);
      if (section) {
        recommendations.push({
          id: `rec-sec-${secId}`,
          action_text: `Ôn tập trọng tâm kỹ năng: ${section.skill.toUpperCase()}`,
          rationale: `Phần "${section.section_name}" kéo điểm tổng của bạn xuống. Hãy làm thêm các bài tập loại này.`,
          priority: insight.severity
        });
      }
    }

    if (insight.insight_type === 'time_management') {
      recommendations.push({
        id: `rec-time-${index}`,
        action_text: 'Học cách đoán từ qua ngữ cảnh và lướt câu khó',
        rationale: insight.description,
        priority: insight.severity
      });
    }
  });

  // Deduplicate logically if needed, sort by priority
  const uniqueRecommendations = Array.from(new Map(recommendations.map(item => [item.action_text, item])).values());

  uniqueRecommendations.sort((a, b) => {
    const score = { high: 3, medium: 2, low: 1 };
    return score[b.priority] - score[a.priority];
  });

  return uniqueRecommendations;
};