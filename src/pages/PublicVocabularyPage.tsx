// filepath: src/pages/PublicVocabularyPage.tsx
// CẦN CHỈNH SỬA
import { useState, useCallback } from 'react';
import { 
  usePublicVocabularyList, 
  usePublicVocabularyContribution 
} from '../features/publicVocabulary';
import { 
  PublicVocabularyList, 
  PublicVocabularySearchBar, 
  PublicVocabularyFilters, 
  PublicVocabularyEmptyState,
  PublicVocabularyContributionForm,
  PublicVocabularyContributionStatus,
  PublicVocabularyDuplicateWarning
} from '../components/publicVocabulary';
import { Modal } from '../components/ui/Modal';

export default function PublicVocabularyPage() {
  // Ánh xạ (alias) tên biến từ hook để khớp với logic hiện tại của Page
  const {
    data,
    isLoading,
    error,
    filters: params = {}, // Lấy 'filters' và gọi nó là 'params', fallback = {} để chống undefined
    setFilters,
    setFilter
  } = usePublicVocabularyList();

  // Tạo các hàm wrapper để khớp với interface cũ của Page
  const updateFilters = useCallback((newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  }, [setFilters]);

  const setSearchQuery = useCallback((query: string) => {
    setFilter('searchQuery', query);
  }, [setFilter]);

  const {
    submit,
    confirmSubmit,
    cancelDuplicateWarning,
    isSubmitting,
    error: submitError,
    validationErrors,
    isSuccess,
    showDuplicateWarning,
    duplicateCandidates,
    resetStatus
  } = usePublicVocabularyContribution();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = (item: any) => {
    alert(`Tính năng "Lưu ${item.canonical_hanzi} về máy" đang được hoàn thiện (Sắp ra mắt).`);
  };

  const handleDetailClick = (item: any) => {
    console.log('View detail for:', item);
  };

  const handleOpenContribute = () => {
    resetStatus();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) setIsModalOpen(false);
  };

  const handleContributeMore = () => {
    resetStatus();
  };

  const hasActiveFilters = Boolean(params.searchQuery || params.hsk20Level || params.hsk30Level || params.hsk30Band);

  return (
    <div className="flex flex-col space-y-4 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-2 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap">Từ vựng cộng đồng</h1>
          <p className="text-sm text-gray-500 mt-1">Khám phá và lưu trữ các từ vựng chuẩn hóa.</p>
        </div>
        
        <div className="flex flex-row w-full md:w-auto items-center gap-2">
          <div className="flex-1 md:w-80">
            <PublicVocabularySearchBar 
              initialValue={params.searchQuery}
              onSearch={setSearchQuery} 
            />
          </div>
          <button 
            className="p-2.5 rounded-xl border border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-900/50 transition-colors shadow-sm whitespace-nowrap"
            onClick={handleOpenContribute}
            title="Đóng góp từ vựng mới"
          >
            <span className="hidden md:inline font-medium text-sm mr-2">+ Đóng góp</span>
            <svg className="w-5 h-5 inline md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
      </div>

      <PublicVocabularyFilters 
        params={params} 
        onChange={updateFilters} 
        onClear={() => updateFilters({ hsk20Level: undefined, hsk30Level: undefined, hsk30Band: undefined })}
      />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm min-h-[500px] p-4 md:p-6 border border-gray-100 dark:border-gray-700">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-xl dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">
            Lỗi kết nối: {error.message}
          </div>
        )}

        {!isLoading && data.length === 0 && !error ? (
          <PublicVocabularyEmptyState 
            hasFilters={hasActiveFilters} 
            onClearFilters={() => {
              setSearchQuery('');
              updateFilters({ hsk20Level: undefined, hsk30Level: undefined, hsk30Band: undefined });
            }}
          />
        ) : (
          <PublicVocabularyList 
            items={data} 
            isLoading={isLoading} 
            onAddClick={handleAddClick}
            onDetailClick={handleDetailClick}
          />
        )}
      </div>

      {/* MODAL ĐÓNG GÓP TỪ VỰNG */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Đóng góp từ vựng cộng đồng"
      >
        {isSuccess || submitError ? (
          <PublicVocabularyContributionStatus 
            isSuccess={isSuccess}
            error={submitError}
            onClose={handleCloseModal}
            onContributeMore={handleContributeMore}
          />
        ) : showDuplicateWarning ? (
          <PublicVocabularyDuplicateWarning
            candidates={duplicateCandidates}
            isSubmitting={isSubmitting}
            onCancel={handleCloseModal}
            onConfirm={confirmSubmit}
            onBackToEdit={cancelDuplicateWarning}
          />
        ) : (
          <PublicVocabularyContributionForm 
            onSubmit={submit}
            isSubmitting={isSubmitting}
            validationErrors={validationErrors}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>

    </div>
  );
}