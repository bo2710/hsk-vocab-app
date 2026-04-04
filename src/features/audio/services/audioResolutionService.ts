// filepath: src/features/audio/services/audioResolutionService.ts
import { 
  WordAudioRequest, 
  ContextAudioRequest, 
  AudioResolutionResult,
  AudioProvider 
} from '../types';
import { resolveAudioProvider } from '../../../lib/speech/audioProviderResolver';

// Mock normalizer if it was previously imported from normalizers
// We keep the old import line just in case, but rely heavily on the resolver abstraction now.
// import { normalizeAudioProviderPreference } from '../../../lib/normalizers';

export const audioResolutionService = {
  /**
   * Lấy cấu hình provider mặc định của hệ thống / user
   */
  getDefaultProvider(): AudioProvider {
    return 'browser_tts';
  },

  /**
   * Quyết định provider và URL/config cuối cùng cho một từ vựng.
   * Dựa trên metadata của từ vựng (preferred_provider) và system fallback.
   */
  async resolveWordAudio(request: WordAudioRequest): Promise<AudioResolutionResult> {
    const targetProvider = request.preferred_provider as AudioProvider | null;
    const resolved = resolveAudioProvider(targetProvider);
    
    return {
      provider_used: resolved.id,
      is_fallback: targetProvider ? resolved.id !== targetProvider : false,
      error: (targetProvider && resolved.id !== targetProvider) 
        ? `Nguồn âm thanh '${targetProvider}' không khả dụng, đã chuyển về mặc định.` 
        : undefined
    };
  },

  /**
   * Quyết định provider và text cần đọc cho một câu context.
   */
  async resolveContextAudio(request: ContextAudioRequest): Promise<AudioResolutionResult> {
    const targetProvider = undefined; // Sẽ mở rộng truyền preferred context provider ở task sau nếu cần
    const resolved = resolveAudioProvider(targetProvider);
    
    return {
      provider_used: resolved.id,
      is_fallback: false, 
    };
  }
};