/**
 * Trích xuất tiêu đề và ca sĩ từ tên file
 * Ví dụ: "Son Tung MTP - Chung Ta Cua Hien Tai.mp3" -> Artist: "Son Tung MTP", Title: "Chung Ta Cua Hien Tai"
 */
export function parseFilename(filename: string): { title: string; artist: string } {
  // Loại bỏ phần mở rộng .mp3, .wav, v.v.
  const base = filename.replace(/\.[^/.]+$/, '').trim();
  
  if (base.includes(' - ')) {
    const parts = base.split(' - ');
    const artist = parts[0].trim();
    const title = parts.slice(1).join(' - ').trim();
    return { title: title || base, artist: artist || 'HoangLee Music' };
  }
  
  return {
    title: base,
    artist: 'HoangLee Music'
  };
}

/**
 * Lấy thời lượng (duration) của file âm thanh bằng Audio Element với timeout an toàn
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    let isDone = false;
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    
    const cleanup = () => {
      if (isDone) return;
      isDone = true;
      try {
        URL.revokeObjectURL(url);
        audio.removeEventListener('loadedmetadata', onLoaded);
        audio.removeEventListener('error', onError);
        audio.src = '';
      } catch {
        // ignore
      }
    };

    const onLoaded = () => {
      const duration = audio.duration;
      cleanup();
      resolve(isFinite(duration) && duration > 0 ? duration : 180);
    };

    const onError = () => {
      cleanup();
      resolve(180); // Default fallback 3 minutes
    };

    // Timeout safety fallback after 1.5 seconds so large batches never hang!
    const timer = setTimeout(() => {
      cleanup();
      resolve(180);
    }, 1500);

    audio.addEventListener('loadedmetadata', () => {
      clearTimeout(timer);
      onLoaded();
    });
    audio.addEventListener('error', () => {
      clearTimeout(timer);
      onError();
    });

    audio.preload = 'metadata';
    audio.src = url;
  });
}
