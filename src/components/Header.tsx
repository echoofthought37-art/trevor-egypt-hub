import { useApp } from '../App';

export default function Header() {
  const { device, settings, siteAssets } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Logo or default flame icon */}
          {siteAssets.logo ? (
            <img src={siteAssets.logo} alt="Logo" className="w-8 h-8 rounded-xl object-cover" />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-orange-500 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 8 6 8 10C8 12 9 13 10 13.5C9.5 12 10 10 12 8C14 10 14.5 12 14 13.5C15 13 16 12 16 10C16 6 12 2 12 2Z" fill="#0A0A0A" />
                <path d="M12 22C8 22 6 19 6 16C6 13 8 11 10 10C9 12 10 14 12 14C14 14 15 12 14 10C16 11 18 13 18 16C18 19 16 22 12 22Z" fill="#0A0A0A" opacity="0.8" />
              </svg>
            </div>
          )}
          <div>
            <span className="font-display font-extrabold text-gold text-sm tracking-wide block leading-tight">
              {settings.siteName.split(' ').slice(0, 2).join(' ')}
            </span>
            <span className="text-[8px] text-white/30 font-medium tracking-widest">
              {settings.siteName.split(' ').slice(2).join(' ') || 'FREE FIRE HUB'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-white/50 leading-tight">
              {device?.model || 'Detecting...'}
            </p>
            <p className="text-[10px] text-white/30 leading-tight">
              {device?.brand} · {device?.os} {device?.osVersion}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-orange-500/20 flex items-center justify-center border border-gold/20">
            <span className="text-gold text-xs font-bold">T</span>
          </div>
        </div>
      </div>
    </header>
  );
}
