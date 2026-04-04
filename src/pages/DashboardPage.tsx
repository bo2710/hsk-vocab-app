import { useDashboardSummary } from '../features/dashboard/hooks/useDashboardSummary';
import { 
  DashboardHero, 
  DashboardStatCard, 
  DashboardTodayFocus, 
  DashboardLevelProgress,
  DashboardRecentActivity,
  DashboardWeeklyChart,
  DashboardWeakWordsCard,
  DashboardExamEntryCard
} from '../components/dashboard';

export default function DashboardPage() {
  const { summary, levelProgress, recentWords, weeklyActivity, weakWords, isLoading, error } = useDashboardSummary();

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl border border-red-200 dark:border-red-800">
          <h2 className="text-lg font-bold mb-2">Lỗi tải dữ liệu</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-24">
      {/* 1. HERO SECTION */}
      <DashboardHero 
        wordsToReview={summary?.reviewing || 0} 
      />

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DashboardStatCard
          title="Tổng số từ vựng"
          value={isLoading ? '...' : summary.total}
          icon={<svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
          colorClass="text-primary-600 dark:text-primary-400"
          bgClass="bg-primary-50 dark:bg-primary-900/30"
          delay={0}
        />
        <DashboardStatCard
          title="Cần ôn tập"
          value={isLoading ? '...' : summary.reviewing}
          icon={<svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          colorClass="text-orange-500 dark:text-orange-400"
          bgClass="bg-orange-50 dark:bg-orange-900/30"
          delay={100}
        />
        <DashboardStatCard
          title="Đang học"
          value={isLoading ? '...' : summary.learning + summary.new}
          icon={<svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
          colorClass="text-blue-500 dark:text-blue-400"
          bgClass="bg-blue-50 dark:bg-blue-900/30"
          delay={200}
        />
        <DashboardStatCard
          title="Đã thuộc"
          value={isLoading ? '...' : summary.mastered}
          icon={<svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>}
          colorClass="text-emerald-500 dark:text-emerald-400"
          bgClass="bg-emerald-50 dark:bg-emerald-900/30"
          delay={300}
        />
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Wider on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardTodayFocus 
              reviewCount={summary?.reviewing || 0} 
              newCount={summary?.new || 0} 
            />
            <DashboardLevelProgress levels={levelProgress} />
          </div>
          <DashboardWeeklyChart data={weeklyActivity} />
        </div>

        {/* Right Column (Sidebar on Desktop) */}
        <div className="space-y-6">
          <DashboardExamEntryCard />
          <DashboardWeakWordsCard weakWords={weakWords} />
          <DashboardRecentActivity recentWords={recentWords} />
        </div>

      </div>
    </div>
  );
}