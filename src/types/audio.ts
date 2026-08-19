export type RepeatMode = 'off' | 'all' | 'one';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  fileSize?: number; // in bytes
  mimeType: string;
  sourceType: 'local' | 'drive';
  blobId?: string; // ID in IndexedDB for local audio blob
  streamUrl?: string; // Object URL or drive direct stream URL
  coverArtUrl?: string; // Optional artwork (data URL or blob)
  addedAt: number; // timestamp
}

export interface AudioState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  playbackRate: number;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  error: string | null;
}
