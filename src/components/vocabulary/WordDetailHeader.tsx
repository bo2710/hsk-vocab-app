import React from 'react';
import { VocabularyItem } from '../../types/models';
import { InlineAudioPlayer } from '../audio';

interface WordDetailHeaderProps {
  word: VocabularyItem;
}

export const WordDetailHeader: React.FC<WordDetailHeaderProps> = ({ word }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white">{word.hanzi}</h1>
          <InlineAudioPlayer 
            type="word" 
            request={{ 
              text: word.hanzi, 
              pinyin: word.pinyin || undefined, 
              preferred_provider: word.preferred_audio_provider 
            }} 
            size="lg" 
            className="mt-2" 
          />
        </div>
        {word.pinyin && <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-medium tracking-wide mb-2">{word.pinyin}</p>}
        {word.han_viet && <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">Hán Việt: {word.han_viet}</p>}
        <p className="text-2xl text-gray-800 dark:text-gray-200 mt-2 font-medium">{word.meaning_vi}</p>
      </div>

      <div className="space-y-4">
        {word.note && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/50">
            <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-500 mb-1">Ghi chú:</h4>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{word.note}</p>
          </div>
        )}
        
        {word.example && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-400 mb-1">Ví dụ:</h4>
              <p className="text-gray-800 dark:text-gray-300 font-serif whitespace-pre-line">{word.example}</p>
            </div>
            <InlineAudioPlayer 
              type="context" 
              request={{ text: word.example, context_id: `example-${word.id}` }} 
              size="sm" 
              className="mt-1" 
            />
          </div>
        )}
      </div>
    </div>
  );
};