import React from 'react';
import { Playlist } from '../../types/library';
import {
  Music,
  ListMusic,
  Plus,
  Trash2,
  Edit2,
  HardDrive,
  Cloud,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  playlists: Playlist[];
  activePlaylistId: string | null;
  totalTracksCount: number;
  onSelectPlaylist: (playlistId: string | null) => void;
  onOpenCreatePlaylist: () => void;
  onOpenEditPlaylist: (playlist: Playlist) => void;
  onDeletePlaylist: (playlistId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  playlists,
  activePlaylistId,
  totalTracksCount,
  onSelectPlaylist,
  onOpenCreatePlaylist,
  onOpenEditPlaylist,
  onDeletePlaylist,
}) => {
  return (
    <aside className="w-64 lg:w-72 bg-background-sidebar border-r border-white/5 flex flex-col justify-between h-full p-4 select-none">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-accent-cyan flex items-center justify-center text-white shadow-lg shadow-accent/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-1.5">
              AuraTunes
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-accent/20 text-accent-cyan border border-accent/30">
                MVP
              </span>
            </h1>
            <p className="text-[11px] text-text-muted">Trình nghe nhạc cá nhân</p>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-text-muted tracking-wider uppercase px-3 py-1">
            Thư Viện
          </p>

          <button
            onClick={() => onSelectPlaylist(null)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activePlaylistId === null
                ? 'bg-accent/20 text-accent-cyan font-semibold border border-accent/30'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Music className="w-4 h-4" />
              <span>Tất cả bài hát</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 text-text-muted">
              {totalTracksCount}
            </span>
          </button>
        </div>

        {/* Playlists Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 py-1">
            <p className="text-[11px] font-bold text-text-muted tracking-wider uppercase">
              Playlist Cá Nhân
            </p>
            <button
              onClick={onOpenCreatePlaylist}
              title="Tạo playlist mới"
              className="p-1 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4 text-accent" />
            </button>
          </div>

          <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
            {playlists.length === 0 ? (
              <p className="text-xs text-text-muted/60 px-3 py-2 italic">
                Chưa có playlist nào. Hãy bấm dấu + để tạo.
              </p>
            ) : (
              playlists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => onSelectPlaylist(pl.id)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activePlaylistId === pl.id
                      ? 'bg-accent/20 text-accent-cyan font-semibold border border-accent/30'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <ListMusic className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{pl.name}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditPlaylist(pl);
                      }}
                      title="Sửa tên playlist"
                      className="p-1 text-text-muted hover:text-white rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Xóa playlist "${pl.name}"?`)) {
                          onDeletePlaylist(pl.id);
                        }
                      }}
                      title="Xóa playlist"
                      className="p-1 text-text-muted hover:text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Future Integrations / Storage Info */}
        <div className="space-y-1 pt-2 border-t border-white/5">
          <p className="text-[11px] font-bold text-text-muted tracking-wider uppercase px-3 py-1">
            Nguồn Âm Thanh
          </p>

          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 text-xs text-text-secondary">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <div className="min-w-0">
              <p className="font-semibold text-text-primary">Bộ nhớ Trình duyệt</p>
              <p className="text-[11px] text-text-muted">IndexedDB • Local First</p>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center gap-3 text-xs text-text-muted opacity-70">
            <Cloud className="w-4 h-4 text-accent" />
            <div className="min-w-0">
              <p className="font-semibold">Google Drive Picker</p>
              <p className="text-[10px] text-accent font-medium">Sẵn sàng cắm Adapter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-white/5 px-2 text-[11px] text-text-muted flex items-center justify-between">
        <span>Bản quyền cá nhân</span>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-text-secondary">
          v0.1.0-mvp
        </span>
      </div>
    </aside>
  );
};
