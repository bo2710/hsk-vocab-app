import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReviewSession} from '../features/review/hooks/useReviewSession';
import { ReviewProgress } from '../components/review/ReviewProgress';
import { ReviewCard } from '../components/review/ReviewCard';
import { VocabularyItem } from '../types/models';
import { getAllVocabulary } from '../lib/indexeddb/vocabularyStore';

export const ReviewPage: React.FC = () => {
  const {
    isStarted,
    startSession,
    resetSession,
    currentItem,
    currentIndex,
    totalItems,
    isLoading,
    error,
    showAnswer,
    isSubmitting,
    isFinished,
    isNoItems,
    stats,
    handleReveal,
    handleRating,
    retry
  } = useReviewSession();

  // State phục vụ cho chế độ Tự Chọn Từ
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [allWords, setAllWords] = useState<VocabularyItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenCustomPicker = async () => {
    const words = await getAllVocabulary();
    // Lọc bỏ rác
    setAllWords(words.filter(v => !v.deleted_at && !v.is_archived));
    setSelectedIds([]);
    setSearchQuery('');
    setShowCustomPicker(true);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filtered = allWords.filter(w => 
      w.hanzi.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (w.meaning_vi || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredIds = filtered.map(w => w.id);
    
    // Nếu tất cả đã được chọn thì bỏ chọn, ngược lại thì chọn hết
    const allSelected = filteredIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleStartCustomSession = () => {
    if (selectedIds.length === 0) return;
    startSession('custom', selectedIds);
  };

  // Hàm bọc lại resetSession để dọn dẹp cả state của Picker
  const handleFullResetSession = () => {
    resetSession();
    setShowCustomPicker(false);
    setSelectedIds([]);
  };

  const renderCustomPicker = () => {
    const filteredWords = allWords.filter(w => 
      w.hanzi.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (w.meaning_vi || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="max-w-xl mx-auto mt-10 p-6 md:p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setShowCustomPicker(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center font-medium transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Quay lại
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chọn từ để ôn</h2>
        </div>

        <input 
          type="text" 
          placeholder="Tìm theo chữ Hán hoặc Nghĩa..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 text-gray-900 dark:text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
        />

        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">Đã chọn: <strong className="text-teal-600 dark:text-teal-400">{selectedIds.length}</strong> từ</span>
          <button onClick={handleSelectAllFiltered} className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline">
            Chọn / Bỏ chọn tất cả ({filteredWords.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[250px] pr-2 space-y-2 border-y border-gray-100 dark:border-gray-700 py-4 custom-scrollbar">
          {filteredWords.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">Không tìm thấy từ nào phù hợp.</p>
          ) : (
            filteredWords.map((word) => {
              const isSelected = selectedIds.includes(word.id);
              return (
                <div 
                  key={word.id} 
                  onClick={() => handleToggleSelect(word.id)}
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${isSelected ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800/50'}`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center mr-4 border ${isSelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                  </div>
                  <div className="flex-1 min-w-0 flex items-baseline justify-between gap-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white truncate">{word.hanzi}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{word.meaning_vi}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-6 mt-auto">
          <button 
            onClick={handleStartCustomSession}
            disabled={selectedIds.length === 0}
            className={`w-full py-4 text-lg font-bold rounded-2xl transition-all shadow-sm ${selectedIds.length > 0 ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
          >
            Bắt đầu ôn {selectedIds.length > 0 ? `(${selectedIds.length} từ)` : ''}
          </button>
        </div>
      </div>
    );
  };

  const renderPreSession = () => {
    if (showCustomPicker) return renderCustomPicker();

    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Bắt đầu Ôn tập</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8 text-sm">Hôm nay bạn muốn luyện tập thế nào?</p>
        
        <div className="space-y-4">
          <button onClick={() => startSession('due')} className="w-full flex items-center p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 transition-colors border border-blue-100 dark:border-blue-800/50">
            <span className="text-2xl mr-4">📚</span>
            <div className="text-left">
              <p className="font-bold">Ôn tập định kỳ</p>
              <p className="text-xs opacity-70">Các từ đã tới hạn ôn hoặc chưa thuộc</p>
            </div>
          </button>

          <button onClick={() => startSession('new')} className="w-full flex items-center p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 transition-colors border border-purple-100 dark:border-purple-800/50">
            <span className="text-2xl mr-4">✨</span>
            <div className="text-left">
              <p className="font-bold">Học từ mới</p>
              <p className="text-xs opacity-70">Chỉ duyệt các từ có trạng thái MỚI</p>
            </div>
          </button>

          <button onClick={() => startSession('learning')} className="w-full flex items-center p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300 transition-colors border border-orange-100 dark:border-orange-800/50">
            <span className="text-2xl mr-4">🔄</span>
            <div className="text-left">
              <p className="font-bold">Từ đang học</p>
              <p className="text-xs opacity-70">Luyện các từ bạn hay bấm "Quên"</p>
            </div>
          </button>

          {/* CHẾ ĐỘ CUSTOM TỰ CHỌN */}
          <button onClick={handleOpenCustomPicker} className="w-full flex items-center p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-300 transition-colors border border-teal-100 dark:border-teal-800/50">
            <span className="text-2xl mr-4">🎯</span>
            <div className="text-left">
              <p className="font-bold">Tự chọn từ</p>
              <p className="text-xs opacity-70">Lọc và đánh dấu các từ bạn muốn ôn</p>
            </div>
          </button>
        </div>
      </div>
    );
  };

  const renderSummary = () => (
    <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-3xl text-center border border-green-100 dark:border-green-800 max-w-lg mx-auto mt-10 shadow-sm animate-fade-in">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-800 text-green-500 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-2">Hoàn thành!</h2>
      <p className="text-green-700 dark:text-green-400 mb-8 font-medium">Bạn đã duyệt xong {totalItems} thẻ từ vựng.</p>
      
      {/* Bảng Thống kê */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/50">
          <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase mb-1">Quên</p>
          <p className="text-3xl font-black text-red-700 dark:text-red-400">{stats.forgot}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-orange-100 dark:border-orange-900/50">
          <p className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase mb-1">Mơ hồ</p>
          <p className="text-3xl font-black text-orange-700 dark:text-orange-400">{stats.vague}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-green-900/50">
          <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase mb-1">Nhớ</p>
          <p className="text-3xl font-black text-green-700 dark:text-green-400">{stats.remembered}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={handleFullResetSession} className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Chọn chế độ khác
        </button>
        <Link to="/vocabulary" className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm">
          Về Kho Từ
        </Link>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!isStarted) return renderPreSession();

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-24">
          <svg className="animate-spin h-10 w-10 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Đang chuẩn bị thẻ ôn tập...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-8 rounded-2xl text-center border border-red-100 dark:border-red-800 max-w-lg mx-auto mt-10">
          <h2 className="text-xl font-bold mb-2">Lỗi tải dữ liệu</h2>
          <p className="mb-6">{error.message}</p>
          <button onClick={retry} className="px-6 py-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-lg font-medium transition-colors">Thử lại</button>
        </div>
      );
    }

    if (isNoItems) {
      return (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-10 rounded-3xl text-center border border-gray-100 dark:border-gray-700 max-w-lg mx-auto mt-10">
          <span className="text-4xl mb-4 block">📭</span>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Không có từ vựng!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Bạn đã dọn sạch mục tiêu trong chế độ này. Hãy thử chế độ khác nhé.</p>
          <button onClick={handleFullResetSession} className="px-6 py-2 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-xl font-bold transition-colors">Quay lại</button>
        </div>
      );
    }

    if (isFinished || !currentItem) return renderSummary();

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <ReviewProgress current={currentIndex + 1} total={totalItems} />
        <ReviewCard 
          item={currentItem} 
          showAnswer={showAnswer} 
          onReveal={handleReveal} 
          onRate={handleRating} 
          isSubmitting={isSubmitting}
        />
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 pb-24 h-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">Ôn tập</h1>
      {renderContent()}
    </div>
  );
};

export default ReviewPage;