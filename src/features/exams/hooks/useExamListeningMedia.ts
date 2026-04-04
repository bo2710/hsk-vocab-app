// filepath: src/features/exams/hooks/useExamListeningMedia.ts
// CẦN TẠO MỚI
import { ExamPaper } from '../types';

export const useExamListeningMedia = (paper: ExamPaper | undefined | null) => {
  if (!paper) {
    return {
      hasMedia: false,
      mediaType: 'none' as const,
      mediaUrl: null,
      isExternal: false,
      isInAppAudio: false
    };
  }

  const mediaType = paper.listening_media_type || 'none';
  const mediaUrl = paper.listening_media_url || null;
  const isExternal = mediaType === 'youtube_link';
  const isInAppAudio = mediaType === 'audio_file';
  const hasMedia = mediaType !== 'none' && mediaUrl !== null;

  return {
    hasMedia,
    mediaType,
    mediaUrl,
    isExternal,
    isInAppAudio
  };
};