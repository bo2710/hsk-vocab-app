// filepath: src/components/exams/ListeningAudioPanel.tsx
// CẦN CHỈNH SỬA
import React, { useRef, useEffect } from 'react';
import { useAudioPreferences } from '../../features/audio/hooks/useAudioPreferences';

interface Props {
  audioUrl: string;
  allowSeek?: boolean; // New prop for TASK-032
}

export const ListeningAudioPanel: React.FC<Props> = ({ audioUrl, allowSeek = true }) => {
  const { settings } = useAudioPreferences();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Áp dụng cài đặt tốc độ phát chung của app vào thẻ audio native
  useEffect(() => {
    if (audioRef.current && settings?.playback_speed) {
      audioRef.current.playbackRate = settings.playback_speed;
    }
  }, [settings?.playback_speed, audioUrl]);

  // Handle preventing seek based on allowSeek flag
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || allowSeek) return;

    let previousTime = 0;

    const handleTimeUpdate = () => {
      if (!audioEl.seeking) {
        previousTime = audioEl.currentTime;
      }
    };

    const handleSeeking = () => {
      if (audioEl.currentTime > previousTime) {
        // Prevent forward seek only if that's the desired strict rule, 
        // or prevent all seek. Standard "no seek" test rule is prevent all manual seeking.
        audioEl.currentTime = previousTime;
      }
    };

    audioEl.addEventListener('timeupdate', handleTimeUpdate);
    audioEl.addEventListener('seeking', handleSeeking);

    return () => {
      audioEl.removeEventListener('timeupdate', handleTimeUpdate);
      audioEl.removeEventListener('seeking', handleSeeking);
    };
  }, [allowSeek]);

  return (
    <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Audio bài nghe</p>
        {!allowSeek && (
          <span className="text-[10px] uppercase font-bold text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-2 py-0.5 rounded">
            Đã khoá tua
          </span>
        )}
      </div>
      <audio 
        ref={audioRef}
        controls 
        src={audioUrl} 
        className="w-full"
        controlsList={`nodownload ${!allowSeek ? 'noplaybackrate' : ''}`}
        // Using pointer-events-none on the timeline if possible, but standard <audio> limits styling.
        // We rely on the JS event block above to enforce the rule.
      />
      {!allowSeek && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          * Trong chế độ làm bài, bạn không thể tua qua phần âm thanh.
        </p>
      )}
    </div>
  );
};