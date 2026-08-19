import React from 'react';
import {
  Search,
  UploadCloud,
  Menu,
  ArrowUp,
  ArrowDown,
  Cloud,
  HardDrive,
  Users,
  User,
  LogOut,
  Settings,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { LibraryState } from '../../types/library';
import { StorageMode } from '../../hooks/useLibrary';

interface HeaderProps {
  title: string;
  searchQuery: string;
  sortBy: LibraryState['sortBy'];
  sortOrder: LibraryState['sortOrder'];
  storageMode: StorageMode;
  roomCode: string;
  user: any | null;
  localTracksCount?: number;
  isSyncing?: boolean;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: LibraryState['sortBy']) => void;
  onToggleStorageMode: (mode: StorageMode) => void;
  onOpenUpload: () => void;
  onOpenAuth: () => void;
  onOpenRoom: () => void;
  onOpenCloudSettings: () => void;
  onSignOut: () => void;
  onSyncLocalToCloud?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  searchQuery,
  sortBy,
  sortOrder,
  storageMode,
  roomCode,
  user,
  localTracksCount = 0,
  isSyncing = false,
  onSearchChange,
  onSortChange,
  onToggleStorageMode,
  onOpenUpload,
  onOpenAuth,
  onOpenRoom,
  onOpenCloudSettings,
  onSignOut,
  onSyncLocalToCloud,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="h-16 border-b border-white/5 px-4 sm:px-6 flex items-center justify-between gap-3 bg-background/60 backdrop-blur-md z-20">
      {/* Left: Mobile Toggle & Storage Mode Switcher */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <h2 className="hidden xl:block text-sm font-bold text-text-primary tracking-tight truncate max-w-[180px]">
          {title}
        </h2>

        {/* Mode Switcher Pill */}
        <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold">
          <button
            onClick={() => onToggleStorageMode('local')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              storageMode === 'local'
                ? 'bg-accent text-white shadow-sm'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Máy Của Tôi</span>
          </button>

          <button
            onClick={() => onToggleStorageMode('cloud')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
              storageMode === 'cloud'
                ? 'bg-gradient-to-r from-accent to-accent-cyan text-white shadow-sm'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Đám Mây Nhóm</span>
          </button>
        </div>

        {/* Room Code Badge (when in cloud mode) */}
        {storageMode === 'cloud' && (
          <button
            onClick={onOpenRoom}
            title="Nhấp để đổi phòng hoặc chia sẻ mã cho bạn bè"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-accent/15 border border-accent/30 text-accent-cyan font-mono text-xs font-bold hover:bg-accent/25 transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Phòng: {roomCode}</span>
          </button>
        )}

        {/* Quick Sync Button (Pushes local tracks into cloud room) */}
        {localTracksCount > 0 && onSyncLocalToCloud && (
          <button
            onClick={onSyncLocalToCloud}
            disabled={isSyncing}
            title="Đẩy tất cả bài hát từ máy lên phòng nghe để bạn bè cùng nghe"
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition-all disabled:opacity-50"
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Đẩy {localTracksCount} bài lên phòng</span>
          </button>
        )}
      </div>

      {/* Right: Search, Actions, Account */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Search Bar */}
        <div className="relative hidden md:block w-40 lg:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm bài hát..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
        </div>

        {/* Sort Button */}
        <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 text-xs text-text-secondary">
          <button
            onClick={() => onSortChange('addedAt')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              sortBy === 'addedAt' ? 'bg-accent text-white font-medium' : 'hover:text-white'
            }`}
          >
            <span>Mới</span>
            {sortBy === 'addedAt' && (
              sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="glass-button px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-accent to-accent-violet hover:from-indigo-500 hover:to-violet-500 flex items-center gap-1.5 shadow-md shadow-accent/20"
        >
          <UploadCloud className="w-4 h-4" />
          <span className="hidden sm:inline">{storageMode === 'cloud' ? 'Tải Lên Phòng' : 'Thêm Nhạc'}</span>
        </button>

        {/* User Account / Login Button */}
        {user ? (
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
            <div className="px-2 py-1 font-semibold text-text-primary flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="max-w-[80px] sm:max-w-[120px] truncate">
                {user.displayName || user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
            </div>
            <button
              onClick={onSignOut}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="glass-button px-3 py-1.5 rounded-xl text-xs font-semibold text-text-primary hover:text-white flex items-center gap-1.5 border border-white/15"
          >
            <User className="w-3.5 h-3.5 text-accent" />
            <span>Đăng Nhập</span>
          </button>
        )}

        {/* Cloud Config Gear */}
        <button
          onClick={onOpenCloudSettings}
          title="Cài đặt kết nối Supabase Cloud"
          className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
