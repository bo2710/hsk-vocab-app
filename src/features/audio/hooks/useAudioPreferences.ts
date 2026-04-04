// filepath: src/features/audio/hooks/useAudioPreferences.ts
import { useState } from 'react';
import { AudioPreferenceSettings } from '../types';

const PREF_KEY = 'hsk_audio_preferences';

const defaultSettings: AudioPreferenceSettings = {
  preferred_provider: 'browser_tts',
  playback_speed: 0.8,
  auto_play_context_audio: false,
};

export const useAudioPreferences = () => {
  const [settings, setSettings] = useState<AudioPreferenceSettings>(() => {
    const stored = localStorage.getItem(PREF_KEY);
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const updateSettings = (updates: Partial<AudioPreferenceSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(PREF_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { settings, updateSettings };
};