import React from 'react';
import { Track } from '../../types/audio';
import { formatTime, formatFileSize } from '../../utils/formatters';
import { Play, Trash2, ListPlus, Volume2 } from 'lucide-react';

interface TrackItemProps {
  track: Track;
  index: number;
  isCurrent: boolean;
  isPlaying: boolean;
  canDelete?: boolean;
  onPlay: (track: Track) => void;
  onDelete: (track: Track) => void;
  onOpenAddToPlaylist: (track: Track) => void;
  onRemoveFromActivePlaylist?: (trackId: string) => void;
}

export const TrackItem: React.FC<TrackItemProps> = ({
  track,
  index,
  isCurrent,
  isPlaying,
  canDelete = true,
  onPlay,
  onDelete,
  onOpenAddToPlaylist,
  onRemoveFromActivePlaylist,
}) => {
  return (
    <div
      onClick={() => onPlay(track)}
      className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
        isCurrent
          ? 'bg-accent/15 border border-accent/30 shadow-sm'
          : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      {/* Left: Index & Title */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Play State / Number */}
        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
          {isCurrent && isPlaying ? (
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-1 bg-accent-cyan rounded-full sound-wave-bar h-full" style={{ animationDuration: '0.6s' }} />
              <span className="w-1 bg-accent rounded-full sound-wave-bar h-full" style={{ animationDuration: '0.9s' }} />
              <span className="w-1 bg-accent-violet rounded-full sound-wave-bar h-full" style={{ animationDuration: '0.7s' }} />
            </div>
          ) : isCurrent ? (
            <Volume2 className="w-4 h-4 text-accent" />
          ) : (
            <>
              <span className="text-xs font-mono text-text-muted group-hover:hidden">
                {index + 1}
              </span>
              <Play className="w-3.5 h-3.5 text-text-primary hidden group-hover:block fill-current" />
            </>
          )}
        </div>

        {/* Track Title & Artist */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-semibold truncate ${
              isCurrent ? 'text-accent-cyan' : 'text-text-primary group-hover:text-white'
            }`}
          >
            {track.title}
          </p>
          <p className="text-xs text-text-secondary truncate mt-0.5">
            {track.artist}
          </p>
        </div>
      </div>

      {/* Right: Metadata & Actions */}
      <div className="flex items-center gap-4 text-xs text-text-muted flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* File Size */}
        <span className="hidden sm:inline-block font-mono text-[11px] opacity-70">
          {formatFileSize(track.fileSize)}
        </span>

        {/* Duration */}
        <span className="font-mono text-xs text-text-secondary min-w-[36px] text-right">
          {formatTime(track.duration)}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Add to playlist button */}
          <button
            onClick={() => onOpenAddToPlaylist(track)}
            title="Thêm vào playlist"
            className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
          >
            <ListPlus className="w-4 h-4" />
          </button>

          {/* If inside a playlist view, option to remove from this playlist */}
          {onRemoveFromActivePlaylist && (
            <button
              onClick={() => onRemoveFromActivePlaylist(track.id)}
              title="Xóa khỏi playlist này"
              className="p-1.5 rounded-lg text-text-secondary hover:text-amber-400 hover:bg-white/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Delete from library (Only if permitted) */}
          {!onRemoveFromActivePlaylist && canDelete && (
            <button
              onClick={() => onDelete(track)}
              title="Xóa bài hát khỏi thư viện"
              className="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-white/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
