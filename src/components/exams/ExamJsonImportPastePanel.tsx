// filepath: src/components/exams/ExamJsonImportPastePanel.tsx
// CẦN TẠO MỚI
import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface ExamJsonImportPastePanelProps {
  onImport: (jsonString: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const ExamJsonImportPastePanel: React.FC<ExamJsonImportPastePanelProps> = ({ onImport, isLoading, error }) => {
  const [jsonText, setJsonText] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonText(text);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  const handleSubmit = () => {
    if (!jsonText.trim()) return;
    onImport(jsonText);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
        <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
          Dán JSON từ ChatGPT
        </h3>
        <button 
          onClick={handlePaste}
          className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          Dán từ Clipboard
        </button>
      </div>
      
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{error}</span>
          </div>
        )}

        <textarea
          className="w-full h-48 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-mono text-gray-800 dark:text-gray-200 resize-y focus:outline-none focus:ring-1 focus:ring-primary-500 mb-4 placeholder-gray-400"
          placeholder='{"title": "Đề thi HSK 4...", "sections": [...]}'
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          disabled={isLoading}
        />

        <div className="flex justify-end">
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={!jsonText.trim() || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : 'Bắt đầu Import'}
          </Button>
        </div>
      </div>
    </div>
  );
};