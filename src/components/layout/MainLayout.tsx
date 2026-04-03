import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import BottomNav from './BottomNav'; // Sửa lại thành Default Import theo đúng file gốc của bạn

export const MainLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Sidebar />
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl animate-slide-right"
            onClick={e => e.stopPropagation()}
          >
            {/* Minimal Mobile Sidebar Content */}
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
              <span className="font-bold text-lg dark:text-white">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            {/* The rest is handled by BottomNav on mobile anyway, but keeping this for potential future expansion */}
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
              Sử dụng thanh điều hướng bên dưới.
            </div>
          </div>
        </div>
      )}

      {/* ĐÃ FIX: Đổi 'relative-z-0' thành 'relative z-0' để class Tailwind hợp lệ */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative z-0">
        {/* Subtle background glow effect for dark mode */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary-500/5 dark:bg-primary-500/10 blur-[100px] pointer-events-none -z-10"></div>
        
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <Outlet />
        </main>
        
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 glass-panel z-30">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};