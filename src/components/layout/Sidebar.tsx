// filepath: src/components/layout/Sidebar.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from './navItems';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-gray-800">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-md shadow-primary-500/20">
            <span className="text-white font-bold text-lg leading-none">H</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            HSK Vocab
          </span>
        </div>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1.5 custom-scrollbar overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2.5" : "2"} d={item.icon}></path>
                </svg>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800/50">
          <p className="text-xs font-semibold text-primary-800 dark:text-primary-300 uppercase tracking-wider mb-1">Học mỗi ngày</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Kiên trì là chìa khóa để chinh phục HSK.</p>
        </div>
      </div>
    </aside>
  );
};