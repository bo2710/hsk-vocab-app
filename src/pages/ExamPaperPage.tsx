import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useExamPaperDetail } from '../features/exams/hooks/useExamPaperDetail';
import { 
  ExamPaperHero, 
  ExamPaperSummary, 
  ExamSectionSelector, 
  ExamPaperEmptyState 
} from '../components/exams';

export default function ExamPaperPage() {
  const navigate = useNavigate();
  const { paperId } = useParams<{ paperId: string }>();
  const { 
    bundle, 
    isLoading, 
    error, 
    selectedSectionIds, 
    toggleSection, 
    selectAllSections,
    refetch
  } = useExamPaperDetail(paperId);

  const handleStartSession = () => {
    // CTA Handoff sang TASK-016
    navigate(`/exams/${paperId}/session`, { 
      state: { selectedSectionIds } 
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <svg className="animate-spin h-10 w-10 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Đang tải cấu trúc đề thi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl text-center">
        <h2 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Đã xảy ra lỗi</h2>
        <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/exams')}>Quay lại thư viện</Button>
          <Button variant="primary" onClick={refetch}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (!bundle || !bundle.paper) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <ExamPaperEmptyState />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-32 animate-fade-in">
      <button 
        onClick={() => navigate('/exams')} 
        className="text-sm font-medium text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 mb-6 flex items-center transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Quay lại thư viện
      </button>

      <ExamPaperHero paper={bundle.paper} />
      <ExamPaperSummary paper={bundle.paper} />

      {bundle.sections && bundle.sections.length > 0 ? (
        <>
          <ExamSectionSelector 
            sections={bundle.sections}
            selectedIds={selectedSectionIds}
            onToggle={toggleSection}
            onSelectAll={selectAllSections}
          />

          <div className="mt-8 flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bạn đã chọn:</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedSectionIds.length} / {bundle.sections.length} phần thi
              </p>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleStartSession}
              disabled={selectedSectionIds.length === 0}
              className="px-8 shadow-sm"
            >
              Bắt đầu làm bài
            </Button>
          </div>
        </>
      ) : (
        <ExamPaperEmptyState />
      )}
    </div>
  );
}