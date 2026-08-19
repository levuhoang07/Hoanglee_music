import React from 'react';
import { Track } from '../../types/audio';
import { Music, Disc } from 'lucide-react';

interface TrackInfoProps {
  currentTrack: Track | null;
  isPlaying: boolean;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ currentTrack, isPlaying }) => {
  if (!currentTrack) {
    return (
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted flex-shrink-0">
          <Music className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-muted truncate">Chưa chọn bài hát</p>
          <p className="text-xs text-text-muted/60 truncate">Chọn từ danh sách để phát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3.5 min-w-0">
      {/* Vinyl / Cover Art Thumbnail with rotation effect */}
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-tr from-accent/30 to-accent-cyan/30 border border-white/10 flex items-center justify-center text-accent-cyan flex-shrink-0 shadow-md ${
          isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
        }`}
      >
        <Disc className="w-6 h-6" />
      </div>

      {/* Title & Artist */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-text-primary truncate tracking-tight hover:text-accent transition-colors">
          {currentTrack.title}
        </p>
        <p className="text-xs text-text-secondary truncate mt-0.5">
          {currentTrack.artist}
        </p>
      </div>
    </div>
  );
};
