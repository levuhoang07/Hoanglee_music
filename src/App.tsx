import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useLibrary } from './hooks/useLibrary';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MainStage } from './components/layout/MainStage';
import { BottomBar } from './components/layout/BottomBar';
import { PlaylistModal } from './components/library/PlaylistModal';
import { AddToPlaylistModal } from './components/library/AddToPlaylistModal';
import { DeleteConfirmModal } from './components/library/DeleteConfirmModal';
import { AuthModal } from './components/auth/AuthModal';
import { RoomModal } from './components/auth/RoomModal';
import { CloudSettingsModal } from './components/auth/CloudSettingsModal';
import { Modal } from './components/common/Modal';
import { UploadDropzone } from './components/library/UploadDropzone';
import { Track } from './types/audio';
import { Playlist } from './types/library';
import { AlertCircle, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

export function App() {
  const {
    user,
    profile,
    roomCode,
    isConfigured: isCloudConfigured,
    signIn,
    signUp,
    signOut,
    joinRoom,
    refreshAuth,
  } = useAuth();

  const {
    tracks,
    playlists,
    storageMode,
    setStorageMode,
    activePlaylist,
    activePlaylistId,
    currentViewTracks,
    searchQuery,
    sortBy,
    sortOrder,
    importFiles,
    loadDemoTrack,
    deleteTrack,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    setActivePlaylistId,
    setSearchQuery,
    setSortBy,
    refreshLibrary,
  } = useLibrary(roomCode, profile);

  const {
    currentTrack,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    error,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    cycleRepeatMode,
    toggleShuffle,
    handleTrackDeleted,
  } = useAudioPlayer(currentViewTracks);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    togglePlay,
    seek,
    currentTime,
    duration,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    toggleMute,
  });

  // Modal States
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [trackToAddToPlaylist, setTrackToAddToPlaylist] = useState<Track | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Cloud & Auth Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isCloudSettingsOpen, setIsCloudSettingsOpen] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast['type'], title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Tự động chuyển sang chế độ Đám Mây khi đăng nhập để thấy ngay bài hát trong phòng
  useEffect(() => {
    if (user) {
      setStorageMode('cloud');
    }
  }, [user, setStorageMode]);

  // Handlers for Playlist Modals
  const handleOpenCreatePlaylist = () => {
    setEditingPlaylist(null);
    setIsPlaylistModalOpen(true);
  };

  const handleOpenEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setIsPlaylistModalOpen(true);
  };

  const handleSavePlaylist = async (name: string, description?: string) => {
    if (editingPlaylist) {
      await updatePlaylist(editingPlaylist.id, name, description);
      addToast('success', 'Đã cập nhật playlist', `Playlist "${name}" đã được lưu.`);
    } else {
      await createPlaylist(name, description);
      addToast('success', 'Đã tạo playlist', `Playlist "${name}" đã sẵn sàng.`);
    }
  };

  const handleOpenAddToPlaylist = (track: Track) => {
    setTrackToAddToPlaylist(track);
    setIsAddToPlaylistOpen(true);
  };

  const handleToggleTrackInPlaylist = async (playlistId: string, trackId: string) => {
    const pl = playlists.find((p) => p.id === playlistId);
    if (pl?.trackIds.includes(trackId)) {
      await removeTrackFromPlaylist(playlistId, trackId);
      addToast('info', 'Đã gỡ bài hát', `Đã xóa bài hát khỏi playlist "${pl.name}".`);
    } else {
      await addTrackToPlaylist(playlistId, trackId);
      addToast('success', 'Đã thêm vào playlist', `Đã thêm vào "${pl?.name}".`);
    }
  };

  // Safe Track Deletion
  const handlePromptDeleteTrack = (track: Track) => {
    setTrackToDelete(track);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (trackId: string) => {
    try {
      handleTrackDeleted(trackId);
      await deleteTrack(trackId);
      addToast('success', 'Đã xóa bài hát', 'Bài hát đã được gỡ bỏ khỏi thư viện.');
    } catch (err: any) {
      addToast('error', 'Lỗi khi xóa bài hát', err.message || 'Không thể xóa bài hát.');
    }
  };

  // Handle Import Files with Duplicate Warnings
  const handleImportFiles = async (files: FileList | File[]) => {
    if (storageMode === 'cloud' && !isCloudConfigured) {
      setIsCloudSettingsOpen(true);
      addToast('warning', 'Chưa kết nối Cloud', 'Vui lòng dán Supabase Project URL & Anon Key để tải nhạc lên Cloud.');
      return { count: 0, tracks: [] };
    }

    const res = await importFiles(files);

    if (res.duplicates && res.duplicates.length > 0) {
      addToast(
        'warning',
        'Phát hiện file trùng lặp',
        `Đã bỏ qua ${res.duplicates.length} file đã có: ${res.duplicates.join(', ')}.`
      );
    }

    if (res.count > 0) {
      addToast(
        'success',
        storageMode === 'cloud' ? 'Đã tải lên nhóm' : 'Tải lên thành công',
        `Đã thêm ${res.count} bài hát vào ${storageMode === 'cloud' ? `phòng [${roomCode}]` : 'bộ nhớ máy'}.`
      );
    }

    return res;
  };

  const handleSwitchStorageMode = (mode: 'local' | 'cloud') => {
    setStorageMode(mode);
    if (mode === 'cloud' && !isCloudConfigured) {
      setIsCloudSettingsOpen(true);
    }
  };

  const getHeaderTitle = () => {
    if (activePlaylist) {
      return `Playlist: ${activePlaylist.name}`;
    }
    if (storageMode === 'cloud') {
      return `Không Gian Nhóm (Phòng: ${roomCode})`;
    }
    return 'Thư Viện Máy Của Tôi';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans">
      {/* Toast Notifications */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 transition-all animate-in slide-in-from-top-3 ${
              t.type === 'warning'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 shadow-amber-950/40'
                : t.type === 'error'
                ? 'bg-red-500/20 border-red-500/40 text-red-200 shadow-red-950/40'
                : t.type === 'info'
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200 shadow-cyan-950/40'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40'
            }`}
          >
            {t.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            ) : t.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            ) : t.type === 'info' ? (
              <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white tracking-wide">{t.title}</p>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{t.message}</p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar
          playlists={playlists}
          activePlaylistId={activePlaylistId}
          totalTracksCount={tracks.length}
          storageMode={storageMode}
          roomCode={roomCode}
          onSelectPlaylist={setActivePlaylistId}
          onOpenCreatePlaylist={handleOpenCreatePlaylist}
          onOpenEditPlaylist={handleOpenEditPlaylist}
          onDeletePlaylist={deletePlaylist}
          onToggleStorageMode={handleSwitchStorageMode}
          onOpenRoomModal={() => setIsRoomModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full">
            <Sidebar
              playlists={playlists}
              activePlaylistId={activePlaylistId}
              totalTracksCount={tracks.length}
              storageMode={storageMode}
              roomCode={roomCode}
              onSelectPlaylist={(id) => {
                setActivePlaylistId(id);
                setIsMobileSidebarOpen(false);
              }}
              onOpenCreatePlaylist={() => {
                setIsMobileSidebarOpen(false);
                handleOpenCreatePlaylist();
              }}
              onOpenEditPlaylist={(pl) => {
                setIsMobileSidebarOpen(false);
                handleOpenEditPlaylist(pl);
              }}
              onDeletePlaylist={deletePlaylist}
              onToggleStorageMode={(m) => {
                handleSwitchStorageMode(m);
                setIsMobileSidebarOpen(false);
              }}
              onOpenRoomModal={() => {
                setIsMobileSidebarOpen(false);
                setIsRoomModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Error Toast Notification if playback fails */}
        {error && (
          <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-2.5 text-xs text-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          title={getHeaderTitle()}
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
          storageMode={storageMode}
          roomCode={roomCode}
          user={user}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onToggleStorageMode={handleSwitchStorageMode}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenRoom={() => setIsRoomModalOpen(true)}
          onOpenCloudSettings={() => setIsCloudSettingsOpen(true)}
          onSignOut={async () => {
            await signOut();
            addToast('info', 'Đã đăng xuất', 'Đã quay về chế độ khách.');
          }}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Stage & Track List */}
        <MainStage
          tracks={currentViewTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          activePlaylist={activePlaylist}
          onPlayTrack={(track) => playTrack(track, true)}
          onDeleteTrack={handlePromptDeleteTrack}
          onImportFiles={handleImportFiles}
          onLoadDemoTrack={loadDemoTrack}
          onOpenAddToPlaylist={handleOpenAddToPlaylist}
          onRemoveFromPlaylist={
            activePlaylist
              ? (trackId) => removeTrackFromPlaylist(activePlaylist.id, trackId)
              : undefined
          }
        />

        {/* Bottom Playback Bar */}
        <BottomBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          repeatMode={repeatMode}
          isShuffled={isShuffled}
          onTogglePlay={togglePlay}
          onNext={nextTrack}
          onPrev={prevTrack}
          onSeek={seek}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          onCycleRepeat={cycleRepeatMode}
          onToggleShuffle={toggleShuffle}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />
      </div>

      {/* Auth Modal (Login/Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSignIn={async (email, pass) => {
          await signIn(email, pass);
          addToast('success', 'Đăng nhập thành công', `Chào mừng trở lại!`);
        }}
        onSignUp={async (email, pass, name) => {
          await signUp(email, pass, name);
          addToast('success', 'Đăng ký thành công', `Tài khoản "${name}" đã được tạo.`);
        }}
      />

      {/* Room Modal */}
      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        currentRoomCode={roomCode}
        onJoinRoom={(code) => {
          joinRoom(code);
          addToast('info', 'Đã đổi phòng', `Đang ở phòng nghe chung: [${code}].`);
        }}
      />

      {/* Cloud Settings Modal */}
      <CloudSettingsModal
        isOpen={isCloudSettingsOpen}
        onClose={() => setIsCloudSettingsOpen(false)}
        onConfigSaved={() => {
          refreshAuth();
          refreshLibrary();
          addToast('success', 'Đã lưu cấu hình', 'Đã kết nối thành công với Supabase Cloud.');
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        track={trackToDelete}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Playlist Create/Edit Modal */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSubmit={handleSavePlaylist}
        initialPlaylist={editingPlaylist}
      />

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
        track={trackToAddToPlaylist}
        playlists={playlists}
        onToggleTrackInPlaylist={handleToggleTrackInPlaylist}
        onOpenCreatePlaylist={handleOpenCreatePlaylist}
      />

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title={storageMode === 'cloud' ? `Tải Nhạc Lên Phòng [${roomCode}]` : 'Thêm Bài Hát Từ Máy Cá Nhân'}
      >
        <div className="space-y-4">
          <UploadDropzone
            onImportFiles={async (files) => {
              const res = await handleImportFiles(files);
              setIsUploadModalOpen(false);
              return res;
            }}
          />
        </div>
      </Modal>

      {/* Shortcuts Modal */}
      <Modal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        title="Phím Tắt Điều Khiển"
      >
        <div className="space-y-3 text-xs text-text-secondary">
          {[
            { key: 'Space', desc: 'Phát / Tạm dừng nhạc' },
            { key: 'Mũi tên phải (→)', desc: 'Tua tới 5 giây' },
            { key: 'Mũi tên trái (←)', desc: 'Tua lùi 5 giây' },
            { key: 'Mũi tên lên (↑)', desc: 'Tăng âm lượng 5%' },
            { key: 'Mũi tên xuống (↓)', desc: 'Giảm âm lượng 5%' },
            { key: 'M', desc: 'Tắt / Bật tiếng (Mute/Unmute)' },
            { key: 'Shift + N', desc: 'Chuyển sang bài tiếp theo' },
            { key: 'Shift + P', desc: 'Quay lại bài trước đó' },
          ].map((sc, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5">
              <span>{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[11px] font-semibold border border-white/10">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
