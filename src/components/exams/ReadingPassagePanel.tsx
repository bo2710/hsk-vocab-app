// filepath: src/components/exams/ReadingPassagePanel.tsx
import React, { useRef, useEffect } from 'react';

interface Props {
  content: string;
}

export const ReadingPassagePanel: React.FC<Props> = ({ content }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn lên đầu khi đoạn văn thay đổi theo câu hỏi
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [content]);

  return (
    <div 
      ref={scrollRef}
      className="bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700 p-5 md:p-6 h-full max-h-[60vh] overflow-y-auto"
    >
      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        Đoạn văn / Ngữ cảnh
      </p>
      <div 
        className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed"
      >
        {content}
      </div>
    </div>
  );
};