import React from 'react';
import { PlaybackStatus } from '../../features/audio/types';

interface AudioPlayButtonProps {
  onClick: (e: React.MouseEvent) => void;
  status: PlaybackStatus;
  supported: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AudioPlayButton: React.FC<AudioPlayButtonProps> = ({
  onClick, status, supported, size = 'md', className = ''
}) => {
  if (!supported) return null;

  const isPlayingOrResolving = status === 'playing' || status === 'resolving';

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2.5',
    lg: 'p-3.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <button
      onClick={onClick}
      disabled={isPlayingOrResolving}
      className={`rounded-full transition-all duration-300 flex items-center justify-center shrink-0 ${
        status === 'playing'
          ? 'bg-primary-100 text-primary-600 scale-110 shadow-sm dark:bg-primary-900/40 dark:text-primary-400'
          : status === 'resolving'
          ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-wait'
          : status === 'error'
          ? 'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
          : 'bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-400'
      } ${sizeClasses[size]} ${className}`}
      title="Phát âm thanh"
      aria-label="Play audio"
    >
      {status === 'resolving' ? (
        <svg className={`animate-spin ${iconSizes[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : status === 'error' ? (
         <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
      ) : (
        <svg
          className={`${iconSizes[size]} ${status === 'playing' ? 'animate-pulse' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
};