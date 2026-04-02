import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVocabularyDetail } from '../features/vocabulary/hooks/useVocabularyDetail';
import { useEditVocabulary } from '../features/vocabulary/hooks/useEditVocabulary';
import { EditWordForm } from '../components/forms/EditWordForm';

export const EditWordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Dùng hook của task trước để lấy dữ liệu cũ
  const { data: initialData, isLoading: isLoadingInitial, error: fetchError } = useVocabularyDetail(id);
  
  // Dùng hook mới để xử lý update & delete
  const { editVocabulary, removeVocabulary, isUpdating, updateError, isSuccess, resetState } = useEditVocabulary();

  // Reset state khi unmount hoặc đổi id
  useEffect(() => {
    return () => resetState();
  }, [id, resetState]);

  const handleSubmit = async (formData: any) => {
    if (!id) return false;
    const success = await editVocabulary(id, formData);
    if (success) {
      setTimeout(() => {
        navigate(`/vocabulary/${id}`, { replace: true });
      }, 500);
    }
    return success;
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Bạn có chắc chắn muốn xóa từ vựng này không? Thao tác này không thể hoàn tác.')) {
      const success = await removeVocabulary(id);
      if (success) {
        navigate('/vocabulary', { replace: true });
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const renderContent = () => {
    if (isLoadingInitial) {
      return (
        <div className="flex justify-center items-center py-20 text-gray-500 dark:text-gray-400">
          Đang tải dữ liệu...
        </div>
      );
    }

    if (fetchError || !initialData) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg text-center">
          <p>Không thể tải thông tin từ vựng.</p>
          <button onClick={handleCancel} className="mt-4 underline hover:text-red-800 dark:hover:text-red-300">Quay lại</button>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        
        {updateError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">
            Lỗi khi lưu: {updateError.message}
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-md">
            Thao tác thành công! Đang chuyển hướng...
          </div>
        )}

        <EditWordForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Chỉnh sửa từ vựng</h1>
      {renderContent()}
    </div>
  );
};

export default EditWordPage;