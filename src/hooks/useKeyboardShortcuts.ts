import { useEffect } from 'react';

interface ShortcutHandlers {
  togglePlay: () => void;
  seek: (seconds: number) => void;
  currentTime: number;
  duration: number;
  nextTrack: () => void;
  prevTrack: () => void;
  volume: number;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
}

export function useKeyboardShortcuts({
  togglePlay,
  seek,
  currentTime,
  duration,
  nextTrack,
  prevTrack,
  volume,
  setVolume,
  toggleMute,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua nếu đang gõ trong input, textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(Math.min(duration, currentTime + 5));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, currentTime - 5));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.05));
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyN':
          if (e.shiftKey) {
            e.preventDefault();
            nextTrack();
          }
          break;
        case 'KeyP':
          if (e.shiftKey) {
            e.preventDefault();
            prevTrack();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seek, currentTime, duration, nextTrack, prevTrack, volume, setVolume, toggleMute]);
}
