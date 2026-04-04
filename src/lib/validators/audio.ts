// filepath: src/lib/validators/audio.ts
import { AudioPreferenceSettings, AUDIO_PROVIDERS } from '../../features/audio/types';
import { ValidationResult } from './vocabulary';

export const validateAudioPreferenceSettings = (data: Partial<AudioPreferenceSettings>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (data.preferred_provider && !(AUDIO_PROVIDERS as readonly string[]).includes(data.preferred_provider)) {
    errors.preferred_provider = 'Nhà cung cấp âm thanh (Audio Provider) không hợp lệ.';
  }

  if (data.playback_speed !== undefined && data.playback_speed !== null) {
    if (typeof data.playback_speed !== 'number' || data.playback_speed <= 0 || data.playback_speed > 3) {
      errors.playback_speed = 'Tốc độ phát audio phải lớn hơn 0 và nhỏ hơn hoặc bằng 3.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};