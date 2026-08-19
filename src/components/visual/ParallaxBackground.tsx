import React from 'react';

interface ParallaxBackgroundProps {
  isPlaying: boolean;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ isPlaying }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
      <style>{`
        @keyframes scrollGrid {
          0% { background-position: 0 0; }
          100% { background-position: -80px 0; }
        }

        @keyframes floatParticles {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.6; }
          100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
        }

        @keyframes auroraGlow {
          0%, 100% { opacity: 0.3; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.55; transform: scale(1.1) rotate(5deg); }
        }

        .animate-scroll-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(99, 102, 241, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 1px, transparent 1px);
          animation: ${isPlaying ? 'scrollGrid 1.2s linear infinite' : 'none'};
          will-change: background-position;
        }

        .animate-aurora {
          animation: ${isPlaying ? 'auroraGlow 8s ease-in-out infinite' : 'none'};
        }
      `}</style>

      {/* Cyber Horizon Aurora Lights */}
      <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[120%] bg-gradient-to-b from-indigo-900/20 via-purple-900/10 to-transparent blur-3xl animate-aurora" />
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />

      {/* Star / Dust particles */}
      <div className="absolute inset-0">
        {[
          { top: '15%', left: '20%', size: 'w-1.5 h-1.5', delay: '0s', dur: '4s' },
          { top: '25%', left: '80%', size: 'w-2 h-2', delay: '1s', dur: '5s' },
          { top: '45%', left: '10%', size: 'w-1 h-1', delay: '2s', dur: '3.5s' },
          { top: '35%', left: '60%', size: 'w-2 h-2', delay: '1.5s', dur: '4.5s' },
          { top: '10%', left: '50%', size: 'w-1.5 h-1.5', delay: '0.5s', dur: '6s' },
          { top: '55%', left: '90%', size: 'w-1 h-1', delay: '2.5s', dur: '4s' },
        ].map((pt, i) => (
          <div
            key={i}
            className={`absolute ${pt.size} rounded-full bg-cyan-300 ${pt.top} ${pt.left}`}
            style={{
              top: pt.top,
              left: pt.left,
              animation: isPlaying ? `floatParticles ${pt.dur} ease-in-out infinite ${pt.delay}` : 'none',
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Perspective Ground Grid */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 animate-scroll-grid"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 30%, transparent 100%)',
          transform: 'perspective(200px) rotateX(45deg)',
          transformOrigin: 'bottom',
        }}
      />

      {/* Cyberpunk Ground Horizon Line */}
      <div className="absolute bottom-28 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
    </div>
  );
};
