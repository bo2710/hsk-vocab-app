// filepath: src/lib/speech/audioProviderResolver.ts
import { AudioProvider } from '../../features/audio/types';
import { audioProviderRegistry, IAudioProvider } from './audioProviderRegistry';

export const resolveAudioProvider = (preferred?: AudioProvider | null): IAudioProvider => {
  const fallbackId: AudioProvider = 'browser_tts';

  // 1. Nếu có preferred, tìm và kiểm tra hỗ trợ runtime
  if (preferred) {
    const provider = audioProviderRegistry.get(preferred);
    if (provider && provider.isSupported()) {
      return provider;
    }
  }

  // 2. Fallback strategy an toàn
  const fallback = audioProviderRegistry.get(fallbackId);
  if (!fallback) {
    throw new Error('Critical: Mất fallback provider (Browser TTS). Cấu hình hệ thống lỗi.');
  }
  
  return fallback;
};