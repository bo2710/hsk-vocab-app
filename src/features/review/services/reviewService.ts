import { vocabularyRepository } from '../../../lib/supabase/repositories/vocabularyRepository';
import { reviewLogRepository } from '../../../lib/supabase/repositories/reviewLogRepository';
import { VocabularyItem, ReviewRating } from '../../../types/models';
import { putVocabulary, getAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { addOperation } from '../../../lib/indexeddb/operationQueueStore';

export const fetchDueReviewItems = async (
  mode: 'due' | 'new' | 'learning' | 'reviewing' | 'custom' = 'due', 
  limit: number = 20,
  customIds: string[] = []
): Promise<VocabularyItem[]> => {
  // OFFLINE-FIRST: Quét thẳng từ bộ nhớ máy
  const allItems = await getAllVocabulary();

  // Lọc bỏ rác (đã xóa mềm)
  let validItems = allItems.filter(v => !v.deleted_at && !v.is_archived);

  // Lọc theo chế độ do user chọn
  switch (mode) {
    case 'custom':
      // Lọc chính xác những từ user đã đánh dấu
      validItems = validItems.filter(v => customIds.includes(v.id));
      break;
    case 'new':
      validItems = validItems.filter(v => v.status === 'new');
      break;
    case 'learning':
      validItems = validItems.filter(v => v.status === 'learning');
      break;
    case 'reviewing':
      validItems = validItems.filter(v => v.status === 'reviewing');
      break;
    case 'due':
    default:
      // Mặc định: loại bỏ 'mastered'
      validItems = validItems.filter(v => v.status !== 'mastered');
      break;
  }

  // Sắp xếp: Ưu tiên ôn những từ lâu chưa ôn nhất, hoặc chưa từng ôn
  // Với chế độ custom, không nhất thiết phải sort ưu tiên nhưng để thống nhất thì giữ nguyên
  validItems.sort((a, b) => {
    const timeA = a.last_reviewed_at ? new Date(a.last_reviewed_at).getTime() : 0;
    const timeB = b.last_reviewed_at ? new Date(b.last_reviewed_at).getTime() : 0;
    return timeA - timeB; // Cũ hơn sẽ lên đầu
  });

  return validItems.slice(0, limit);
};

export const submitReviewRating = async (
  item: VocabularyItem,
  rating: ReviewRating
): Promise<VocabularyItem> => {
  // LOGIC TỰ ĐỘNG CHUYỂN CẤP (SPACED REPETITION)
  let newStatus: VocabularyItem['status'] = item.status;
  
  if (rating === 'forgot') {
    newStatus = 'learning'; 
  } else if (rating === 'vague') {
    newStatus = 'reviewing'; 
  } else if (rating === 'remembered') {
    if (item.status === 'reviewing') newStatus = 'mastered'; 
    else if (item.status === 'learning' || item.status === 'new') newStatus = 'reviewing'; 
  }

  const updates = {
    status: newStatus,
    review_count: (item.review_count || 0) + 1,
    encounter_count: (item.encounter_count || 0) + 1,
    last_reviewed_at: new Date().toISOString(),
  };

  const updatedItem = { ...item, ...updates } as VocabularyItem;
  
  // 1. LOCAL-FIRST: Cập nhật IndexedDB trước
  await putVocabulary(updatedItem);

  try {
    // 2. REMOTE: Cập nhật lên Supabase
    const result = await vocabularyRepository.updateVocabulary(item.id, updates);
    if (result.error) throw result.error;

    reviewLogRepository.insertLog({ vocabulary_id: item.id, rating }).catch(() => {});
    return result.data || updatedItem;
  } catch (error: any) {
    // 3. OFFLINE QUEUE: Lỗi mạng hay lỗi Database đều tống vào Queue
    await addOperation({
      operationType: 'UPDATE',
      entityType: 'VOCABULARY',
      payload: { id: item.id, updates }
    });

    await addOperation({
      operationType: 'CREATE',
      entityType: 'REVIEW_LOG',
      payload: { vocabulary_id: item.id, rating }
    });
    
    return updatedItem;
  }
};