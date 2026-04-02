/**
 * Chuẩn hóa chữ Hán: Loại bỏ toàn bộ khoảng trắng thừa.
 */
export const normalizeHanzi = (hanzi?: string | null): string => {
  if (!hanzi) return '';
  return hanzi.replace(/\s+/g, '');
};

/**
 * Chuẩn hóa Pinyin: Xóa khoảng trắng 2 đầu và đưa về chữ thường.
 */
export const normalizePinyin = (pinyin?: string | null): string => {
  if (!pinyin) return '';
  return pinyin.trim().toLowerCase();
};

/**
 * Chuẩn hóa Nghĩa Tiếng Việt: Xóa khoảng trắng 2 đầu và đưa về chữ thường.
 */
export const normalizeMeaning = (meaning?: string | null): string => {
  if (!meaning) return '';
  return meaning.trim().toLowerCase();
};