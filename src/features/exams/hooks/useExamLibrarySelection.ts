// filepath: src/features/exams/hooks/useExamLibrarySelection.ts
// CẦN CHỈNH SỬA
import { useState, useCallback } from 'react';

export const useExamLibrarySelection = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isExplicitMode, setIsExplicitMode] = useState(false);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setIsExplicitMode(false); // Thoát mode khi clear (cancel/delete)
  }, []);

  const toggleSelectionMode = useCallback(() => {
    setIsExplicitMode(prev => {
      if (prev) {
        setSelectedIds(new Set()); // Reset danh sách chọn khi tắt mode
      }
      return !prev;
    });
  }, []);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  return {
    selectedIds: Array.from(selectedIds),
    isSelectionMode: isExplicitMode || selectedIds.size > 0,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    toggleSelectionMode
  };
};