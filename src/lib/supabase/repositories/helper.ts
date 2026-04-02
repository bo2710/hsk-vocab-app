import { supabase } from '../client';

/**
 * Lấy User ID hiện tại từ Session đã lưu trong client.
 * Sử dụng getSession() thay vì getUser() ở Repo để giảm thiểu độ trễ network khi gọi DB liên tục.
 */
export const getCurrentUserId = async (): Promise<string> => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session?.user) throw new Error('User is not authenticated.');
  return session.user.id;
};

/**
 * Chuẩn hóa lỗi từ Supabase thành đối tượng Error tiêu chuẩn của JS.
 */
export const formatError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return new Error((error as Record<string, unknown>).message as string);
  }
  return new Error('An unknown error occurred during database operation.');
};