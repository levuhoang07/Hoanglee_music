/**
 * Trích xuất tiêu đề và ca sĩ từ tên file
 * Ví dụ: "Son Tung MTP - Chung Ta Cua Hien Tai.mp3" -> Artist: "Son Tung MTP", Title: "Chung Ta Cua Hien Tai"
 */
export function parseFilename(filename: string): { title: string; artist: string } {
  // Loại bỏ phần mở rộng
  const base = filename.replace(/\.[^/.]+$/, '').trim();
  
  if (base.includes(' - ')) {
    const parts = base.split(' - ');
    const artist = parts[0].trim();
    const title = parts.slice(1).join(' - ').trim();
    return { title: title || base, artist: artist || 'Nghệ sĩ chưa rõ' };
  }
  
  if (base.includes('_')) {
    const parts = base.split('_');
    if (parts.length >= 2) {
      return { title: parts.slice(1).join(' ').trim(), artist: parts[0].trim() };
    }
  }
  
  return {
    title: base,
    artist: 'Nghệ sĩ chưa rõ'
  };
}

/**
 * Lấy thời lượng (duration) của file âm thanh bằng Audio Element
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    
    const cleanup = () => {
      URL.revokeObjectURL(url);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('error', onError);
    };

    const onLoaded = () => {
      const duration = audio.duration;
      cleanup();
      resolve(isFinite(duration) ? duration : 0);
    };

    const onError = () => {
      cleanup();
      resolve(0);
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('error', onError);
    audio.src = url;
  });
}
