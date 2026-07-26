import { useApp } from '../App';
import { motion } from 'framer-motion';
import { Zap, Battery, ChevronRight, Star, Download, MessageCircle } from 'lucide-react';
import { TabId } from '../types';
import { DiamondIcon, RankBadge, FireEffect, BooyahBadge, CategoryOverlay } from './FFVisuals';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function HomeTab({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const { device, sensi, generateSensi, sensiGenerated, products, proofs, settings, mods, siteAssets, getProofImage } = useApp();

  // Max is 200
  const sensiScore = sensi
    ? Math.round(
        (sensi.general + sensi.redDot + sensi.twoX + sensi.fourX + sensi.sniper + sensi.freeLook) / 6
      )
    : null;

  // Handle mod click - download or contact Trevor
  const handleModClick = (mod: typeof mods[0]) => {
    if (mod.requiresKey) {
      // Contact Trevor on WhatsApp to buy key
      const msg = encodeURIComponent(
        `Hi Trevor! 🔥\n\nI want to buy the key for:\n📦 ${mod.name} ${mod.version}\n\nMy device: ${device?.model || 'Unknown'}`
      );
      window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    } else {
      // Free download - open download URL
      if (mod.downloadUrl && mod.downloadUrl !== '#') {
        window.open(mod.downloadUrl, '_blank');
      } else {
        // If no URL set, contact Trevor
        const msg = encodeURIComponent(
          `Hi Trevor! 🔥\n\nI want to download:\n📦 ${mod.name} ${mod.version}\n\nMy device: ${device?.model || 'Unknown'}`
        );
        window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
      }
    }
  };

  return (
    <div className="space-y-0">
      {/* Hero Banner */}
      <motion.section {...fadeIn} className="relative h-56 overflow-hidden">
        <img
          src={siteAssets.heroBanner}
          alt="Free Fire Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/60 to-transparent" />
        <FireEffect className="absolute bottom-0 left-0 right-0 h-16" />
        <div className="absolute bottom-5 left-4 right-4">
          <div className="flex items-center gap-2.5 mb-1.5">
            {siteAssets.logo ? (
              <img src={siteAssets.logo} alt="Logo" className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-gold to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C12 2 8 6 8 10C8 12 9 13 10 13.5C9.5 12 10 10 12 8C14 10 14.5 12 14 13.5C15 13 16 12 16 10C16 6 12 2 12 2Z" fill="#0A0A0A" />
                  <path d="M12 22C8 22 6 19 6 16C6 13 8 11 10 10C9 12 10 14 12 14C14 14 15 12 14 10C16 11 18 13 18 16C18 19 16 22 12 22Z" fill="#0A0A0A" opacity="0.8" />
                </svg>
              </div>
            )}
            <div>
              <h1 className="font-display font-black text-xl text-gold tracking-wide leading-tight">
                {settings.siteName}
              </h1>
              <p className="text-white/60 text-[11px] font-medium">{settings.siteTagline}</p>
            </div>
          </div>
          <BooyahBadge className="mt-1" />
        </div>
      </motion.section>

      <div className="px-4 space-y-4 pt-4">
        {/* Hero Cards */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3">
          {/* Device Card */}
          <div className="bg-gradient-to-br from-gold to-gold-dark rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
            <Battery className="w-5 h-5 text-dark/60 mb-2" />
            <p className="text-dark font-bold text-sm leading-tight">
              {device?.model || 'Detecting...'}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-dark/80 text-xs font-semibold">
                {device?.battery ?? '--'}%
              </span>
              {device?.charging && (
                <Zap className="w-3 h-3 text-dark/70" />
              )}
            </div>
            <p className="text-dark/50 text-[10px] mt-0.5">
              {device?.refreshRate || 60}Hz · {device?.tier?.toUpperCase() || 'MID'}
            </p>
          </div>

          {/* Sensi Score Card */}
          <div className="bg-gradient-to-br from-blue-deep to-blue-accent rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
            <Star className="w-5 h-5 text-white/60 mb-2" />
            <p className="text-white/60 text-xs font-medium">Sensi Score</p>
            <p className="text-white font-black text-2xl leading-tight">
              {sensiScore !== null ? sensiScore : '--'}<span className="text-sm text-white/40">/200</span>
            </p>
            <p className="text-white/40 text-[10px] mt-0.5">
              {sensiGenerated ? '✅ Optimized' : 'Generate first'}
            </p>
          </div>
        </motion.div>

        {/* Generate Sensi Button */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <button
            onClick={() => {
              generateSensi();
              onNavigate('sensi');
            }}
            className="w-full bg-white text-dark font-bold text-sm py-3.5 rounded-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-white/10"
          >
            <Zap className="w-4 h-4" />
            Generate My Sensi
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {[
            { text: `${settings.totalDeals}+ Devices Tuned`, icon: '📱' },
            { text: '24/7 Support Online', icon: '🟢' },
            { text: 'Hacks Undetected', icon: '🛡️' },
          ].map((stat) => (
            <div
              key={stat.text}
              className="flex-shrink-0 bg-dark-surface border border-white/5 rounded-xl px-3 py-2 flex items-center gap-2"
            >
              <span className="text-sm">{stat.icon}</span>
              <span className="text-white/70 text-[11px] font-medium whitespace-nowrap">{stat.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Quick Sensi Preview */}
        {sensiGenerated && sensi && (
          <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
            <div className="bg-dark-card border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-sm">Optimized For You</h3>
                <button
                  onClick={() => onNavigate('sensi')}
                  className="text-gold text-xs font-medium flex items-center gap-0.5"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'General', value: sensi.general },
                  { label: 'Red Dot', value: sensi.redDot },
                  { label: 'Sniper', value: sensi.sniper },
                ].map((s) => (
                  <div key={s.label} className="bg-dark-surface rounded-xl p-2.5 text-center">
                    <p className="text-white/50 text-[10px]">{s.label}</p>
                    <p className="text-gold font-bold text-lg">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Trevor's Vault Preview */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-base">Trevor's Vault</h2>
              <DiamondIcon size={18} />
            </div>
            <button
              onClick={() => onNavigate('vault')}
              className="text-gold text-xs font-medium flex items-center gap-0.5"
            >
              See All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
            {products.filter(p => p.status === 'available').slice(0, 4).map((product) => (
              <ProductMiniCard key={product.id} product={product} />
            ))}
          </div>
        </motion.div>

        {/* The Lab - Hacks/Mods */}
        <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-base">The Lab</h2>
              <span className="text-[10px]">🧪</span>
            </div>
            <span className="text-[10px] text-green-safe font-medium bg-green-safe/10 px-2 py-0.5 rounded-full">
              🟢 {mods.filter(m => m.safety === 'safe').length} Safe
            </span>
          </div>
          <div className="space-y-2">
            {mods.slice(0, 5).map((mod) => (
              <div
                key={mod.id}
                className="bg-dark-card border border-white/5 rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm truncate">{mod.name}</p>
                    <span className={`flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      mod.safety === 'safe'
                        ? 'bg-green-safe/10 text-green-safe'
                        : 'bg-red-risky/10 text-red-risky'
                    }`}>
                      {mod.safety === 'safe' ? '🟢 Safe' : '🔴 Risky'}
                    </span>
                  </div>
                  <p className="text-white/40 text-[11px] mt-0.5">{mod.version}</p>
                </div>
                <button 
                  onClick={() => handleModClick(mod)}
                  className={`flex-shrink-0 ml-2 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform ${
                    mod.requiresKey 
                      ? 'bg-gold text-dark' 
                      : 'bg-green-safe/10 text-green-safe'
                  }`}
                >
                  {mod.requiresKey ? (
                    <>
                      <MessageCircle className="w-3 h-3" />
                      Buy Key
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3" />
                      Download
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
          {mods.length > 5 && (
            <button 
              onClick={() => onNavigate('vault')}
              className="w-full mt-3 bg-dark-surface border border-white/5 text-white/50 text-xs font-medium py-2.5 rounded-xl"
            >
              View All {mods.length} Mods →
            </button>
          )}
        </motion.div>

        {/* Proof Wall */}
        <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-base">Legit Proofs</h2>
              <span className="text-[10px]">✅</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-safe rounded-full pulse-dot" />
              <span className="text-white/50 text-[11px] font-medium">
                {settings.totalDeals.toLocaleString()} deals
              </span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
            {proofs.slice(0, 6).map((proof, i) => (
              <div key={proof.id} className="flex-shrink-0 w-36">
                <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden">
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={getProofImage(proof)}
                      alt={proof.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                    <div className="absolute top-1.5 right-1.5">
                      {i % 2 === 0 ? (
                        <DiamondIcon size={16} />
                      ) : (
                        <RankBadge rank={['gold', 'diamond', 'heroic'][i % 3]} size={18} />
                      )}
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-white/70 text-[10px] leading-tight line-clamp-2">
                      {proof.caption}
                    </p>
                    <p className="text-white/30 text-[9px] mt-1">{proof.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Social Hub */}
        <motion.div {...fadeIn} transition={{ delay: 0.45 }} className="pb-6">
          <h2 className="text-white font-bold text-base mb-3">Connect</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'TikTok', emoji: '🎵', followers: settings.tiktokFollowers, color: 'bg-white/5', link: settings.tiktok },
              { name: 'Discord', emoji: '💬', followers: settings.discordMembers, color: 'bg-[#5865F2]/10', link: settings.discord },
              { name: 'WhatsApp', emoji: '📱', followers: settings.whatsappMembers, color: 'bg-green-safe/10', link: settings.whatsappGroup },
              { name: 'YouTube', emoji: '▶️', followers: settings.youtubeSubscribers, color: 'bg-red-500/10', link: settings.youtube },
            ].map((s) => (
              <a
                key={s.name}
                href={s.link}
                target="_blank"
                rel="noopener"
                className={`${s.color} border border-white/5 rounded-2xl p-4 flex flex-col gap-1 active:scale-[0.97] transition-transform`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-white font-semibold text-sm">{s.name}</span>
                <span className="text-white/40 text-[11px]">{s.followers}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProductMiniCard({ product }: { product: any }) {
  const { settings, getProductImage } = useApp();

  const handleBuy = () => {
    const msg = encodeURIComponent(
      `Hi Trevor! 🔥\n\nI want to buy:\n🛒 ${product.title}\n💰 ${product.price}\n\n📱 My device: ${navigator.userAgent.substring(0, 50)}`
    );
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  const categoryEmoji: Record<string, string> = {
    diamonds: '💎',
    skins: '🔫',
    bundles: '👤',
    services: '⚡',
    accounts: '🎮',
  };

  return (
    <div className={`flex-shrink-0 w-40 bg-dark-card rounded-2xl overflow-hidden border ${
      product.featured ? 'border-gold/30' : 'border-white/5'
    }`}>
      <div className="relative">
        <img
          src={getProductImage(product)}
          alt={product.title}
          className="w-full h-24 object-cover"
        />
        <CategoryOverlay category={product.category} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 to-transparent" />
        {product.limitedStock && (
          <span className="absolute top-1.5 left-1.5 bg-red-risky text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
            🔥 LIMITED
          </span>
        )}
        <div className="absolute bottom-1.5 right-1.5">
          {product.category === 'diamonds' ? (
            <DiamondIcon size={18} />
          ) : (
            <span className="text-sm">{categoryEmoji[product.category] || '🎮'}</span>
          )}
        </div>
      </div>
      <div className="p-3">
        <p className="text-white font-semibold text-xs leading-tight line-clamp-1">{product.title}</p>
        <p className="text-gold font-bold text-sm mt-1">{product.price}</p>
        <button
          onClick={handleBuy}
          className="w-full mt-2 bg-gold text-dark text-[11px] font-bold py-1.5 rounded-lg active:scale-[0.97] transition-transform flex items-center justify-center gap-1"
        >
          <MessageCircle className="w-3 h-3" />
          Buy Now
        </button>
      </div>
    </div>
  );
}
