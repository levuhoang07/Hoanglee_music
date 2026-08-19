import { Track } from '../../types/audio';

export type AudioEventCallback = {
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onBufferingChange?: (isBuffering: boolean) => void;
  onEnded?: () => void;
  onError?: (errorMessage: string) => void;
};

export class AudioEngine {
  private audio: HTMLAudioElement;
  private callbacks: AudioEventCallback = {};

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.setupListeners();
  }

  private setupListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.callbacks.onTimeUpdate?.(this.audio.currentTime);
    });

    this.audio.addEventListener('durationchange', () => {
      if (isFinite(this.audio.duration)) {
        this.callbacks.onDurationChange?.(this.audio.duration);
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (isFinite(this.audio.duration)) {
        this.callbacks.onDurationChange?.(this.audio.duration);
      }
    });

    this.audio.addEventListener('play', () => {
      this.callbacks.onPlayStateChange?.(true);
      this.callbacks.onBufferingChange?.(false);
    });

    this.audio.addEventListener('pause', () => {
      this.callbacks.onPlayStateChange?.(false);
    });

    this.audio.addEventListener('waiting', () => {
      this.callbacks.onBufferingChange?.(true);
    });

    this.audio.addEventListener('playing', () => {
      this.callbacks.onBufferingChange?.(false);
      this.callbacks.onPlayStateChange?.(true);
    });

    this.audio.addEventListener('ended', () => {
      this.callbacks.onPlayStateChange?.(false);
      this.callbacks.onEnded?.();
    });

    this.audio.addEventListener('error', () => {
      const err = this.audio.error;
      let msg = 'Lỗi không xác định khi phát âm thanh';
      if (err) {
        switch (err.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            msg = 'Quá trình phát bị hủy.';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            msg = 'Lỗi mạng khi tải tệp âm thanh.';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            msg = 'Không thể giải mã tệp âm thanh (định dạng không hỗ trợ hoặc bị lỗi).';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            msg = 'Định dạng tệp âm thanh không được hỗ trợ bởi trình duyệt.';
            break;
        }
      }
      this.callbacks.onBufferingChange?.(false);
      this.callbacks.onPlayStateChange?.(false);
      this.callbacks.onError?.(msg);
    });
  }

  public setCallbacks(callbacks: AudioEventCallback) {
    this.callbacks = callbacks;
  }

  public async loadSource(url: string, autoPlay: boolean = true): Promise<void> {
    if (this.audio.src !== url) {
      this.audio.src = url;
      this.audio.load();
    }
    if (autoPlay) {
      try {
        await this.play();
      } catch (err: any) {
        // Autoplay policy restriction catch
        console.warn('Autoplay prevented by browser policy:', err);
      }
    }
  }

  public async play(): Promise<void> {
    if (!this.audio.src) return;
    try {
      await this.audio.play();
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        throw e;
      }
    }
  }

  public pause(): void {
    this.audio.pause();
  }

  public seek(seconds: number): void {
    if (isFinite(seconds) && seconds >= 0) {
      this.audio.currentTime = seconds;
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.audio.volume = clamped;
  }

  public setMuted(muted: boolean): void {
    this.audio.muted = muted;
  }

  public setPlaybackRate(rate: number): void {
    this.audio.playbackRate = rate;
  }

  public getCurrentTime(): number {
    return this.audio.currentTime;
  }

  public getDuration(): number {
    return this.audio.duration || 0;
  }

  public isPlaying(): boolean {
    return !this.audio.paused && !this.audio.ended && this.audio.readyState > 2;
  }

  public updateMediaSession(track: Track | null, onNext?: () => void, onPrev?: () => void) {
    if (!('mediaSession' in navigator)) return;

    if (!track) {
      navigator.mediaSession.metadata = null;
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album || 'AuraTunes Library',
      artwork: track.coverArtUrl ? [{ src: track.coverArtUrl }] : [],
    });

    navigator.mediaSession.setActionHandler('play', () => this.play());
    navigator.mediaSession.setActionHandler('pause', () => this.pause());
    navigator.mediaSession.setActionHandler('previoustrack', onPrev ? onPrev : null);
    navigator.mediaSession.setActionHandler('nexttrack', onNext ? onNext : null);
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        this.seek(details.seekTime);
      }
    });
  }

  public destroy(): void {
    this.pause();
    this.audio.src = '';
  }
}

export const audioEngine = new AudioEngine();
