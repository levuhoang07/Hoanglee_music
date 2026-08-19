import { useState, useEffect, useCallback, useRef } from 'react';
import { Track, AudioState, RepeatMode } from '../types/audio';
import { audioEngine } from '../core/audio/AudioEngine';
import { localMusicAdapter } from '../core/storage/LocalAdapter';
import { getSetting, saveSetting } from '../core/storage/db';

export function useAudioPlayer(playlist: Track[]) {
  const [audioState, setAudioState] = useState<AudioState>({
    currentTrack: null,
    isPlaying: false,
    isBuffering: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    playbackRate: 1,
    repeatMode: 'all',
    isShuffled: false,
    error: null,
  });

  const playlistRef = useRef<Track[]>(playlist);
  playlistRef.current = playlist;

  const shuffledIndicesRef = useRef<number[]>([]);
  const currentShufflePosRef = useRef<number>(0);

  // Khôi phục cài đặt lưu trữ từ IndexedDB
  useEffect(() => {
    async function loadSettings() {
      const savedVolume = await getSetting<number>('volume', 0.8);
      const savedRepeat = await getSetting<RepeatMode>('repeatMode', 'all');
      const savedShuffle = await getSetting<boolean>('isShuffled', false);
      
      audioEngine.setVolume(savedVolume);
      setAudioState((prev) => ({
        ...prev,
        volume: savedVolume,
        repeatMode: savedRepeat,
        isShuffled: savedShuffle,
      }));
    }
    loadSettings();
  }, []);

  // Xáo trộn danh sách khi bật shuffle hoặc danh sách thay đổi
  const generateShuffleSequence = useCallback((list: Track[], startTrackId?: string) => {
    const indices = Array.from({ length: list.length }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    if (startTrackId) {
      const startIdx = list.findIndex((t) => t.id === startTrackId);
      if (startIdx !== -1) {
        // Đưa startIdx lên đầu danh sách xáo trộn
        const pos = indices.indexOf(startIdx);
        if (pos !== -1) {
          indices.splice(pos, 1);
          indices.unshift(startIdx);
        }
      }
    }
    shuffledIndicesRef.current = indices;
    currentShufflePosRef.current = 0;
  }, []);

  // Chơi một bài hát cụ thể (Hỗ trợ cả Local IndexedDB và Supabase Cloud Stream)
  const playTrack = useCallback(async (track: Track, autoPlay: boolean = true) => {
    try {
      setAudioState((prev) => ({ ...prev, isBuffering: true, error: null, currentTrack: track }));
      
      let streamUrl = '';
      if (track.streamUrl) {
        streamUrl = track.streamUrl;
      } else if (track.sourceType === 'cloud') {
        const { cloudMusicAdapter } = await import('../core/storage/CloudAdapter');
        streamUrl = await cloudMusicAdapter.getPlaybackUrl(track);
      } else {
        try {
          streamUrl = await localMusicAdapter.getPlaybackUrl(track);
        } catch {
          const { cloudMusicAdapter } = await import('../core/storage/CloudAdapter');
          streamUrl = await cloudMusicAdapter.getPlaybackUrl(track);
        }
      }

      await audioEngine.loadSource(streamUrl, autoPlay);
    } catch (err: any) {
      setAudioState((prev) => ({
        ...prev,
        isBuffering: false,
        isPlaying: false,
        error: err.message || 'Lỗi khi phát bài hát',
      }));
    }
  }, []);

  // Toggle Play / Pause
  const togglePlay = useCallback(async () => {
    if (!audioState.currentTrack) {
      if (playlistRef.current.length > 0) {
        await playTrack(playlistRef.current[0], true);
      }
      return;
    }

    if (audioState.isPlaying) {
      audioEngine.pause();
    } else {
      await audioEngine.play();
    }
  }, [audioState.currentTrack, audioState.isPlaying, playTrack]);

  // Bài tiếp theo (Next)
  const nextTrack = useCallback(async () => {
    const list = playlistRef.current;
    if (list.length === 0) return;

    if (!audioState.currentTrack) {
      await playTrack(list[0], true);
      return;
    }

    if (audioState.isShuffled) {
      if (shuffledIndicesRef.current.length !== list.length) {
        generateShuffleSequence(list, audioState.currentTrack.id);
      }
      let nextPos = currentShufflePosRef.current + 1;
      if (nextPos >= list.length) {
        if (audioState.repeatMode === 'off') {
          audioEngine.pause();
          return;
        }
        // Xáo trộn lại vòng mới
        generateShuffleSequence(list);
        nextPos = 0;
      }
      currentShufflePosRef.current = nextPos;
      const targetIdx = shuffledIndicesRef.current[nextPos];
      if (list[targetIdx]) {
        await playTrack(list[targetIdx], true);
      }
    } else {
      const currIdx = list.findIndex((t) => t.id === audioState.currentTrack?.id);
      let nextIdx = currIdx + 1;
      if (nextIdx >= list.length) {
        if (audioState.repeatMode === 'off') {
          audioEngine.pause();
          return;
        }
        nextIdx = 0;
      }
      await playTrack(list[nextIdx], true);
    }
  }, [audioState.currentTrack, audioState.isShuffled, audioState.repeatMode, generateShuffleSequence, playTrack]);

  // Bài trước đó (Previous)
  const prevTrack = useCallback(async () => {
    const list = playlistRef.current;
    if (list.length === 0) return;

    // Nếu bài đã phát quá 3s, click previous sẽ replay lại bài hiện tại
    if (audioEngine.getCurrentTime() > 3) {
      audioEngine.seek(0);
      return;
    }

    if (!audioState.currentTrack) {
      await playTrack(list[0], true);
      return;
    }

    if (audioState.isShuffled) {
      let prevPos = currentShufflePosRef.current - 1;
      if (prevPos < 0) {
        prevPos = list.length - 1;
      }
      currentShufflePosRef.current = prevPos;
      const targetIdx = shuffledIndicesRef.current[prevPos];
      if (list[targetIdx]) {
        await playTrack(list[targetIdx], true);
      }
    } else {
      const currIdx = list.findIndex((t) => t.id === audioState.currentTrack?.id);
      let prevIdx = currIdx - 1;
      if (prevIdx < 0) {
        prevIdx = list.length - 1;
      }
      await playTrack(list[prevIdx], true);
    }
  }, [audioState.currentTrack, audioState.isShuffled, playTrack]);

  // Khi bài hát kết thúc (onEnded event)
  const handleTrackEnded = useCallback(async () => {
    if (audioState.repeatMode === 'one') {
      audioEngine.seek(0);
      await audioEngine.play();
    } else {
      await nextTrack();
    }
  }, [audioState.repeatMode, nextTrack]);

  // Hook AudioEngine callbacks
  useEffect(() => {
    audioEngine.setCallbacks({
      onTimeUpdate: (time) => {
        setAudioState((prev) => ({ ...prev, currentTime: time }));
      },
      onDurationChange: (dur) => {
        setAudioState((prev) => ({ ...prev, duration: dur }));
      },
      onPlayStateChange: (playing) => {
        setAudioState((prev) => ({ ...prev, isPlaying: playing }));
      },
      onBufferingChange: (buffering) => {
        setAudioState((prev) => ({ ...prev, isBuffering: buffering }));
      },
      onEnded: () => {
        handleTrackEnded();
      },
      onError: (errMsg) => {
        setAudioState((prev) => ({ ...prev, error: errMsg, isPlaying: false, isBuffering: false }));
      },
    });
  }, [handleTrackEnded]);

  // Cập nhật MediaSession
  useEffect(() => {
    audioEngine.updateMediaSession(audioState.currentTrack, nextTrack, prevTrack);
  }, [audioState.currentTrack, nextTrack, prevTrack]);

  // Seek
  const seek = useCallback((time: number) => {
    audioEngine.seek(time);
    setAudioState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  // Set Volume
  const setVolume = useCallback((vol: number) => {
    audioEngine.setVolume(vol);
    setAudioState((prev) => ({ ...prev, volume: vol, isMuted: vol === 0 }));
    saveSetting('volume', vol);
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setAudioState((prev) => {
      const nextMute = !prev.isMuted;
      audioEngine.setMuted(nextMute);
      return { ...prev, isMuted: nextMute };
    });
  }, []);

  // Cycle Repeat Mode
  const cycleRepeatMode = useCallback(() => {
    setAudioState((prev) => {
      let nextMode: RepeatMode = 'off';
      if (prev.repeatMode === 'off') nextMode = 'all';
      else if (prev.repeatMode === 'all') nextMode = 'one';
      else nextMode = 'off';

      saveSetting('repeatMode', nextMode);
      return { ...prev, repeatMode: nextMode };
    });
  }, []);

  // Toggle Shuffle
  const toggleShuffle = useCallback(() => {
    setAudioState((prev) => {
      const nextShuffle = !prev.isShuffled;
      if (nextShuffle) {
        generateShuffleSequence(playlistRef.current, prev.currentTrack?.id);
      }
      saveSetting('isShuffled', nextShuffle);
      return { ...prev, isShuffled: nextShuffle };
    });
  }, [generateShuffleSequence]);

  // Xử lý khi bài hát bị xóa
  const handleTrackDeleted = useCallback((deletedTrackId: string) => {
    if (audioState.currentTrack?.id === deletedTrackId) {
      audioEngine.pause();
      setAudioState((prev) => ({
        ...prev,
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      }));
    }
  }, [audioState.currentTrack]);

  return {
    ...audioState,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    cycleRepeatMode,
    toggleShuffle,
    handleTrackDeleted,
  };
}
