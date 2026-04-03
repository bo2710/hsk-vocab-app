import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabularyList } from '../features/vocabulary/hooks/useVocabularyList';
import { useVocabularySearch } from '../features/vocabulary/hooks/useVocabularySearch';
import { useVocabularyFilters } from '../features/vocabulary/hooks/useVocabularyFilters';
import { VocabularyList } from '../components/vocabulary/VocabularyList';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterBar } from '../components/ui/FilterBar';

export const VocabularyPage: React.FC = () => {
  const navigate = useNavigate();
  // Lấy dữ liệu toàn bộ từ db thông qua hook
  const { data: items = [], isLoading, error } = useVocabularyList();
  
  // Áp dụng Text Search cục bộ
  const [searchQuery, setSearchQuery] = useState('');
  const { filteredItems: searchedItems } = useVocabularySearch(items, searchQuery);

  // Áp dụng Lọc và Sắp xếp cục bộ lên tập dữ liệu đã search
  const { 
    filters, setFilters, 
    sort, setSort, 
    processedItems: finalItems, 
    clearFilters, 
    isFilterActive 
  } = useVocabularyFilters(searchedItems);

  // Trạng thái tổng hợp xem người dùng có đang thao tác bất kỳ công cụ tìm kiếm/lọc nào không
  const isSearchOrFilterActive = searchQuery.trim().length > 0 || isFilterActive;

  // Ghi log ẩn thay vì ném lỗi thô ra UI cho người dùng thấy
  if (error) {
    console.warn("Lỗi tải kho từ (Đã bị ẩn trên UI):", error);
  }

  return (
    <div className="flex flex-col space-y-4 p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Kho từ vựng</h1>
        
        <div className="w-full sm:w-80">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm bằng Hanzi, Pinyin, nghĩa..."
          />
        </div>
      </div>

      {/* Cụm thanh công cụ Filter & Sort */}
      <FilterBar 
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        onClear={() => {
          clearFilters();
          setSearchQuery(''); // Xóa tiện lợi cả thanh search nếu người dùng bấm "Xóa bộ lọc"
        }}
        isActive={isSearchOrFilterActive}
      />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm min-h-[500px] p-4 md:p-6 border border-gray-100 dark:border-gray-700">
        
        {/* NÂNG CẤP UI: Thay thế báo lỗi thô bằng Giao diện "Chưa có từ vựng" khi mảng rỗng */}
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
            error={null} // Cố tình ép null để component con không bao giờ quăng bảng lỗi đỏ lòm
            hasActiveFilters={isSearchOrFilterActive}
          />
        )}
        
      </div>
    </div>
  );
};

export default VocabularyPage;