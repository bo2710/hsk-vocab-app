// filepath: src/lib/supabase/repositories/examAttemptRepository.ts
import { supabase } from '../client';
import { getCurrentUserId, withRepositoryErrorCatching } from './helper';
import { RepositoryResult } from '../../../types/repositories';
import { 
  ExamAttempt, 
  ExamAttemptResponse, 
  ExamReviewInsight, 
  ExamVocabularyEncounter 
} from '../../../features/exams/types';

export const examAttemptRepository = {
  async createAttempt(payload: Partial<ExamAttempt>): Promise<RepositoryResult<ExamAttempt>> {
    return withRepositoryErrorCatching(async () => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('exam_attempts')
        .insert([{ ...payload, user_id: userId }])
        .select()
        .single();
        
      if (error) throw error;
      return data as ExamAttempt;
    });
  },

  async updateAttempt(id: string, updates: Partial<ExamAttempt>): Promise<RepositoryResult<ExamAttempt>> {
    return withRepositoryErrorCatching(async () => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('exam_attempts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId) // Đảm bảo an toàn RLS
        .select()
        .single();
        
      if (error) throw error;
      return data as ExamAttempt;
    });
  },

  async getAttemptById(id: string): Promise<RepositoryResult<ExamAttempt>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as ExamAttempt;
    });
  },

  async listAttemptsByPaper(paperId: string): Promise<RepositoryResult<ExamAttempt[]>> {
    return withRepositoryErrorCatching(async () => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('exam_paper_id', paperId)
        .eq('user_id', userId)
        .order('started_at', { ascending: false });
        
      if (error) throw error;
      return data as ExamAttempt[];
    });
  },

  async upsertResponses(responses: Partial<ExamAttemptResponse>[]): Promise<RepositoryResult<ExamAttemptResponse[]>> {
    return withRepositoryErrorCatching(async () => {
      if (!responses.length) return [];
      const { data, error } = await supabase
        .from('exam_attempt_responses')
        .upsert(responses, { onConflict: 'exam_attempt_id, exam_question_id' })
        .select();
        
      if (error) throw error;
      return data as ExamAttemptResponse[];
    });
  },

  async getResponsesByAttemptId(attemptId: string): Promise<RepositoryResult<ExamAttemptResponse[]>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('exam_attempt_responses')
        .select('*')
        .eq('exam_attempt_id', attemptId);
        
      if (error) throw error;
      return data as ExamAttemptResponse[];
    });
  },

  async getInsightsByAttemptId(attemptId: string): Promise<RepositoryResult<ExamReviewInsight[]>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('exam_review_insights')
        .select('*')
        .eq('exam_attempt_id', attemptId);
        
      if (error) throw error;
      return data as ExamReviewInsight[];
    });
  },

  async getEncountersByPaperId(paperId: string): Promise<RepositoryResult<ExamVocabularyEncounter[]>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('exam_vocabulary_encounters')
        .select('*')
        .eq('exam_paper_id', paperId);
        
      if (error) throw error;
      return data as ExamVocabularyEncounter[];
    });
  }
};