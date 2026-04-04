import React from 'react';

interface Props {
  instruction: string | null;
  content: string | null;
  imageUrl?: string;
  wordLimit?: number;
}

export const WritingPromptPanel: React.FC<Props> = ({ instruction, content, imageUrl, wordLimit }) => {
  return (
    <div className="bg-purple-50/50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30 p-5 md:p-6 mb-6">
      {instruction && (
        <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-3">
          Yêu cầu: {instruction}
        </p>
      )}
      
      {wordLimit && (
        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full mb-4">
          Giới hạn: {wordLimit} từ
        </span>
      )}

      {imageUrl && (
        <div className="mb-4">
          <img 
            src={imageUrl} 
            alt="Writing Prompt Reference" 
            className="max-w-full h-auto max-h-[300px] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 object-contain"
          />
        </div>
      )}

      {content && (
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
};