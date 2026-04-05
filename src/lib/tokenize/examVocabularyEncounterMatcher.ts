// filepath: src/lib/tokenize/examVocabularyEncounterMatcher.ts
// CẦN CHỈNH SỬA
import { VocabularyItem } from '../../types/models';
import { TextSegment, EncounterRole } from './examContentTokenizer';

export interface EncounterResult {
  vocabulary: VocabularyItem;
  roles: EncounterRole[];
  count: number;
}

export const matchVocabularyInText = (
  segments: TextSegment[],
  vocabList: VocabularyItem[]
): EncounterResult[] => {
  if (!segments.length || !vocabList.length) return [];
  
  const results = new Map<string, EncounterResult>();

  vocabList.forEach(vocab => {
    // We strictly match based on hanzi for V2 MVP tokenization
    if (!vocab.hanzi || vocab.hanzi.trim() === '') return;
    
    let count = 0;
    const roles = new Set<EncounterRole>();
    const searchTarget = vocab.hanzi.trim();

    segments.forEach(seg => {
      if (!seg.text) return;
      
      // Simple substring match counting
      // It splits the text by the hanzi. The number of occurrences is length - 1.
      const matches = seg.text.split(searchTarget).length - 1;
      
      if (matches > 0) {
        count += matches;
        roles.add(seg.role);
      }
    });

    if (count > 0) {
      // FIX BUG LẶP TỪ: Nhóm các từ vựng theo chữ Hán thay vì vocab.id. 
      // Điều này ngăn chặn việc hiển thị trùng lặp nếu trong từ điển cá nhân của user có chứa nhiều từ bị trùng chữ Hán.
      const hanziNorm = vocab.hanzi_normalized || searchTarget.replace(/\s+/g, '');
      
      if (results.has(hanziNorm)) {
        const existing = results.get(hanziNorm)!;
        existing.count += count;
        Array.from(roles).forEach(r => {
          if (!existing.roles.includes(r)) existing.roles.push(r);
        });
      } else {
        results.set(hanziNorm, {
          vocabulary: vocab,
          roles: Array.from(roles),
          count
        });
      }
    }
  });

  // Sort logically: longest words first (more specific matches), then by frequency
  return Array.from(results.values()).sort((a, b) => {
    const lenDiff = b.vocabulary.hanzi.length - a.vocabulary.hanzi.length;
    if (lenDiff !== 0) return lenDiff;
    return b.count - a.count;
  });
};