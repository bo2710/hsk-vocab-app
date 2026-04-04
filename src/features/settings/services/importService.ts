// filepath: src/features/settings/services/importService.ts
import { supabase } from '../../../lib/supabase/client';
import { ImportSummary } from '../types';
import { putAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { VocabularyItem, VocabularyContext, HskLevel } from '../../../types/models';

// Interface hỗ trợ hứng dữ liệu object example từ JSON ngoại lai
interface LegacyExample {
  hanzi?: string;
  pinyin?: string;
  translationVi?: string;
}

// Interface mở rộng để hứng toàn bộ các trường JSON cũ mà không báo lỗi Type
interface LegacyVocabularyItem {
  id?: string;
  hanzi?: string;
  word?: string; // Fallback cho hanzi
  meaning_vi?: string;
  meaningVi?: string; // Fallback cho meaning_vi
  han_viet?: string;
  readingVi?: string; // Fallback cho han_viet
  pinyin?: string;
  example?: string | LegacyExample; // Xử lý cả chuỗi và object
  review_count?: number;
  encounter_count?: number;
  hanzi_normalized?: string;
  pinyin_normalized?: string;
  meaning_vi_normalized?: string;
  note?: string;
  status?: VocabularyItem['status'];
  tags?: string[];
  sheet?: string; // Fallback cho tags
  hsk_level?: number;
  level?: string | number; // Fallback cho hsk_level (ví dụ: 'HSK4' -> 4)
  first_added_at?: string;
  last_reviewed_at?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  is_archived?: boolean;
  [key: string]: unknown;
}

// Helper: Chuẩn hóa font chữ tiếng Việt (Gộp dấu Unicode NFD -> NFC)
const normalizeNFC = (str: string | undefined | null): string => {
  if (!str) return '';
  return str.normalize('NFC').trim();
};

// Helper: bóc tách số từ chuỗi level và ép kiểu về đúng HskLevel (1-9) hoặc null
const parseHskLevel = (level: string | number | undefined | unknown): HskLevel | null => {
  let num: number | null = null;
  
  if (typeof level === 'number') {
    num = level;
  } else if (typeof level === 'string') {
    const match = level.match(/\d+/);
    if (match) num = parseInt(match[0], 10);
  }

  if (num !== null && num >= 1 && num <= 9) {
    return num as HskLevel;
  }
  
  return null;
};

// Helper: nối nested object example thành 1 string hoàn chỉnh
const parseExample = (example: string | LegacyExample | undefined | unknown): string => {
  if (!example) return '';
  if (typeof example === 'string') return example;
  
  const ex = example as LegacyExample;
  const parts: string[] = [];
  if (ex.hanzi) parts.push(ex.hanzi);
  if (ex.pinyin) parts.push(`(${ex.pinyin})`);
  if (ex.translationVi) parts.push(`- ${ex.translationVi}`);
  return parts.join(' ').trim();
};

// Helper: Kiểm tra chuỗi chuẩn UUID
const isUUID = (uuid: string): boolean => {
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(uuid);
};

export const importData = async (file: File): Promise<ImportSummary> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        
        const data = JSON.parse(content) as { vocabulary?: LegacyVocabularyItem[], contexts?: any[] };

        if (!data.vocabulary || !Array.isArray(data.vocabulary)) {
          throw new Error('File không hợp lệ: Thiếu cấu trúc dữ liệu từ vựng (vocabulary).');
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error('Vui lòng đăng nhập để thực hiện chức năng này.');
        }

        const validVocabs: VocabularyItem[] = [];
        const validContexts: VocabularyContext[] = [];
        const now = new Date().toISOString();
        
        const idMapping = new Map<string, string>();

        // 1. XỬ LÝ TỪ VỰNG
        for (const item of data.vocabulary) {
          const hanzi = normalizeNFC(item.hanzi || item.word);
          const meaning_vi = normalizeNFC(item.meaning_vi || item.meaningVi);

          if (!item.id || !hanzi || !meaning_vi) continue;

          let finalId = item.id;
          if (!isUUID(item.id)) {
            finalId = crypto.randomUUID();
            idMapping.set(item.id, finalId);
          }

          const rCount = typeof item.review_count === 'number' ? Math.max(0, item.review_count) : 0;
          const rawECount = typeof item.encounter_count === 'number' ? item.encounter_count : 1;
          const eCount = Math.max(1, rCount, rawECount);

          // Lấy example ra và chuẩn hóa font
          const parsedExampleStr = normalizeNFC(parseExample(item.example));

          const cleanItem: VocabularyItem = {
            id: finalId,
            user_id: user.id,
            hanzi: hanzi,
            hanzi_normalized: item.hanzi_normalized || hanzi.replace(/\s+/g, ''),
            pinyin: normalizeNFC(item.pinyin) || null,
            pinyin_normalized: item.pinyin_normalized || null,
            han_viet: normalizeNFC(item.han_viet || item.readingVi) || null,
            meaning_vi: meaning_vi,
            meaning_vi_normalized: item.meaning_vi_normalized || null,
            note: normalizeNFC(item.note) || null,
            example: parsedExampleStr || null,
            status: item.status || 'new',
            hsk_level: parseHskLevel(item.hsk_level || item.level),
            tags: Array.isArray(item.tags) ? item.tags.map(t => normalizeNFC(t)) : (item.sheet ? [normalizeNFC(item.sheet)] : []),
            encounter_count: eCount,
            review_count: rCount,
            first_added_at: item.first_added_at || now,
            last_reviewed_at: item.last_reviewed_at || null,
            created_at: item.created_at || now,
            updated_at: item.updated_at || now,
            deleted_at: item.deleted_at || null,
            is_archived: Boolean(item.is_archived),
            
            // FIX TYPESCRIPT: Thêm V2 fields fallback an toàn
            source_scope: (item.source_scope as 'private' | 'public') || 'private',
            public_word_id: (item.public_word_id as string) || null,
            contribution_status: (item.contribution_status as 'none' | 'pending' | 'accepted' | 'rejected') || 'none',
            hsk20_level: (item.hsk20_level as number) || null,
            hsk30_band: (item.hsk30_band as number) || null,
            hsk30_level: (item.hsk30_level as number) || null,
            preferred_audio_provider: (item.preferred_audio_provider as string) || null,
            has_context_audio: Boolean(item.has_context_audio),
            exam_encounter_count: (item.exam_encounter_count as number) || 0,
            wrong_answer_related_count: (item.wrong_answer_related_count as number) || 0,
            last_encountered_at: (item.last_encountered_at as string) || null,
            source_reference_type: (item.source_reference_type as string) || null,
            source_reference_id: (item.source_reference_id as string) || null,
          };
          
          validVocabs.push(cleanItem);

          // AUTO-GENERATE CONTEXT TỪ EXAMPLE: 
          // Thoả mãn nhu cầu xem Nguồn/Thể loại ở Detail Page khi import JSON cũ
          if (parsedExampleStr) {
            validContexts.push({
              id: crypto.randomUUID(),
              vocabulary_id: finalId,
              user_id: user.id,
              context_name: parsedExampleStr,
              context_type: 'sentence', // Mặc định là câu
              learned_at: cleanItem.first_added_at || now,
              context_note: 'Tạo tự động từ Ví dụ nhập vào',
              created_at: now,
              updated_at: now,
              deleted_at: null,
              
              // FIX TYPESCRIPT: Thêm V2 fields fallback an toàn
              context_text: null,
              context_translation_vi: null,
              audio_text_override: null,
              source_scope: 'private',
              source_reference_id: null,
            });
          }
        }

        // 2. XỬ LÝ CONTEXTS RÕ RÀNG TRONG JSON (Nếu có)
        if (Array.isArray(data.contexts)) {
          for (const c of data.contexts) {
            if (!c.id || !c.vocabulary_id || !c.context_name) continue;

            const mappedVocabId = idMapping.get(c.vocabulary_id) || c.vocabulary_id;
            if (!isUUID(mappedVocabId)) continue;

            const finalContextId = isUUID(c.id) ? c.id : crypto.randomUUID();

            const cleanContext: VocabularyContext = {
              id: finalContextId,
              vocabulary_id: mappedVocabId,
              user_id: user.id,
              context_name: normalizeNFC(c.context_name),
              context_type: c.context_type || 'sentence',
              learned_at: c.learned_at || now,
              context_note: normalizeNFC(c.context_note) || null,
              created_at: c.created_at || now,
              updated_at: c.updated_at || now,
              deleted_at: c.deleted_at || null,
              
              // FIX TYPESCRIPT: Thêm V2 fields fallback an toàn
              context_text: (c.context_text as string) || null,
              context_translation_vi: (c.context_translation_vi as string) || null,
              audio_text_override: (c.audio_text_override as string) || null,
              source_scope: (c.source_scope as 'private' | 'public') || 'private',
              source_reference_id: (c.source_reference_id as string) || null,
            };

            validContexts.push(cleanContext);
          }
        }

        let importedVocabCount = 0;
        let importedContextCount = 0;

        if (validVocabs.length > 0) {
          const { error: vocabError } = await supabase
            .from('vocabulary_items')
            .upsert(validVocabs, { onConflict: 'id' });

          if (vocabError) throw new Error(`Lỗi cập nhật CSDL từ vựng: ${vocabError.message}`);
          
          importedVocabCount = validVocabs.length;
          await putAllVocabulary(validVocabs);
        }

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