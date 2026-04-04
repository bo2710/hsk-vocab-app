// filepath: src/components/publicVocabulary/PublicVocabularyList.tsx
import React from 'react';
import { PublicVocabularyEntry } from '../../features/publicVocabulary/types';
import { PublicVocabularyCard } from './PublicVocabularyCard';

interface PublicVocabularyListProps {
  items: PublicVocabularyEntry[];
  isLoading: boolean;
  onAddClick: (item: PublicVocabularyEntry) => void;
  onDetailClick: (item: PublicVocabularyEntry) => void;
}

export const PublicVocabularyList: React.FC<PublicVocabularyListProps> = ({
  items,
  isLoading,
  onAddClick,
  onDetailClick
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 flex justify-center items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang tải dữ liệu cộng đồng...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <PublicVocabularyCard 
          key={item.id} 
          item={item} 
          onAddClick={onAddClick}
          onDetailClick={onDetailClick}
        />
      ))}
    </div>
  );
};