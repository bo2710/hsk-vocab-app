import { supabase } from '../client';
import { CreateReviewLogInput, ReviewLog } from '../../../types/models';
import { RepositoryResult, IReviewLogRepository } from '../../../types/repositories';

class ReviewLogRepository implements IReviewLogRepository {
  async insertLog(input: CreateReviewLogInput): Promise<RepositoryResult<ReviewLog>> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        // Sử dụng new Error() thay vì string
        return { data: null, error: new Error('User is not authenticated') };
      }

      const { data, error } = await supabase
        .from('review_logs')
        .insert([
          {
            user_id: userData.user.id,
            vocabulary_id: input.vocabulary_id,
            rating: input.rating,
          }
        ])
        .select()
        .single();

      if (error) {
        // Tự xử lý lỗi trả về Error object thay vì dùng helper
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as ReviewLog, error: null };
    } catch (error: any) {
      // Sử dụng new Error() thay vì string
      return { data: null, error: new Error(error.message || 'An unexpected error occurred') };
    }
  }
}

export const reviewLogRepository = new ReviewLogRepository();