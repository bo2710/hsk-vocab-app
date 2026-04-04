export const AUDIO_PROVIDERS = ['browser_tts', 'google_cloud', 'azure', 'aws'] as const;
export type AudioProvider = typeof AUDIO_PROVIDERS[number];

export interface AudioPreferenceSettings {
  preferred_provider: AudioProvider;
  voice_id?: string;
  playback_speed: number;
  auto_play_context_audio?: boolean; // Bổ sung cờ auto-play cho context
}

export interface AudioResolutionResult {
  provider_used: AudioProvider;
  audio_url?: string;
  is_fallback: boolean;
  error?: string;
}

export interface WordAudioRequest {
  text: string;
  pinyin?: string;
  preferred_provider?: string | null;
}

export interface ContextAudioRequest {
  text: string;
  context_id: string;
  audio_text_override?: string | null;
}

export type PlaybackStatus = 'idle' | 'resolving' | 'playing' | 'error';