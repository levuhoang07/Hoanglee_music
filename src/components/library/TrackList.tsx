import React, { useState } from 'react';
import { Track } from '../../types/audio';
import { Playlist } from '../../types/library';
import { TrackItem } from './TrackItem';
import { Music2, FolderHeart, Sparkles, Loader2, Zap, Cloud } from 'lucide-react';
import { StorageMode } from '../../hooks/useLibrary';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  activePlaylist: Playlist | null;
  storageMode?: StorageMode;
  roomCode?: string;
  localTracksCount?: number;
  isSyncing?: boolean;
  onPlayTrack: (track: Track) => void;
  onDeleteTrack: (track: Track) => void;
  onOpenAddToPlaylist: (track: Track) => void;
  onRemoveFromPlaylist?: (trackId: string) => void;
  onLoadDemoTrack?: () => Promise<Track | null>;
  onSyncLocalToCloud?: () => void;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  activePlaylist,
  storageMode = 'cloud',
  roomCode = 'HOANGLEE',
  localTracksCount = 0,
  isSyncing = false,
  onPlayTrack,
  onDeleteTrack,
  onOpenAddToPlaylist,
  onRemoveFromPlaylist,
  onLoadDemoTrack,
  onSyncLocalToCloud,
}) => {
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);

  const handleGenerateDemo = async () => {
    if (!onLoadDemoTrack) return;
    setIsGeneratingDemo(true);
    try {
      const demo = await onLoadDemoTrack();
      if (demo) {
        onPlayTrack(demo);
      }
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-text-muted">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-text-secondary">
          {activePlaylist ? (
            <FolderHeart className="w-8 h-8 text-accent" />
          ) : storageMode === 'cloud' ? (
            <Cloud className="w-8 h-8 text-accent-cyan" />
          ) : (
            <Music2 className="w-8 h-8" />
          )}
        </div>
        <h4 className="text-base font-semibold text-text-primary">
          {activePlaylist
            ? `Playlist "${activePlaylist.name}" đang trống`
            : storageMode === 'cloud'
            ? `Phòng [${roomCode}] chưa có bài hát nào`
            : 'Thư viện chưa có bài hát'}
        </h4>
        <p className="text-xs text-text-muted max-w-sm mt-1">
          {activePlaylist
            ? 'Hãy thêm bài hát từ thư viện vào playlist này bằng biểu tượng dấu cộng.'
            : storageMode === 'cloud'
            ? 'Hãy kéo thả file nhạc lên phòng nghe hoặc bấm nút đồng bộ bài hát từ máy của bạn.'
            : 'Hãy kéo thả file MP3/WAV vào đây hoặc nghe thử ngay bản nhạc mẫu bên dưới.'}
        </p>

        {/* Sync Local Tracks to Room Button */}
        {storageMode === 'cloud' && localTracksCount > 0 && onSyncLocalToCloud && (
          <button
            onClick={onSyncLocalToCloud}
            disabled={isSyncing}
            className="mt-4 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 text-yellow-200" />
            )}
            <span>Đẩy {localTracksCount} bài hát từ máy vào phòng nghe ngay</span>
          </button>
        )}

        {!activePlaylist && onLoadDemoTrack && (
          <button
            onClick={handleGenerateDemo}
            disabled={isGeneratingDemo}
            className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-accent to-accent-cyan hover:brightness-110 shadow-md shadow-accent/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            {isGeneratingDemo ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Tạo & Nghe Thử Bản Nhạc Mẫu (Demo Beat)</span>
          </button>
        )}
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
          onRemoveFromActivePlaylist={onRemoveFromPlaylist}
        />
      ))}
    </div>
  );
};
