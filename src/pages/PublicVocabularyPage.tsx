// filepath: src/pages/PublicVocabularyPage.tsx
// CẦN CHỈNH SỬA
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../app/providers/AuthProvider';
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
  PublicVocabularyDuplicateWarning,
  ContributionStatusBadge,
  PublicVocabularyModerationPanel
} from '../components/publicVocabulary';
import { Modal } from '../components/ui/Modal';

type TabView = 'browse' | 'my_contributions' | 'moderation';

export default function PublicVocabularyPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabView>('browse');

  const {
    data,
    isLoading,
    error,
    filters: params = {}, 
    setFilters,
    setFilter,
    refetch: refetchPublicList
  } = usePublicVocabularyList();

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
    resetStatus,
    userContributions,
    isLoadingContributions,
    fetchUserContributions
  } = usePublicVocabularyContribution();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Khi chuyển sang tab "Đóng góp của tôi", tự động fetch lịch sử
  useEffect(() => {
    if (activeTab === 'my_contributions') {
      fetchUserContributions();
    }
  }, [activeTab, fetchUserContributions]);

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
    if (!isSubmitting) {
      setIsModalOpen(false);
      // Nếu có tab my_contributions đang mở, tự reload khi modal đóng
      if (activeTab === 'my_contributions') fetchUserContributions();
      if (activeTab === 'browse' && isSuccess) refetchPublicList();
    }
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
          {activeTab === 'browse' && (
            <div className="flex-1 md:w-80">
              <PublicVocabularySearchBar 
                initialValue={params.searchQuery}
                onSearch={setSearchQuery} 
              />
            </div>
          )}
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

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 mb-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'browse' 
              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Khám phá
        </button>
        <button 
          onClick={() => setActiveTab('my_contributions')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'my_contributions' 
              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Đóng góp của tôi
        </button>
        {isAdmin && (
          <button 
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'moderation' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Quản duyệt
          </button>
        )}
      </div>

      {/* VIEW: BROWSE */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
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
        </div>
      )}

      {/* VIEW: MY CONTRIBUTIONS */}
      {activeTab === 'my_contributions' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm min-h-[300px] p-4 md:p-6 border border-gray-100 dark:border-gray-700">
          {isLoadingContributions ? (
            <div className="text-center p-8 text-gray-500">Đang tải lịch sử...</div>
          ) : userContributions.length === 0 ? (
            <div className="text-center p-12 text-gray-500 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              Bạn chưa có đóng góp nào. Bấm nút + Đóng góp để chia sẻ từ vựng mới nhé!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                    <th className="pb-3 font-semibold">Từ vựng (Hanzi)</th>
                    <th className="pb-3 font-semibold">Nghĩa</th>
                    <th className="pb-3 font-semibold">Trạng thái</th>
                    <th className="pb-3 font-semibold">Ngày gửi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {userContributions.map(item => {
                    const payload: any = item.payload || {};
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 font-bold text-gray-900 dark:text-white text-base">
                          {item.normalized_hanzi}
                        </td>
                        <td className="py-4 text-gray-600 dark:text-gray-300 line-clamp-1">
                          {payload.meaning_vi || 'N/A'}
                        </td>
                        <td className="py-4">
                          <ContributionStatusBadge status={item.validation_status} />
                        </td>
                        <td className="py-4 text-gray-500 dark:text-gray-400">
                          {new Date(item.submitted_at).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW: MODERATION (ADMIN) */}
      {activeTab === 'moderation' && isAdmin && (
        <PublicVocabularyModerationPanel />
      )}

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