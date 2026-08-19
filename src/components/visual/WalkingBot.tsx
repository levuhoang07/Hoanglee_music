import React from 'react';

interface WalkingBotProps {
  isPlaying: boolean;
  isBuffering: boolean;
  botStyle?: 'cyber-bot' | 'astro-bot';
}

export const WalkingBot: React.FC<WalkingBotProps> = ({
  isPlaying,
  isBuffering,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
      <style>{`
        /* Bot Animations */
        @keyframes botBob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }

        @keyframes botIdle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-3px) scale(1.02); }
        }

        @keyframes legLeftWalk {
          0% { transform: rotate(-24deg); }
          50% { transform: rotate(24deg); }
          100% { transform: rotate(-24deg); }
        }

        @keyframes legRightWalk {
          0% { transform: rotate(24deg); }
          50% { transform: rotate(-24deg); }
          100% { transform: rotate(24deg); }
        }

        @keyframes armLeftWalk {
          0% { transform: rotate(20deg); }
          50% { transform: rotate(-20deg); }
          100% { transform: rotate(20deg); }
        }

        @keyframes armRightWalk {
          0% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
          100% { transform: rotate(-20deg); }
        }

        @keyframes antennaGlow {
          0%, 100% { fill: #06b6d4; filter: drop-shadow(0 0 4px #06b6d4); }
          50% { fill: #ec4899; filter: drop-shadow(0 0 10px #ec4899); }
        }

        @keyframes visorScan {
          0% { transform: translateX(-15px); }
          100% { transform: translateX(15px); }
        }

        .animate-bot-body {
          animation: ${isPlaying ? 'botBob 0.6s ease-in-out infinite' : 'botIdle 3s ease-in-out infinite'};
          will-change: transform;
        }

        .animate-leg-l {
          transform-origin: 52px 105px;
          animation: ${isPlaying ? 'legLeftWalk 0.6s ease-in-out infinite' : 'none'};
          will-change: transform;
        }

        .animate-leg-r {
          transform-origin: 88px 105px;
          animation: ${isPlaying ? 'legRightWalk 0.6s ease-in-out infinite' : 'none'};
          will-change: transform;
        }

        .animate-arm-l {
          transform-origin: 38px 75px;
          animation: ${isPlaying ? 'armLeftWalk 0.6s ease-in-out infinite' : 'none'};
          will-change: transform;
        }

        .animate-arm-r {
          transform-origin: 102px 75px;
          animation: ${isPlaying ? 'armRightWalk 0.6s ease-in-out infinite' : 'none'};
          will-change: transform;
        }

        .animate-antenna {
          animation: antennaGlow 2s infinite ease-in-out;
        }
      `}</style>

      {/* Bot Shadow */}
      <div
        className={`w-32 h-4 bg-black/40 rounded-full blur-sm transition-all duration-300 ${
          isPlaying ? 'scale-x-110 opacity-70' : 'scale-x-90 opacity-40'
        }`}
        style={{ marginTop: '140px' }}
      />

      {/* SVG Bot Graphic */}
      <div className="absolute top-0 w-36 h-40 flex items-center justify-center">
        <svg
          viewBox="0 0 140 160"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="140" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#312e81" />
              <stop offset="0.5" stopColor="#4338ca" />
              <stop offset="1" stopColor="#1e1b4b" />
            </linearGradient>

            <linearGradient id="metalGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#64748b" />
              <stop offset="1" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#06b6d4" />
              <stop offset="0.5" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left Leg (Back layer) */}
          <g className="animate-leg-l">
            {/* Thigh */}
            <rect x="46" y="105" width="12" height="26" rx="6" fill="url(#metalGrad)" stroke="#1e1b4b" strokeWidth="2" />
            {/* Boot */}
            <path
              d="M44 130 C44 127 60 127 60 130 L64 142 C64 146 38 146 40 142 Z"
              fill="#06b6d4"
              stroke="#0891b2"
              strokeWidth="2"
            />
            {/* Boot Neon Sole */}
            <path d="M40 142 L64 142" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" filter="url(#neonGlow)" />
          </g>

          {/* Left Arm (Back layer) */}
          <g className="animate-arm-l">
            <rect x="30" y="72" width="10" height="28" rx="5" fill="url(#metalGrad)" stroke="#1e1b4b" strokeWidth="2" />
            {/* Hand */}
            <circle cx="35" cy="103" r="6" fill="#818cf8" />
            <circle cx="35" cy="103" r="3" fill="#c7d2fe" />
          </g>

          {/* Bot Main Torso & Head */}
          <g className="animate-bot-body">
            {/* Antenna Pole & Ball */}
            <line x1="70" y1="18" x2="70" y2="30" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="70" cy="14" r="6" className="animate-antenna" />

            {/* Head */}
            <rect
              x="42"
              y="28"
              width="56"
              height="44"
              rx="16"
              fill="url(#bodyGrad)"
              stroke="#6366f1"
              strokeWidth="2.5"
            />

            {/* Head Headphones (Left & Right Ear cups) */}
            <rect x="36" y="40" width="7" height="20" rx="3.5" fill="#ec4899" filter="url(#neonGlow)" />
            <rect x="97" y="40" width="7" height="20" rx="3.5" fill="#ec4899" filter="url(#neonGlow)" />
            <path d="M42 42 C42 22 98 22 98 42" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Visor / Face Screen */}
            <rect x="50" y="38" width="40" height="24" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

            {/* Glowing Eyes / Visor Display */}
            {isBuffering ? (
              /* Loading Scan line */
              <g clipPath="url(#visorClip)">
                <rect x="52" y="48" width="36" height="4" rx="2" fill="#334155" />
                <rect x="52" y="48" width="12" height="4" rx="2" fill="#ec4899" filter="url(#neonGlow)">
                  <animate attributeName="x" values="52;76;52" dur="1s" repeatCount="indefinite" />
                </rect>
              </g>
            ) : isPlaying ? (
              /* Cute animated blinking/bouncing digital eyes */
              <g>
                <rect x="56" y="44" width="8" height="12" rx="4" fill="#06b6d4" filter="url(#neonGlow)">
                  <animate attributeName="height" values="12;12;2;12" keyTimes="0;0.9;0.95;1" dur="4s" repeatCount="indefinite" />
                </rect>
                <rect x="76" y="44" width="8" height="12" rx="4" fill="#06b6d4" filter="url(#neonGlow)">
                  <animate attributeName="height" values="12;12;2;12" keyTimes="0;0.9;0.95;1" dur="4s" repeatCount="indefinite" />
                </rect>
                {/* Smile line */}
                <path d="M66 54 Q70 57 74 54" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              /* Idle sleeping/relaxed face */
              <g>
                <path d="M56 48 Q60 52 64 48" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M76 48 Q80 52 84 48" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Neck Joint */}
            <rect x="64" y="72" width="12" height="6" rx="2" fill="#475569" />

            {/* Torso / Body */}
            <rect
              x="44"
              y="77"
              width="52"
              height="36"
              rx="12"
              fill="url(#bodyGrad)"
              stroke="#6366f1"
              strokeWidth="2"
            />

            {/* Chest Equalizer / Core Reactor */}
            <circle cx="70" cy="94" r="9" fill="#0f172a" stroke="#312e81" strokeWidth="1.5" />
            <circle
              cx="70"
              cy="94"
              r="5"
              fill={isPlaying ? '#06b6d4' : '#64748b'}
              filter={isPlaying ? 'url(#neonGlow)' : 'none'}
            >
              {isPlaying && (
                <animate attributeName="r" values="4;6;4" dur="0.8s" repeatCount="indefinite" />
              )}
            </circle>

            {/* Chest Audio wave stripes */}
            <rect x="52" y="86" width="3" height={isPlaying ? '14' : '6'} rx="1.5" fill="#818cf8" />
            <rect x="85" y="86" width="3" height={isPlaying ? '14' : '6'} rx="1.5" fill="#818cf8" />
          </g>

          {/* Right Leg (Front layer) */}
          <g className="animate-leg-r">
            <rect x="82" y="105" width="12" height="26" rx="6" fill="url(#metalGrad)" stroke="#1e1b4b" strokeWidth="2" />
            <path
              d="M80 130 C80 127 96 127 96 130 L100 142 C100 146 74 146 76 142 Z"
              fill="#06b6d4"
              stroke="#0891b2"
              strokeWidth="2"
            />
            <path d="M76 142 L100 142" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" filter="url(#neonGlow)" />
          </g>

          {/* Right Arm (Front layer) */}
          <g className="animate-arm-r">
            <rect x="100" y="72" width="10" height="28" rx="5" fill="url(#metalGrad)" stroke="#1e1b4b" strokeWidth="2" />
            <circle cx="105" cy="103" r="6" fill="#818cf8" />
            <circle cx="105" cy="103" r="3" fill="#c7d2fe" />
          </g>
        </svg>
      </div>
    </div>
  );
};
