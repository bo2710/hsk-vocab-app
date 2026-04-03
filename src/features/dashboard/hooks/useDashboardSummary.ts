import { useState, useEffect } from 'react';
import { DashboardData } from '../types';
import { dashboardService } from '../services/dashboardService';

export const useDashboardSummary = (): DashboardData => {
  const [data, setData] = useState<Omit<DashboardData, 'isLoading' | 'error'>>({
    summary: { total: 0, new: 0, learning: 0, reviewing: 0, mastered: 0 },
    levelProgress: [],
    recentWords: [],
    weeklyActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await dashboardService.getDashboardData();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          console.error("Dashboard data load error:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { ...data, isLoading, error };
};