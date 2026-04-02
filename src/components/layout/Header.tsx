import React from 'react';
import { SyncStatusBadge } from '../sync';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
          HSK Vocab
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Sync Status Indicator */}
        <SyncStatusBadge />
        
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm">
          U
        </div>
      </div>
    </header>
  );
};

// Bổ sung default export để tương thích với cú pháp import trong MainLayout
export default Header;