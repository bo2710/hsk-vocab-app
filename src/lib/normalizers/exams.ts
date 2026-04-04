// filepath: src/lib/normalizers/exams.ts
// CẦN CHỈNH SỬA
import { ExamJsonHandoffEnvelope, ExamPaperContentBundle, ExamPaper, ExamSection, ExamQuestion, ExamQuestionOption } from '../../features/exams/types';

export const normalizeExamPaperDraft = (data: Partial<ExamPaper>): Partial<ExamPaper> => {
  const normalized = { ...data };
  
  if (normalized.title) {
    normalized.title = normalized.title.trim();
  }
  
  if (normalized.exam_type) {
    normalized.exam_type = normalized.exam_type.trim().toLowerCase();
  }

  if (normalized.tags && Array.isArray(normalized.tags)) {
    normalized.tags = normalized.tags.map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
  }

  return normalized;
};

export const normalizeExamQuestionDraft = (data: Partial<ExamQuestion>): Partial<ExamQuestion> => {
  const normalized = { ...data };
  
  if (normalized.prompt_text) {
    normalized.prompt_text = normalized.prompt_text.trim();
  }

  if (normalized.question_type) {
    normalized.question_type = normalized.question_type.trim().toLowerCase();
  }

  return normalized;
};

export const normalizeJsonHandoffToBundle = (envelope: ExamJsonHandoffEnvelope, userId: string): ExamPaperContentBundle => {
  const paperId = crypto.randomUUID();
  
  const ownerScope = envelope.visibility === 'public' ? 'system' : 'user_private';

  const paper: ExamPaper = {
    id: paperId,
    owner_scope: ownerScope,
    imported_by_user_id: userId,
    title: envelope.title.trim(),
    slug: null,
    exam_type: (envelope.exam_type || 'HSK').trim(),
    exam_level: envelope.exam_level || null,
    standard_version: null,
    source_type: 'pdf_import',
    source_file_name: null,
    source_file_url: null,
    source_checksum: null,
    paper_year: null,
    paper_term: null,
    total_sections: envelope.total_sections || envelope.sections.length,
    total_questions: envelope.total_questions || 0,
    total_duration_seconds: null,
    status: 'draft',
    instructions: null,
    tags: [],
    
    // TASK-032: Gán dữ liệu media
    listening_media_type: envelope.media?.type || 'none',
    listening_media_url: envelope.media?.url || null,

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const sections: ExamSection[] = [];
  const questions: ExamQuestion[] = [];
  const options: ExamQuestionOption[] = [];

  let sectionOrder = 1;
  for (const secJson of envelope.sections) {
    const sectionId = crypto.randomUUID();
    
    const section: ExamSection = {
      id: sectionId,
      exam_paper_id: paperId,
      section_code: secJson.section_code || `SEC_${sectionOrder}`,
      section_name: secJson.section_name || `Phần ${sectionOrder}`,
      skill: secJson.skill || 'comprehensive',
      display_order: sectionOrder,
      duration_seconds: null,
      question_count: secJson.questions?.length || 0,
      instructions: secJson.instructions || null,
      audio_asset_url: null,
      transcript_text: null,
      explanation_text: null
    };
    sections.push(section);

    for (const qJson of secJson.questions) {
      const questionId = crypto.randomUUID();
      
      const reviewKey = envelope.review_only?.answer_keys?.find(k => k.question_order === qJson.question_order);
      const reviewTranscript = envelope.review_only?.transcripts?.find(t => t.question_order === qJson.question_order);
      const reviewExplanation = envelope.review_only?.explanations?.find(e => e.question_order === qJson.question_order);

      let correctOptionId: string | null = null;
      let referenceAnswerText: string | null = reviewKey?.subjective_answer || null;

      let optionOrder = 1;
      for (const optJson of (qJson.options || [])) {
        const optionId = crypto.randomUUID();
        const isCorrect = reviewKey?.correct_option_key === optJson.option_key;
        if (isCorrect) correctOptionId = optionId;

        const option: ExamQuestionOption = {
          id: optionId,
          exam_question_id: questionId,
          option_key: optJson.option_key,
          option_text: optJson.option_text || null,
          option_rich_text: null,
          option_image_url: null,
          is_correct: isCorrect,
          display_order: optionOrder++
        };
        options.push(option);
      }

      const question: ExamQuestion = {
        id: questionId,
        exam_paper_id: paperId,
        exam_section_id: sectionId,
        question_order: qJson.question_order,
        question_type: qJson.question_type || 'multiple_choice',
        prompt_text: qJson.prompt_text || null,
        prompt_rich_text: null,
        transcript_text: reviewTranscript?.text || null,
        explanation_text: reviewExplanation?.text || null,
        stem_audio_url: null,
        reference_answer_text: referenceAnswerText,
        correct_option_id: correctOptionId,
        score_value: 1, 
        difficulty_tag: null,
        source_page_index: null,
        raw_import_block_id: null,
        render_config_json: null,
        created_at: paper.created_at,
        updated_at: paper.updated_at
      };
      questions.push(question);
    }
    sectionOrder++;
  }

  if (envelope.review_only?.transcripts) {
    for (const t of envelope.review_only.transcripts) {
      if ((t.question_order === null || t.question_order === undefined) && t.section_code) {
        const sec = sections.find(s => s.section_code === t.section_code);
        if (sec) {
          sec.transcript_text = sec.transcript_text ? `${sec.transcript_text}\n${t.text}` : t.text;
        }
      }
    }
  }

  return { paper, sections, questions, options };
};