import React from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <div className="flex items-center gap-2 group">
      <button
        onClick={onToggleMute}
        title={isMuted ? 'Bật âm thanh (M)' : 'Tắt tiếng (M)'}
        className="p-1.5 text-text-secondary hover:text-white rounded-lg transition-colors"
      >
        {effectiveVolume === 0 ? (
          <VolumeX className="w-5 h-5 text-red-400" />
        ) : effectiveVolume < 0.5 ? (
          <Volume1 className="w-5 h-5 text-text-secondary" />
        ) : (
          <Volume2 className="w-5 h-5 text-text-secondary" />
        )}
      </button>

      <div className="relative w-20 sm:w-28 flex items-center">
        {/* Track bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full group-hover:bg-accent-cyan transition-colors"
            style={{ width: `${effectiveVolume * 100}%` }}
          />
        </div>

        {/* Input */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={effectiveVolume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <span className="text-xs font-mono text-text-muted min-w-[28px] text-right">
        {Math.round(effectiveVolume * 100)}%
      </span>
    </div>
  );
};
