import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  hoverable = false,
  ...props 
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm transition-all duration-200 overflow-hidden';
  const paddingClasses = noPadding ? '' : 'p-5 md:p-6';
  const hoverClasses = hoverable ? 'hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800/50 hover:-translate-y-0.5' : '';

  return (
    <div className={`${baseClasses} ${paddingClasses} ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};