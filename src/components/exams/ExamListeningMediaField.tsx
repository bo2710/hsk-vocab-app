// filepath: src/components/exams/ExamListeningMediaField.tsx
// CẦN TẠO MỚI
import React from 'react';
import { ExamListeningMediaType } from '../../features/exams/types';
import { Input } from '../ui/Input';

interface ExamListeningMediaFieldProps {
  type: ExamListeningMediaType;
  url: string;
  onTypeChange: (val: ExamListeningMediaType) => void;
  onUrlChange: (val: string) => void;
  disabled?: boolean;
}

export const ExamListeningMediaField: React.FC<ExamListeningMediaFieldProps> = ({ 
  type, 
  url, 
  onTypeChange, 
  onUrlChange, 
  disabled 
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-900 dark:text-white">Nguồn Audio (Listening)</label>
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            onTypeChange('none');
            onUrlChange('');
          }}
          className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
            type === 'none' 
              ? 'border-gray-900 bg-gray-900 text-white dark:bg-gray-100 dark:border-gray-100 dark:text-gray-900' 
              : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Không có
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onTypeChange('audio_file')}
          className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
            type === 'audio_file' 
              ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-400' 
              : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          File Audio URL
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onTypeChange('youtube_link')}
          className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
            type === 'youtube_link' 
              ? 'border-red-600 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-900/30 dark:text-red-400' 
              : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          YouTube Link
        </button>
      </div>

      {type === 'audio_file' && (
        <div className="mt-3 animate-fade-in">
          <Input 
            type="url"
            placeholder="https://example.com/audio.mp3"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={disabled}
            className="w-full"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            Dán đường dẫn trực tiếp đến file âm thanh (.mp3, .wav). Audio sẽ phát trực tiếp trong app.
          </p>
        </div>
      )}

      {type === 'youtube_link' && (
        <div className="mt-3 animate-fade-in">
          <Input 
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={disabled}
            className="w-full"
          />
          <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-medium">
            Lưu ý: Ứng dụng không hỗ trợ phát YouTube ngầm. Người dùng sẽ phải mở link này ở một tab khác để nghe.
          </p>
        </div>
      )}
    </div>
  );
};