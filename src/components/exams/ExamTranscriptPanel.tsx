import React, { useState } from 'react';

interface Props {
  transcript: string | null;
}

export const ExamTranscriptPanel: React.FC<Props> = ({ transcript }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!transcript) return null;

  return (
    <div className="mt-6 border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-blue-100/50 dark:hover:bg-blue-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
          <span className="font-bold text-blue-800 dark:text-blue-300">Transcript (Nội dung bài nghe)</span>
        </div>
        <svg className={`w-5 h-5 text-blue-600 dark:text-blue-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-blue-200/50 dark:border-blue-800/30 bg-white/50 dark:bg-gray-900/30">
          <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
            {transcript}
          </div>
        </div>
      )}
    </div>
  );
};