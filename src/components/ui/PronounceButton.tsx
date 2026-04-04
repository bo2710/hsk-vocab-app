import React, { memo } from 'react';
import { InlineAudioPlayer } from '../audio/InlineAudioPlayer';

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
  // Được tái cấu trúc để dùng InlineAudioPlayer, 
  // đảm bảo tương thích ngược cho những nơi đang dùng PronounceButton cũ
  return (
    <InlineAudioPlayer 
      type="word"
      request={{ text }}
      size={size}
      className={className}
    />
  );
};

export const PronounceButton = memo(PronounceButtonComponent);