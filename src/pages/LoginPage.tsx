import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../app/providers/AuthProvider';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // State quản lý form
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State xác nhận mật khẩu
  
  // State trạng thái
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Nếu đã đăng nhập thì tự động đẩy về trang chủ
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    // KIỂM TRA MẬT KHẨU NHẬP LẠI (Chỉ chạy khi đang ở mode Đăng ký)
    if (!isLoginMode && password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      setIsLoading(false);
      return;
    }

    try {
      if (isLoginMode) {
        // Xử lý Đăng nhập
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        // Xử lý Đăng ký
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        
        // CẬP NHẬT: Nhắc người dùng kiểm tra email
        setSuccessMsg('Đăng ký thành công!');
        setIsLoginMode(true); // Chuyển về tab đăng nhập
        setPassword(''); // Xóa mật khẩu cho an toàn
        setConfirmPassword('');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';
      // Dịch các lỗi Supabase phổ biến cho thân thiện
      if (errorMessage.includes('Invalid login credentials')) {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (errorMessage.includes('User already registered')) {
        setError('Email này đã được đăng ký.');
      } else if (errorMessage.includes('Password should be at least')) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
    setSuccessMsg(null);
    setConfirmPassword(''); // Reset ô nhập lại mật khẩu khi đổi tab
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              HSK Vocab
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {isLoginMode ? 'Đăng nhập' : 'Tạo tài khoản mới để bắt đầu'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg border border-green-100 dark:border-green-900/50">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="nhapemail@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            {/* TRƯỜNG NHẬP LẠI MẬT KHẨU (Chỉ hiện khi Đăng ký) */}
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Xác nhận lại mật khẩu"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading 
                ? 'Đang xử lý...' 
                : (isLoginMode ? 'Đăng nhập' : 'Đăng ký tài khoản')
              }
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              {isLoginMode 
                ? 'Chưa có tài khoản? Đăng ký ngay' 
                : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;