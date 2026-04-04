// filepath: src/components/publicVocabulary/PublicVocabularyModerationQueue.tsx
// CẦN TẠO MỚI
import React from 'react';
import { PublicVocabularyContribution } from '../../features/publicVocabulary/types';

interface PublicVocabularyModerationQueueProps {
  items: PublicVocabularyContribution[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
}

export const PublicVocabularyModerationQueue: React.FC<PublicVocabularyModerationQueueProps> = ({
  items,
  selectedIds,
  onToggleSelect,
  onSelectAll
}) => {
  if (items.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p>Hàng đợi trống. Không có đóng góp nào cần duyệt lúc này.</p>
      </div>
    );
  }

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="p-4 w-12">
              <input 
                type="checkbox" 
                checked={allSelected} 
                onChange={onSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </th>
            <th className="p-4 font-semibold">Từ vựng (Hanzi)</th>
            <th className="p-4 font-semibold">Pinyin</th>
            <th className="p-4 font-semibold min-w-[200px]">Nghĩa (VI)</th>
            <th className="p-4 font-semibold">Metadata</th>
            <th className="p-4 font-semibold">Thời gian gửi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.map(item => {
            const isChecked = selectedIds.includes(item.id);
            const payload: any = item.payload || {};
            
            return (
              <tr 
                key={item.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isChecked ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                onClick={() => onToggleSelect(item.id)}
              >
                <td className="p-4 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={() => onToggleSelect(item.id)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="p-4 font-bold text-gray-900 dark:text-white text-lg">
                  {item.normalized_hanzi}
                </td>
                <td className="p-4 text-primary-600 dark:text-primary-400">
                  {payload.pinyin || 'N/A'}
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-300 line-clamp-2">
                  {payload.meaning_vi || 'N/A'}
                </td>
                <td className="p-4 text-xs text-gray-500 dark:text-gray-400">
                  {payload.hsk20_level && <div>HSK {payload.hsk20_level}</div>}
                  {payload.hsk30_level && <div>v3: L{payload.hsk30_level}</div>}
                  {payload.tags && <div>#{payload.tags}</div>}
                </td>
                <td className="p-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {new Date(item.submitted_at).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};