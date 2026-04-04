import React from 'react';
import { useAudioPlayback } from '../../features/audio/hooks/useAudioPlayback';
import { AudioPlayButton } from './AudioPlayButton';
import { ContextAudioRequest, WordAudioRequest } from '../../features/audio/types';

interface InlineAudioPlayerProps {
  type: 'word' | 'context';
  request: WordAudioRequest | ContextAudioRequest;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InlineAudioPlayer: React.FC<InlineAudioPlayerProps> = ({ 
  type, request, size = 'sm', className = '' 
}) => {
  const { playWord, playContext, status, supported } = useAudioPlayback();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'word') {
      playWord(request as WordAudioRequest);
    } else {
      playContext(request as ContextAudioRequest);
    }
  };

  return (
    <AudioPlayButton
      onClick={handlePlay}
      status={status}
      supported={supported}
      size={size}
      className={className}
    />
  );
};