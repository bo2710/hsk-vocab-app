import { getAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { DashboardSummary, LevelProgress, WeeklyActivity } from '../types';

const HSK_ESTIMATES: Record<string, number> = {
  '1': 500,
  '2': 772,
  '3': 973,
  '4': 1000,
  '5': 1071,
  '6': 1140,
  '7': 1200, // Approximation for 7-9
  '8': 1200,
  '9': 1200,
};

export const dashboardService = {
  async getDashboardData() {
    // 1. Fetch raw data from Local DB (Fast, Offline-first)
    const allWords = await getAllVocabulary();
    
    // Filter out deleted/archived
    const activeWords = allWords.filter(w => !w.deleted_at && !w.is_archived);

    // 2. Compute Summary
    const summary: DashboardSummary = {
      total: activeWords.length,
      new: 0,
      learning: 0,
      reviewing: 0,
      mastered: 0,
    };

    activeWords.forEach(word => {
      if (word.status === 'new') summary.new++;
      if (word.status === 'learning') summary.learning++;
      if (word.status === 'reviewing') summary.reviewing++;
      if (word.status === 'mastered') summary.mastered++;
    });

    // 3. Compute HSK Level Progress
    const levelMap = new Map<string, number>();
    activeWords.forEach(word => {
      if (word.hsk_level) {
        const key = String(word.hsk_level);
        levelMap.set(key, (levelMap.get(key) || 0) + 1);
      }
    });

    const levelProgress: LevelProgress[] = Array.from(levelMap.entries())
      .map(([level, count]) => ({
        level,
        count,
        totalEstimated: HSK_ESTIMATES[level] || Math.max(count * 2, 100) // Fallback estimation
      }))
      .sort((a, b) => Number(a.level) - Number(b.level));

    // 4. Get Recent Words (Top 5 newest)
    const recentWords = [...activeWords]
      .sort((a, b) => new Date(b.first_added_at).getTime() - new Date(a.first_added_at).getTime())
      .slice(0, 5);

    // 5. Compute Weekly Activity (Derived mock based on first_added_at and last_reviewed_at to keep it light)
    // We create a rolling 7-day window
    const weeklyActivity: WeeklyActivity[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i);
      const dateStr = `${targetDate.getDate()}/${targetDate.getMonth() + 1}`;
      
      let added = 0;
      let reviewed = 0;

      activeWords.forEach(word => {
        const addedDate = new Date(word.first_added_at);
        if (addedDate.toDateString() === targetDate.toDateString()) {
          added++;
        }
        
        if (word.last_reviewed_at) {
          const reviewedDate = new Date(word.last_reviewed_at);
          if (reviewedDate.toDateString() === targetDate.toDateString()) {
            reviewed++;
          }
        }
      });

      weeklyActivity.push({ date: dateStr, added, reviewed });
    }

    return {
      summary,
      levelProgress,
      recentWords,
      weeklyActivity
    };
  }
};