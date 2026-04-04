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
  ExamPaperListParams,
  UpdateExamPaperInput,
  ExamEditRequest
} from '../../../features/exams/types';

export const examPaperRepository = {
  async getExamPapers(params: ExamPaperListParams): Promise<RepositoryResult<ExamPaper[]>> {
    return withRepositoryErrorCatching(async () => {
      const userId = await getCurrentUserId();
      let query = supabase.from('exam_papers').select('*');

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

  async updateExamPaper(id: string, payload: UpdateExamPaperInput): Promise<RepositoryResult<ExamPaper>> {
    return withRepositoryErrorCatching(async () => {
      // Đã xóa điều kiện '.eq(imported_by_user_id)' để Admin có thể update xuyên quyền (UI layer sẽ đảm bảo chỉ owner/admin mới gọi được hàm này).
      const { data, error } = await supabase
        .from('exam_papers')
        .update({
          ...payload,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data as ExamPaper;
    });
  },

  async deleteExamPapers(ids: string[]): Promise<RepositoryResult<void>> {
    return withRepositoryErrorCatching(async () => {
      if (!ids.length) return;
      // Tương tự, xóa điều kiện chặn userId để Admin có thể xóa đề.
      const { error } = await supabase
        .from('exam_papers')
        .delete()
        .in('id', ids);
        
      if (error) throw error;
    });
  },

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
  },

  // ---- MODULE MODERATION (TASK-037) ----
  
  async createEditRequest(paperId: string, payload: UpdateExamPaperInput): Promise<RepositoryResult<ExamEditRequest>> {
    return withRepositoryErrorCatching(async () => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('exam_edit_requests')
        .insert([{ exam_paper_id: paperId, user_id: userId, payload, status: 'pending' }])
        .select()
        .single();
      if (error) throw error;
      return data as ExamEditRequest;
    });
  },

  async getPendingEditRequests(): Promise<RepositoryResult<ExamEditRequest[]>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('exam_edit_requests')
        .select('*, exam_papers(title)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as ExamEditRequest[];
    });
  },

  async resolveEditRequest(requestId: string, status: 'approved' | 'rejected'): Promise<RepositoryResult<void>> {
    return withRepositoryErrorCatching(async () => {
      const { data: request, error: fetchErr } = await supabase
        .from('exam_edit_requests')
        .select('*')
        .eq('id', requestId)
        .single();
        
      if (fetchErr) throw fetchErr;

      if (status === 'approved' && request) {
        const { error: updateErr } = await supabase
          .from('exam_papers')
          .update({ ...request.payload, updated_at: new Date().toISOString() })
          .eq('id', request.exam_paper_id);
        if (updateErr) throw updateErr;
      }

      const { error: resolveErr } = await supabase
        .from('exam_edit_requests')
        .update({ status, resolved_at: new Date().toISOString() })
        .eq('id', requestId);
        
      if (resolveErr) throw resolveErr;
    });
  }
};