import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Track } from '../../types/audio';
import { Playlist } from '../../types/library';

interface MusicDB extends DBSchema {
  tracks: {
    key: string;
    value: Track;
    indexes: { 'by-added': number };
  };
  audio_blobs: {
    key: string;
    value: { id: string; blob: Blob };
  };
  playlists: {
    key: string;
    value: Playlist;
    indexes: { 'by-updated': number };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'AuraTunes_MusicDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MusicDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<MusicDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MusicDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Tracks object store
        if (!db.objectStoreNames.contains('tracks')) {
          const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
          trackStore.createIndex('by-added', 'addedAt');
        }

        // Blobs store (holds actual audio binary data)
        if (!db.objectStoreNames.contains('audio_blobs')) {
          db.createObjectStore('audio_blobs', { keyPath: 'id' });
        }

        // Playlists store
        if (!db.objectStoreNames.contains('playlists')) {
          const playlistStore = db.createObjectStore('playlists', { keyPath: 'id' });
          playlistStore.createIndex('by-updated', 'updatedAt');
        }

        // Settings store (volume, last track, etc.)
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

// Database helper functions
export async function getAllTracksFromDB(): Promise<Track[]> {
  const db = await getDB();
  return db.getAllFromIndex('tracks', 'by-added');
}

export async function saveTrackToDB(track: Track, blob: Blob): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['tracks', 'audio_blobs'], 'readwrite');
  await tx.objectStore('tracks').put(track);
  await tx.objectStore('audio_blobs').put({ id: track.blobId || track.id, blob });
  await tx.done;
}

export async function getAudioBlobFromDB(blobId: string): Promise<Blob | null> {
  const db = await getDB();
  const entry = await db.get('audio_blobs', blobId);
  return entry ? entry.blob : null;
}

export async function deleteTrackFromDB(trackId: string): Promise<void> {
  const db = await getDB();
  const track = await db.get('tracks', trackId);
  const tx = db.transaction(['tracks', 'audio_blobs', 'playlists'], 'readwrite');
  
  if (track?.blobId) {
    await tx.objectStore('audio_blobs').delete(track.blobId);
  }
  await tx.objectStore('tracks').delete(trackId);
  
  // Remove track from all playlists
  const allPlaylists = await tx.objectStore('playlists').getAll();
  for (const pl of allPlaylists) {
    if (pl.trackIds.includes(trackId)) {
      pl.trackIds = pl.trackIds.filter(id => id !== trackId);
      pl.updatedAt = Date.now();
      await tx.objectStore('playlists').put(pl);
    }
  }
  
  await tx.done;
}

export async function getAllPlaylistsFromDB(): Promise<Playlist[]> {
  const db = await getDB();
  return db.getAll('playlists');
}

export async function savePlaylistToDB(playlist: Playlist): Promise<void> {
  const db = await getDB();
  await db.put('playlists', playlist);
}

export async function deletePlaylistFromDB(playlistId: string): Promise<void> {
  const db = await getDB();
  await db.delete('playlists', playlistId);
}

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const db = await getDB();
  const val = await db.get('settings', key);
  return val !== undefined ? val : defaultValue;
}

export async function saveSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB();
  await db.put('settings', value, key);
}
