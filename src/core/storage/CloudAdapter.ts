import { Track } from '../../types/audio';
import { getSupabaseClient } from '../supabase/client';
import { parseFilename, getAudioDuration } from '../../utils/metadataParser';

export class CloudMusicAdapter {
  readonly type = 'cloud' as const;

  async getPlaybackUrl(track: Track): Promise<string> {
    if (track.streamUrl) return track.streamUrl;

    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Chưa kết nối Supabase.');

    const path = (track as any).storagePath || track.id;
    const { data } = supabase.storage.from('music_files').getPublicUrl(path);
    return data.publicUrl;
  }

  releasePlaybackUrl(): void {
    // Cloud URLs do not require local revokeObjectURL
  }

  async getAllTracks(roomCode: string = 'HOANGLEE'): Promise<Track[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    // Query all tracks without restrictive 20-item limit
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('room_code', roomCode)
      .order('created_at', { ascending: false })
      .range(0, 4999); // Unlimited range up to 5000 items

    if (error) {
      console.error('Lỗi lấy bài hát từ Cloud:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      artist: row.artist,
      album: row.album || undefined,
      duration: Number(row.duration) || 0,
      fileSize: Number(row.file_size) || undefined,
      mimeType: row.mime_type || 'audio/mpeg',
      sourceType: 'cloud',
      streamUrl: row.stream_url,
      storagePath: row.storage_path,
      uploaderName: row.uploader_name,
      addedAt: new Date(row.created_at).getTime(),
    }));
  }

  async saveTrack(
    file: File,
    uploaderId?: string,
    uploaderName?: string,
    roomCode: string = 'HOANGLEE'
  ): Promise<Track> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Chưa cấu hình kết nối Supabase Cloud.');

    const { title, artist } = parseFilename(file.name);
    const duration = await getAudioDuration(file);
    const trackId = `track_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${roomCode}/${trackId}_${cleanFileName}`;

    // 1. Upload audio binary to Storage Bucket
    const { error: uploadError } = await supabase.storage
      .from('music_files')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'audio/mpeg',
      });

    if (uploadError) {
      throw new Error(`Lỗi tải file lên đám mây: ${uploadError.message}`);
    }

    // 2. Get Public URL
    const { data: urlData } = supabase.storage.from('music_files').getPublicUrl(storagePath);
    const streamUrl = urlData.publicUrl;

    // 3. Save Record to PostgreSQL 'tracks' table
    const { error: dbError } = await supabase.from('tracks').insert({
      id: trackId,
      title,
      artist,
      duration,
      file_size: file.size,
      mime_type: file.type || 'audio/mpeg',
      storage_path: storagePath,
      stream_url: streamUrl,
      uploader_id: uploaderId || null,
      uploader_name: uploaderName || 'Bạn bè',
      room_code: roomCode,
    });

    if (dbError) {
      throw new Error(`Lỗi lưu thông tin bài hát: ${dbError.message}`);
    }

    return {
      id: trackId,
      title,
      artist,
      duration,
      fileSize: file.size,
      mimeType: file.type || 'audio/mpeg',
      sourceType: 'cloud',
      streamUrl,
      addedAt: Date.now(),
    };
  }

  async uploadLocalBlobToCloud(
    track: Track,
    blob: Blob,
    uploaderId?: string,
    uploaderName?: string,
    roomCode: string = 'HOANGLEE'
  ): Promise<Track> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Chưa kết nối Supabase Cloud.');

    // Ensure unique ID for every track so no collisions occur
    const trackId = `cloud_${track.id.replace(/[^a-zA-Z0-9_-]/g, '')}_${Date.now().toString(36)}`;
    const cleanTitle = (track.title || 'audio').replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${roomCode}/${trackId}_${cleanTitle}.mp3`;

    // 1. Upload Blob to Storage
    const { error: uploadError } = await supabase.storage
      .from('music_files')
      .upload(storagePath, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: track.mimeType || 'audio/mpeg',
      });

    if (uploadError) {
      console.warn(`Lỗi upload file [${track.title}]:`, uploadError.message);
    }

    // 2. Get Public URL
    const { data: urlData } = supabase.storage.from('music_files').getPublicUrl(storagePath);
    const streamUrl = urlData.publicUrl;

    // 3. Upsert DB Record
    await supabase.from('tracks').upsert({
      id: trackId,
      title: track.title,
      artist: track.artist,
      duration: track.duration || 0,
      file_size: track.fileSize || blob.size,
      mime_type: track.mimeType || 'audio/mpeg',
      storage_path: storagePath,
      stream_url: streamUrl,
      uploader_id: uploaderId || null,
      uploader_name: uploaderName || 'Admin HoangLee',
      room_code: roomCode,
    });

    return {
      ...track,
      id: trackId,
      sourceType: 'cloud',
      streamUrl,
    };
  }

  async deleteTrack(trackId: string, storagePath?: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Delete row from DB
    await supabase.from('tracks').delete().eq('id', trackId);

    // Delete file from Storage if path exists
    if (storagePath) {
      await supabase.storage.from('music_files').remove([storagePath]);
    }
  }
}

export const cloudMusicAdapter = new CloudMusicAdapter();
