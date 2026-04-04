// filepath: src/components/settings/AudioPreferencesSection.tsx
import React from 'react';
import { useAudioPreferences } from '../../features/audio/hooks/useAudioPreferences';
import { AudioProvider } from '../../features/audio/types';

export const AudioPreferencesSection: React.FC = () => {
  const { settings, updateSettings } = useAudioPreferences();

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ preferred_provider: e.target.value as AudioProvider });
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ playback_speed: parseFloat(e.target.value) });
  };

  const handleAutoPlayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ auto_play_context_audio: e.target.checked });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Âm thanh & Phát âm (Audio)</h2>

      <div className="space-y-5">
        <div className="space-y-2 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nguồn phát âm (Provider)</label>
          <select
            value={settings.preferred_provider}
            onChange={handleProviderChange}
            className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none w-full"
          >
            <option value="browser_tts">Trình duyệt mặc định (Browser TTS)</option>
            <option value="google_cloud" disabled>Google Cloud (Sắp ra mắt)</option>
            <option value="azure" disabled>Azure (Sắp ra mắt)</option>
            <option value="aws" disabled>AWS (Sắp ra mắt)</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Trình phát sẽ tự động chuyển về mặc định nếu nguồn cung cấp bạn chọn không khả dụng.
          </p>
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tốc độ đọc mặc định</label>
          <select
            value={settings.playback_speed}
            onChange={handleSpeedChange}
            className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none w-full"
          >
            <option value={0.5}>0.5x (Rất chậm)</option>
            <option value={0.8}>0.8x (Chậm, khuyên dùng)</option>
            <option value={1.0}>1.0x (Bình thường)</option>
            <option value={1.2}>1.2x (Nhanh)</option>
          </select>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={settings.auto_play_context_audio || false}
              onChange={handleAutoPlayChange}
              className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Tự động phát âm thanh của ví dụ (Context)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};