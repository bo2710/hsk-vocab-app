// filepath: src/components/publicVocabulary/PublicVocabularySearchBar.tsx
import React, { useState, useEffect } from 'react';
import { SearchBar } from '../ui/SearchBar';

interface PublicVocabularySearchBarProps {
  initialValue?: string;
  onSearch: (query: string) => void;
}

export const PublicVocabularySearchBar: React.FC<PublicVocabularySearchBarProps> = ({ 
  initialValue = '', 
  onSearch 
}) => {
  const [localQuery, setLocalQuery] = useState(initialValue);

  // Debounce search để tránh gọi API liên tục khi gõ
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(localQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localQuery, onSearch]);

  return (
    <SearchBar
      value={localQuery}
      onChange={setLocalQuery}
      placeholder="Tìm chữ Hán, Pinyin, Nghĩa..."
      className="w-full shadow-sm"
    />
  );
};