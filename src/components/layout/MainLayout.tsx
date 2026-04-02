import React, { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';

// 1. Khai báo interface cho phép component nhận prop 'children' (tùy chọn)
interface MainLayoutProps {
  children?: ReactNode;
}

// 2. Cập nhật hàm để nhận 'children' từ props
export default function MainLayout({ children }: MainLayoutProps) {
  // Thêm state để quản lý menu mobile (đáp ứng yêu cầu của Header)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Tương lai bạn có thể truyền isMobileMenuOpen vào Sidebar nếu cần */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Truyền hàm toggle vào Header để fix lỗi TypeScript */}
        <Header onMenuToggle={toggleMobileMenu} />

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto">
            {/* 3. Render linh hoạt: Nếu có children thì dùng children, nếu không thì dùng Outlet */}
            {children ? children : <Outlet />}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}