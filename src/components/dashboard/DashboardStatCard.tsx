import React from 'react';
import { Card } from '../ui/Card';

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  delay?: number; // for staggered animation
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({ 
  title, 
  value, 
  icon, 
  colorClass, 
  bgClass,
  delay = 0
}) => {
  return (
    <Card 
      className={`animate-slide-up hoverable border-l-4 ${colorClass.replace('text-', 'border-l-')}`} 
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`p-3.5 rounded-2xl ${bgClass} ${colorClass}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};