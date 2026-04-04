// filepath: src/components/publicVocabulary/PublicVocabularyModerationPanel.tsx
// CẦN TẠO MỚI
import React from 'react';
import { usePublicVocabularyModeration } from '../../features/publicVocabulary/hooks/usePublicVocabularyModeration';
import { PublicVocabularyModerationQueue } from './PublicVocabularyModerationQueue';
import { Button } from '../ui/Button';

export const PublicVocabularyModerationPanel: React.FC = () => {
  const { 
    pendingItems, 
    isLoading, 
    isResolving, 
    selectedIds, 
    error,
    toggleSelection, 
    selectAll, 
    resolveSelected, 
    refetch 
  } = usePublicVocabularyModeration();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Đang tải hàng đợi kiểm duyệt...</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Hàng đợi kiểm duyệt
            <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400 px-2.5 py-0.5 rounded-full text-xs">
              {pendingItems.length} mục
            </span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Duyệt hoặc từ chối các đóng góp từ cộng đồng trước khi publish.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="ghost" onClick={refetch} disabled={isResolving} size="sm">
            Làm mới
          </Button>
          {selectedIds.length > 0 && (
            <>
              <Button 
                variant="danger" 
                onClick={() => resolveSelected('rejected')} 
                disabled={isResolving}
                size="sm"
              >
                Từ chối ({selectedIds.length})
              </Button>
              <Button 
                variant="primary" 
                onClick={() => resolveSelected('approved')} 
                disabled={isResolving}
                size="sm"
              >
                Phê duyệt ({selectedIds.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      <PublicVocabularyModerationQueue 
        items={pendingItems}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelection}
        onSelectAll={selectAll}
      />
    </div>
  );
};