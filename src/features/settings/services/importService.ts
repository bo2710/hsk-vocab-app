import { supabase } from '../../../lib/supabase/client';
import { BackupData, ImportSummary } from '../types';
import { putAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { VocabularyItem, VocabularyContext } from '../../../types/models';

export const importData = async (file: File): Promise<ImportSummary> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as Partial<BackupData>;

        if (!data.vocabulary || !Array.isArray(data.vocabulary)) {
          throw new Error('File không hợp lệ: Thiếu cấu trúc dữ liệu từ vựng (vocabulary).');
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error('Vui lòng đăng nhập để thực hiện chức năng này.');
        }

        const validVocabs: VocabularyItem[] = [];

        for (const item of data.vocabulary) {
          // Bỏ qua các dòng không có ID hoặc chữ Hán
          if (!item.id || !item.hanzi || !item.meaning_vi) continue;

          // BẢO VỆ DATABASE CONTRAINTS:
          // review_count và encounter_count tuyệt đối không được < 0 hay null
          const rCount = typeof item.review_count === 'number' ? Math.max(0, item.review_count) : 0;
          // Số lần gặp (encounter) bắt buộc phải lớn hơn hoặc bằng số lần ôn (review)
          const eCount = typeof item.encounter_count === 'number' ? Math.max(rCount, item.encounter_count) : rCount;

          const cleanItem: VocabularyItem = {
            ...item,
            user_id: user.id, // Ghi đè user hiện tại
            // Tự tạo hanzi_normalized nếu file JSON cũ bị khuyết
            hanzi_normalized: item.hanzi_normalized || item.hanzi.replace(/\s+/g, ''),
            encounter_count: eCount,
            review_count: rCount,
            status: item.status || 'new',
            // Đảm bảo tags luôn là mảng, xử lý trường hợp file JSON lưu tags bị rỗng []
            tags: Array.isArray(item.tags) ? item.tags : [],
          };
          
          validVocabs.push(cleanItem);
        }

        const validContexts: VocabularyContext[] = Array.isArray(data.contexts)
          ? data.contexts
              .filter(c => c.id && c.vocabulary_id)
              .map(c => ({ ...c, user_id: user.id }))
          : [];

        let importedVocabCount = 0;
        let importedContextCount = 0;

        // Upsert Vocabulary
        if (validVocabs.length > 0) {
          const { error: vocabError } = await supabase
            .from('vocabulary_items')
            .upsert(validVocabs, { onConflict: 'id' });

          if (vocabError) throw new Error(`Lỗi cập nhật CSDL từ vựng: ${vocabError.message}`);
          
          importedVocabCount = validVocabs.length;
          
          // Lưu vào Local Cache để hiện ra ngay trên màn hình Kho Từ
          await putAllVocabulary(validVocabs);
        }

        // Upsert Contexts
        if (validContexts.length > 0) {
          const { error: contextError } = await supabase
            .from('vocabulary_contexts')
            .upsert(validContexts, { onConflict: 'id' });

          if (contextError) {
            console.warn('[ImportService] Lỗi cập nhật CSDL ngữ cảnh:', contextError.message);
          } else {
            importedContextCount = validContexts.length;
          }
        }

        resolve({
          success: true,
          importedVocabCount,
          importedContextCount,
        });

      } catch (err: unknown) {
        resolve({
          success: false,
          importedVocabCount: 0,
          importedContextCount: 0,
          error: err instanceof Error ? err.message : 'Lỗi không xác định khi phân tích file.',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        importedVocabCount: 0,
        importedContextCount: 0,
        error: 'Không thể đọc nội dung file.',
      });
    };

    reader.readAsText(file);
  });
};