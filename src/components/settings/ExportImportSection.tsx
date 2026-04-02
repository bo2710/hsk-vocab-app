import React, { useRef, useState } from 'react';
import { exportData } from '../../features/settings/services/exportService';
import { importData } from '../../features/settings/services/importService';

export const ExportImportSection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setMessage(null);
    try {
      const jsonString = await exportData();
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hsk_vocab_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Xuất dữ liệu thành công! File đã được tải xuống máy của bạn.' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage({ type: 'error', text: errorMessage || 'Lỗi khi xuất dữ liệu' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setMessage(null);

    try {
      // FIX CONTRACT LỖI: Truyền trực tiếp đối tượng file vào hàm importData như code gốc
      const result = await importData(file);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `Nhập thành công ${result.importedVocabCount} từ vựng và ${result.importedContextCount} ngữ cảnh! Hãy tải lại trang để thấy thay đổi.` 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Lỗi khi nhập dữ liệu' 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage({ type: 'error', text: errorMessage || 'Lỗi khi nhập dữ liệu' });
    } finally {
      setIsImporting(false);
      // Reset input để có thể chọn lại cùng một file
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dữ liệu (Data & Backup)</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Xuất toàn bộ dữ liệu từ vựng của bạn ra tệp tin .json để lưu trữ an toàn, hoặc phục hồi từ file sao lưu.
      </p>

      {message && (
        <div className={`p-4 mb-6 rounded-xl border ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExport}
          disabled={isExporting || isImporting}
          className="flex-1 py-3 px-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          {isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
        </button>
        
        <input
          type="file"
          accept=".json"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button
          onClick={handleImportClick}
          disabled={isExporting || isImporting}
          className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {isImporting ? 'Đang đọc file...' : 'Nhập dữ liệu'}
        </button>
      </div>
    </div>
  );
};