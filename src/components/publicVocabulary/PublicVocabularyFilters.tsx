// filepath: src/components/publicVocabulary/PublicVocabularyFilters.tsx
import React from 'react';
import { PublicVocabularyFilterParams } from '../../features/publicVocabulary/types';

interface PublicVocabularyFiltersProps {
  params: PublicVocabularyFilterParams;
  onChange: (filters: Partial<PublicVocabularyFilterParams>) => void;
  onClear: () => void;
}

export const PublicVocabularyFilters: React.FC<PublicVocabularyFiltersProps> = ({
  params,
  onChange,
  onClear
}) => {
  const hasActiveFilter = params.hsk20Level !== undefined || params.hsk30Level !== undefined || params.hsk30Band !== undefined;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-4 lg:items-end">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">HSK 2.0</label>
          <select
            value={params.hsk20Level || ''}
            onChange={(e) => onChange({ hsk20Level: e.target.value ? Number(e.target.value) : undefined })}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 px-3 w-full"
          >
            <option value="">Tất cả</option>
            {[1, 2, 3, 4, 5, 6].map(l => <option key={l} value={l}>HSK {l}</option>)}
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">HSK 3.0 Level</label>
          <select
            value={params.hsk30Level || ''}
            onChange={(e) => onChange({ hsk30Level: e.target.value ? Number(e.target.value) : undefined })}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 px-3 w-full"
          >
            <option value="">Tất cả</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(l => <option key={l} value={l}>Level {l}</option>)}
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">HSK 3.0 Band</label>
          <select
            value={params.hsk30Band || ''}
            onChange={(e) => onChange({ hsk30Band: e.target.value ? Number(e.target.value) : undefined })}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 px-3 w-full"
          >
            <option value="">Tất cả</option>
            <option value="1">Sơ cấp (1-3)</option>
            <option value="2">Trung cấp (4-6)</option>
            <option value="3">Cao cấp (7-9)</option>
          </select>
        </div>
      </div>

      {hasActiveFilter && (
        <button
          onClick={onClear}
          className="text-sm px-4 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-red-100 dark:border-red-900 h-[34px]"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
};