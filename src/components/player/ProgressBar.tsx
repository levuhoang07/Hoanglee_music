import React, { useState, useRef } from 'react';
import { formatTime } from '../../utils/formatters';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  disabled?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const displayTime = isDragging ? dragValue : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setDragValue(val);
  };

  const handleSeekStart = () => {
    setIsDragging(true);
    setDragValue(currentTime);
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setIsDragging(false);
    const target = e.target as HTMLInputElement;
    const val = parseFloat(target.value);
    onSeek(val);
  };

  return (
    <div className="w-full flex items-center gap-3 select-none">
      {/* Current Time */}
      <span className="text-xs font-mono text-text-muted min-w-[36px] text-right">
        {formatTime(displayTime)}
      </span>

      {/* Interactive Bar */}
      <div className="relative flex-1 group py-2" ref={progressRef}>
        {/* Background Track */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden group-hover:h-2 transition-all">
          {/* Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-cyan rounded-full transition-all duration-75 group-hover:brightness-125"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        {/* Real Range Input */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={displayTime}
          disabled={disabled || !duration}
          onChange={handleSeekChange}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onTouchStart={handleSeekStart}
          onTouchEnd={handleSeekEnd}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>

      {/* Duration */}
      <span className="text-xs font-mono text-text-muted min-w-[36px]">
        {formatTime(duration)}
      </span>
    </div>
  );
};
