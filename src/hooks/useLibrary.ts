import { useState, useEffect, useCallback, useRef } from 'react';
import { Track } from '../types/audio';
import { Playlist, LibraryState } from '../types/library';
import {
  getAllTracksFromDB,
  getAllPlaylistsFromDB,
  savePlaylistToDB,
  deletePlaylistFromDB,
  getAudioBlobFromDB,
} from '../core/storage/db';
import { localMusicAdapter } from '../core/storage/LocalAdapter';
import { cloudMusicAdapter } from '../core/storage/CloudAdapter';
import { getSupabaseClient } from '../core/supabase/client';

export type StorageMode = 'local' | 'cloud';

export function useLibrary(currentRoomCode: string = 'HOANGLEE', currentUserProfile?: any) {
  const [storageMode, setStorageMode] = useState<StorageMode>('cloud'); // Default to Cloud room HOANGLEE
  const [localTracksCount, setLocalTracksCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [libraryState, setLibraryState] = useState<LibraryState>({
    tracks: [],
    playlists: [],
    activePlaylistId: null,
    searchQuery: '',
    sortBy: 'addedAt',
    sortOrder: 'desc',
  });

  const [isLoading, setIsLoading] = useState(true);
  const roomCodeRef = useRef(currentRoomCode);
  roomCodeRef.current = currentRoomCode;

  // Check local tracks count
  const checkLocalTracks = useCallback(async () => {
    try {
      const locals = await getAllTracksFromDB();
      setLocalTracksCount(locals.length);
      return locals;
    } catch {
      return [];
    }
  }, []);

  // Load all tracks and playlists from DB / Cloud
  const refreshLibrary = useCallback(async () => {
    try {
      setIsLoading(true);
      await checkLocalTracks();

      if (storageMode === 'cloud') {
        const cloudTracks = await cloudMusicAdapter.getAllTracks(roomCodeRef.current || 'HOANGLEE');
        const playlists = await getAllPlaylistsFromDB();
        setLibraryState((prev) => ({
          ...prev,
          tracks: cloudTracks,
          playlists,
        }));
      } else {
        const [tracks, playlists] = await Promise.all([
          getAllTracksFromDB(),
          getAllPlaylistsFromDB(),
        ]);
        setLibraryState((prev) => ({
          ...prev,
          tracks,
          playlists,
        }));
      }
    } catch (err) {
      console.error('Lỗi khi tải thư viện nhạc:', err);
    } finally {
      setIsLoading(false);
    }
  }, [storageMode, checkLocalTracks]);

  useEffect(() => {
    refreshLibrary();
  }, [refreshLibrary]);

  // Real-time listener for Cloud Mode (Supabase changes)
  useEffect(() => {
    if (storageMode !== 'cloud') return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const channel = supabase
      .channel('realtime_tracks_room')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tracks' },
        () => {
          refreshLibrary();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storageMode, refreshLibrary]);

  // Sync all Local IndexedDB Tracks into Supabase Room HOANGLEE
  const syncLocalTracksToCloud = useCallback(
    async (targetRoom: string = 'HOANGLEE') => {
      try {
        setIsSyncing(true);
        const localTracks = await getAllTracksFromDB();
        if (localTracks.length === 0) return { synced: 0 };

        let syncedCount = 0;
        for (const track of localTracks) {
          const blobId = track.blobId || track.id;
          const blob = await getAudioBlobFromDB(blobId);
          if (blob) {
            await cloudMusicAdapter.uploadLocalBlobToCloud(
              track,
              blob,
              currentUserProfile?.id,
              currentUserProfile?.displayName || 'Admin HoangLee',
              targetRoom
            );
            syncedCount++;
          }
        }

        await refreshLibrary();
        return { synced: syncedCount };
      } catch (err) {
        console.error('Lỗi đồng bộ nhạc lên Cloud:', err);
        throw err;
      } finally {
        setIsSyncing(false);
      }
    },
    [currentUserProfile, refreshLibrary]
  );

  // Auto-sync check: if Cloud library has 0 tracks but local has tracks, trigger auto sync
  useEffect(() => {
    if (storageMode === 'cloud') {
      checkLocalTracks().then(async (locals) => {
        if (locals.length > 0) {
          const cloudTracks = await cloudMusicAdapter.getAllTracks(roomCodeRef.current || 'HOANGLEE');
          if (cloudTracks.length === 0) {
            // Auto sync local tracks to room
            syncLocalTracksToCloud(roomCodeRef.current || 'HOANGLEE').catch(() => {});
          }
        }
      });
    }
  }, [storageMode, checkLocalTracks, syncLocalTracksToCloud]);

  // Upload audio files (Handles both Local IndexedDB & Cloud Supabase)
  const importFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => {
        const ext = f.name.split('.').pop()?.toLowerCase();
        return (
          ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(ext || '') ||
          f.type.startsWith('audio/')
        );
      });

      if (fileArray.length === 0) {
        return { count: 0, tracks: [], duplicates: [] };
      }

      const { parseFilename } = await import('../utils/metadataParser');
      const existingTracks =
        storageMode === 'cloud'
          ? await cloudMusicAdapter.getAllTracks(roomCodeRef.current || 'HOANGLEE')
          : await getAllTracksFromDB();

      const newTracks: Track[] = [];
      const duplicates: string[] = [];

      for (const file of fileArray) {
        const { title, artist } = parseFilename(file.name);

        const isDuplicate = existingTracks.some(
          (t) =>
            t.title.toLowerCase() === title.toLowerCase() &&
            t.fileSize === file.size
        );

        if (isDuplicate) {
          duplicates.push(file.name);
          continue;
        }

        try {
          if (storageMode === 'cloud') {
            const track = await cloudMusicAdapter.saveTrack(
              file,
              currentUserProfile?.id,
              currentUserProfile?.displayName || 'Admin HoangLee',
              roomCodeRef.current || 'HOANGLEE'
            );
            newTracks.push(track);
            existingTracks.push(track);
          } else {
            const track = await localMusicAdapter.saveTrack(file);
            newTracks.push(track);
            existingTracks.push(track);
          }
        } catch (err) {
          console.error('Lỗi khi lưu file:', file.name, err);
        }
      }

      await refreshLibrary();
      return { count: newTracks.length, tracks: newTracks, duplicates };
    },
    [storageMode, currentUserProfile, refreshLibrary]
  );

  // Add demo track
  const loadDemoTrack = useCallback(async () => {
    try {
      const { createDemoTrack } = await import('../utils/audioGenerator');
      const track = await createDemoTrack();
      await refreshLibrary();
      return track;
    } catch (err) {
      console.error('Lỗi khi tạo nhạc demo:', err);
      return null;
    }
  }, [refreshLibrary]);

  // Delete a track
  const deleteTrack = useCallback(
    async (trackId: string) => {
      const track = libraryState.tracks.find((t) => t.id === trackId);
      if (storageMode === 'cloud') {
        await cloudMusicAdapter.deleteTrack(trackId, (track as any)?.storagePath);
      } else {
        await localMusicAdapter.deleteTrack(trackId);
      }
      await refreshLibrary();
    },
    [storageMode, libraryState.tracks, refreshLibrary]
  );

  // Create Playlist
  const createPlaylist = useCallback(
    async (name: string, description?: string) => {
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
    },
    [refreshLibrary]
  );

  // Edit Playlist Name
  const updatePlaylist = useCallback(
    async (id: string, name: string, description?: string) => {
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
    },
    [libraryState.playlists, refreshLibrary]
  );

  // Delete Playlist
  const deletePlaylist = useCallback(
    async (playlistId: string) => {
      await deletePlaylistFromDB(playlistId);
      if (libraryState.activePlaylistId === playlistId) {
        setLibraryState((prev) => ({ ...prev, activePlaylistId: null }));
      }
      await refreshLibrary();
    },
    [libraryState.activePlaylistId, refreshLibrary]
  );

  // Add track to playlist
  const addTrackToPlaylist = useCallback(
    async (playlistId: string, trackId: string) => {
      const pl = libraryState.playlists.find((p) => p.id === playlistId);
      if (!pl) return;
      if (pl.trackIds.includes(trackId)) return;

      const updated: Playlist = {
        ...pl,
        trackIds: [...pl.trackIds, trackId],
        updatedAt: Date.now(),
      };
      await savePlaylistToDB(updated);
      await refreshLibrary();
    },
    [libraryState.playlists, refreshLibrary]
  );

  // Remove track from playlist
  const removeTrackFromPlaylist = useCallback(
    async (playlistId: string, trackId: string) => {
      const pl = libraryState.playlists.find((p) => p.id === playlistId);
      if (!pl) return;

      const updated: Playlist = {
        ...pl,
        trackIds: pl.trackIds.filter((id) => id !== trackId),
        updatedAt: Date.now(),
      };
      await savePlaylistToDB(updated);
      await refreshLibrary();
    },
    [libraryState.playlists, refreshLibrary]
  );

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

  const activePlaylist =
    libraryState.playlists.find((p) => p.id === libraryState.activePlaylistId) || null;

  const currentViewTracks = (
    libraryState.activePlaylistId
      ? libraryState.tracks.filter((t) => activePlaylist?.trackIds.includes(t.id))
      : libraryState.tracks
  )
    .filter((t) => {
      if (!libraryState.searchQuery.trim()) return true;
      const q = libraryState.searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q);
    })
    .sort((a, b) => {
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
    storageMode,
    localTracksCount,
    isSyncing,
    setStorageMode,
    activePlaylist,
    currentViewTracks,
    isLoading,
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
    syncLocalTracksToCloud,
  };
}
