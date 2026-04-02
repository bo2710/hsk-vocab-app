import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import AddWordPage from '../../pages/AddWordPage';
import VocabularyPage from '../../pages/VocabularyPage';
import WordDetailPage from '../../pages/WordDetailPage';
import EditWordPage from '../../pages/EditWordPage';
import ReviewPage from '../../pages/ReviewPage';
import SettingsPage from '../../pages/SettingsPage';
import { SyncProvider } from '../providers/SyncProvider';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <SyncProvider>
        <ProtectedRoute />
      </SyncProvider>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      
      // Xử lý chuyển hướng nếu lỡ gõ /dashboard
      { path: 'dashboard', element: <Navigate to="/" replace /> },
      
      { path: 'add', element: <AddWordPage /> },
      { path: 'vocabulary', element: <VocabularyPage /> },
      { path: 'vocabulary/:id', element: <WordDetailPage /> },
      { path: 'vocabulary/:id/edit', element: <EditWordPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'settings', element: <SettingsPage /> },
      
      // Route bắt đáy (Catch-all 404): Nếu gõ sai URL, tự động đưa về trang chủ
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);