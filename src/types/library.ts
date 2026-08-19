import { Track } from './audio';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  trackIds: string[];
  coverColor?: string;
  createdAt: number;
  updatedAt: number;
}

export interface LibraryState {
  tracks: Track[];
  playlists: Playlist[];
  activePlaylistId: string | null; // null = 'all' tracks
  searchQuery: string;
  sortBy: 'title' | 'artist' | 'addedAt' | 'duration';
  sortOrder: 'asc' | 'desc';
}
