// filepath: src/features/exams/services/examAttemptService.ts
// CẦN CHỈNH SỬA
import { examAttemptRepository } from '../../../lib/supabase';
import { isNetworkError, generateUUID } from '../../../lib/network/networkHelper';
import { queueExamAttemptCreate, queueExamAttemptSubmit } from '../../../lib/indexeddb/examAttemptStore';
import { getOperations } from '../../../lib/indexeddb/operationQueueStore';
import { detectVocabularyEncounters, saveExamVocabularyEncounters } from './examVocabularyEncounterService';
import { 
  ExamAttempt, 
  ExamAttemptResponse,
  ServiceResult,
  ExamSubmissionPayload
} from '../types';

export const examAttemptService = {
  async startAttempt(paperId: string, mode: 'practice' | 'real_exam'): Promise<ServiceResult<ExamAttempt>> {
    const payload = {
      exam_paper_id: paperId,
      mode,
      status: 'in_progress' as const,
      started_at: new Date().toISOString()
    };

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const result = await examAttemptRepository.createAttempt(payload);
      if (result.error) throw result.error;
      return { status: 'success', data: result.data! };
    } catch (err: any) {
      if (isNetworkError(err) || (typeof navigator !== 'undefined' && !navigator.onLine)) {
        const fallbackAttempt: ExamAttempt = {
          id: generateUUID(),
          user_id: '',
          ...payload,
          submitted_at: null,
          duration_seconds: 0,
          total_score: null,
          section_scores_json: null,
          correct_count: 0,
          wrong_count: 0,
          unanswered_count: 0,
          accuracy_rate: null,
          mistake_summary_json: null,
          review_recommendation_json: null,
          created_at: payload.started_at,
          updated_at: payload.started_at
        };
        await queueExamAttemptCreate(fallbackAttempt);
        return { status: 'success', data: fallbackAttempt };
      }
      return { status: 'error', error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  async saveResponses(responses: Partial<ExamAttemptResponse>[]): Promise<ServiceResult<boolean>> {
    if (!responses.length) return { status: 'success', data: true };
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) return { status: 'success', data: true }; 
      const result = await examAttemptRepository.upsertResponses(responses);
      if (result.error) throw result.error;
      return { status: 'success', data: true };
    } catch (err: any) {
      return { status: 'success', data: true };
    }
  },

  async getInProgressAttempt(id: string): Promise<ServiceResult<ExamAttempt>> {
    try {
      const result = await examAttemptRepository.getAttemptById(id);
      if (result.error) throw result.error;
      return { status: 'success', data: result.data! };
    } catch (err: any) {
      return { status: 'error', error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  async submitAttemptAndScore(payload: ExamSubmissionPayload): Promise<ServiceResult<ExamAttempt>> {
    const { attemptId, durationSeconds, bundle, responses } = payload;
    
    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    let sectionScores: Record<string, number> = {};

    const scoredResponses = bundle.questions.map(question => {
      let resp = responses.find(r => r.exam_question_id === question.id);
      
      // FIX: Trả về đối tượng hoàn chỉnh nếu user bỏ trống câu
      if (!resp) {
        resp = {
          exam_attempt_id: attemptId,
          exam_question_id: question.id,
          selected_option_id: null,
          subjective_answer_text: null,
          time_spent_seconds: 0, // Tránh lỗi type
          answered_at: new Date().toISOString()
        };
      }

      const isSubjective = question.question_type === 'writing' || question.question_type === 'subjective' || !bundle.options.some(o => o.exam_question_id === question.id);
      
      const hasAnswer = isSubjective ? !!resp.subjective_answer_text : !!resp.selected_option_id;

      let isCorrect: boolean | null = null;
      let scoreEarned = 0;

      if (sectionScores[question.exam_section_id] === undefined) {
        sectionScores[question.exam_section_id] = 0;
      }

      if (!hasAnswer) {
        unansweredCount++;
        isCorrect = null; // System hiểu là Unanswered
      } else {
        if (!isSubjective && question.correct_option_id) {
          isCorrect = resp.selected_option_id === question.correct_option_id;
          if (isCorrect) {
            scoreEarned = question.score_value || 1;
            correctCount++;
            totalScore += scoreEarned;
            sectionScores[question.exam_section_id] += scoreEarned;
          } else {
            wrongCount++;
          }
        } else if (!isSubjective && !question.correct_option_id) {
          isCorrect = false;
          wrongCount++;
        } else {
          isCorrect = null; // Câu tự luận
        }
      }

      return {
        ...resp,
        is_correct: isCorrect
      } as Partial<ExamAttemptResponse>;
    });

    const accuracy = (correctCount + wrongCount) > 0 
      ? Math.round((correctCount / (correctCount + wrongCount)) * 100) 
      : 0;

    const updates: Partial<ExamAttempt> = {
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      total_score: totalScore,
      correct_count: correctCount,
      wrong_count: wrongCount,
      unanswered_count: unansweredCount,
      accuracy_rate: accuracy,
      section_scores_json: sectionScores
    };

    const processEncountersAsync = async () => {
      try {
        if (typeof navigator !== 'undefined' && !navigator.onLine) return; 

        const questionEncounters: { questionId: string, encounters: any[] }[] = [];
        
        for (const question of bundle.questions) {
          const section = bundle.sections.find(s => s.id === question.exam_section_id) || null;
          const qOptions = bundle.options.filter(o => o.exam_question_id === question.id);
          
          let readingPassage = null;
          if (question.render_config_json && typeof question.render_config_json === 'object') {
            const passageObj = question.render_config_json.passage as any;
            if (passageObj && passageObj.text) {
              readingPassage = passageObj.text;
            }
          }

          const encounters = await detectVocabularyEncounters(question, section, qOptions, readingPassage);
          if (encounters.length > 0) {
            questionEncounters.push({ questionId: question.id, encounters });
          }
        }

        if (questionEncounters.length > 0) {
          await saveExamVocabularyEncounters(bundle.paper.id, questionEncounters);
        }
      } catch (err) {
        console.error('Lỗi khi chạy ngầm lưu từ vựng bắt gặp:', err);
      }
    };

    processEncountersAsync();

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      
      if (scoredResponses.length > 0) {
        const respRes = await examAttemptRepository.upsertResponses(scoredResponses);
        if (respRes.error) throw respRes.error;
      }

      const result = await examAttemptRepository.updateAttempt(attemptId, updates);
      if (result.error) throw result.error;
      return { status: 'success', data: result.data! };

    } catch (error: any) {
      if (isNetworkError(error) || (typeof navigator !== 'undefined' && !navigator.onLine)) {
        await queueExamAttemptSubmit(attemptId, updates, scoredResponses);
        
        const optimisticAttempt = {
            id: attemptId,
            user_id: '',
            exam_paper_id: bundle.paper.id,
            mode: 'practice' as const,
            started_at: new Date().toISOString(),
            ...updates,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        } as ExamAttempt;

        return { status: 'success', data: optimisticAttempt };
      }
      return { status: 'error', error: error instanceof Error ? error : new Error(String(error)) };
    }
  },

  async getAttemptResultData(attemptId: string): Promise<ServiceResult<{ attempt: ExamAttempt, responses: ExamAttemptResponse[] }>> {
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      const attemptResult = await examAttemptRepository.getAttemptById(attemptId);
      if (attemptResult.error || !attemptResult.data) {
        throw attemptResult.error || new Error('Attempt not found');
      }
      
      const responsesResult = await examAttemptRepository.getResponsesByAttemptId(attemptId);
      
      return {
        status: 'success',
        data: {
          attempt: attemptResult.data,
          responses: responsesResult.data || []
        }
      };
    } catch (error: any) {
      if (isNetworkError(error) || (typeof navigator !== 'undefined' && !navigator.onLine)) {
         const ops = await getOperations();
         const submitOp = ops.find(o => o.entityType === 'EXAM_ATTEMPT' && o.operationType === 'SUBMIT' && (o.payload as any).attemptId === attemptId);
         const createOp = ops.find(o => o.entityType === 'EXAM_ATTEMPT' && o.operationType === 'CREATE' && (o.payload as any).id === attemptId);

         if (submitOp && createOp) {
             const attempt = { ...(createOp.payload as any), ...(submitOp.payload as any).updates };
             const responses = (submitOp.payload as any).responses || [];
             return { status: 'success', data: { attempt, responses } };
         }
      }
      return { status: 'error', error: error instanceof Error ? error : new Error(String(error)) };
    }
  }
};