// Free Fire themed SVG visuals & overlay components
// Used as overlays on product cards and section backgrounds

export function DiamondIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="diamond-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="50%" stopColor="#0088FF" />
          <stop offset="100%" stopColor="#6C3CE0" />
        </linearGradient>
        <filter id="diamond-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points="32,4 58,24 32,60 6,24"
        fill="url(#diamond-grad)"
        filter="url(#diamond-glow)"
      />
      <polygon
        points="32,4 42,24 32,48 22,24"
        fill="rgba(255,255,255,0.25)"
      />
      <line x1="6" y1="24" x2="58" y2="24" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <line x1="32" y1="4" x2="22" y2="24" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <line x1="32" y1="4" x2="42" y2="24" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    </svg>
  );
}

export function RankBadge({ rank, size = 40 }: { rank: string; size?: number }) {
  const colors: Record<string, { primary: string; secondary: string; accent: string }> = {
    bronze: { primary: '#CD7F32', secondary: '#8B4513', accent: '#FFD700' },
    silver: { primary: '#C0C0C0', secondary: '#808080', accent: '#E8E8E8' },
    gold: { primary: '#FFD700', secondary: '#DAA520', accent: '#FFF8DC' },
    platinum: { primary: '#00CED1', secondary: '#008B8B', accent: '#E0FFFF' },
    diamond: { primary: '#00BFFF', secondary: '#0066CC', accent: '#87CEEB' },
    heroic: { primary: '#FF4500', secondary: '#CC0000', accent: '#FFD700' },
    grandmaster: { primary: '#FFD700', secondary: '#FF4500', accent: '#FFFFFF' },
  };

  const c = colors[rank.toLowerCase()] || colors.gold;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`rank-${rank}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.primary} />
          <stop offset="100%" stopColor={c.secondary} />
        </linearGradient>
      </defs>
      {/* Shield shape */}
      <path
        d="M24 4 L40 12 L40 28 Q40 38 24 44 Q8 38 8 28 L8 12 Z"
        fill={`url(#rank-${rank})`}
        stroke={c.accent}
        strokeWidth="1.5"
      />
      {/* Star */}
      <polygon
        points="24,14 27,21 34,21 28,26 30,33 24,29 18,33 20,26 14,21 21,21"
        fill={c.accent}
        opacity="0.9"
      />
      {/* Wings for high ranks */}
      {['diamond', 'heroic', 'grandmaster'].includes(rank.toLowerCase()) && (
        <>
          <path d="M8 20 Q2 16 0 22 Q4 20 8 24" fill={c.primary} opacity="0.6" />
          <path d="M40 20 Q46 16 48 22 Q44 20 40 24" fill={c.primary} opacity="0.6" />
        </>
      )}
    </svg>
  );
}

export function FireEffect({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="fire-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FF4500" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#FF8C00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,80 Q20,40 40,60 Q60,20 80,50 Q100,10 120,45 Q140,25 160,55 Q180,30 200,80 Z" fill="url(#fire-grad)">
          <animate attributeName="d" dur="3s" repeatCount="indefinite" values="
            M0,80 Q20,40 40,60 Q60,20 80,50 Q100,10 120,45 Q140,25 160,55 Q180,30 200,80 Z;
            M0,80 Q20,50 40,55 Q60,30 80,45 Q100,20 120,55 Q140,15 160,50 Q180,40 200,80 Z;
            M0,80 Q20,40 40,60 Q60,20 80,50 Q100,10 120,45 Q140,25 160,55 Q180,30 200,80 Z
          " />
        </path>
      </svg>
    </div>
  );
}

export function BooyahBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-display font-black text-[10px] px-2 py-0.5 rounded-md ${className}`}>
      <span>🏆</span> BOOYAH!
    </div>
  );
}

// Category-specific gradient overlays for product cards
export function CategoryOverlay({ category }: { category: string }) {
  const gradients: Record<string, string> = {
    diamonds: 'from-blue-600/20 via-cyan-500/10 to-purple-600/20',
    skins: 'from-orange-500/20 via-red-500/10 to-yellow-500/20',
    bundles: 'from-green-500/20 via-emerald-500/10 to-teal-500/20',
    services: 'from-gold/20 via-amber-500/10 to-orange-500/20',
  };

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[category] || gradients.diamonds} pointer-events-none`} />
  );
}

// Free Fire styled "FF" logo watermark
export function FFWatermark({ className = '' }: { className?: string }) {
  return (
    <div className={`opacity-5 font-display font-black text-white select-none pointer-events-none ${className}`}>
      FF
    </div>
  );
}
