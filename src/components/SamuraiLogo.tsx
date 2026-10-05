interface Props {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function SamuraiLogo({ className = '', size = 40, showText = false }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#1c080d] via-[#120a10] to-[#0a080d] border border-rose-500/40 shadow-[0_0_18px_rgba(225,29,72,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]"
        style={{ width: size, height: size }}
      >
        {/* Subtle gold ring */}
        <div className="absolute inset-0.5 rounded-xl border border-amber-400/25 pointer-events-none" />

        {/* Authentic Japanese Samurai Crest SVG */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          <defs>
            {/* Forged Katana Blade Gradient */}
            <linearGradient id="katanaBlade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Crimson Lacquer Gradient */}
            <linearGradient id="crimsonLacquer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>

            {/* Imperial Gold Gradient */}
            <linearGradient id="imperialGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Outer Bushido Sun / Ring */}
          <circle cx="50" cy="50" r="44" stroke="url(#crimsonLacquer)" strokeWidth="2.5" opacity="0.8" />
          <circle cx="50" cy="50" r="40" stroke="url(#imperialGold)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Crossed Dual Katanas (Blades behind helmet) */}
          {/* Katana 1 (Top-Left to Bottom-Right) */}
          <path d="M18 18 L82 82" stroke="url(#katanaBlade)" strokeWidth="3" strokeLinecap="round" />
          <path d="M82 82 L86 86" stroke="url(#imperialGold)" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="77" y1="87" x2="87" y2="77" stroke="url(#imperialGold)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Katana 2 (Top-Right to Bottom-Left) */}
          <path d="M82 18 L18 82" stroke="url(#katanaBlade)" strokeWidth="3" strokeLinecap="round" />
          <path d="M18 82 L14 86" stroke="url(#imperialGold)" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="13" y1="77" x2="23" y2="87" stroke="url(#imperialGold)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Samurai Kabuto Helmet Horns (Kuwagata Crest) */}
          <path 
            d="M50 36 C42 22 28 14 20 18 C28 26 38 32 44 42 Z" 
            fill="url(#imperialGold)" 
            stroke="#78350f" 
            strokeWidth="0.8"
          />
          <path 
            d="M50 36 C58 22 72 14 80 18 C72 26 62 32 56 42 Z" 
            fill="url(#imperialGold)" 
            stroke="#78350f" 
            strokeWidth="0.8"
          />

          {/* Central Sun Disc / Jewel on Helmet (Maedate) */}
          <circle cx="50" cy="38" r="6" fill="url(#crimsonLacquer)" stroke="url(#imperialGold)" strokeWidth="1.5" />

          {/* Kabuto Bowl (Hachi) */}
          <path 
            d="M34 44 C34 36 66 36 66 44 C68 56 64 64 50 66 C36 64 32 56 34 44 Z" 
            fill="#0f172a" 
            stroke="url(#katanaBlade)" 
            strokeWidth="1.8"
          />

          {/* Samurai Face Guard (Menpo / Visor) */}
          <path 
            d="M36 50 C44 52 56 52 64 50 L61 62 C55 67 45 67 39 62 Z" 
            fill="url(#crimsonLacquer)" 
            stroke="url(#imperialGold)" 
            strokeWidth="1.2"
          />

          {/* Menpo Mustache / Fangs Accent */}
          <path d="M42 56 Q50 60 58 56" stroke="url(#katanaBlade)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Neck Guard (Shikoro plates) */}
          <path d="M30 60 Q50 72 70 60" stroke="url(#imperialGold)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M26 66 Q50 80 74 66" stroke="url(#crimsonLacquer)" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>

        {/* Live Katana Aura Pulse */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
              <span>X-VIWE</span>
              <span className="text-rose-400 text-xs">侍</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-semibold leading-none">
              SAMURAI
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
            <span className="text-amber-400">⚔️</span>
            <span>Bushido Defense Mesh</span>
          </span>
        </div>
      )}
    </div>
  );
}
