import React from 'react';
import { Button } from '../ui/Button';

interface ImportExamFileSummaryProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

export const ImportExamFileSummary: React.FC<ImportExamFileSummaryProps> = ({ file, onRemove, disabled }) => {
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5 flex items-center justify-between shadow-sm animate-fade-in">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="min-w-0 pr-2">
          <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Dung lượng: {sizeMB} MB
          </p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRemove} 
        disabled={disabled} 
        className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
      >
        <span className="hidden sm:inline mr-1">Xóa file</span>
        <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </Button>
    </div>
  );
};