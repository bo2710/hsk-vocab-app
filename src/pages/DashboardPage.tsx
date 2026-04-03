import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useVocabularyList } from '../features/vocabulary/hooks/useVocabularyList';

export default function DashboardPage() {
  const navigate = useNavigate();
  // Sử dụng Hook thực tế từ kiến trúc để bốc dữ liệu từ LocalDB/Supabase thay vì mock
  const { data: words, isLoading } = useVocabularyList();

  // Tính toán thống kê dựa trên dữ liệu thật
  const stats = useMemo(() => {
    if (!words) return { total: 0, reviewing: 0, mastered: 0, new: 0, learning: 0 };
    
    return words.reduce((acc, word) => {
      acc.total += 1;
      if (word.status === 'reviewing') acc.reviewing += 1;
      if (word.status === 'mastered') acc.mastered += 1;
      if (word.status === 'new') acc.new += 1;
      if (word.status === 'learning') acc.learning += 1;
      return acc;
    }, { total: 0, reviewing: 0, mastered: 0, new: 0, learning: 0 });
  }, [words]);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      {/* HEADER SECTION */}
      <header className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tổng quan học tập</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">Theo dõi tiến độ tích lũy từ vựng HSK của bạn.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" onClick={() => navigate('/review')} className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Ôn tập ngay
          </Button>
          <Button onClick={() => navigate('/add')} className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Thêm từ mới
          </Button>
        </div>
      </header>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-primary-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tổng số từ vựng</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? '...' : stats.total}
                </p>
                <span className="text-sm font-medium text-gray-400">từ</span>
              </div>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl text-primary-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cần ôn tập (Review)</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                  {isLoading ? '...' : stats.reviewing}
                </p>
                <span className="text-sm font-medium text-gray-400">từ</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Đang học (Learning)</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {isLoading ? '...' : stats.learning + stats.new}
                </p>
                <span className="text-sm font-medium text-gray-400">từ</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Đã thuộc (Mastered)</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                  {isLoading ? '...' : stats.mastered}
                </p>
                <span className="text-sm font-medium text-gray-400">từ</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}