/**
 * Kiểm tra xem lỗi trả về có phải là lỗi do mất kết nối mạng hay không.
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
    return true;
  }
  const msg = (error.message || '').toLowerCase();
  return msg.includes('fetch') || msg.includes('network') || msg.includes('offline');
};

/**
 * Sinh UUID v4 an toàn khi offline (fallback khi trình duyệt cũ không có crypto.randomUUID)
 */
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};