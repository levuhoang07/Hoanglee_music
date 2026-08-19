import React from 'react';
import { Track, RepeatMode } from '../../types/audio';
import { TrackInfo } from '../player/TrackInfo';
import { PlayerControls } from '../player/PlayerControls';
import { ProgressBar } from '../player/ProgressBar';
import { VolumeControl } from '../player/VolumeControl';
import { Keyboard } from 'lucide-react';

interface BottomBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onCycleRepeat: () => void;
  onToggleShuffle: () => void;
  onOpenShortcuts: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  currentTrack,
  isPlaying,
  isBuffering,
  currentTime,
  duration,
  volume,
  isMuted,
  repeatMode,
  isShuffled,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onCycleRepeat,
  onToggleShuffle,
  onOpenShortcuts,
}) => {
  return (
    <footer className="h-24 bg-background-card/90 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4 select-none z-30">
      {/* Left: Track Information */}
      <div className="w-1/4 min-w-[160px] max-w-[280px]">
        <TrackInfo currentTrack={currentTrack} isPlaying={isPlaying} />
      </div>

      {/* Center: Controls & Timeline Bar */}
      <div className="flex-1 max-w-2xl flex flex-col items-center gap-1.5">
        <PlayerControls
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          repeatMode={repeatMode}
          isShuffled={isShuffled}
          onTogglePlay={onTogglePlay}
          onNext={onNext}
          onPrev={onPrev}
          onCycleRepeat={onCycleRepeat}
          onToggleShuffle={onToggleShuffle}
          disabled={!currentTrack}
        />
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          disabled={!currentTrack}
        />
      </div>

      {/* Right: Volume & Shortcuts */}
      <div className="w-1/4 min-w-[160px] max-w-[280px] flex items-center justify-end gap-3">
        <button
          onClick={onOpenShortcuts}
          title="Phím tắt điều khiển"
          className="hidden md:flex p-2 text-text-muted hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />
      </div>
    </footer>
  );
};
