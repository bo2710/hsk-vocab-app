import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVocabularyDetail } from '../features/vocabulary/hooks/useVocabularyDetail';
import { updateVocabularyWord, deleteVocabularyWord } from '../features/vocabulary/services/vocabularyEditService';
import { EditWordForm, EditVocabularyPayload } from '../components/forms/EditWordForm';

export const EditWordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Khai thác mảng 'contexts' từ Hook để truyền vào form
  const { data: word, contexts, isLoading, error } = useVocabularyDetail(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="text-gray-500 dark:text-gray-400 font-medium">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error || !word) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center mt-10 animate-fade-in">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl border border-red-200 dark:border-red-800 shadow-sm">
          <h2 className="text-lg font-bold mb-2">Lỗi tải dữ liệu</h2>
          <p>{error?.message || 'Không tìm thấy từ vựng. Nó có thể đã bị xóa.'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-5 py-2 bg-red-100 dark:bg-red-900/40 rounded-md hover:bg-red-200 dark:hover:bg-red-900/60 font-medium transition-colors">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (payload: EditVocabularyPayload) => {
    setIsSubmitting(true);
    try {
      await updateVocabularyWord(id!, payload);
      alert('Chỉnh sửa từ vựng thành công!');
      // FIX LỖI ĐIỀU HƯỚNG: Dùng { replace: true } để không sinh ra History lặp lại vòng luẩn quẩn
      navigate(`/vocabulary/${id}`, { replace: true });
      return true;
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi khi lưu.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa từ vựng này không? Hành động này không thể hoàn tác.')) return;
    setIsSubmitting(true);
    try {
      await deleteVocabularyWord(id!);
      // Xóa thành công thì về thẳng Kho từ
      navigate('/vocabulary', { replace: true });
    } catch (err: any) {
      alert('Lỗi xóa: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chỉnh sửa từ vựng</h1>
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          title="Đóng"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <EditWordForm 
          initialData={word} 
          initialContexts={contexts} // Bơm ngữ cảnh vào UI
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          onCancel={() => navigate(-1)} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default EditWordPage;