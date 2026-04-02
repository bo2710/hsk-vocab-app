import React from 'react';
import { VocabularyItem, ReviewRating } from '../../types/models';
import { PronounceButton } from '../ui/PronounceButton';
import { Button } from '../ui/Button';

interface ReviewCardProps {
  item: VocabularyItem;
  showAnswer: boolean;
  onReveal: () => void;
  onRate: (rating: ReviewRating) => void;
  isSubmitting: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  item,
  showAnswer,
  onReveal,
  onRate,
  isSubmitting
}) => {
  return (
    <div className="relative w-full max-w-lg mx-auto min-h-[450px] [perspective:1000px]">
      <div 
        className={`w-full h-full min-h-[450px] transition-all duration-500 [transform-style:preserve-3d] ${showAnswer ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* MẶT TRƯỚC (CÂU HỎI) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col border border-gray-100 dark:border-gray-700">
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold text-gray-500 dark:text-gray-400">
              HSK {item.hsk_level || '?'}
            </span>
            <h2 className="text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              {item.hanzi}
            </h2>
            <PronounceButton text={item.hanzi} size="lg" />
          </div>

          <div className="mt-auto pt-8">
            <Button 
              onClick={onReveal} 
              variant="primary" 
              className="w-full py-4 text-lg font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              Xem đáp án
            </Button>
          </div>
        </div>

        {/* MẶT SAU (ĐÁP ÁN) */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col border border-gray-100 dark:border-gray-700">
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div>
              <p className="text-3xl text-primary-600 dark:text-primary-400 font-bold tracking-widest mb-4">
                {item.pinyin}
              </p>
              <p className="text-4xl text-gray-800 dark:text-gray-200 font-medium mb-2">
                {item.meaning_vi}
              </p>
              {item.han_viet && (
                <p className="text-lg text-gray-500 dark:text-gray-400">Hán Việt: {item.han_viet}</p>
              )}
            </div>
          </div>

          {/* Các nút đánh giá nằm sát dưới cùng */}
          <div className="grid grid-cols-3 gap-3 pt-6 mt-auto">
            <button
              disabled={isSubmitting}
              onClick={() => onRate('forgot')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              <span className="font-bold">Quên</span>
              <span className="text-[10px] opacity-70 mt-1">Học lại ngay</span>
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => onRate('vague')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
            >
              <span className="font-bold">Mơ hồ</span>
              <span className="text-[10px] opacity-70 mt-1">Sắp ôn lại</span>
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => onRate('remembered')}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
            >
              <span className="font-bold">Nhớ</span>
              <span className="text-[10px] opacity-70 mt-1">Lên cấp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};