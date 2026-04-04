import { useState, useCallback, useEffect } from 'react';
import { audioResolutionService } from '../services/audioResolutionService';
import { useSpeechSynthesis } from '../../../lib/speech/useSpeechSynthesis';
import { useAudioPreferences } from './useAudioPreferences';
import { WordAudioRequest, ContextAudioRequest, PlaybackStatus } from '../types';

export const useAudioPlayback = () => {
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const { speak, stop: stopSpeech, isSpeaking, supported } = useSpeechSynthesis();
  const { settings } = useAudioPreferences();

  useEffect(() => {
    if (isSpeaking) {
      setStatus('playing');
    } else if (status === 'playing') {
      setStatus('idle');
    }
  }, [isSpeaking, status]);

  const playWord = useCallback(async (request: WordAudioRequest) => {
    try {
      setStatus('resolving');
      const resolution = await audioResolutionService.resolveWordAudio(request);
      
      if (resolution.audio_url) {
        const audio = new Audio(resolution.audio_url);
        audio.playbackRate = settings.playback_speed;
        audio.onplay = () => setStatus('playing');
        audio.onended = () => setStatus('idle');
        audio.onerror = () => setStatus('error');
        audio.play().catch(() => setStatus('error'));
      } else {
        speak(request.text);
      }
    } catch (error) {
      console.error('Lỗi khi phát âm từ vựng:', error);
      setStatus('error');
    }
  }, [speak, settings.playback_speed]);

  const playContext = useCallback(async (request: ContextAudioRequest) => {
    try {
      setStatus('resolving');
      const resolution = await audioResolutionService.resolveContextAudio(request);
      
      if (resolution.audio_url) {
        const audio = new Audio(resolution.audio_url);
        audio.playbackRate = settings.playback_speed;
        audio.onplay = () => setStatus('playing');
        audio.onended = () => setStatus('idle');
        audio.onerror = () => setStatus('error');
        audio.play().catch(() => setStatus('error'));
      } else {
        speak(request.audio_text_override || request.text);
      }
    } catch (error) {
      console.error('Lỗi khi phát âm câu ví dụ:', error);
      setStatus('error');
    }
  }, [speak, settings.playback_speed]);

  const stop = useCallback(() => {
    stopSpeech();
    setStatus('idle');
  }, [stopSpeech]);

  return { playWord, playContext, stop, status, supported };
};