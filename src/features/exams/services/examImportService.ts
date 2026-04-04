// filepath: src/features/exams/services/examImportService.ts
// CẦN CHỈNH SỬA
import { supabase } from '../../../lib/supabase/client';
import { examPaperRepository } from '../../../lib/supabase';
import { ExamImportJob, ServiceResult, ExamJsonHandoffEnvelope } from '../types';
import { normalizeJsonHandoffToBundle } from '../../../lib/normalizers/exams';

// Helper: Làm sạch dữ liệu trước khi gửi lên Supabase (PostgREST)
const sanitizePayload = <T extends Record<string, any>>(data: T | T[]): T | T[] => {
  if (Array.isArray(data)) {
    if (data.length === 0) return data;
    
    const allKeys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    return data.map(item => {
      const sanitizedItem: any = {};
      allKeys.forEach(key => {
        sanitizedItem[key] = item[key] === undefined ? null : item[key];
      });
      return sanitizedItem;
    }) as T[];
  }
  
  const sanitizedObj: any = {};
  Object.keys(data).forEach(key => {
    sanitizedObj[key] = (data as any)[key] === undefined ? null : (data as any)[key];
  });
  return sanitizedObj as T;
};

export const examImportService = {
  async createImportJobDraft(fileName: string, fileUrl?: string): Promise<ServiceResult<ExamImportJob>> {
    const payload = {
      file_name: fileName,
      file_url: fileUrl || null,
      parse_status: 'uploaded' as const
    };

    const result = await examPaperRepository.createImportJob(payload);
    if (result.error) return { status: 'error', error: result.error };
    return { status: 'success', data: result.data! };
  },

  async getImportJobStatus(jobId: string): Promise<ServiceResult<ExamImportJob>> {
    const result = await examPaperRepository.getImportJobById(jobId);
    if (result.error) return { status: 'error', error: result.error };
    return { status: 'success', data: result.data! };
  },

  async submitJsonHandoff(payload: ExamJsonHandoffEnvelope): Promise<ServiceResult<{ success: boolean; paper_id?: string }>> {
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Cần kết nối mạng để lưu đề thi mới vào thư viện.');
      }

      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      
      if (!userId) {
         throw new Error('Bạn cần đăng nhập để lưu đề thi vào hệ thống.');
      }

      // 1. Normalize
      const bundle = normalizeJsonHandoffToBundle(payload, userId);
      
      // 2. Sanitize
      const cleanPaper = sanitizePayload(bundle.paper);
      const cleanSections = sanitizePayload(bundle.sections) as any[];
      const cleanQuestions = sanitizePayload(bundle.questions) as any[];
      const cleanOptions = sanitizePayload(bundle.options) as any[];
      
      // 3. Persist
      const { error: pErr } = await supabase.from('exam_papers').insert(cleanPaper);
      if (pErr) throw pErr;
      
      if (bundle.sections.length > 0) {
        const { error: sErr } = await supabase.from('exam_sections').insert(cleanSections);
        if (sErr) throw sErr;
      }
      
      if (bundle.questions.length > 0) {
        const { error: qErr } = await supabase.from('exam_questions').insert(cleanQuestions);
        if (qErr) throw qErr;
      }
      
      if (bundle.options.length > 0) {
        const { error: oErr } = await supabase.from('exam_question_options').insert(cleanOptions);
        if (oErr) throw oErr;
      }

      return { 
        status: 'success', 
        data: { success: true, paper_id: bundle.paper.id } 
      };
    } catch (err: any) {
      console.error("Ingestion Error: ", err);
      let errMsg = 'Lỗi không xác định khi lưu đề thi.';
      if (err instanceof Error) {
        errMsg = err.message;
      } else if (err.message) {
        errMsg = err.message;
      } else if (err.error_description) {
        errMsg = err.error_description;
      }
      return { status: 'error', error: new Error(errMsg) };
    }
  }
};