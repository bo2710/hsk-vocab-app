import React from 'react';
import { useTheme } from '../../app/providers/ThemeProvider';

export const AppearanceSection: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Giao diện (Appearance)</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Chọn chế độ màu sắc cho ứng dụng.</p>
      
      {/* FIX CSS: Thêm nền xám tối (dark:bg-gray-900) cho thẻ bọc ngoài, và p-1 để tạo viền ảo */}
      <div className="flex p-1 space-x-1 bg-gray-100 dark:bg-gray-900 rounded-xl max-w-md">
        {(['light', 'dark', 'system'] as const).map((t) => {
          const labels = { light: 'Sáng', dark: 'Tối', system: 'Hệ thống' };
          const isSelected = theme === t;
          
          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isSelected 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' // Nổi lên khi được chọn
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50' // Chìm xuống khi chưa chọn
              }`}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>
    </div>
  );
};