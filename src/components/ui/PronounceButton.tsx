import React, { memo } from 'react';
import { useSpeechSynthesis } from '../../lib/speech/useSpeechSynthesis';

interface PronounceButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PronounceButtonComponent: React.FC<PronounceButtonProps> = ({
  text,
  size = 'md',
  className = '',
}) => {
  const { speak, isSpeaking, supported } = useSpeechSynthesis();

  if (!supported) return null;

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      disabled={isSpeaking}
      className={`rounded-full transition-all duration-200 ${
        isSpeaking 
          ? 'bg-blue-100 text-blue-600 scale-110 shadow-sm' 
          : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500'
      } ${sizeClasses[size]} ${className}`}
      title="Phát âm"
      aria-label="Pronounce"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${iconSizes[size]} ${isSpeaking ? 'animate-pulse' : ''}`}
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    </button>
  );
};

export const PronounceButton = memo(PronounceButtonComponent);