import React from 'react';
import { AggregateMistakeInsight } from '../../features/exams/types';

interface Props {
  insight: AggregateMistakeInsight;
}

export const ExamMistakeInsightCard: React.FC<Props> = ({ insight }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-300';
      case 'medium': return 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-300';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-300';
      default: return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'section_weakness':
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        );
      case 'time_management':
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'unanswered':
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${getSeverityStyles(insight.severity)} shadow-sm transition-all`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 opacity-80">
          {getIcon(insight.insight_type)}
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide opacity-90 mb-1">{insight.title}</h4>
          <p className="text-sm leading-relaxed opacity-80">{insight.description}</p>
        </div>
      </div>
    </div>
  );
};