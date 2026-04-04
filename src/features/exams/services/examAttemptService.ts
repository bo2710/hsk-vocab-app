import { examAttemptRepository } from '../../../lib/supabase';
import { isNetworkError, generateUUID } from '../../../lib/network/networkHelper';
import { queueExamAttemptCreate, queueExamAttemptSubmit } from '../../../lib/indexeddb/examAttemptStore';
import { getOperations } from '../../../lib/indexeddb/operationQueueStore';
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
        // Fallback offline creation
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
      if (typeof navigator !== 'undefined' && !navigator.onLine) return { status: 'success', data: true }; // Rely on IndexedDB Draft for offline logic
      const result = await examAttemptRepository.upsertResponses(responses);
      if (result.error) throw result.error;
      return { status: 'success', data: true };
    } catch (err: any) {
      // Allow graceful failure if transient issue, draft will backup locally
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
    
    // 1. Scoring Logic
    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = bundle.questions.length - responses.length;
    let sectionScores: Record<string, number> = {};

    const scoredResponses = responses.map(resp => {
      const question = bundle.questions.find(q => q.id === resp.exam_question_id);
      const isSubjective = !!resp.subjective_answer_text;
      
      let isCorrect: boolean | null = null;
      let scoreEarned = 0;

      if (!question) return resp;

      if (sectionScores[question.exam_section_id] === undefined) {
        sectionScores[question.exam_section_id] = 0;
      }

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
      } else if (isSubjective) {
        isCorrect = null;
      }

      return {
        ...resp,
        is_correct: isCorrect
      };
    });

    // 2. Finalize Attempt Metadata
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

    // 3. Submit Flow (Online vs Offline)
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
        // Enqueue offline submission
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
         // Recover from Offline Queue if navigating to Result Page when disconnected
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