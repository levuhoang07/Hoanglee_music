import { useState, useEffect, useCallback } from 'react';
import { Track } from '../types/audio';
import { Playlist, LibraryState } from '../types/library';
import {
  getAllTracksFromDB,
  getAllPlaylistsFromDB,
  savePlaylistToDB,
  deletePlaylistFromDB,
} from '../core/storage/db';
import { localMusicAdapter } from '../core/storage/LocalAdapter';

export function useLibrary() {
  const [libraryState, setLibraryState] = useState<LibraryState>({
    tracks: [],
    playlists: [],
    activePlaylistId: null,
    searchQuery: '',
    sortBy: 'addedAt',
    sortOrder: 'desc',
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load all tracks and playlists from DB
  const refreshLibrary = useCallback(async () => {
    try {
      setIsLoading(true);
      const [tracks, playlists] = await Promise.all([
        getAllTracksFromDB(),
        getAllPlaylistsFromDB(),
      ]);
      setLibraryState((prev) => ({
        ...prev,
        tracks,
        playlists,
      }));
    } catch (err) {
      console.error('Lỗi khi tải thư viện nhạc:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLibrary();
  }, [refreshLibrary]);

  // Upload local audio files
  const importFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(ext || '') || f.type.startsWith('audio/');
    });

    if (fileArray.length === 0) {
      return { count: 0, tracks: [] };
    }

    const newTracks: Track[] = [];
    for (const file of fileArray) {
      try {
        const track = await localMusicAdapter.saveTrack(file);
        newTracks.push(track);
      } catch (err) {
        console.error('Lỗi khi lưu file:', file.name, err);
      }
    }

    await refreshLibrary();
    return { count: newTracks.length, tracks: newTracks };
  }, [refreshLibrary]);

  // Delete a track
  const deleteTrack = useCallback(async (trackId: string) => {
    await localMusicAdapter.deleteTrack(trackId);
    await refreshLibrary();
  }, [refreshLibrary]);

  // Create Playlist
  const createPlaylist = useCallback(async (name: string, description?: string) => {
    const newPlaylist: Playlist = {
      id: `pl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim() || 'Playlist Mới',
      description: description?.trim(),
      trackIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await savePlaylistToDB(newPlaylist);
    await refreshLibrary();
    return newPlaylist;
  }, [refreshLibrary]);

  // Edit Playlist Name
  const updatePlaylist = useCallback(async (id: string, name: string, description?: string) => {
    const pl = libraryState.playlists.find((p) => p.id === id);
    if (!pl) return;
    const updated: Playlist = {
      ...pl,
      name: name.trim() || pl.name,
      description: description !== undefined ? description.trim() : pl.description,
      updatedAt: Date.now(),
    };
    await savePlaylistToDB(updated);
    await refreshLibrary();
  }, [libraryState.playlists, refreshLibrary]);

  // Delete Playlist
  const deletePlaylist = useCallback(async (playlistId: string) => {
    await deletePlaylistFromDB(playlistId);
    if (libraryState.activePlaylistId === playlistId) {
      setLibraryState((prev) => ({ ...prev, activePlaylistId: null }));
    }
    await refreshLibrary();
  }, [libraryState.activePlaylistId, refreshLibrary]);

  // Add track to playlist
  const addTrackToPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    const pl = libraryState.playlists.find((p) => p.id === playlistId);
    if (!pl) return;
    if (pl.trackIds.includes(trackId)) return; // Already in playlist

    const updated: Playlist = {
      ...pl,
      trackIds: [...pl.trackIds, trackId],
      updatedAt: Date.now(),
    };
    await savePlaylistToDB(updated);
    await refreshLibrary();
  }, [libraryState.playlists, refreshLibrary]);

  // Remove track from playlist
  const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    const pl = libraryState.playlists.find((p) => p.id === playlistId);
    if (!pl) return;

    const updated: Playlist = {
      ...pl,
      trackIds: pl.trackIds.filter((id) => id !== trackId),
      updatedAt: Date.now(),
    };
    await savePlaylistToDB(updated);
    await refreshLibrary();
  }, [libraryState.playlists, refreshLibrary]);

  // Set active playlist (null = all tracks)
  const setActivePlaylistId = useCallback((id: string | null) => {
    setLibraryState((prev) => ({ ...prev, activePlaylistId: id }));
  }, []);

  // Search query
  const setSearchQuery = useCallback((query: string) => {
    setLibraryState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  // Sort by
  const setSortBy = useCallback((sortBy: LibraryState['sortBy']) => {
    setLibraryState((prev) => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Filtered & Sorted Tracks for active view
  const activePlaylist = libraryState.playlists.find((p) => p.id === libraryState.activePlaylistId) || null;

  const currentViewTracks = (
    libraryState.activePlaylistId
      ? libraryState.tracks.filter((t) => activePlaylist?.trackIds.includes(t.id))
      : libraryState.tracks
  ).filter((t) => {
    if (!libraryState.searchQuery.trim()) return true;
    const q = libraryState.searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q);
  }).sort((a, b) => {
    const order = libraryState.sortOrder === 'asc' ? 1 : -1;
    if (libraryState.sortBy === 'title') {
      return a.title.localeCompare(b.title) * order;
    }
    if (libraryState.sortBy === 'artist') {
      return a.artist.localeCompare(b.artist) * order;
    }
    if (libraryState.sortBy === 'duration') {
      return (a.duration - b.duration) * order;
    }
    return (a.addedAt - b.addedAt) * order;
  });

  return {
    ...libraryState,
    activePlaylist,
    currentViewTracks,
    isLoading,
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
    refreshLibrary,
  };
}
