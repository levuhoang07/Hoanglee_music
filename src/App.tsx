import { useState } from 'react';
import { useLibrary } from './hooks/useLibrary';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MainStage } from './components/layout/MainStage';
import { BottomBar } from './components/layout/BottomBar';
import { PlaylistModal } from './components/library/PlaylistModal';
import { AddToPlaylistModal } from './components/library/AddToPlaylistModal';
import { Modal } from './components/common/Modal';
import { UploadDropzone } from './components/library/UploadDropzone';
import { Track } from './types/audio';
import { Playlist } from './types/library';
import { AlertCircle } from 'lucide-react';

export function App() {
  const {
    tracks,
    playlists,
    activePlaylist,
    activePlaylistId,
    currentViewTracks,
    searchQuery,
    sortBy,
    sortOrder,
    importFiles,
    deleteTrack,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    setActivePlaylistId,
    setSearchQuery,
    setSortBy,
  } = useLibrary();

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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    } else {
      await createPlaylist(name, description);
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
    } else {
      await addTrackToPlaylist(playlistId, trackId);
    }
  };

  const getHeaderTitle = () => {
    if (activePlaylist) {
      return `Playlist: ${activePlaylist.name}`;
    }
    return 'Thư Viện Nhạc Của Tôi';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar
          playlists={playlists}
          activePlaylistId={activePlaylistId}
          totalTracksCount={tracks.length}
          onSelectPlaylist={setActivePlaylistId}
          onOpenCreatePlaylist={handleOpenCreatePlaylist}
          onOpenEditPlaylist={handleOpenEditPlaylist}
          onDeletePlaylist={deletePlaylist}
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
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onOpenUpload={() => setIsUploadModalOpen(true)}
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
          onDeleteTrack={deleteTrack}
          onImportFiles={importFiles}
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
        title="Thêm Bài Hát Từ Máy Cá Nhân"
      >
        <div className="space-y-4">
          <UploadDropzone
            onImportFiles={async (files) => {
              const res = await importFiles(files);
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
