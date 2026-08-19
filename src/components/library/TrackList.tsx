import React from 'react';
import { Track } from '../../types/audio';
import { Playlist } from '../../types/library';
import { TrackItem } from './TrackItem';
import { Music2, FolderHeart } from 'lucide-react';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  activePlaylist: Playlist | null;
  onPlayTrack: (track: Track) => void;
  onDeleteTrack: (trackId: string) => void;
  onOpenAddToPlaylist: (track: Track) => void;
  onRemoveFromPlaylist?: (trackId: string) => void;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  activePlaylist,
  onPlayTrack,
  onDeleteTrack,
  onOpenAddToPlaylist,
  onRemoveFromPlaylist,
}) => {
  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-text-muted">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-text-secondary">
          {activePlaylist ? <FolderHeart className="w-8 h-8 text-accent" /> : <Music2 className="w-8 h-8" />}
        </div>
        <h4 className="text-base font-semibold text-text-primary">
          {activePlaylist ? `Playlist "${activePlaylist.name}" đang trống` : 'Chưa có bài hát nào'}
        </h4>
        <p className="text-xs text-text-muted max-w-sm mt-1">
          {activePlaylist
            ? 'Hãy thêm bài hát từ thư viện vào playlist này bằng biểu tượng dấu cộng.'
            : 'Hãy kéo thả hoặc tải lên các bài hát từ máy cá nhân của bạn.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Header Info */}
      <div className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-text-muted border-b border-white/5 mb-2">
        <div className="flex items-center gap-2">
          <span>#</span>
          <span className="ml-5">TIÊU ĐỀ BÀI HÁT</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline">DUNG LƯỢNG</span>
          <span>THỜI LƯỢNG</span>
        </div>
      </div>

      {/* Track rows */}
      {tracks.map((track, index) => (
        <TrackItem
          key={track.id}
          track={track}
          index={index}
          isCurrent={currentTrack?.id === track.id}
          isPlaying={isPlaying}
          onPlay={onPlayTrack}
          onDelete={onDeleteTrack}
          onOpenAddToPlaylist={onOpenAddToPlaylist}
          onRemoveFromActivePlaylist={activePlaylist ? onRemoveFromPlaylist : undefined}
        />
      ))}
    </div>
  );
};
