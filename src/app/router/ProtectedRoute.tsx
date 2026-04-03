import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
// SỬA TẬN GỐC: Thêm ngoặc nhọn {} để khớp với Named Export bên MainLayout
import { MainLayout } from '../../components/layout/MainLayout'; 

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Ngăn chặn flicker khi app chưa kịp lấy trạng thái từ Supabase
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500 dark:text-gray-400 font-medium">Đang tải...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // TRỌNG TÂM FIX LAYOUT: Trả về MainLayout thay vì chỉ là Outlet trần
  // Bản thân MainLayout đã có sẵn <Outlet /> bên trong nó.
  return <MainLayout />;
}