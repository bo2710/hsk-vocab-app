import { useState, useCallback, useEffect } from 'react';
import { speakHanzi, isSpeechSupported } from './speechService';

/**
 * Hook cung cấp logic phát âm và trạng thái cho UI.
 */
export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSupported());
    
    // Web Speech API load voices async, cần đảm bảo voices đã sẵn sàng
    const handleVoicesChanged = () => {
      setSupported(isSpeechSupported());
    };
    
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!text) return;

    speakHanzi(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, supported };
};