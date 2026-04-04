import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVocabularyDetail } from '../features/vocabulary/hooks/useVocabularyDetail';
import { updateVocabularyWord } from '../features/vocabulary/services/vocabularyEditService';
import { WordDetailHeader } from '../components/vocabulary/WordDetailHeader';
import { WordDetailMeta } from '../components/vocabulary/WordDetailMeta';
import { WordDetailContexts } from '../components/vocabulary/WordDetailContexts';

// Audio Playback UI đã được tích hợp trực tiếp vào WordDetailHeader và WordDetailContexts thông qua InlineAudioPlayer
export const WordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: word, contexts, isLoading, error } = useVocabularyDetail(id);

  // LOGIC ĐỌC: Đổi status từ "new" sang "learning" an toàn, hỗ trợ Offline
  useEffect(() => {
    if (word && word.status === 'new') {
      const clearNewStatus = async () => {
        try {
          // Gọi Service tổng hợp, nó tự lo việc cập nhật IndexedDB và Supabase (hoặc Offline Queue)
          await updateVocabularyWord(word.id, { status: 'learning' });
        } catch (e) {
          console.warn('Lỗi khi tắt trạng thái NEW', e);
        }
      };
      clearNewStatus();
    }
  }, [word]);

  const handleBack = () => {
    navigate(-1);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <span className="text-gray-500 dark:text-gray-400 font-medium text-lg">Đang tải chi tiết...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-8 rounded-xl text-center shadow-sm">
          <h2 className="text-xl font-bold mb-2">Đã có lỗi xảy ra</h2>
          <p>{error.message}</p>
        </div>
      );
    }

    if (!word) return null;

    return (
      <div className="animate-fade-in space-y-6">
        <WordDetailHeader word={word} />
        <WordDetailMeta word={word} />
        <WordDetailContexts contexts={contexts} />
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleBack} 
          className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center transition-colors font-medium"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Quay lại
        </button>
        
        {word && (
          <Link 
            to={`/vocabulary/${id}/edit`}
            className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/50 font-medium text-sm transition-colors"
          >
            Chỉnh sửa
          </Link>
        )}
      </div>

      {renderContent()}
    </div>
  );
};

export default WordDetailPage;