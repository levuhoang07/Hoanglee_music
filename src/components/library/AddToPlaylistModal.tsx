import React from 'react';
import { Modal } from '../common/Modal';
import { Track } from '../../types/audio';
import { Playlist } from '../../types/library';
import { Check, FolderPlus, Music } from 'lucide-react';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  playlists: Playlist[];
  onToggleTrackInPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  onOpenCreatePlaylist: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  track,
  playlists,
  onToggleTrackInPlaylist,
  onOpenCreatePlaylist,
}) => {
  if (!track) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm vào Playlist">
      <div className="space-y-4">
        {/* Track preview */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
            <Music className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary truncate">{track.title}</p>
            <p className="text-xs text-text-muted truncate">{track.artist}</p>
          </div>
        </div>

        {/* Playlist list */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {playlists.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-4">
              Bạn chưa có playlist nào. Hãy tạo mới một danh sách!
            </p>
          ) : (
            playlists.map((pl) => {
              const isIncluded = pl.trackIds.includes(track.id);
              return (
                <div
                  key={pl.id}
                  onClick={() => onToggleTrackInPlaylist(pl.id, track.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isIncluded
                      ? 'bg-accent/15 border border-accent/40 text-accent-cyan'
                      : 'hover:bg-white/5 border border-transparent text-text-primary'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{pl.name}</p>
                    <p className="text-xs text-text-muted">{pl.trackIds.length} bài hát</p>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      isIncluded ? 'bg-accent text-white' : 'border border-white/20 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Create new playlist shortcut */}
        <div className="pt-2 border-t border-white/10">
          <button
            onClick={() => {
              onClose();
              onOpenCreatePlaylist();
            }}
            className="w-full py-2.5 rounded-xl border border-dashed border-white/20 hover:border-accent hover:text-accent text-xs font-semibold text-text-secondary flex items-center justify-center gap-2 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Tạo Playlist Mới</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
