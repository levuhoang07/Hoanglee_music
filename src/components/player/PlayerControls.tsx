import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Loader2 } from 'lucide-react';
import { RepeatMode } from '../../types/audio';

interface PlayerControlsProps {
  isPlaying: boolean;
  isBuffering: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onCycleRepeat: () => void;
  onToggleShuffle: () => void;
  disabled?: boolean;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isBuffering,
  repeatMode,
  isShuffled,
  onTogglePlay,
  onNext,
  onPrev,
  onCycleRepeat,
  onToggleShuffle,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      {/* Shuffle Button */}
      <button
        onClick={onToggleShuffle}
        disabled={disabled}
        title={isShuffled ? 'Bật xáo trộn (Bật)' : 'Tắt xáo trộn'}
        className={`p-2 rounded-xl transition-all duration-200 ${
          isShuffled
            ? 'text-accent-cyan bg-accent-cyan/10 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
            : 'text-text-muted hover:text-text-primary hover:bg-white/5'
        }`}
      >
        <Shuffle className="w-4 h-4" />
      </button>

      {/* Previous Track */}
      <button
        onClick={onPrev}
        disabled={disabled}
        title="Bài trước (Shift+P hoặc lùi >3s)"
        className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-40"
      >
        <SkipBack className="w-5 h-5 fill-current" />
      </button>

      {/* Main Play / Pause Button */}
      <button
        onClick={onTogglePlay}
        disabled={disabled}
        title={isPlaying ? 'Tạm dừng (Space)' : 'Phát nhạc (Space)'}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-accent to-accent-violet hover:from-indigo-500 hover:to-violet-500 text-white flex items-center justify-center shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40"
      >
        {isBuffering ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-6 h-6 fill-current" />
        ) : (
          <Play className="w-6 h-6 fill-current ml-0.5" />
        )}
      </button>

      {/* Next Track */}
      <button
        onClick={onNext}
        disabled={disabled}
        title="Bài tiếp theo (Shift+N)"
        className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-40"
      >
        <SkipForward className="w-5 h-5 fill-current" />
      </button>

      {/* Repeat Mode */}
      <button
        onClick={onCycleRepeat}
        disabled={disabled}
        title={
          repeatMode === 'one'
            ? 'Lặp lại 1 bài'
            : repeatMode === 'all'
            ? 'Lặp lại toàn bộ danh sách'
            : 'Tắt lặp lại'
        }
        className={`p-2 rounded-xl transition-all duration-200 relative ${
          repeatMode !== 'off'
            ? 'text-accent bg-accent/10 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
            : 'text-text-muted hover:text-text-primary hover:bg-white/5'
        }`}
      >
        {repeatMode === 'one' ? (
          <Repeat1 className="w-4 h-4" />
        ) : (
          <Repeat className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
