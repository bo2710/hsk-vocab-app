// filepath: src/features/exams/services/examVocabularyEncounterService.ts
// CẦN CHỈNH SỬA
import { supabase } from '../../../lib/supabase/client';
import { vocabularyRepository } from '../../../lib/supabase/repositories/vocabularyRepository';
import { getAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { extractTextSegments } from '../../../lib/tokenize/examContentTokenizer';
import { matchVocabularyInText, EncounterResult } from '../../../lib/tokenize/examVocabularyEncounterMatcher';
import { ExamQuestion, ExamSection, ExamQuestionOption } from '../types';

export const detectVocabularyEncounters = async (
  question: ExamQuestion,
  section: ExamSection | null,
  options: ExamQuestionOption[],
  readingPassage: string | null
): Promise<EncounterResult[]> => {
  try {
    const vocabList = await getAllVocabulary();
    if (!vocabList || vocabList.length === 0) {
      return [];
    }

    const segments = extractTextSegments(question, section, options, readingPassage);
    const matches = matchVocabularyInText(segments, vocabList);
    
    // Gộp (Merge) các từ vựng bị trùng lặp ở các role/segment khác nhau
    const mergedMatches = new Map<string, EncounterResult>();
    
    for (const match of matches) {
      // Nhóm theo chữ Hán để đảm bảo không bị lặp từ trên UI
      const key = match.vocabulary.hanzi_normalized || match.vocabulary.hanzi;
      if (mergedMatches.has(key)) {
        const existing = mergedMatches.get(key)!;
        existing.count += match.count;
        
        const roleSet = new Set([...existing.roles, ...match.roles]);
        existing.roles = Array.from(roleSet);
      } else {
        mergedMatches.set(key, { 
          vocabulary: match.vocabulary, 
          count: match.count, 
          roles: [...match.roles] 
        });
      }
    }
    
    return Array.from(mergedMatches.values());
  } catch (error) {
    console.error('Failed to detect vocabulary encounters:', error);
    return [];
  }
};

export const saveExamVocabularyEncounters = async (
  examPaperId: string,
  questionEncounters: { questionId: string, encounters: EncounterResult[] }[]
): Promise<void> => {
  try {
    const vocabUpdates = new Map<string, number>();
    const encounterRecords: any[] = [];

    questionEncounters.forEach(({ questionId, encounters }) => {
      encounters.forEach(enc => {
        const primaryRole = enc.roles.length > 0 ? enc.roles[0] : null;
        
        encounterRecords.push({
          exam_paper_id: examPaperId,
          exam_question_id: questionId,
          normalized_token: enc.vocabulary.hanzi_normalized,
          matched_private_vocabulary_id: enc.vocabulary.id,
          encounter_role: primaryRole
        });

        const currentCount = vocabUpdates.get(enc.vocabulary.id) || 0;
        vocabUpdates.set(enc.vocabulary.id, currentCount + enc.count);
      });
    });

    if (encounterRecords.length === 0) return;

    const { error: insertError } = await supabase
      .from('exam_vocabulary_encounters')
      .insert(encounterRecords);
      
    if (insertError) {
      console.error('Lỗi khi lưu lịch sử bắt gặp từ vựng:', insertError);
    }

    // Cập nhật biến đếm cho vocabulary_items bằng Supabase update
    for (const [vocabId, count] of Array.from(vocabUpdates.entries())) {
      const { data: oldData } = await vocabularyRepository.getVocabularyById(vocabId);
      if (oldData) {
        await supabase
          .from('vocabulary_items')
          .update({
            exam_encounter_count: (oldData.exam_encounter_count || 0) + count,
            last_encountered_at: new Date().toISOString()
          })
          .eq('id', vocabId);
      }
    }
  } catch (err) {
    console.error('Lỗi hệ thống khi lưu từ vựng bắt gặp:', err);
  }
};