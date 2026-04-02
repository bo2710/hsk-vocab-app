import React from 'react';

export const AppInfoSection: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Thông tin ứng dụng (App Info)</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">HSK Vocab App</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Ứng dụng quản lý từ vựng HSK cá nhân. Hỗ trợ học tập, flashcard và theo dõi tiến độ.
          </p>
        </div>
        
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
            <li><strong>Phiên bản:</strong> 1.0.0 (PWA Ready)</li>
            <li><strong>Tính năng Offline:</strong> Ứng dụng tự động lưu trữ dữ liệu cục bộ. Bạn có thể sử dụng bình thường khi không có mạng. Dữ liệu sẽ tự đồng bộ khi có kết nối trở lại.</li>
            <li><strong>Cài đặt:</strong> Bạn có thể "Add to Home Screen" trên điện thoại để trải nghiệm như một ứng dụng độc lập.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};