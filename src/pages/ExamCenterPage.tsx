// filepath: src/pages/ExamCenterPage.tsx
// CẦN CHỈNH SỬA
import { useState } from 'react';
import { useAuth } from '../app/providers/AuthProvider';
import { ExamCenterHero, ExamPaperLibrary } from '../components/exams';
import { ExamModerationPanel } from '../components/exams/ExamModerationPanel';

type ExamCenterTab = 'library' | 'moderation';

export default function ExamCenterPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<ExamCenterTab>('library');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full animate-fade-in">
      {isAdmin && (
        <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'library' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Thư viện đề thi
          </button>
          <button 
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'moderation' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Quản duyệt đề thi
          </button>
        </div>
      )}

      {activeTab === 'library' ? (
        <>
          <ExamCenterHero />
          <ExamPaperLibrary />
        </>
      ) : (
        <ExamModerationPanel />
      )}
    </div>
  );
}