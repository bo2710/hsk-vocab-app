// filepath: src/components/vocabulary/VocabularyCard.tsx
import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { VocabularyItem } from '../../types/models';
import { PronounceButton } from '../ui/PronounceButton';
import { deleteVocabularyWord } from '../../features/vocabulary/services/vocabularyEditService';

interface VocabularyCardProps {
  item: VocabularyItem;
  // Props cho chế độ chọn nhiều
  isSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

const VocabularyCardComponent: React.FC<VocabularyCardProps> = ({ 
  item, 
  isSelectMode = false, 
  isSelected = false, 
  onToggleSelect 
}) => {
  const navigate = useNavigate();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Nếu đang ở chế độ chọn, click vào card sẽ đánh dấu/bỏ đánh dấu
    if (isSelectMode) {
      onToggleSelect?.();
      return;
    }

    // Nếu không, click bình thường sẽ chuyển sang trang chi tiết (bỏ qua nếu bấm vào nút phát âm)
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/vocabulary/${item.id}`);
  };

  const handleQuickDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn xóa nhanh từ "${item.hanzi}" không?`)) {
      setIsDeleting(true);
      try {
        await deleteVocabularyWord(item.id);
        setIsDeleted(true); 
      } catch (err) {
        alert('Xóa thất bại! Vui lòng thử lại.');
        setIsDeleting(false);
      }
    }
  };

  const renderStatusBadge = () => {
    const statusMap = {
      'new': { label: 'MỚI', classes: 'bg-red-500 text-white animate-pulse shadow-sm' },
      'learning': { label: 'ĐANG HỌC', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
      'reviewing': { label: 'CẦN ÔN', classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' },
      'mastered': { label: 'ĐÃ THUỘC', classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
    };
    
    const config = statusMap[item.status as keyof typeof statusMap] || { label: 'KHÁC', classes: 'bg-gray-100 text-gray-500' };

    return (
      <div className={`absolute top-0 left-0 text-[10px] font-bold px-2 py-0.5 rounded-br-lg z-10 ${config.classes}`}>
        {config.label}
      </div>
    );
  };

  if (isDeleted) return null;

  return (
    <div 
      onClick={handleCardClick}
      className={`rounded-lg shadow-sm p-4 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full ${
        isDeleting ? 'opacity-50 pointer-events-none' : ''
      } ${
        isSelected 
          ? 'bg-primary-50 border-2 border-primary-500 dark:bg-primary-900/30' 
          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:border-gray-600'
      }`}
    >
      {/* CHECKBOX DÀNH CHO MULTI-SELECT */}
      {isSelectMode && (
        <div className="absolute top-3 right-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer pointer-events-none bg-white dark:bg-gray-900"
          />
        </div>
      )}

      {renderStatusBadge()}

      {/* NÚT XÓA NHANH (Ẩn đi khi đang bật chế độ chọn nhiều) */}
      {!isSelectMode && (
        <button 
          onClick={handleQuickDelete}
          className="absolute top-3 right-3 p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded opacity-0 group-hover:opacity-100 transition-all"
          title="Xóa nhanh"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      )}

      <div className="flex justify-between items-start mb-2 pr-8 mt-3">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {item.hanzi}
          </h3>
          <PronounceButton text={item.hanzi} size="sm" />
        </div>
        
        {/* V2 METADATA BADGES - Hiển thị gọn gàng */}
        <div className="flex flex-col items-end gap-1">
          {item.hsk_level ? (
             <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
               HSK {item.hsk_level}
             </span>
          ) : null}
          {item.hsk30_level ? (
             <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-800">
               v3: L{item.hsk30_level}
             </span>
          ) : (
            item.hsk20_level ? (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-800">
                v2: L{item.hsk20_level}
              </span>
            ) : null
          )}
        </div>
      </div>
      
      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">{item.pinyin}</p>
      <p className="text-gray-800 dark:text-gray-200 font-medium mb-3 line-clamp-1 flex-1" title={item.meaning_vi}>{item.meaning_vi}</p>
      
      <div className="flex justify-between items-end mt-2">
        <div className="flex flex-wrap gap-1 flex-1">
          {item.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              #{tag}
            </span>
          ))}
          {/* Scope Indicator */}
          {item.source_scope === 'public' && (
             <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" title="Từ vựng công cộng">
               🌍 Public
             </span>
          )}
        </div>
        {(item.encounter_count || 0) > 0 && (
          <div className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center ml-2 whitespace-nowrap" title="Số lần gặp">
            <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            {item.encounter_count}
          </div>
        )}
      </div>
    </div>
  );
};

export const VocabularyCard = memo(VocabularyCardComponent, (prevProps, nextProps) => {
  // RẤT QUAN TRỌNG: Component memo phải check thêm prop isSelectMode và isSelected
  // Nếu không nó sẽ không đổi mầu thẻ sang mầu xanh/đánh dấu checkbox khi người dùng click
  return prevProps.item.id === nextProps.item.id && 
         prevProps.item.updated_at === nextProps.item.updated_at &&
         prevProps.item.status === nextProps.item.status &&
         prevProps.isSelectMode === nextProps.isSelectMode &&
         prevProps.isSelected === nextProps.isSelected;
});