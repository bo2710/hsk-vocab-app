// filepath: src/components/publicVocabulary/PublicVocabularyDuplicateWarning.tsx
import React from 'react';
import { PublicVocabularyEntry } from '../../features/publicVocabulary/types';
import { Button } from '../ui/Button';

interface PublicVocabularyDuplicateWarningProps {
  candidates: PublicVocabularyEntry[];
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onBackToEdit: () => void;
}

export const PublicVocabularyDuplicateWarning: React.FC<PublicVocabularyDuplicateWarningProps> = ({ 
  candidates, 
  isSubmitting,
  onCancel, 
  onConfirm, 
  onBackToEdit 
}) => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
        <div className="flex items-start mb-3">
          <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400">Phát hiện từ vựng có thể trùng lặp!</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Hệ thống tìm thấy <strong>{candidates.length}</strong> từ vựng tương tự đã tồn tại trong kho công cộng. Vui lòng kiểm tra xem bạn có đang đóng góp trùng với dữ liệu đã có hay không.
            </p>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          {candidates.map(c => (
            <div key={c.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-700/50">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">{c.canonical_hanzi}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{c.canonical_pinyin}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{c.canonical_meaning_vi}</p>
              <div className="flex gap-2 mt-2">
                {c.hsk20_level && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">HSK {c.hsk20_level}</span>}
                {c.hsk30_level && <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">HSK3.0 L{c.hsk30_level}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Hủy</Button>
        <Button variant="secondary" onClick={onBackToEdit} disabled={isSubmitting}>Quay lại sửa</Button>
        <Button variant="primary" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Vẫn gửi (Bỏ qua cảnh báo)'}
        </Button>
      </div>
    </div>
  );
};