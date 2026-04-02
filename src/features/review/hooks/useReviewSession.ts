import { useState, useCallback } from 'react';
import { VocabularyItem, ReviewRating } from '../../../types/models';
import { fetchDueReviewItems, submitReviewRating } from '../services/reviewService';

export type ReviewMode = 'due' | 'new' | 'learning' | 'reviewing' | 'custom';

export const useReviewSession = () => {
  const [mode, setMode] = useState<ReviewMode>('due');
  const [customIds, setCustomIds] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Thống kê phiên học
  const [stats, setStats] = useState({ forgot: 0, vague: 0, remembered: 0 });

  const startSession = useCallback(async (selectedMode: ReviewMode = 'due', ids: string[] = []) => {
    setIsLoading(true);
    setError(null);
    setMode(selectedMode);
    setCustomIds(ids);
    setIsStarted(true);
    setStats({ forgot: 0, vague: 0, remembered: 0 });
    setCurrentIndex(0);
    setShowAnswer(false);

    try {
      // Nếu là custom mode thì nới lỏng limit bằng đúng số lượng từ đã chọn, ngược lại lấy 20
      const limit = selectedMode === 'custom' ? ids.length : 20;
      const fetchedItems = await fetchDueReviewItems(selectedMode, limit, ids); 
      setItems(fetchedItems);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const currentItem = items[currentIndex];
  const isFinished = isStarted && items.length > 0 && currentIndex >= items.length;
  const isNoItems = isStarted && !isLoading && items.length === 0;

  const handleReveal = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const handleRating = useCallback(async (rating: ReviewRating) => {
    if (!currentItem || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitReviewRating(currentItem, rating);
      
      // Cộng điểm thống kê
      setStats((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));
      
      setShowAnswer(false);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error('Lỗi khi chấm điểm:', err);
      // Vẫn tiếp tục chạy UI để không chặn người học
      setStats((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));
      setShowAnswer(false);
      setCurrentIndex((prev) => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentItem, isSubmitting]);

  const retry = useCallback(() => {
    // Trải qua retry vẫn giữ nguyên danh sách các từ custom đã chọn
    startSession(mode, customIds);
  }, [startSession, mode, customIds]);

  const resetSession = useCallback(() => {
    setIsStarted(false);
    setItems([]);
    setCurrentIndex(0);
    setStats({ forgot: 0, vague: 0, remembered: 0 });
  }, []);

  return {
    mode,
    customIds,
    isStarted,
    startSession,
    resetSession,
    currentItem,
    currentIndex,
    totalItems: items.length,
    isLoading,
    error,
    showAnswer,
    isSubmitting,
    isFinished,
    isNoItems,
    stats,
    handleReveal,
    handleRating,
    retry
  };
};