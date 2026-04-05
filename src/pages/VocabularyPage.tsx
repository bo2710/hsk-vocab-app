// filepath: src/pages/VocabularyPage.tsx
// CẦN CHỈNH SỬA
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabularyList } from '../features/vocabulary/hooks/useVocabularyList';
import { useVocabularySearch } from '../features/vocabulary/hooks/useVocabularySearch';
import { useVocabularyFilters } from '../features/vocabulary/hooks/useVocabularyFilters';
import { VocabularyList } from '../components/vocabulary/VocabularyList';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterBar } from '../components/ui/FilterBar';
import { bulkDeleteVocabularyWords } from '../features/vocabulary/services/vocabularyEditService';
import { publicVocabularyContributionService } from '../features/publicVocabulary/services/publicVocabularyContributionService';

export const VocabularyPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: items = [], isLoading, error } = useVocabularyList();
  
  const [searchQuery, setSearchQuery] = useState('');
  const { filteredItems: searchedItems } = useVocabularySearch(items, searchQuery);

  const { 
    filters, setFilters, 
    sort, setSort, 
    processedItems: finalItems, 
    clearFilters, 
    isFilterActive 
  } = useVocabularyFilters(searchedItems);

  // STATE QUẢN LÝ CHẾ ĐỘ CHỌN HÀNG LOẠT
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const isSearchOrFilterActive = searchQuery.trim().length > 0 || isFilterActive;

  if (error) {
    console.warn("Lỗi tải kho từ (Đã bị ẩn trên UI):", error);
  }

  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedIds([]); 
  };

  const handleToggleSelectWord = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === finalItems.length && finalItems.length > 0) {
      setSelectedIds([]); 
    } else {
      setSelectedIds(finalItems.map(item => item.id)); 
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN ${selectedIds.length} từ vựng đã chọn không? Hành động này không thể hoàn tác.`)) return;

    setIsDeleting(true);
    try {
      await bulkDeleteVocabularyWords(selectedIds);
      window.location.reload(); 
    } catch (err) {
      alert("Đã xảy ra lỗi khi xóa.");
      setIsDeleting(false);
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn ĐĂNG ${selectedIds.length} từ vựng này lên kho cộng đồng để chờ duyệt không?`)) return;

    setIsPublishing(true);
    try {
      const itemsToPublish = finalItems.filter(item => selectedIds.includes(item.id));
      let successCount = 0;
      
      for (const item of itemsToPublish) {
         const payload = {
            normalized_hanzi: item.hanzi_normalized,
            payload: {
               canonical_hanzi: item.hanzi,
               pinyin: item.pinyin,
               meaning_vi: item.meaning_vi,
               han_viet: item.han_viet,
               note: item.note,
               example: item.example,
               hsk20_level: item.hsk20_level,
               hsk30_level: item.hsk30_level,
               hsk30_band: item.hsk30_band,
               tags: item.tags?.join(', ') || ''
            }
         };
         await publicVocabularyContributionService.submitContribution(payload as any, true);
         successCount++;
      }
      
      alert(`Đã gửi thành công ${successCount} từ vựng! Bạn có thể theo dõi tiến độ duyệt tại mục Đóng góp của tôi ở màn hình Từ vựng cộng đồng.`);
      handleToggleSelectMode();
    } catch (err) {
      alert("Đã xảy ra lỗi khi đăng từ vựng.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-2 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap">Kho từ vựng</h1>
        
        <div className="flex flex-row w-full md:w-auto items-center gap-2">
          <div className="flex-1 md:w-80">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm kiếm bằng Hanzi, Pinyin, nghĩa..."
            />
          </div>
          
          <button
            onClick={handleToggleSelectMode}
            className={`p-2.5 rounded-xl border transition-colors shrink-0 shadow-sm ${
              isSelectMode 
                ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900/40 dark:border-primary-500 dark:text-primary-400' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
            }`}
            title="Chọn nhiều"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </button>
        </div>
      </div>

      {isSelectMode ? (
        <div className="bg-primary-50/80 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm animate-slide-up">
          <label className="flex items-center gap-3 cursor-pointer pl-2">
            <input 
              type="checkbox" 
              checked={selectedIds.length === finalItems.length && finalItems.length > 0} 
              onChange={handleSelectAll} 
              className="w-5 h-5 rounded text-primary-600 border-gray-300 focus:ring-primary-500 bg-white dark:bg-gray-800" 
            />
            <span className="text-sm font-semibold text-primary-800 dark:text-primary-300">
              Đã chọn {selectedIds.length} / {finalItems.length}
            </span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleToggleSelectMode} 
              disabled={isDeleting || isPublishing} 
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={handleBulkPublish} 
              disabled={selectedIds.length === 0 || isDeleting || isPublishing} 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isPublishing ? 'Đang đăng...' : 'Đăng lên cộng đồng'}
            </button>
            <button 
              onClick={handleBulkDelete} 
              disabled={selectedIds.length === 0 || isDeleting || isPublishing} 
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa đã chọn'}
            </button>
          </div>
        </div>
      ) : (
        <FilterBar 
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
          onClear={() => {
            clearFilters();
            setSearchQuery(''); 
          }}
          isActive={isSearchOrFilterActive}
          showAdvanced={showAdvancedFilters}
          setShowAdvanced={setShowAdvancedFilters}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm min-h-[500px] p-4 md:p-6 border border-gray-100 dark:border-gray-700">
        {!isLoading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4 animate-fade-in">
            <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Chưa có từ vựng nào</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">Kho từ của bạn đang trống. Hãy bắt đầu thêm những từ vựng đầu tiên để xây dựng vốn từ HSK của riêng mình nhé!</p>
            <button 
              onClick={() => navigate('/add')}
              className="mt-4 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
            >
              Thêm từ mới ngay
            </button>
          </div>
        ) : (
          <VocabularyList
            items={finalItems}
            isLoading={isLoading}
            error={null} 
            hasActiveFilters={isSearchOrFilterActive}
            isSelectMode={isSelectMode}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelectWord}
          />
        )}
      </div>
    </div>
  );
};

export default VocabularyPage;