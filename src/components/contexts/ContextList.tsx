import React from 'react';
import { useFetchContexts } from '../../features/contexts';
import { ContextItem } from './ContextItem';
import { Button } from '../ui/Button';

interface ContextListProps {
  vocabularyId: string;
}

export const ContextList: React.FC<ContextListProps> = ({ vocabularyId }) => {
  const { 
    data: contexts, 
    isLoading, 
    error, 
    refetch,
    updateLocalContext,
    removeLocalContext
  } = useFetchContexts(vocabularyId);

  if (isLoading) {
    return <div className="py-4 text-center text-sm text-gray-500">Đang tải ngữ cảnh...</div>;
  }

  if (error) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-red-500 mb-2">{error}</p>
        <Button variant="outline" size="sm" onClick={refetch}>Thử lại</Button>
      </div>
    );
  }

  if (contexts.length === 0) {
    return (
      <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có ngữ cảnh nào cho từ vựng này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contexts.map((ctx) => (
        <ContextItem 
          key={ctx.id} 
          context={ctx} 
          onUpdated={updateLocalContext}
          onDeleted={removeLocalContext}
        />
      ))}
    </div>
  );
};