// filepath: src/components/exams/ExamPaperLibrary.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { useExamLibrary } from '../../features/exams/hooks/useExamLibrary';
import { useExamLibrarySelection } from '../../features/exams/hooks/useExamLibrarySelection';
import { ExamLevelTabs } from './ExamLevelTabs';
import { ExamPaperCard } from './ExamPaperCard';
import { ExamLibraryEmptyState } from './ExamLibraryEmptyState';
import { ExamLibraryBulkActionBar } from './ExamLibraryBulkActionBar';
import { ExamVisibilityFilterBar } from './ExamVisibilityFilterBar';
import { Button } from '../ui/Button';

export const ExamPaperLibrary: React.FC = () => {
  const { 
    exams, 
    allExams,
    availableLevels, 
    selectedLevel, 
    setSelectedLevel,
    selectedVisibility,
    setSelectedVisibility, 
    isLoading, 
    isDeleting,
    error,
    refetch,
    deleteExams
  } = useExamLibrary();

  const {
    selectedIds,
    isSelectionMode,
    toggleSelection,
    clearSelection,
    isSelected,
    toggleSelectionMode
  } = useExamLibrarySelection();

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const ok = window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} đề thi này? Hành động này không thể hoàn tác.`);
    if (ok) {
      const success = await deleteExams(selectedIds);
      if (success) {
        clearSelection();
      }
    }
  };

  const resetFilters = () => {
    setSelectedLevel('all');
    setSelectedVisibility('all');
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <svg className="animate-spin h-10 w-10 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Đang tải thư viện đề thi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-8 rounded-2xl text-center">
        <h3 className="text-lg text-red-800 dark:text-red-400 font-bold mb-3">Đã xảy ra lỗi</h3>
        <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
        <Button variant="outline" onClick={refetch}>Thử lại</Button>
      </div>
    );
  }

  if (allExams.length === 0) {
    return <ExamLibraryEmptyState />;
  }

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <ExamLevelTabs 
          availableLevels={availableLevels} 
          selectedLevel={selectedLevel} 
          onSelectLevel={setSelectedLevel} 
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <ExamVisibilityFilterBar 
            selectedVisibility={selectedVisibility} 
            onSelect={setSelectedVisibility} 
          />
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
              Hiển thị <span className="text-gray-900 dark:text-white">{exams.length}</span> đề thi
            </div>
            {exams.length > 0 && (
              <Button 
                variant={isSelectionMode ? "primary" : "outline"} 
                size="sm" 
                onClick={toggleSelectionMode}
              >
                {isSelectionMode ? 'Hủy chọn' : 'Chọn nhiều'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {exams.length === 0 ? (
        <ExamLibraryEmptyState 
          isFilterEmpty={true} 
          resetFilter={resetFilters} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-24">
          {exams.map(paper => (
            <ExamPaperCard 
              key={paper.id} 
              paper={paper} 
              isSelectionMode={isSelectionMode}
              isSelected={isSelected(paper.id)}
              onToggleSelect={() => toggleSelection(paper.id)}
            />
          ))}
        </div>
      )}

      <ExamLibraryBulkActionBar 
        selectedCount={selectedIds.length}
        onClear={clearSelection}
        onDelete={handleDeleteSelected}
        isDeleting={isDeleting}
      />
    </div>
  );
};