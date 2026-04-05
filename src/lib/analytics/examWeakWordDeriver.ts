// filepath: src/lib/analytics/examWeakWordDeriver.ts
// CẦN CHỈNH SỬA
import { ExamAttemptResponse, ExamPaperContentBundle, AggregateMistakeInsight, ExamWeakWord } from '../../features/exams/types';
import { VocabularyItem } from '../../types/models';
import { extractTextSegments } from '../tokenize/examContentTokenizer';
import { matchVocabularyInText } from '../tokenize/examVocabularyEncounterMatcher';

export const deriveWeakWordsFromAttempt = (
  responses: ExamAttemptResponse[],
  bundle: ExamPaperContentBundle,
  vocabList: VocabularyItem[],
  insights: AggregateMistakeInsight[]
): ExamWeakWord[] => {
  if (!responses.length || !bundle.questions.length || !vocabList.length) return [];

  const weakWordsMap = new Map<string, ExamWeakWord>();

  const weakSections = insights
    .filter(i => i.insight_type === 'section_weakness')
    .flatMap(i => i.related_section_ids || []);

  responses.forEach(resp => {
    // FIX LỖI: Thu thập từ vựng từ cả câu làm SAI và câu BỎ TRỐNG (is_correct === null)
    const isWrong = resp.is_correct === false;
    const isUnanswered = resp.is_correct === null && !resp.subjective_answer_text;

    if (isWrong || isUnanswered) {
      const question = bundle.questions.find(q => q.id === resp.exam_question_id);
      if (!question) return;

      const section = bundle.sections.find(s => s.id === question.exam_section_id) || null;
      const options = bundle.options.filter(o => o.exam_question_id === question.id);
      const config = question.render_config_json as any;
      const isReading = section?.skill === 'reading';
      const readingPassage = isReading ? (config?.passage || question.prompt_rich_text || section?.instructions) : null;

      const segments = extractTextSegments(question, section, options, readingPassage);
      const matches = matchVocabularyInText(segments, vocabList);

      const isWeakSection = section ? weakSections.includes(section.id) : false;
      const priority = isWeakSection ? 'high' : 'medium';
      const sectionName = section?.section_name || 'phần thi không rõ';
      const reasonText = isUnanswered ? `Gặp trong câu bỏ trống thuộc ${sectionName}` : `Gặp trong câu làm sai thuộc ${sectionName}`;

      matches.forEach(match => {
        if (weakWordsMap.has(match.vocabulary.id)) {
          const existing = weakWordsMap.get(match.vocabulary.id)!;
          existing.encounter_count += match.count;
          if (existing.encounter_count > 2 && existing.priority === 'low') {
            existing.priority = 'medium';
          }
        } else {
          weakWordsMap.set(match.vocabulary.id, {
            vocabulary_id: match.vocabulary.id,
            hanzi: match.vocabulary.hanzi,
            pinyin: match.vocabulary.pinyin || undefined,
            meaning_vi: match.vocabulary.meaning_vi,
            reason: reasonText,
            encounter_count: match.count,
            priority: priority
          });
        }
      });
    }
  });

  return Array.from(weakWordsMap.values())
    .sort((a, b) => {
      const pScore = { high: 3, medium: 2, low: 1 };
      const diff = pScore[b.priority] - pScore[a.priority];
      if (diff !== 0) return diff;
      return b.encounter_count - a.encounter_count;
    })
    .slice(0, 12);
};