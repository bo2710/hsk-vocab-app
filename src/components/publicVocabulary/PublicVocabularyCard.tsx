// filepath: src/components/publicVocabulary/PublicVocabularyCard.tsx
import React, { memo } from 'react';
import { PublicVocabularyEntry } from '../../features/publicVocabulary/types';
import { PronounceButton } from '../ui/PronounceButton';

interface PublicVocabularyCardProps {
  item: PublicVocabularyEntry;
  onAddClick?: (item: PublicVocabularyEntry) => void;
  onDetailClick?: (item: PublicVocabularyEntry) => void;
}

const PublicVocabularyCardComponent: React.FC<PublicVocabularyCardProps> = ({ 
  item, 
  onAddClick,
  onDetailClick 
}) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <h3 
            className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 transition-colors"
            onClick={() => onDetailClick?.(item)}
          >
            {item.canonical_hanzi}
          </h3>
          <PronounceButton text={item.canonical_hanzi} size="sm" />
        </div>
        
        {/* V2 METADATA BADGES */}
        <div className="flex flex-col items-end gap-1">
          {item.hsk20_level ? (
             <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
               HSK {item.hsk20_level}
             </span>
          ) : null}
          {item.hsk30_level ? (
             <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-800">
               v3: L{item.hsk30_level}
             </span>
          ) : null}
        </div>
      </div>
      
      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">{item.canonical_pinyin}</p>
      <p className="text-gray-800 dark:text-gray-200 font-medium mb-3 line-clamp-2 flex-1" title={item.canonical_meaning_vi}>
        {item.canonical_meaning_vi}
      </p>
      
      <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-50 dark:border-gray-700/50">
        <div className="flex flex-wrap gap-1">
          {item.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              #{tag}
            </span>
          ))}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-800 text-gray-400" title="Số người dùng">
            👥 {item.usage_count}
          </span>
        </div>
        
        <button 
          onClick={() => onAddClick?.(item)}
          className="text-xs font-semibold px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 dark:text-primary-400 rounded-lg transition-colors"
        >
          Lưu về máy
        </button>
      </div>
    </div>
  );
};

export const PublicVocabularyCard = memo(PublicVocabularyCardComponent, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id;
});