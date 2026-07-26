import { useState, useEffect, useRef } from 'react';
import { useApp } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Settings, Sliders, Package, Shield, Image,
  Link, Megaphone, Save, Plus, Trash2, Lock, Eye, EyeOff, X, Check,
  Upload, Palette, Database, RefreshCw, Copy
} from 'lucide-react';
import { Product, Mod, Proof, SiteAssets } from '../types';
import { loadData, saveData, STORAGE_KEYS } from '../store';
import { 
  saveSupabaseConfig, 
  getSupabaseConfigValues,
  SUPABASE_SCHEMA 
} from '../lib/supabase';

type AdminTab = 'branding' | 'sensi' | 'shop' | 'mods' | 'proofs' | 'social' | 'announce' | 'database';

const ADMIN_PASSWORD = 'trevor2025';

// Image upload helper - converts to base64
function ImageUploader({ 
  value, 
  onChange, 
  label,
  className = ''
}: { 
  value: string; 
  onChange: (dataUrl: string) => void; 
  label: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image too large. Max 2MB');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      // Compress image if needed
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800;
        let w = img.width;
        let h = img.height;
        
        if (w > maxSize || h > maxSize) {
          if (w > h) {
            h = (h / w) * maxSize;
            w = maxSize;
          } else {
            w = (w / h) * maxSize;
            h = maxSize;
          }
        }
        
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onChange(dataUrl);
        setLoading(false);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={className}>
      <label className="text-white/40 text-[11px] block mb-1">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        className="bg-dark-surface border border-white/10 rounded-xl p-3 cursor-pointer hover:border-gold/30 transition-colors"
      >
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="w-full h-24 object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <span className="text-white text-xs">Tap to change</span>
            </div>
          </div>
        ) : (
          <div className="h-20 flex flex-col items-center justify-center gap-2">
            {loading ? (
              <div className="animate-spin w-6 h-6 border-2 border-gold border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-white/30" />
                <span className="text-white/30 text-xs">Tap to upload</span>
              </>
            )}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const {
    sensiConfig, setSensiConfig,
    products, setProducts,
    mods, setMods,
    proofs, setProofs,
    settings, setSettings,
    siteAssets, setSiteAssets,
  } = useApp();

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('branding');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const auth = loadData(STORAGE_KEYS.adminAuth, false);
    setAuthenticated(auth);
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      saveData(STORAGE_KEYS.adminAuth, true);
    } else {
      alert('Wrong password');
    }
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gold/10 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-white font-display font-black text-xl">Admin Panel</h1>
            <p className="text-white/40 text-xs mt-1">Enter password to continue</p>
          </div>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Password"
              className="w-full bg-dark-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/30"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
            </button>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-gold text-dark font-bold text-sm py-3 rounded-xl active:scale-[0.97] transition-transform"
          >
            Login
          </button>
          <button
            onClick={onClose}
            className="w-full text-white/30 text-xs mt-4 py-2"
          >
            ← Back to site
          </button>
        </div>
      </div>
    );
  }

  const adminTabs: { id: AdminTab; label: string; icon: typeof Settings }[] = [
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'sensi', label: 'Sensi', icon: Sliders },
    { id: 'shop', label: 'Shop', icon: Package },
    { id: 'mods', label: 'Mods', icon: Shield },
    { id: 'proofs', label: 'Proofs', icon: Image },
    { id: 'social', label: 'Social', icon: Link },
    { id: 'announce', label: 'Announce', icon: Megaphone },
    { id: 'database', label: 'Database', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Admin Header */}
      <div className="sticky top-0 z-50 bg-dark/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onClose} className="flex items-center gap-2 text-white/50">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs">Back</span>
          </button>
          <h1 className="text-gold font-bold text-sm">Admin Panel</h1>
          <button
            onClick={() => {
              saveData(STORAGE_KEYS.adminAuth, false);
              setAuthenticated(false);
            }}
            className="text-white/30 text-xs"
          >
            Logout
          </button>
        </div>
        {/* Tab Bar */}
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-1 pb-2">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gold text-dark'
                  : 'text-white/40 bg-dark-surface'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-safe text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Saved
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 pb-8">
        {activeTab === 'branding' && <BrandingAdmin siteAssets={siteAssets} setSiteAssets={setSiteAssets} settings={settings} setSettings={setSettings} onSave={showSaved} />}
        {activeTab === 'sensi' && <SensiAdmin sensiConfig={sensiConfig} setSensiConfig={setSensiConfig} onSave={showSaved} />}
        {activeTab === 'shop' && <ShopAdmin products={products} setProducts={setProducts} siteAssets={siteAssets} onSave={showSaved} />}
        {activeTab === 'mods' && <ModsAdmin mods={mods} setMods={setMods} onSave={showSaved} />}
        {activeTab === 'proofs' && <ProofsAdmin proofs={proofs} setProofs={setProofs} settings={settings} setSettings={setSettings} onSave={showSaved} />}
        {activeTab === 'social' && <SocialAdmin settings={settings} setSettings={setSettings} onSave={showSaved} />}
        {activeTab === 'announce' && <AnnounceAdmin settings={settings} setSettings={setSettings} onSave={showSaved} />}
        {activeTab === 'database' && <DatabaseAdmin onSave={showSaved} />}
      </div>
    </div>
  );
}

// ─── Branding Admin ───
function BrandingAdmin({ siteAssets, setSiteAssets, settings, setSettings, onSave }: any) {
  const [assets, setAssets] = useState<SiteAssets>(siteAssets);
  const [s, setS] = useState(settings);

  const handleSave = () => {
    setSiteAssets(assets);
    setSettings(s);
    onSave();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-base">🎨 Branding & Images</h2>
      <p className="text-white/40 text-xs">Upload your logo, banner, and default images. All images can be uploaded from your phone gallery.</p>

      {/* Site Name & Tagline */}
      <div className="bg-dark-card border border-white/5 rounded-2xl p-4 space-y-3">
        <h3 className="text-white font-semibold text-sm">Site Info</h3>
        <div>
          <label className="text-white/40 text-[11px]">Site Name</label>
          <input
            type="text"
            value={s.siteName}
            onChange={(e) => setS({ ...s, siteName: e.target.value })}
            className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white mt-1 focus:outline-none focus:border-gold/30"
            placeholder="TREVOR EGYPT HUB"
          />
        </div>
        <div>
          <label className="text-white/40 text-[11px]">Tagline</label>
          <input
            type="text"
            value={s.siteTagline}
            onChange={(e) => setS({ ...s, siteTagline: e.target.value })}
            className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white mt-1 focus:outline-none focus:border-gold/30"
            placeholder="Premium Free Fire Services"
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-dark-card border border-white/5 rounded-2xl p-4">
        <ImageUploader
          value={assets.logo}
          onChange={(url) => setAssets({ ...assets, logo: url })}
          label="📛 Logo (optional - uses flame icon if empty)"
        />
      </div>

      {/* Hero Banner */}
      <div className="bg-dark-card border border-white/5 rounded-2xl p-4">
        <ImageUploader
          value={assets.heroBanner}
          onChange={(url) => setAssets({ ...assets, heroBanner: url })}
          label="🖼️ Hero Banner (main image at top)"
        />
      </div>

      {/* Category Default Images */}
      <div className="bg-dark-card border border-white/5 rounded-2xl p-4 space-y-3">
        <h3 className="text-white font-semibold text-sm">Default Category Images</h3>
        <p className="text-white/30 text-[10px]">These show when products don't have their own image</p>
        
        <ImageUploader
          value={assets.diamondsImage}
          onChange={(url) => setAssets({ ...assets, diamondsImage: url })}
          label="💎 Diamonds Default"
        />
        <ImageUploader
          value={assets.weaponSkinImage}
          onChange={(url) => setAssets({ ...assets, weaponSkinImage: url })}
          label="🔫 Weapon Skins Default"
        />
        <ImageUploader
          value={assets.characterBundleImage}
          onChange={(url) => setAssets({ ...assets, characterBundleImage: url })}
          label="👤 Bundles Default"
        />
        <ImageUploader
          value={assets.rankBoostImage}
          onChange={(url) => setAssets({ ...assets, rankBoostImage: url })}
          label="🏆 Rank/Services Default"
        />
      </div>

      {/* Other Assets */}
      <div className="bg-dark-card border border-white/5 rounded-2xl p-4 space-y-3">
        <h3 className="text-white font-semibold text-sm">Other Images</h3>
        <ImageUploader
          value={assets.phoneMockupImage}
          onChange={(url) => setAssets({ ...assets, phoneMockupImage: url })}
          label="📱 Phone Mockup (Sensi page)"
        />
        <ImageUploader
          value={assets.proofDefaultImage}
          onChange={(url) => setAssets({ ...assets, proofDefaultImage: url })}
          label="✅ Default Proof Image"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-gold text-dark font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
      >
        <Save className="w-4 h-4" /> Save Branding
      </button>
    </div>
  );
}

// ─── Sensi Admin ───
function SensiAdmin({ sensiConfig, setSensiConfig, onSave }: any) {
  const [config, setConfig] = useState(sensiConfig);

  const update = (key: string, val: number) => setConfig({ ...config, [key]: val });
  const updateTier = (tier: string, val: number) =>
    setConfig({ ...config, tierMultipliers: { ...config.tierMultipliers, [tier]: val } });

  const handleSave = () => {
    setSensiConfig(config);
    onSave();
  };

  // MAX IS 200!
  const fields = [
    { key: 'generalBase', label: 'General Base', min: 50, max: 200 },
    { key: 'redDotBase', label: 'Red Dot Base', min: 40, max: 200 },
    { key: 'twoXBase', label: '2x Base', min: 35, max: 190 },
    { key: 'fourXBase', label: '4x Base', min: 25, max: 170 },
    { key: 'sniperBase', label: 'AWM/Sniper Base', min: 20, max: 150 },
    { key: 'freeLookBase', label: 'Free Look Base', min: 40, max: 180 },
    { key: 'dpiBase', label: 'DPI Base', min: 200, max: 800 },
    { key: 'buttonSizeBase', label: 'Button Size Base', min: 30, max: 100 },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-base">🎯 Sensi Algorithm Tuner</h2>
      <p className="text-white/40 text-xs">Adjust base values (max 200). The engine auto-calculates per device.</p>

      <div className="bg-dark-card border border-white/5 rounded-2xl p-4 space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <div className="flex justify-between mb-1">
              <span className="text-white/50 text-xs">{f.label}</span>
              <span className="text-gold text-xs font-bold">{config[f.key]}</span>
            </div>
            <input
              type="range"
              min={f.min}
              max={f.max}
              value={config[f.key]}
              onChange={(e) => update(f.key, Number(e.target.value))}
              className="w-full accent-gold"
            />
            <div className="flex justify-between text-[9px] text-white/20">
              <span>{f.min}</span>
              <span>{f.max}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-dark-card border border-white/5 rounded-2xl p-4 space-y-3">
        <h3 className="text-white font-semibold text-sm">Multipliers</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white/40 text-[11px]">Battery Impact</label>
            <input
              type="number"
              step="0.01"
              value={config.batteryMultiplier}
              onChange={(e) => update('batteryMultiplier', Number(e.target.value))}
              className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white mt-1 focus:outline-none focus:border-gold/30"
            />
          </div>
          <div>
            <label className="text-white/40 text-[11px]">Refresh Rate Impact</label>
            <input
              type="number"
              step="0.01"
              value={config.refreshRateMultiplier}
              onChange={(e) => update('refreshRateMultiplier', Number(e.target.value))}
              className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white mt-1 focus:outline-none focus:border-gold/30"
            />
          </div>
        </div>
        <h4 className="text-white/40 text-[11px] mt-2">Tier Multipliers</h4>
        <div className="grid grid-cols-4 gap-2">
          {['low', 'mid', 'high', 'ultra'].map((tier) => (
            <div key={tier}>
              <label className="text-white/30 text-[10px] capitalize">{tier}</label>
              <input
                type="number"
                step="0.01"
                value={config.tierMultipliers[tier]}
                onChange={(e) => updateTier(tier, Number(e.target.value))}
                className="w-full bg-dark-surface border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white mt-0.5 focus:outline-none focus:border-gold/30"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-gold text-dark font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
      >
        <Save className="w-4 h-4" /> Save Algorithm
      </button>
    </div>
  );
}

// ─── Shop Admin ───
function ShopAdmin({ products, setProducts, siteAssets, onSave }: any) {
  const [items, setItems] = useState<Product[]>(products);
  const [editing, setEditing] = useState<Product | null>(null);

  const handleSave = () => {
    setProducts(items);
    onSave();
  };

  const addNew = () => {
    const newItem: Product = {
      id: Date.now().toString(),
      title: 'New Item',
      price: '100 EGP',
      category: 'diamonds',
      image: '',
      status: 'available',
      featured: false,
      limitedStock: false,
      description: '',
    };
    setItems([...items, newItem]);
    setEditing(newItem);
  };

  const updateItem = (id: string, updates: Partial<Product>) => {
    setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
    if (editing?.id === id) setEditing({ ...editing, ...updates });
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const getDisplayImage = (item: Product) => {
    if (item.image) return item.image;
    switch (item.category) {
      case 'diamonds': return siteAssets.diamondsImage;
      case 'skins': return siteAssets.weaponSkinImage;
      case 'bundles': return siteAssets.characterBundleImage;
      default: return siteAssets.rankBoostImage;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-base">🛒 Shop Items</h2>
        <button
          onClick={addNew}
          className="bg-gold text-dark text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark/90 backdrop-blur-sm flex items-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-dark-card border-t border-white/10 rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-sm">Edit Item</h3>
                <button onClick={() => setEditing(null)}>
                  <X className="w-5 h-5 text-white/30" />
                </button>
              </div>
              <div className="space-y-3">
                {/* Product Image Upload */}
                <ImageUploader
                  value={editing.image}
                  onChange={(url) => updateItem(editing.id, { image: url })}
                  label="📸 Product Image (or uses category default)"
                />
                <div>
                  <label className="text-white/40 text-[11px]">Title</label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => updateItem(editing.id, { title: e.target.value })}
                    className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white mt-1 focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-[11px]">Price (e.g., ₦1,500)</label>
                  <input
                    type="text"
                    value={editing.price}
                    onChange={(e) => updateItem(editing.id, { price: e.target.value })}
                    className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white mt-1 focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-[11px]">Description (optional)</label>
                  <textarea
                    value={editing.description || ''}
                    onChange={(e) => updateItem(editing.id, { description: e.target.value })}
                    className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white mt-1 focus:outline-none focus:border-gold/30 resize-none"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-[11px]">Category</label>
                  <select
                    value={editing.category}
                    onChange={(e) => updateItem(editing.id, { category: e.target.value as any })}
                    className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white mt-1 focus:outline-none focus:border-gold/30"
                  >
                    <option value="diamonds">💎 Diamonds</option>
                    <option value="skins">🔫 Skins</option>
                    <option value="bundles">👤 Bundles</option>
                    <option value="services">⚡ Services</option>
                    <option value="accounts">🎮 Accounts</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editing.featured}
                      onChange={(e) => updateItem(editing.id, { featured: e.target.checked })}
                      className="accent-gold w-4 h-4"
                    />
                    <span className="text-white/50 text-xs">⭐ Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editing.limitedStock}
                      onChange={(e) => updateItem(editing.id, { limitedStock: e.target.checked })}
                      className="accent-gold w-4 h-4"
                    />
                    <span className="text-white/50 text-xs">🔥 Limited</span>
                  </label>
                </div>
                <div>
                  <label className="text-white/40 text-[11px]">Status</label>
                  <select
                    value={editing.status}
                    onChange={(e) => updateItem(editing.id, { status: e.target.value as any })}
                    className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white mt-1 focus:outline-none focus:border-gold/30"
                  >
                    <option value="available">✅ Available</option>
                    <option value="sold">❌ Sold Out</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="w-full bg-gold text-dark font-bold text-sm py-3 rounded-xl mt-4 active:scale-[0.97] transition-transform"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-dark-card border border-white/5 rounded-2xl p-3 flex items-center gap-3">
            <img src={getDisplayImage(item)} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-xs truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-gold text-[11px] font-bold">{item.price}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  item.status === 'available' ? 'bg-green-safe/10 text-green-safe' : 'bg-red-risky/10 text-red-risky'
                }`}>
                  {item.status === 'available' ? '✅' : '❌'} {item.status}
                </span>
              </div>
            </div>
            <button onClick={() => setEditing(item)} className="text-white/30 p-1.5">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={() => deleteItem(item.id)} className="text-red-risky/50 p-1.5">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-gold text-dark font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
      >
        <Save className="w-4 h-4" /> Save All Items
      </button>
    </div>
  );
}

// ─── Mods Admin ───
function ModsAdmin({ mods, setMods, onSave }: any) {
  const [items, setItems] = useState<Mod[]>(mods);

  const addMod = () => {
    setItems([...items, {
      id: Date.now().toString(),
      name: 'New Mod',
      version: 'v1.0.0',
      safety: 'safe',
      downloadUrl: '#',
      requiresKey: false,
    }]);
  };

  const updateMod = (id: string, updates: Partial<Mod>) => {
    setItems(items.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMod = (id: string) => setItems(items.filter(m => m.id !== id));

  const handleSave = () => { setMods(items); onSave(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-base">🧪 Mods / Hacks</h2>
        <button onClick={addMod} className="bg-gold text-dark text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <div className="space-y-2">
        {items.map((mod) => (
          <div key={mod.id} className="bg-dark-card border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={mod.name}
                onChange={(e) => updateMod(mod.id, { name: e.target.value })}
                className="flex-1 bg-dark-surface border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold/30"
                placeholder="Name"
              />
              <input
                type="text"
                value={mod.version}
                onChange={(e) => updateMod(mod.id, { version: e.target.value })}
                className="w-20 bg-dark-surface border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-gold/30"
                placeholder="Version"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={mod.downloadUrl}
                onChange={(e) => updateMod(mod.id, { downloadUrl: e.target.value })}
                className="flex-1 bg-dark-surface border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold/30"
                placeholder="Download URL"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <select
                  value={mod.safety}
                  onChange={(e) => updateMod(mod.id, { safety: e.target.value as any })}
                  className="bg-dark-surface border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
                >
                  <option value="safe">🟢 Safe</option>
                  <option value="risky">🔴 Risky</option>
                </select>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={mod.requiresKey}
                    onChange={(e) => updateMod(mod.id, { requiresKey: e.target.checked })}
                    className="accent-gold"
                  />
                  <span className="text-white/40 text-[11px]">🔑 Key Required</span>
                </label>
              </div>
              <button onClick={() => deleteMod(mod.id)} className="text-red-risky/50 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="w-full bg-gold text-dark font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
        <Save className="w-4 h-4" /> Save Mods
      </button>
    </div>
  );
}

// ─── Proofs Admin ───
function ProofsAdmin({ proofs, setProofs, settings, setSettings, onSave }: any) {
  const [items, setItems] = useState<Proof[]>(proofs);
  const [totalDeals, setTotalDeals] = useState(settings.totalDeals);

  const addProof = () => {
    setItems([...items, {
      id: Date.now().toString(),
      image: '',
      caption: 'New proof',
      date: new Date().toISOString().split('T')[0],
    }]);
  };

  const updateProof = (id: string, updates: Partial<Proof>) => {
    setItems(items.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProof = (id: string) => setItems(items.filter(p => p.id !== id));

  const handleSave = () => {
    setProofs(items);
    setSettings({ ...settings, totalDeals });
    onSave();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-base">✅ Proof Wall</h2>
        <button onClick={addProof} className="bg-gold text-dark text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <div className="bg-dark-card border border-white/5 rounded-2xl p-4">
        <label className="text-white/40 text-[11px]">📊 Total Deals Counter</label>
        <input
          type="number"
          value={totalDeals}
          onChange={(e) => setTotalDeals(Number(e.target.value))}
          className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white mt-1 focus:outline-none focus:border-gold/30"
        />
      </div>

      <div className="space-y-2">
        {items.map((proof) => (
          <div key={proof.id} className="bg-dark-card border border-white/5 rounded-2xl p-3 space-y-2">
            <ImageUploader
              value={proof.image}
              onChange={(url) => updateProof(proof.id, { image: url })}
              label="📸 Screenshot"
            />
            <input
              type="text"
              value={proof.caption}
              onChange={(e) => updateProof(proof.id, { caption: e.target.value })}
              className="w-full bg-dark-surface border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none"
              placeholder="Caption"
            />
            <div className="flex items-center justify-between">
              <input
                type="date"
                value={proof.date}
                onChange={(e) => updateProof(proof.id, { date: e.target.value })}
                className="bg-dark-surface border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
              />
              <button onClick={() => deleteProof(proof.id)} className="text-red-risky/50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="w-full bg-gold text-dark font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
        <Save className="w-4 h-4" /> Save Proofs
      </button>
    </div>
  );
}

// ─── Social Admin ───
function SocialAdmin({ settings, setSettings, onSave }: any) {
  const [s, setS] = useState(settings);

  const update = (key: string, val: string) => setS({ ...s, [key]: val });

  const handleSave = () => { setSettings(s); onSave(); };

  const fields = [
    { key: 'whatsappNumber', label: '📱 WhatsApp Number (with country code)', placeholder: '+201234567890' },
    { key: 'whatsappGroup', label: '👥 WhatsApp Group Link', placeholder: 'https://chat.whatsapp.com/...' },
    { key: 'whatsappMembers', label: 'WhatsApp Members Count', placeholder: '5.1K' },
    { key: 'tiktok', label: '🎵 TikTok Link', placeholder: 'https://tiktok.com/@...' },
    { key: 'tiktokFollowers', label: 'TikTok Followers Count', placeholder: '25.4K' },
    { key: 'discord', label: '💬 Discord Link', placeholder: 'https://discord.gg/...' },
    { key: 'discordMembers', label: 'Discord Members Count', placeholder: '3.2K' },
    { key: 'youtube', label: '▶️ YouTube Link', placeholder: 'https://youtube.com/@...' },
    { key: 'youtubeSubscribers', label: 'YouTube Subscribers Count', placeholder: '12.8K' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-base">🔗 Social Links</h2>
      <p className="text-white/40 text-xs">Update your WhatsApp, TikTok, Discord, and YouTube links.</p>
      <div className="bg-dark-card border border-white/5 rounded-2xl p-4 space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-white/40 text-[11px]">{f.label}</label>
            <input
              type="text"
              value={s[f.key]}
              onChange={(e) => update(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-gold/30"
            />
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="w-full bg-gold text-dark font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
        <Save className="w-4 h-4" /> Save Links
      </button>
    </div>
  );
}

// ─── Announce Admin ───
function AnnounceAdmin({ settings, setSettings, onSave }: any) {
  const [text, setText] = useState(settings.announcement);

  const handleSave = () => {
    setSettings({ ...settings, announcement: text });
    onSave();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-base">📢 Announcement Bar</h2>
      <p className="text-white/40 text-xs">This text appears at the top of the site. Leave empty to hide.</p>
      <div className="bg-dark-card border border-white/5 rounded-2xl p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter announcement text..."
          rows={3}
          className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold/30 resize-none"
        />
      </div>
      {text && (
        <div className="bg-gold/10 border border-gold/20 rounded-xl px-4 py-2">
          <p className="text-[11px] text-white/40 mb-1">Preview:</p>
          <p className="text-xs text-gold">{text}</p>
        </div>
      )}
      <button onClick={handleSave} className="w-full bg-gold text-dark font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
        <Save className="w-4 h-4" /> Save Announcement
      </button>
    </div>
  );
}

// ─── Database Admin (Supabase Connection) ───
function DatabaseAdmin({ onSave }: { onSave: () => void }) {
  const { isSupabaseConnected, dbStatus, syncWithSupabase, pushToSupabase } = useApp();
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const config = getSupabaseConfigValues();
    setUrl(config.url || '');
    setAnonKey(config.anonKey || '');
  }, []);

  const handleSave = async () => {
    saveSupabaseConfig(url, anonKey);
    onSave();
    // Trigger sync after saving
    setSyncing(true);
    await syncWithSupabase();
    setSyncing(false);
  };

  const handleSync = async () => {
    setSyncing(true);
    await syncWithSupabase();
    setSyncing(false);
  };

  const copySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-base">🗄️ Database (Supabase)</h2>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold ${
          isSupabaseConnected 
            ? 'bg-green-safe/10 text-green-safe' 
            : 'bg-red-risky/10 text-red-risky'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-green-safe' : 'bg-red-risky'}`} />
          {isSupabaseConnected ? 'Connected' : 'Not Connected'}
        </div>
      </div>
      
      <p className="text-white/40 text-xs">
        Connect to Supabase to sync your data across devices and enable cloud storage. 
        Without Supabase, data is stored locally in the browser only.
      </p>

      {/* Connection Status Card */}
      <div className={`rounded-2xl p-4 border ${
        isSupabaseConnected 
          ? 'bg-green-safe/5 border-green-safe/20' 
          : dbStatus === 'no-tables'
            ? 'bg-yellow-500/5 border-yellow-500/20'
            : 'bg-dark-card border-white/5'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isSupabaseConnected ? 'bg-green-safe/10' : dbStatus === 'no-tables' ? 'bg-yellow-500/10' : 'bg-white/5'
          }`}>
            <Database className={`w-5 h-5 ${isSupabaseConnected ? 'text-green-safe' : dbStatus === 'no-tables' ? 'text-yellow-500' : 'text-white/30'}`} />
          </div>
          <div className="flex-1">
            <p className={`font-semibold text-sm ${
              isSupabaseConnected ? 'text-green-safe' : dbStatus === 'no-tables' ? 'text-yellow-500' : 'text-white/50'
            }`}>
              {dbStatus === 'checking' && '⏳ Checking connection...'}
              {dbStatus === 'connected' && '✅ Supabase Connected'}
              {dbStatus === 'no-tables' && '⚠️ Tables Not Found'}
              {dbStatus === 'error' && '❌ Connection Error'}
            </p>
            <p className="text-white/30 text-[11px]">
              {dbStatus === 'connected' && 'Data syncs automatically to cloud'}
              {dbStatus === 'no-tables' && 'Run the SQL schema below first'}
              {dbStatus === 'error' && 'Check your credentials'}
              {dbStatus === 'checking' && 'Please wait...'}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            {isSupabaseConnected && (
              <button 
                onClick={handleSync}
                disabled={syncing}
                className="bg-white/5 text-white/70 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Push to Supabase button - show when connected but empty */}
      {isSupabaseConnected && (
        <button
          onClick={async () => {
            setSyncing(true);
            await pushToSupabase();
            setSyncing(false);
            onSave();
          }}
          disabled={syncing}
          className="w-full bg-blue-deep text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <Upload className="w-4 h-4" />
          {syncing ? 'Uploading...' : 'Upload Local Data to Supabase'}
        </button>
      )}

      {/* Credentials */}
      <div className="bg-dark-card border border-white/5 rounded-2xl p-4 space-y-3">
        <h3 className="text-white font-semibold text-sm">Supabase Credentials</h3>
        <div>
          <label className="text-white/40 text-[11px]">Project URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://xxxxx.supabase.co"
            className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white mt-1 focus:outline-none focus:border-gold/30"
          />
        </div>
        <div>
          <label className="text-white/40 text-[11px]">Anon/Public Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-dark-surface border border-white/10 rounded-lg px-3 py-2 pr-10 text-xs text-white mt-1 focus:outline-none focus:border-gold/30"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5"
            >
              {showKey ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
            </button>
          </div>
        </div>
      </div>

      {/* How to get credentials */}
      <div className="bg-dark-card border border-white/5 rounded-2xl p-4">
        <h3 className="text-white font-semibold text-sm mb-2">📝 How to Setup Supabase</h3>
        <ol className="text-white/40 text-[11px] space-y-1.5 list-decimal list-inside">
          <li>Go to <span className="text-gold">supabase.com</span> and create a free account</li>
          <li>Create a new project (choose any name & password)</li>
          <li>Go to Project Settings → API</li>
          <li>Copy the <span className="text-white/60">Project URL</span> and <span className="text-white/60">anon/public</span> key</li>
          <li>Paste them above and click Save</li>
          <li>Go to SQL Editor and run the schema below</li>
        </ol>
      </div>

      {/* SQL Schema */}
      <div className="bg-dark-card border border-white/5 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold text-sm">📋 Database Schema (SQL)</h3>
          <button
            onClick={() => setShowSchema(!showSchema)}
            className="text-gold text-xs"
          >
            {showSchema ? 'Hide' : 'Show'}
          </button>
        </div>
        <p className="text-white/30 text-[10px] mb-2">
          Copy this SQL and run it in Supabase SQL Editor to create the required tables.
        </p>
        {showSchema && (
          <div className="relative">
            <pre className="bg-dark-surface rounded-lg p-3 text-[9px] text-green-safe/80 overflow-x-auto max-h-60 overflow-y-auto">
              {SUPABASE_SCHEMA}
            </pre>
            <button
              onClick={copySchema}
              className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 ${
                copied ? 'bg-green-safe text-white' : 'bg-white/10 text-white/50'
              }`}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-gold text-dark font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
      >
        <Save className="w-4 h-4" /> Save & Connect
      </button>
    </div>
  );
}
