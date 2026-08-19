import { Track } from './audio';

export interface CloudTrack extends Track {
  storagePath: string;
  uploaderId?: string;
  uploaderName?: string;
  roomCode: string;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  currentRoomCode: string;
}

export interface SharedRoom {
  id: string;
  code: string;
  name: string;
  createdBy: string;
  createdAt: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}
