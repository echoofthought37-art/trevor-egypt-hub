import { useApp } from '../App';
import { motion } from 'framer-motion';
import {
  Smartphone, Battery, RefreshCw, Cpu, Monitor,
  MessageCircle, ExternalLink
} from 'lucide-react';
import { DiamondIcon, RankBadge } from './FFVisuals';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function ProfileTab() {
  const { device, sensi, sensiGenerated, settings, proofs, mods, siteAssets } = useApp();

  return (
    <div className="px-4 pt-6 space-y-4">
      {/* Profile Header */}
      <motion.div {...fadeIn}>
        <div className="bg-dark-card border border-white/5 rounded-2xl p-5 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gold/5 to-transparent" />
          <div className="absolute top-2 left-4 opacity-10">
            <RankBadge rank="grandmaster" size={32} />
          </div>
          <div className="absolute top-2 right-4 opacity-10">
            <DiamondIcon size={28} />
          </div>

          {/* Logo */}
          {siteAssets.logo ? (
            <img src={siteAssets.logo} alt="Logo" className="w-16 h-16 mx-auto rounded-2xl object-cover mb-3 shadow-lg" />
          ) : (
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gold to-orange-500 rounded-2xl flex items-center justify-center mb-3 relative shadow-lg shadow-gold/20">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 8 6 8 10C8 12 9 13 10 13.5C9.5 12 10 10 12 8C14 10 14.5 12 14 13.5C15 13 16 12 16 10C16 6 12 2 12 2Z" fill="#0A0A0A" />
                <path d="M12 22C8 22 6 19 6 16C6 13 8 11 10 10C9 12 10 14 12 14C14 14 15 12 14 10C16 11 18 13 18 16C18 19 16 22 12 22Z" fill="#0A0A0A" opacity="0.8" />
              </svg>
            </div>
          )}
          <h2 className="text-white font-display font-black text-lg">{settings.siteName}</h2>
          <p className="text-white/40 text-xs mt-1">{settings.siteTagline}</p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-gold font-bold text-lg">{settings.totalDeals.toLocaleString()}</p>
              <p className="text-white/30 text-[10px]">Deals</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-gold font-bold text-lg">{proofs.length}</p>
              <p className="text-white/30 text-[10px]">Proofs</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-gold font-bold text-lg">{mods.filter(m => m.safety === 'safe').length}</p>
              <p className="text-white/30 text-[10px]">Safe Mods</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Device Details */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-gold" /> Your Device
        </h3>
        <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden">
          {[
            { icon: Smartphone, label: 'Brand', value: device?.brand || 'Unknown' },
            { icon: Smartphone, label: 'Model', value: device?.model || 'Detecting...' },
            { icon: Monitor, label: 'OS', value: `${device?.os || 'Unknown'} ${device?.osVersion || ''}` },
            { icon: Battery, label: 'Battery', value: `${device?.battery ?? '--'}%${device?.charging ? ' ⚡ Charging' : ''}` },
            { icon: RefreshCw, label: 'Refresh Rate', value: `${device?.refreshRate || 60}Hz` },
            { icon: Cpu, label: 'Device Tier', value: device?.tier?.toUpperCase() || 'MID', isGold: true },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < 5 ? 'border-b border-white/5' : ''
              }`}
            >
              <item.icon className="w-4 h-4 text-white/30" />
              <span className="text-white/50 text-xs flex-1">{item.label}</span>
              <span className={`text-xs font-medium ${item.isGold ? 'text-gold font-bold' : 'text-white'}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sensi Summary - MAX 200 */}
      {sensiGenerated && sensi && (
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
              <circle cx="8" cy="8" r="2" fill="#D4AF37" />
            </svg>
            Your Sensi (Max 200)
          </h3>
          <div className="bg-dark-card border border-white/5 rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'General', value: sensi.general },
                { label: 'Red Dot', value: sensi.redDot },
                { label: '2x', value: sensi.twoX },
                { label: '4x', value: sensi.fourX },
                { label: 'AWM', value: sensi.sniper },
                { label: 'Free Look', value: sensi.freeLook },
              ].map((s) => (
                <div key={s.label} className="bg-dark-surface rounded-xl p-2.5 text-center">
                  <p className="text-white/40 text-[10px]">{s.label}</p>
                  <p className="text-gold font-bold text-base">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-dark-surface rounded-xl p-2.5 text-center">
                <p className="text-white/40 text-[10px]">DPI</p>
                <p className="text-gold font-bold text-base">{sensi.dpi}</p>
              </div>
              <div className="bg-dark-surface rounded-xl p-2.5 text-center">
                <p className="text-white/40 text-[10px]">Btn Size</p>
                <p className="text-gold font-bold text-base">{sensi.buttonSize}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rank Badges Display */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <h3 className="text-white font-bold text-sm mb-3">Free Fire Ranks</h3>
        <div className="bg-dark-card border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-around">
            {['bronze', 'silver', 'gold', 'platinum', 'diamond', 'heroic'].map((rank) => (
              <div key={rank} className="flex flex-col items-center gap-1">
                <RankBadge rank={rank} size={28} />
                <span className="text-white/30 text-[8px] capitalize">{rank}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/20 text-[10px] mt-3">Need a rank boost? Contact Trevor!</p>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
        <h3 className="text-white font-bold text-sm mb-3">Connect With Trevor</h3>
        <div className="space-y-2">
          {[
            { name: 'WhatsApp', emoji: '📱', count: settings.whatsappMembers, link: settings.whatsappGroup, color: 'text-green-safe' },
            { name: 'TikTok', emoji: '🎵', count: settings.tiktokFollowers, link: settings.tiktok, color: 'text-white' },
            { name: 'Discord', emoji: '💬', count: settings.discordMembers, link: settings.discord, color: 'text-[#5865F2]' },
            { name: 'YouTube', emoji: '▶️', count: settings.youtubeSubscribers, link: settings.youtube, color: 'text-red-500' },
          ].map((social) => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-3 bg-dark-card border border-white/5 rounded-2xl p-3.5 active:scale-[0.98] transition-transform"
            >
              <span className="text-lg">{social.emoji}</span>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${social.color}`}>{social.name}</p>
                <p className="text-white/30 text-[11px]">{social.count} members</p>
              </div>
              <ExternalLink className="w-4 h-4 text-white/20" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="pb-6">
        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Trevor! I need Free Fire services 🔥')}`}
          target="_blank"
          rel="noopener"
          className="w-full bg-green-safe text-white font-bold text-sm py-3.5 rounded-full flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <MessageCircle className="w-4 h-4" />
          Message Trevor on WhatsApp
        </a>
      </motion.div>
    </div>
  );
}
