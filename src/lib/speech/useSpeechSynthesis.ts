import { useState, useCallback, useEffect } from 'react';
import { useAudioPreferences } from '../../features/audio/hooks/useAudioPreferences';
import { resolveAudioProvider } from './audioProviderResolver';

/**
 * Hook cung cấp logic phát âm và trạng thái cho UI.
 * Tích hợp tự động với audio provider abstraction mới.
 */
export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const { settings } = useAudioPreferences();

  useEffect(() => {
    const provider = resolveAudioProvider(settings.preferred_provider);
    setSupported(provider.isSupported());
    
    // Web Speech API load voices async, cần đảm bảo voices đã sẵn sàng
    const handleVoicesChanged = () => {
      setSupported(provider.isSupported());
    };
    
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      provider.stop();
    };
  }, [settings.preferred_provider]);

  const speak = useCallback((text: string) => {
    if (!text) return;
    
    const provider = resolveAudioProvider(settings.preferred_provider);

    try {
      provider.speak(text, {
        rate: settings.playback_speed,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    } catch (e) {
      console.error("Provider speech error:", e);
      setIsSpeaking(false);
    }
  }, [settings.preferred_provider, settings.playback_speed]);

  const stop = useCallback(() => {
    const provider = resolveAudioProvider(settings.preferred_provider);
    provider.stop();
    setIsSpeaking(false);
  }, [settings.preferred_provider]);

  return { speak, stop, isSpeaking, supported };
};