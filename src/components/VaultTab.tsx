import { useState } from 'react';
import { useApp } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, MessageCircle, ShoppingBag, FlaskConical } from 'lucide-react';
import { DiamondIcon, CategoryOverlay, RankBadge } from './FFVisuals';

type MainTab = 'shop' | 'lab';
type Category = 'all' | 'diamonds' | 'skins' | 'bundles' | 'services' | 'accounts';
type ModCategory = 'all' | 'aim' | 'esp' | 'speed' | 'damage' | 'config' | 'vip';

const categories: { id: Category; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '🔥' },
  { id: 'diamonds', label: 'Diamonds', emoji: '💎' },
  { id: 'skins', label: 'Skins', emoji: '🔫' },
  { id: 'bundles', label: 'Bundles', emoji: '👤' },
  { id: 'accounts', label: 'Accounts', emoji: '🎮' },
  { id: 'services', label: 'Services', emoji: '⚡' },
];

const modCategories: { id: ModCategory; label: string }[] = [
  { id: 'all', label: '🔥 All' },
  { id: 'aim', label: '🎯 Aim' },
  { id: 'esp', label: '👁️ ESP' },
  { id: 'speed', label: '⚡ Speed' },
  { id: 'damage', label: '💥 Damage' },
  { id: 'config', label: '⚙️ Config' },
  { id: 'vip', label: '👑 VIP' },
];

// Map mods to categories based on name
const getModCategory = (name: string): ModCategory => {
  const lower = name.toLowerCase();
  if (lower.includes('aim') || lower.includes('headshot') || lower.includes('one tap')) return 'aim';
  if (lower.includes('esp') || lower.includes('wall') || lower.includes('enemy') || lower.includes('loot') || lower.includes('antenna')) return 'esp';
  if (lower.includes('speed') || lower.includes('run') || lower.includes('jump') || lower.includes('teleport') || lower.includes('hologram') || lower.includes('invisible') || lower.includes('ghost')) return 'speed';
  if (lower.includes('damage') || lower.includes('ammo') || lower.includes('fire') || lower.includes('rapid') || lower.includes('recoil')) return 'damage';
  if (lower.includes('config') || lower.includes('sensi') || lower.includes('drag') || lower.includes('awm')) return 'config';
  if (lower.includes('vip') || lower.includes('all-in') || lower.includes('diamond') || lower.includes('anti-ban') || lower.includes('menu')) return 'vip';
  return 'all';
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function VaultTab() {
  const { products, mods, settings, device, getProductImage } = useApp();
  const [mainTab, setMainTab] = useState<MainTab>('shop');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [activeModCategory, setActiveModCategory] = useState<ModCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const filteredMods = mods.filter((m) => {
    const matchCategory = activeModCategory === 'all' || getModCategory(m.name) === activeModCategory;
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleBuy = (title: string, price: string) => {
    const msg = encodeURIComponent(
      `Hi Trevor! 🔥\n\nI want to buy:\n🛒 ${title}\n💰 ${price}\n\n📱 My device: ${device?.model || 'Unknown'}`
    );
    window.open(
      `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`,
      '_blank'
    );
  };

  const handleModClick = (mod: typeof mods[0]) => {
    if (mod.requiresKey) {
      const msg = encodeURIComponent(
        `Hi Trevor! 🔥\n\nI want to buy the key for:\n📦 ${mod.name} ${mod.version}\n\n📱 My device: ${device?.model || 'Unknown'}`
      );
      window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    } else {
      if (mod.downloadUrl && mod.downloadUrl !== '#') {
        window.open(mod.downloadUrl, '_blank');
      } else {
        const msg = encodeURIComponent(
          `Hi Trevor! 🔥\n\nI want to download:\n📦 ${mod.name} ${mod.version}\n\n📱 My device: ${device?.model || 'Unknown'}`
        );
        window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
      }
    }
  };

  return (
    <div className="px-4 pt-6 space-y-4">
      {/* Header */}
      <motion.div {...fadeIn}>
        <div className="flex items-center gap-2">
          <h1 className="text-white font-display font-black text-xl">Trevor's Vault</h1>
          <DiamondIcon size={22} />
        </div>
        <p className="text-white/40 text-xs mt-0.5">Premium Free Fire items, mods & services</p>
      </motion.div>

      {/* Main Tab Toggle - Shop vs Lab */}
      <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
        <div className="flex bg-dark-surface rounded-xl p-1">
          <button
            onClick={() => setMainTab('shop')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mainTab === 'shop' 
                ? 'bg-gold text-dark' 
                : 'text-white/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Shop
          </button>
          <button
            onClick={() => setMainTab('lab')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mainTab === 'lab' 
                ? 'bg-gold text-dark' 
                : 'text-white/50'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            The Lab
            <span className="text-[9px] bg-green-safe/20 text-green-safe px-1.5 py-0.5 rounded-full">
              {mods.filter(m => m.safety === 'safe').length}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder={mainTab === 'shop' ? "Search items..." : "Search mods..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-surface border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/30 transition-colors"
          />
        </div>
      </motion.div>

      {/* SHOP TAB */}
      {mainTab === 'shop' && (
        <>
          {/* Category Filters */}
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-gold text-dark'
                      : 'bg-dark-surface text-white/50 border border-white/5'
                  }`}
                >
                  <span className="text-sm">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <div className="grid grid-cols-2 gap-3 pb-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.03 }}
                    className={`bg-dark-card rounded-2xl overflow-hidden border ${
                      product.featured ? 'border-gold/30' : 'border-white/5'
                    } ${product.status === 'sold' ? 'opacity-50' : ''}`}
                  >
                    <div className="relative">
                      <img
                        src={getProductImage(product)}
                        alt={product.title}
                        className="w-full h-28 object-cover"
                      />
                      <CategoryOverlay category={product.category} />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-card/60 to-transparent" />
                      {product.limitedStock && (
                        <span className="absolute top-1.5 left-1.5 bg-red-risky text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                          🔥 LIMITED
                        </span>
                      )}
                      {product.featured && (
                        <span className="absolute top-1.5 right-1.5 bg-gold text-dark text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                          ⭐ FEATURED
                        </span>
                      )}
                      {product.status === 'sold' && (
                        <div className="absolute inset-0 bg-dark/60 flex items-center justify-center">
                          <span className="text-white font-bold text-sm bg-red-risky/80 px-3 py-1 rounded-lg">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-1.5 right-1.5">
                        {product.category === 'diamonds' && <DiamondIcon size={20} />}
                        {product.category === 'services' && <RankBadge rank="heroic" size={22} />}
                        {product.category === 'accounts' && <RankBadge rank="grandmaster" size={22} />}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-white font-semibold text-xs leading-tight line-clamp-2">
                        {product.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {product.category === 'diamonds' && <DiamondIcon size={12} />}
                        <p className="text-gold font-bold text-sm">{product.price}</p>
                      </div>
                      <button
                        onClick={() => handleBuy(product.title, product.price)}
                        disabled={product.status === 'sold'}
                        className={`w-full mt-2 text-[11px] font-bold py-2 rounded-xl active:scale-[0.97] transition-transform flex items-center justify-center gap-1 ${
                          product.status === 'sold'
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-gold text-dark'
                        }`}
                      >
                        <MessageCircle className="w-3 h-3" />
                        {product.status === 'sold' ? 'Sold Out' : 'Buy Now'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No items found</p>
            </div>
          )}
        </>
      )}

      {/* LAB TAB - Mods/Hacks */}
      {mainTab === 'lab' && (
        <>
          {/* Mod Category Filters */}
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
              {modCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveModCategory(cat.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeModCategory === cat.id
                      ? 'bg-gold text-dark'
                      : 'bg-dark-surface text-white/50 border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Safety Legend */}
          <motion.div {...fadeIn} transition={{ delay: 0.18 }}>
            <div className="flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-safe rounded-full" />
                <span className="text-white/40">Safe = Undetected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-risky rounded-full" />
                <span className="text-white/40">Risky = Use with caution</span>
              </div>
            </div>
          </motion.div>

          {/* Mods List */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <div className="space-y-2 pb-6">
              <AnimatePresence mode="popLayout">
                {filteredMods.map((mod, i) => (
                  <motion.div
                    key={mod.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.02 }}
                    className="bg-dark-card border border-white/5 rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-white font-semibold text-sm">{mod.name}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            mod.safety === 'safe'
                              ? 'bg-green-safe/10 text-green-safe'
                              : 'bg-red-risky/10 text-red-risky'
                          }`}>
                            {mod.safety === 'safe' ? '🟢 Safe' : '🔴 Risky'}
                          </span>
                          {mod.requiresKey && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-gold/10 text-gold">
                              🔑 Key Required
                            </span>
                          )}
                        </div>
                        <p className="text-white/40 text-[11px] mt-1">{mod.version}</p>
                      </div>
                      <button
                        onClick={() => handleModClick(mod)}
                        className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 transition-transform ${
                          mod.requiresKey 
                            ? 'bg-gold text-dark' 
                            : 'bg-green-safe text-white'
                        }`}
                      >
                        {mod.requiresKey ? (
                          <>
                            <MessageCircle className="w-3.5 h-3.5" />
                            Buy Key
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {filteredMods.length === 0 && (
            <div className="text-center py-12">
              <FlaskConical className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No mods found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
