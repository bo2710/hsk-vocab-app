// filepath: src/lib/normalizers/audio.ts
import { AudioProvider, AUDIO_PROVIDERS } from '../../features/audio/types';

export const normalizeAudioProviderPreference = (value: string | null | undefined): AudioProvider => {
  if (!value) return 'browser_tts';
  
  const normalized = value.trim().toLowerCase();
  
  if ((AUDIO_PROVIDERS as readonly string[]).includes(normalized)) {
    return normalized as AudioProvider;
  }
  
  return 'browser_tts';
};