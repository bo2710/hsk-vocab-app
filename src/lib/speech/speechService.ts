/**
 * Service quản lý Web Speech API của trình duyệt.
 */

export const getChineseVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  // Ưu tiên zh-CN (Phổ thông), sau đó là zh-HK (Quảng Đông) hoặc zh-TW
  return (
    voices.find((v) => v.lang === 'zh-CN') ||
    voices.find((v) => v.lang.startsWith('zh-')) ||
    null
  );
};

export const speakHanzi = (
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: any) => void
) => {
  if (!('speechSynthesis' in window)) {
    return;
  }

  // Hủy các yêu cầu phát âm đang chờ
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getChineseVoice();

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    // Fallback ngôn ngữ nếu không tìm thấy voice cụ thể
    utterance.lang = 'zh-CN';
  }

  utterance.rate = 0.8; // Tốc độ đọc chậm một chút để dễ nghe
  utterance.pitch = 1;

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = (event) => onError?.(event);

  window.speechSynthesis.speak(utterance);
};

export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window;
};