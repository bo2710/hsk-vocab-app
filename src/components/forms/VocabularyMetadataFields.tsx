// filepath: src/components/forms/VocabularyMetadataFields.tsx
import React from 'react';
import { Input } from '../ui/Input';

interface MetadataFieldsProps {
  formData: {
    // FIX TYPESCRIPT: Bổ sung type 'null' để khớp với model VocabularyItem từ Database
    hsk_level?: number | string | null;
    hsk20_level?: number | string | null;
    hsk30_band?: number | string | null;
    hsk30_level?: number | string | null;
    source_scope?: string;
    preferred_audio_provider?: string | null;
    has_context_audio?: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  disabled?: boolean;
}

export const VocabularyMetadataFields: React.FC<MetadataFieldsProps> = ({ formData, onChange, disabled }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Tạo giả lập event để dùng chung với handleChange tổng của cha
    onChange({
      target: {
        name: e.target.name,
        value: e.target.checked as any // Ép kiểu an toàn vì cha sẽ nhận object
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-6 mt-4 p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">Phân loại & Siêu dữ liệu (V2)</h3>
      
      {/* Phân loại HSK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HSK (Cũ)</label>
          <select 
            name="hsk_level" 
            value={formData.hsk_level === null ? '' : formData.hsk_level} 
            onChange={onChange} 
            disabled={disabled}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          >
            <option value="">Chưa phân loại</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
              <option key={level} value={level}>HSK {level}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HSK 2.0 Level</label>
          <select 
            name="hsk20_level" 
            value={formData.hsk20_level === null ? '' : formData.hsk20_level} 
            onChange={onChange} 
            disabled={disabled}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          >
            <option value="">Không có</option>
            {[1, 2, 3, 4, 5, 6].map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HSK 3.0 Band</label>
          <select 
            name="hsk30_band" 
            value={formData.hsk30_band === null ? '' : formData.hsk30_band} 
            onChange={onChange} 
            disabled={disabled}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          >
            <option value="">Không có</option>
            <option value="1">Sơ cấp (1-3)</option>
            <option value="2">Trung cấp (4-6)</option>
            <option value="3">Cao cấp (7-9)</option>
          </select>
        </div>

        <div className="space-y-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HSK 3.0 Level</label>
          <select 
            name="hsk30_level" 
            value={formData.hsk30_level === null ? '' : formData.hsk30_level} 
            onChange={onChange} 
            disabled={disabled}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          >
            <option value="">Không có</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Nguồn gốc và quyền riêng tư */}
        <div className="space-y-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chế độ chia sẻ (Scope)</label>
          <select 
            name="source_scope" 
            value={formData.source_scope || 'private'} 
            onChange={onChange} 
            disabled={disabled}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          >
            <option value="private">Riêng tư (Private)</option>
            <option value="public">Công khai (Chờ duyệt) - Sắp ra mắt</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Lưu ý: Tính năng chia sẻ cộng đồng đang được hoàn thiện.</p>
        </div>

        {/* Audio Metadata */}
        <div className="space-y-4">
          <div className="space-y-1 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nguồn phát âm (Audio Provider)</label>
            <select 
              name="preferred_audio_provider" 
              value={formData.preferred_audio_provider || ''} 
              onChange={onChange} 
              disabled={disabled}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
            >
              <option value="">Hệ thống mặc định (TTS)</option>
              <option value="google_cloud">Google Cloud (Sắp ra mắt)</option>
              <option value="azure">Azure TTS (Sắp ra mắt)</option>
              <option value="aws">AWS Polly (Sắp ra mắt)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="has_context_audio" 
              name="has_context_audio"
              checked={Boolean(formData.has_context_audio)}
              onChange={handleCheckboxChange}
              disabled={disabled}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor="has_context_audio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Đánh dấu đã có thu âm ngữ cảnh thật
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};