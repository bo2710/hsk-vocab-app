import { ExamQuestion, ExamSection, ExamQuestionOption } from '../../features/exams/types';

export type EncounterRole = 'prompt' | 'passage' | 'transcript' | 'explanation' | 'option';

export interface TextSegment {
  role: EncounterRole;
  text: string;
}

export const extractTextSegments = (
  question: ExamQuestion,
  section: ExamSection | null,
  options: ExamQuestionOption[],
  readingPassage: string | null
): TextSegment[] => {
  const segments: TextSegment[] = [];

  if (readingPassage) {
    // Strip basic HTML tags if it happens to be rich text
    const cleanPassage = readingPassage.replace(/<[^>]*>?/gm, '');
    segments.push({ role: 'passage', text: cleanPassage });
  }

  if (question.prompt_text) {
    segments.push({ role: 'prompt', text: question.prompt_text });
  } else if (question.prompt_rich_text) {
    const cleanPrompt = question.prompt_rich_text.replace(/<[^>]*>?/gm, '');
    segments.push({ role: 'prompt', text: cleanPrompt });
  }

  if (question.transcript_text) {
    segments.push({ role: 'transcript', text: question.transcript_text });
  } else if (section?.transcript_text) {
    segments.push({ role: 'transcript', text: section.transcript_text });
  }

  if (question.explanation_text) {
    segments.push({ role: 'explanation', text: question.explanation_text });
  } else if (section?.explanation_text) {
    segments.push({ role: 'explanation', text: section.explanation_text });
  }

  options.forEach(opt => {
    if (opt.option_text) {
      segments.push({ role: 'option', text: opt.option_text });
    }
  });

  return segments;
};