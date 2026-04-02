import { VocabularyItem } from '../../types/models';

/**
 * Chuẩn hóa chuỗi văn bản để phục vụ tìm kiếm: loại bỏ khoảng trắng thừa và chuyển thành chữ thường.
 */
const normalizeText = (text?: string | null): string => {
  if (!text) return '';
  return text.toLowerCase().trim();
};

/**
 * Tìm kiếm cục bộ trên danh sách VocabularyItem.
 * Quét qua các trường: hanzi, pinyin, han_viet, meaning_vi, note, example, tags.
 */
export const searchVocabulary = (
  items: VocabularyItem[],
  query: string
): VocabularyItem[] => {
  const normalizedQuery = normalizeText(query);
  
  // Trả về toàn bộ danh sách nếu query rỗng
  if (!normalizedQuery) return items;

  return items.filter((item) => {
    // Tập hợp tất cả các trường cần tìm kiếm
    const searchableFields = [
      item.hanzi,
      item.pinyin,
      item.han_viet,
      item.meaning_vi,
      item.note,
      item.example,
      ...(item.tags || []),
    ];

    // Kiểm tra xem có trường nào chứa từ khóa tìm kiếm hay không
    return searchableFields.some((field) => {
      const normalizedField = normalizeText(field);
      return normalizedField.includes(normalizedQuery);
    });
  });
};