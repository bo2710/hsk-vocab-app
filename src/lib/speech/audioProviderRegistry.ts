// filepath: src/lib/speech/audioProviderRegistry.ts
import { AudioProvider } from '../../features/audio/types';
import { isSpeechSupported, speakHanzi, stopSpeech } from './speechService';

export interface PlaybackOptions {
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export interface IAudioProvider {
  id: AudioProvider;
  name: string;
  isSupported: () => boolean;
  speak: (text: string, options?: PlaybackOptions) => void;
  stop: () => void;
}

// Foundation provider wrapper cho Web Speech API
class BrowserTTSProvider implements IAudioProvider {
  id: AudioProvider = 'browser_tts';
  name = 'Trình duyệt (Browser TTS)';
  
  isSupported = isSpeechSupported;
  
  speak = (text: string, options?: PlaybackOptions) => {
    speakHanzi(text, options?.onStart, options?.onEnd, options?.onError, options?.rate);
  };
  
  stop = () => {
    stopSpeech();
  };
}

// Registry quản lý tập hợp các provider
export const audioProviderRegistry = {
  providers: new Map<AudioProvider, IAudioProvider>(),
  
  register(provider: IAudioProvider) {
    this.providers.set(provider.id, provider);
  },
  
  get(id: AudioProvider): IAudioProvider | undefined {
    return this.providers.get(id);
  }
};

// Đăng ký mặc định
audioProviderRegistry.register(new BrowserTTSProvider());