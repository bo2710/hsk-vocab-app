import { VocabularyItem } from '../../types/models';

export interface DashboardSummary {
  total: number;
  new: number;
  learning: number;
  reviewing: number;
  mastered: number;
}

export interface LevelProgress {
  level: number | string;
  count: number;
  totalEstimated: number; // For progress bar max value
}

export interface WeeklyActivity {
  date: string; // MM/DD
  added: number;
  reviewed: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  levelProgress: LevelProgress[];
  recentWords: VocabularyItem[];
  weeklyActivity: WeeklyActivity[];
  weakWords: VocabularyItem[];
  isLoading: boolean;
  error: Error | null;
}