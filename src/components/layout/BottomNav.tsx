// filepath: src/components/layout/BottomNav.tsx
// CẦN CHỈNH SỬA
import { NavLink } from 'react-router-dom';
import { navItems } from './navItems';

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-3 flex justify-start sm:justify-around items-center z-50 overflow-x-auto gap-2 custom-scrollbar hide-scrollbar">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `whitespace-nowrap flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
              isActive
                ? 'text-primary-600 dark:text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}