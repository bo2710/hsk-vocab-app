// filepath: src/features/publicVocabulary/hooks/usePublicVocabularyModeration.ts
// CẦN TẠO MỚI
import { useState, useCallback, useEffect } from 'react';
import { publicVocabularyContributionService } from '../services/publicVocabularyContributionService';
import { PublicVocabularyContribution } from '../types';

export const usePublicVocabularyModeration = () => {
  const [pendingItems, setPendingItems] = useState<PublicVocabularyContribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await publicVocabularyContributionService.getPendingContributions();
    if (result.status === 'success') {
      setPendingItems(result.data || []);
    } else {
      setError(result.error?.message || 'Không thể tải danh sách chờ duyệt');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selectedIds.size === pendingItems.length && pendingItems.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingItems.map(i => i.id)));
    }
  }, [pendingItems, selectedIds.size]);

  const resolveSelected = async (status: 'approved' | 'rejected') => {
    if (selectedIds.size === 0) return;
    setIsResolving(true);
    setError(null);
    try {
      const result = await publicVocabularyContributionService.resolveContributions(Array.from(selectedIds), status);
      if (result.status === 'success') {
        setSelectedIds(new Set());
        await fetchPending(); // Làm mới danh sách ngay lập tức
      } else {
        setError(result.error?.message || `Lỗi khi ${status === 'approved' ? 'duyệt' : 'từ chối'} đóng góp`);
      }
    } finally {
      setIsResolving(false);
    }
  };

  return { 
    pendingItems, 
    isLoading, 
    isResolving, 
    selectedIds: Array.from(selectedIds), 
    error,
    toggleSelection, 
    selectAll, 
    resolveSelected, 
    refetch: fetchPending 
  };
};