import React, { useState } from 'react';
import { Track } from '../../types/audio';
import { WalkingBot, BotMotionMode } from './WalkingBot';
import { ParallaxBackground } from './ParallaxBackground';
import { Sparkles, Eye, EyeOff, Radio, Flame, Headphones, Footprints } from 'lucide-react';

interface VisualStageProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
}

const STORAGE_MOTION_KEY = 'auratunes_bot_motion';

export const VisualStage: React.FC<VisualStageProps> = ({
  currentTrack,
  isPlaying,
  isBuffering,
}) => {
  const [showVisual, setShowVisual] = useState(true);
  const [motionMode, setMotionMode] = useState<BotMotionMode>(() => {
    return (localStorage.getItem(STORAGE_MOTION_KEY) as BotMotionMode) || 'jump-dance';
  });

  const handleSetMotion = (mode: BotMotionMode) => {
    setMotionMode(mode);
    localStorage.setItem(STORAGE_MOTION_KEY, mode);
  };

  if (!showVisual) {
    return (
      <div className="relative w-full h-32 glass-panel rounded-3xl flex items-center justify-between px-6 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {currentTrack ? currentTrack.title : 'Chưa chọn bài hát'}
            </p>
            <p className="text-xs text-text-muted">
              {currentTrack ? currentTrack.artist : 'Visual đang tắt'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowVisual(true)}
          className="glass-button px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-white flex items-center gap-2"
        >
          <Eye className="w-4 h-4 text-accent" />
          Bật Visual Hoạt Họa
        </button>
      </div>
    );
  }

  const getStatusText = () => {
    if (isBuffering) return 'Đang nạp âm thanh...';
    if (!isPlaying) return 'Tạm dừng • Bot Nghỉ Ngơi';
    if (motionMode === 'jump-dance') return '🕺 Bot Đang Nhảy Bật Cực Sung!';
    if (motionMode === 'groove-chill') return '🎧 Bot Đang Nhún Chill Theo Beat';
    return '🚶 Bot Đang Đi Bộ Vô Hạn';
  };

  return (
    <div className="relative w-full h-64 sm:h-72 lg:h-80 glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between p-5 sm:p-6">
      {/* Background Animated Parallax */}
      <ParallaxBackground isPlaying={isPlaying} />

      {/* Top Header & Motion Mode Switcher in stage */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isPlaying
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
                : isBuffering
                ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-ping'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-xs font-bold tracking-wider uppercase text-text-secondary">
            {getStatusText()}
          </span>
        </div>

        {/* Motion Style Switcher Pill */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 backdrop-blur-md text-[11px] font-semibold">
            <button
              onClick={() => handleSetMotion('jump-dance')}
              title="Điệu Nhảy Bật Sôi Động (Mặc định)"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                motionMode === 'jump-dance'
                  ? 'bg-gradient-to-r from-accent to-pink-500 text-white shadow-md'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-300" />
              <span>Nhảy Sung</span>
            </button>

            <button
              onClick={() => handleSetMotion('groove-chill')}
              title="Điệu Nhún Chill Lắc Lư"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                motionMode === 'groove-chill'
                  ? 'bg-accent text-white shadow-md'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <Headphones className="w-3 h-3 text-accent-cyan" />
              <span>Nhún Chill</span>
            </button>

            <button
              onClick={() => handleSetMotion('walk-loop')}
              title="Đi Bộ Vô Hạn"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                motionMode === 'walk-loop'
                  ? 'bg-accent text-white shadow-md'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              <Footprints className="w-3 h-3 text-emerald-300" />
              <span>Đi Bộ</span>
            </button>
          </div>

          <button
            onClick={() => setShowVisual(false)}
            title="Tắt hiệu ứng để tiết kiệm pin"
            className="glass-button p-2 rounded-xl text-text-secondary hover:text-white transition-colors"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Centered Walking & Dancing Bot */}
      <div className="relative z-10 my-auto flex items-center justify-center">
        <WalkingBot
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          motionMode={motionMode}
        />
      </div>

      {/* Bottom Equalizer Wave Visualizer Bars */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3 max-w-[60%]">
          {currentTrack ? (
            <div className="truncate">
              <span className="text-xs text-accent font-medium flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-3.5 h-3.5" /> Now Vibe
              </span>
              <p className="text-sm font-bold text-text-primary truncate">{currentTrack.title}</p>
              <p className="text-xs text-text-secondary truncate">{currentTrack.artist}</p>
            </div>
          ) : (
            <p className="text-xs text-text-muted italic">Chọn một bài hát trong thư viện để bắt đầu</p>
          )}
        </div>

        {/* Audio Bars Wave */}
        <div className="flex items-end gap-1.5 h-8">
          {[0.5, 0.9, 0.6, 1.2, 0.4, 1.0, 0.7, 1.1, 0.6].map((speed, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-accent to-accent-cyan sound-wave-bar"
              style={{
                height: isPlaying ? '100%' : '20%',
                animationDuration: `${speed}s`,
                animationPlayState: isPlaying ? 'running' : 'paused',
                opacity: isPlaying ? 0.9 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
