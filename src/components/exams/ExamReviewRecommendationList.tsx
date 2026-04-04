import React from 'react';
import { ReviewRecommendation } from '../../features/exams/types';
import { ExamReviewRecommendationEmptyState } from './ExamReviewRecommendationEmptyState';

interface Props {
  recommendations: ReviewRecommendation[];
}

export const ExamReviewRecommendationList: React.FC<Props> = ({ recommendations }) => {
  if (!recommendations.length) {
    return <ExamReviewRecommendationEmptyState />;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">
        Hành động đề xuất (Next steps)
      </h3>
      {recommendations.map(rec => (
        <div key={rec.id} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="mt-0.5 text-primary-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{rec.action_text}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{rec.rationale}</div>
          </div>
        </div>
      ))}
    </div>
  );
};