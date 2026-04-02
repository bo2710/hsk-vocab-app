import React from 'react';
import { useAuth } from '../app/providers/AuthProvider';
import { supabase } from '../lib/supabase/client';
import { Button } from '../components/ui/Button';
import { ExportImportSection, AppearanceSection, AppInfoSection } from '../components/settings';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cài đặt</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý tài khoản, giao diện và dữ liệu ứng dụng.</p>
      </div>
      
      <div className="space-y-6">
        {/* User Account Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Tài khoản (Account)</h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đang đăng nhập với email:</p>
              <p className="font-semibold text-gray-900 dark:text-white truncate">{user?.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="danger" className="w-full sm:w-auto shrink-0">
              Đăng xuất
            </Button>
          </div>
        </section>

        {/* Appearance Section */}
        <section>
          <AppearanceSection />
        </section>

        {/* Backup & Restore Section */}
        <section>
          <ExportImportSection />
        </section>

        {/* App Info Section */}
        <section>
          <AppInfoSection />
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;