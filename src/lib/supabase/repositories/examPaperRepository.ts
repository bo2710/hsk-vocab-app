// filepath: src/lib/supabase/repositories/examPaperRepository.ts
// CẦN CHỈNH SỬA
import { supabase } from '../client';
import { getCurrentUserId, withRepositoryErrorCatching } from './helper';
import { RepositoryResult } from '../../../types/repositories';
import { 
  ExamPaper, 
  ExamSection, 
  ExamQuestion, 
  ExamQuestionOption, 
  ExamImportJob,
  ExamPaperListParams
} from '../../../features/exams/types';

export const examPaperRepository = {
  async getExamPapers(params: ExamPaperListParams): Promise<RepositoryResult<ExamPaper[]>> {
    return withRepositoryErrorCatching(async () => {
      const userId = await getCurrentUserId();
      let query = supabase.from('exam_papers').select('*');

      // Có thể đọc paper của system hoặc do chính mình import
      query = query.or(`owner_scope.eq.system,imported_by_user_id.eq.${userId}`);

      if (params.level) {
        query = query.eq('exam_level', params.level);
      }
      if (params.status) {
        query = query.eq('status', params.status);
      }
      if (params.owner_scope) {
        query = query.eq('owner_scope', params.owner_scope);
      }

      // Sắp xếp mặc định
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data as ExamPaper[];
    });
  },

  async getExamPaperById(id: string): Promise<RepositoryResult<ExamPaper>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('exam_papers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as ExamPaper;
    });
  },

  async getSectionsByPaperId(paperId: string): Promise<RepositoryResult<ExamSection[]>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('exam_sections')
        .select('*')
        .eq('exam_paper_id', paperId)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      return data as ExamSection[];
    });
  },

  async getQuestionsByPaperId(paperId: string): Promise<RepositoryResult<ExamQuestion[]>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('exam_questions')
        .select('*')
        .eq('exam_paper_id', paperId)
        .order('question_order', { ascending: true });
        
      if (error) throw error;
      return data as ExamQuestion[];
    });
  },

  async getOptionsByQuestionIds(questionIds: string[]): Promise<RepositoryResult<ExamQuestionOption[]>> {
    return withRepositoryErrorCatching(async () => {
      if (!questionIds.length) return [];
      const { data, error } = await supabase
        .from('exam_question_options')
        .select('*')
        .in('exam_question_id', questionIds)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      return data as ExamQuestionOption[];
    });
  },

  // Xóa nhiều đề thi. RLS đảm bảo user chỉ xóa được đề của chính mình.
  async deleteExamPapers(ids: string[]): Promise<RepositoryResult<void>> {
    return withRepositoryErrorCatching(async () => {
      const userId = await getCurrentUserId();
      if (!ids.length) return;
      
      const { error } = await supabase
        .from('exam_papers')
        .delete()
        .in('id', ids)
        .eq('imported_by_user_id', userId);
        
      if (error) throw error;
    });
  },

  // Foundation cho phần Import Job
  async createImportJob(payload: Partial<ExamImportJob>): Promise<RepositoryResult<ExamImportJob>> {
    return withRepositoryErrorCatching(async () => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('exam_import_jobs')
        .insert([{ ...payload, user_id: userId }])
        .select()
        .single();
        
      if (error) throw error;
      return data as ExamImportJob;
    });
  },

  async getImportJobById(id: string): Promise<RepositoryResult<ExamImportJob>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('exam_import_jobs')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as ExamImportJob;
    });
  }
};