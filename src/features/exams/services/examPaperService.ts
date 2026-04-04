// filepath: src/features/exams/services/examPaperService.ts
// CẦN CHỈNH SỬA
import { examPaperRepository } from '../../../lib/supabase';
import { validateExamPaperUpdate } from '../../../lib/validators/exams';
import { 
  ExamPaper, 
  ExamPaperListParams, 
  ExamPaperContentBundle,
  ServiceResult,
  UpdateExamPaperInput,
  ExamEditRequest
} from '../types';

export const examPaperService = {
  async getExamPapers(params: ExamPaperListParams): Promise<ServiceResult<ExamPaper[]>> {
    const result = await examPaperRepository.getExamPapers(params);
    if (result.error) return { status: 'error', error: result.error };
    return { status: 'success', data: result.data || [] };
  },

  async getExamPaperDetail(id: string): Promise<ServiceResult<ExamPaper>> {
    const result = await examPaperRepository.getExamPaperById(id);
    if (result.error) return { status: 'error', error: result.error };
    if (!result.data) return { status: 'error', error: new Error('Exam paper not found') };
    return { status: 'success', data: result.data };
  },

  async getExamPaperContentBundle(paperId: string): Promise<ServiceResult<ExamPaperContentBundle>> {
    const paperResult = await examPaperRepository.getExamPaperById(paperId);
    if (paperResult.error || !paperResult.data) {
      return { status: 'error', error: paperResult.error || new Error('Exam paper not found') };
    }

    const sectionsResult = await examPaperRepository.getSectionsByPaperId(paperId);
    const questionsResult = await examPaperRepository.getQuestionsByPaperId(paperId);
    
    let options: any[] = [];
    if (questionsResult.data && questionsResult.data.length > 0) {
      const questionIds = questionsResult.data.map(q => q.id);
      const optionsResult = await examPaperRepository.getOptionsByQuestionIds(questionIds);
      if (optionsResult.data) options = optionsResult.data;
    }

    return {
      status: 'success',
      data: {
        paper: paperResult.data,
        sections: sectionsResult.data || [],
        questions: questionsResult.data || [],
        options: options || []
      }
    };
  },

  async updateExamPaper(id: string, payload: UpdateExamPaperInput): Promise<ServiceResult<ExamPaper>> {
    const validation = validateExamPaperUpdate(payload);
    if (!validation.isValid) {
      return { status: 'validation_error', validationErrors: validation.errors };
    }

    const result = await examPaperRepository.updateExamPaper(id, payload);
    if (result.error) return { status: 'error', error: result.error };
    return { status: 'success', data: result.data! };
  },

  async deleteExamPapers(ids: string[]): Promise<ServiceResult<void>> {
    if (!ids || ids.length === 0) return { status: 'success' };
    const result = await examPaperRepository.deleteExamPapers(ids);
    if (result.error) return { status: 'error', error: result.error };
    return { status: 'success' };
  },

  async createEditRequest(paperId: string, payload: UpdateExamPaperInput): Promise<ServiceResult<ExamEditRequest>> {
    const result = await examPaperRepository.createEditRequest(paperId, payload);
    if (result.error) return { status: 'error', error: result.error };
    return { status: 'success', data: result.data! };
  },

  async getPendingEditRequests(): Promise<ServiceResult<ExamEditRequest[]>> {
    const result = await examPaperRepository.getPendingEditRequests();
    if (result.error) return { status: 'error', error: result.error };
    return { status: 'success', data: result.data! };
  },

  async resolveEditRequest(requestId: string, status: 'approved' | 'rejected'): Promise<ServiceResult<void>> {
    const result = await examPaperRepository.resolveEditRequest(requestId, status);
    if (result.error) return { status: 'error', error: result.error };
    return { status: 'success' };
  }
};