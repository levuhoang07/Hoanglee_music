import { Track } from './audio';

export interface MusicSourceAdapter {
  readonly type: 'local' | 'drive';
  
  /**
   * Khởi tạo URL có thể phát được cho audio player (Object URL hoặc Stream Link)
   */
  getPlaybackUrl(track: Track): Promise<string>;
  
  /**
   * Giải phóng tài nguyên tạm thời nếu có (ví dụ: URL.revokeObjectURL)
   */
  releasePlaybackUrl(url: string): void;
  
  /**
   * Lưu trữ file mới vào nguồn lưu trữ
   */
  saveTrack(file: File): Promise<Track>;
  
  /**
   * Xóa file khỏi nguồn lưu trữ
   */
  deleteTrack(trackId: string): Promise<void>;
}
