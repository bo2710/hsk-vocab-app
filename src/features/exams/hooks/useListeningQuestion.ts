import { ExamQuestion, ExamSection } from '../types';

export const useListeningQuestion = (
  question: ExamQuestion,
  section?: ExamSection
) => {
  const isListening = section?.skill === 'listening' || question.question_type.toLowerCase().includes('listen');
  
  // Ưu tiên audio riêng của câu hỏi, nếu không có thì lấy audio chung của toàn section
  const audioUrl = question.stem_audio_url || section?.audio_asset_url || null;
  const hasAudio = !!audioUrl;

  return {
    isListening,
    audioUrl,
    hasAudio
  };
};