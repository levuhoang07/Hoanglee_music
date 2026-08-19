import React from 'react';
import { Track } from '../../types/audio';
import { Playlist } from '../../types/library';
import { VisualStage } from '../visual/VisualStage';
import { TrackList } from '../library/TrackList';
import { UploadDropzone } from '../library/UploadDropzone';

interface MainStageProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
  activePlaylist: Playlist | null;
  onPlayTrack: (track: Track) => void;
  onDeleteTrack: (trackId: string) => void;
  onImportFiles: (files: FileList | File[]) => Promise<{ count: number }>;
  onOpenAddToPlaylist: (track: Track) => void;
  onRemoveFromPlaylist?: (trackId: string) => void;
  onLoadDemoTrack?: () => Promise<Track | null>;
}

export const MainStage: React.FC<MainStageProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  isBuffering,
  activePlaylist,
  onPlayTrack,
  onDeleteTrack,
  onImportFiles,
  onOpenAddToPlaylist,
  onRemoveFromPlaylist,
  onLoadDemoTrack,
}) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Visual Animation Stage */}
      <VisualStage
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
      />

      {/* Library Area */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              {activePlaylist ? `Danh sách: ${activePlaylist.name}` : 'Danh Sách Bài Hát Cá Nhân'}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {tracks.length} bài hát • Lưu trữ an toàn trong IndexedDB
            </p>
          </div>

          <UploadDropzone onImportFiles={onImportFiles} compact />
        </div>

        {/* Track List */}
        <TrackList
          tracks={tracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          activePlaylist={activePlaylist}
          onPlayTrack={onPlayTrack}
          onDeleteTrack={onDeleteTrack}
          onOpenAddToPlaylist={onOpenAddToPlaylist}
          onRemoveFromPlaylist={onRemoveFromPlaylist}
          onLoadDemoTrack={onLoadDemoTrack}
        />
      </div>
    </main>
  );
};
