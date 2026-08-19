import { MusicSourceAdapter } from '../../types/adapter';
import { Track } from '../../types/audio';
import { getAudioBlobFromDB, saveTrackToDB, deleteTrackFromDB } from './db';
import { parseFilename, getAudioDuration } from '../../utils/metadataParser';

export class LocalMusicAdapter implements MusicSourceAdapter {
  readonly type = 'local' as const;
  private activeObjectUrls = new Map<string, string>(); // trackId -> objectUrl

  async getPlaybackUrl(track: Track): Promise<string> {
    // If track already has an active Object URL in memory, return it
    if (this.activeObjectUrls.has(track.id)) {
      return this.activeObjectUrls.get(track.id)!;
    }

    // Retrieve blob from IndexedDB
    const blobId = track.blobId || track.id;
    const blob = await getAudioBlobFromDB(blobId);
    if (!blob) {
      throw new Error(`Không tìm thấy dữ liệu âm thanh cho bài hát: ${track.title}`);
    }

    const objectUrl = URL.createObjectURL(blob);
    this.activeObjectUrls.set(track.id, objectUrl);
    return objectUrl;
  }

  releasePlaybackUrl(url: string): void {
    for (const [trackId, activeUrl] of this.activeObjectUrls.entries()) {
      if (activeUrl === url) {
        URL.revokeObjectURL(url);
        this.activeObjectUrls.delete(trackId);
        break;
      }
    }
  }

  releaseAllUrls(): void {
    for (const url of this.activeObjectUrls.values()) {
      URL.revokeObjectURL(url);
    }
    this.activeObjectUrls.clear();
  }

  async saveTrack(file: File): Promise<Track> {
    const id = `track_local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const { title, artist } = parseFilename(file.name);
    const duration = await getAudioDuration(file);

    const track: Track = {
      id,
      title,
      artist,
      duration,
      fileSize: file.size,
      mimeType: file.type || 'audio/mpeg',
      sourceType: 'local',
      blobId: id,
      addedAt: Date.now(),
    };

    await saveTrackToDB(track, file);
    return track;
  }

  async deleteTrack(trackId: string): Promise<void> {
    if (this.activeObjectUrls.has(trackId)) {
      URL.revokeObjectURL(this.activeObjectUrls.get(trackId)!);
      this.activeObjectUrls.delete(trackId);
    }
    await deleteTrackFromDB(trackId);
  }
}

export const localMusicAdapter = new LocalMusicAdapter();
