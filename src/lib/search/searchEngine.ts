// filepath: src/lib/search/searchEngine.ts
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
 * Bổ sung hỗ trợ search cả metadata V2 (HSK 2.0, HSK 3.0, Audio provider).
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
      
      // Bổ sung các Text Fields của V2 vào search pool
      item.preferred_audio_provider,
      item.source_scope,
      // Map level ra Text để người dùng có thể search từ "hsk", "level"
      item.hsk20_level ? `hsk 2.0 level ${item.hsk20_level}` : null,
      item.hsk30_level ? `hsk 3.0 level ${item.hsk30_level}` : null,
      item.hsk30_band ? `hsk 3.0 band ${item.hsk30_band}` : null,
    ];

    // Kiểm tra xem có trường nào chứa từ khóa tìm kiếm hay không
    return searchableFields.some((field) => {
      const normalizedField = normalizeText(field?.toString());
      return normalizedField.includes(normalizedQuery);
    });
  });
};