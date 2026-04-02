import React from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from './navItems';

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-3 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `text-xs font-medium px-2 py-1 rounded-md transition-colors ${
              isActive
                ? 'text-primary-600 dark:text-primary-500'
                : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}