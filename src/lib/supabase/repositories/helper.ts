// filepath: src/lib/supabase/repositories/helper.ts
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

/**
 * Wrapper dùng chung cho mọi repository call để giảm boilerplate try-catch.
 */
export const withRepositoryErrorCatching = async <T>(
  operation: () => Promise<T>
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: formatError(error) };
  }
};