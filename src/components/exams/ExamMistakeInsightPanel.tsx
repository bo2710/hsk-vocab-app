import React, { useState } from 'react';
import { AggregateMistakeInsight, ReviewRecommendation } from '../../features/exams/types';
import { ExamMistakeInsightCard } from './ExamMistakeInsightCard';
import { ExamReviewRecommendationList } from './ExamReviewRecommendationList';

interface Props {
  insights: AggregateMistakeInsight[];
  recommendations: ReviewRecommendation[];
  isLoading: boolean;
  error: string | null;
}

export const ExamMistakeInsightPanel: React.FC<Props> = ({ insights, recommendations, isLoading, error }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="mb-8 p-6 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <svg className="animate-spin h-6 w-6 text-primary-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm text-gray-500 dark:text-gray-400">Đang phân tích bài làm...</span>
      </div>
    );
  }

  if (error) {
    return null; // Gracefully hide the panel if insight fails, keep review usable
  }

  // If no insights and no recommendations, just hide it
  if (!insights.length && !recommendations.length) return null;

  return (
    <div className="mb-8 border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl overflow-hidden transition-all shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-indigo-100/50 dark:hover:bg-indigo-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <span className="font-bold text-indigo-800 dark:text-indigo-300">Phân tích chuyên sâu (Insights & Recommendations)</span>
          <span className="ml-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Beta
          </span>
        </div>
        <svg className={`w-5 h-5 text-indigo-600 dark:text-indigo-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4 md:p-6 border-t border-indigo-200/50 dark:border-indigo-800/30 bg-white/70 dark:bg-gray-900/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cột Insights */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">
                Lỗi thường gặp
              </h3>
              {insights.length > 0 ? (
                insights.map(insight => (
                  <ExamMistakeInsightCard key={insight.id} insight={insight} />
                ))
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
                  Chưa phát hiện lỗi sai hệ thống.
                </div>
              )}
            </div>

            {/* Cột Recommendations */}
            <div>
              <ExamReviewRecommendationList recommendations={recommendations} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};