import React, { useState } from 'react';
import { useVocabularyList } from '../features/vocabulary/hooks/useVocabularyList';
import { useVocabularySearch } from '../features/vocabulary/hooks/useVocabularySearch';
import { useVocabularyFilters } from '../features/vocabulary/hooks/useVocabularyFilters';
import { VocabularyList } from '../components/vocabulary/VocabularyList';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterBar } from '../components/ui/FilterBar';

export const VocabularyPage: React.FC = () => {
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
  const errorObject = error ? new Error(error) : null;

  return (
    <div className="flex flex-col space-y-4 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kho từ vựng</h1>
        
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

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm min-h-[500px] p-4 border border-gray-100 dark:border-gray-800">
        <VocabularyList
          items={finalItems}
          isLoading={isLoading}
          error={errorObject}
          hasActiveFilters={isSearchOrFilterActive}
        />
      </div>
    </div>
  );
};

export default VocabularyPage;