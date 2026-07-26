import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Mod, Proof, Settings, SiteAssets, SensiConfig } from '../types';

// ═══════════════════════════════════════════════════════════
// TREVOR EGYPT HUB - SUPABASE CONFIGURATION
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://jawctidmiepjnrhhiscn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphd2N0aWRtaWVwam5yaGhpc2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MTY0MTEsImV4cCI6MjEwMDI5MjQxMX0.v0YtieihMQBgoSPlvzWDGXou0tGY9BLNajNSPDE8myY';

// Create Supabase client
let supabaseClient: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
};

// Check if Supabase is configured (always true now since hardcoded)
export const isSupabaseConfigured = (): boolean => {
  return true;
};

// For backward compatibility
export const saveSupabaseConfig = (url: string, anonKey: string) => {
  // Not needed anymore since hardcoded, but keeping for compatibility
  localStorage.setItem('trevor_supabase_config', JSON.stringify({ url, anonKey }));
};

export const getSupabaseConfigValues = () => {
  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
};

// ═══════════════════════════════════════════════════════════
// DATABASE OPERATIONS
// ═══════════════════════════════════════════════════════════

// Products
export async function fetchProducts(): Promise<Product[] | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return null;
    }
    
    return data?.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      category: p.category,
      image: p.image || '',
      status: p.status,
      featured: p.featured,
      limitedStock: p.limited_stock,
      description: p.description,
    })) || [];
  } catch (e) {
    console.error('Products fetch error:', e);
    return null;
  }
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  try {
    const supabase = getSupabase();
    
    // Delete all existing and insert new
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (products.length === 0) return true;
    
    const { error } = await supabase.from('products').insert(
      products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        category: p.category,
        image: p.image,
        status: p.status,
        featured: p.featured,
        limited_stock: p.limitedStock,
        description: p.description || '',
      }))
    );
    
    if (error) {
      console.error('Error saving products:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Products save error:', e);
    return false;
  }
}

// Mods
export async function fetchMods(): Promise<Mod[] | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('mods')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching mods:', error);
      return null;
    }
    
    return data?.map(m => ({
      id: m.id,
      name: m.name,
      version: m.version,
      safety: m.safety,
      downloadUrl: m.download_url,
      requiresKey: m.requires_key,
    })) || [];
  } catch (e) {
    console.error('Mods fetch error:', e);
    return null;
  }
}

export async function saveMods(mods: Mod[]): Promise<boolean> {
  try {
    const supabase = getSupabase();
    
    await supabase.from('mods').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (mods.length === 0) return true;
    
    const { error } = await supabase.from('mods').insert(
      mods.map(m => ({
        id: m.id,
        name: m.name,
        version: m.version,
        safety: m.safety,
        download_url: m.downloadUrl,
        requires_key: m.requiresKey,
      }))
    );
    
    if (error) {
      console.error('Error saving mods:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Mods save error:', e);
    return false;
  }
}

// Proofs
export async function fetchProofs(): Promise<Proof[] | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('proofs')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching proofs:', error);
      return null;
    }
    
    return data?.map(p => ({
      id: p.id,
      image: p.image || '',
      caption: p.caption,
      date: p.date,
    })) || [];
  } catch (e) {
    console.error('Proofs fetch error:', e);
    return null;
  }
}

export async function saveProofs(proofs: Proof[]): Promise<boolean> {
  try {
    const supabase = getSupabase();
    
    await supabase.from('proofs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (proofs.length === 0) return true;
    
    const { error } = await supabase.from('proofs').insert(
      proofs.map(p => ({
        id: p.id,
        image: p.image,
        caption: p.caption,
        date: p.date,
      }))
    );
    
    if (error) {
      console.error('Error saving proofs:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Proofs save error:', e);
    return false;
  }
}

// Settings
export async function fetchSettings(): Promise<Settings | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'main')
      .single();
    
    if (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      whatsappNumber: data.whatsapp_number,
      tiktok: data.tiktok,
      discord: data.discord,
      youtube: data.youtube,
      whatsappGroup: data.whatsapp_group,
      tiktokFollowers: data.tiktok_followers,
      discordMembers: data.discord_members,
      youtubeSubscribers: data.youtube_subscribers,
      whatsappMembers: data.whatsapp_members,
      announcement: data.announcement,
      totalDeals: data.total_deals,
      siteName: data.site_name,
      siteTagline: data.site_tagline,
    };
  } catch (e) {
    console.error('Settings fetch error:', e);
    return null;
  }
}

export async function saveSettings(settings: Settings): Promise<boolean> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase.from('settings').upsert({
      id: 'main',
      whatsapp_number: settings.whatsappNumber,
      tiktok: settings.tiktok,
      discord: settings.discord,
      youtube: settings.youtube,
      whatsapp_group: settings.whatsappGroup,
      tiktok_followers: settings.tiktokFollowers,
      discord_members: settings.discordMembers,
      youtube_subscribers: settings.youtubeSubscribers,
      whatsapp_members: settings.whatsappMembers,
      announcement: settings.announcement,
      total_deals: settings.totalDeals,
      site_name: settings.siteName,
      site_tagline: settings.siteTagline,
    });
    
    if (error) {
      console.error('Error saving settings:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Settings save error:', e);
    return false;
  }
}

// Site Assets
export async function fetchSiteAssets(): Promise<SiteAssets | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('site_assets')
      .select('*')
      .eq('id', 'main')
      .single();
    
    if (error) {
      console.error('Error fetching site assets:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      logo: data.logo || '',
      heroBanner: data.hero_banner || '',
      diamondsImage: data.diamonds_image || '',
      weaponSkinImage: data.weapon_skin_image || '',
      characterBundleImage: data.character_bundle_image || '',
      rankBoostImage: data.rank_boost_image || '',
      proofDefaultImage: data.proof_default_image || '',
      phoneMockupImage: data.phone_mockup_image || '',
    };
  } catch (e) {
    console.error('Site assets fetch error:', e);
    return null;
  }
}

export async function saveSiteAssets(assets: SiteAssets): Promise<boolean> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase.from('site_assets').upsert({
      id: 'main',
      logo: assets.logo,
      hero_banner: assets.heroBanner,
      diamonds_image: assets.diamondsImage,
      weapon_skin_image: assets.weaponSkinImage,
      character_bundle_image: assets.characterBundleImage,
      rank_boost_image: assets.rankBoostImage,
      proof_default_image: assets.proofDefaultImage,
      phone_mockup_image: assets.phoneMockupImage,
    });
    
    if (error) {
      console.error('Error saving site assets:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Site assets save error:', e);
    return false;
  }
}

// Sensi Config
export async function fetchSensiConfig(): Promise<SensiConfig | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('sensi_config')
      .select('*')
      .eq('id', 'main')
      .single();
    
    if (error) {
      console.error('Error fetching sensi config:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      generalBase: data.general_base,
      redDotBase: data.red_dot_base,
      twoXBase: data.two_x_base,
      fourXBase: data.four_x_base,
      sniperBase: data.sniper_base,
      freeLookBase: data.free_look_base,
      dpiBase: data.dpi_base,
      buttonSizeBase: data.button_size_base,
      batteryMultiplier: data.battery_multiplier,
      refreshRateMultiplier: data.refresh_rate_multiplier,
      tierMultipliers: data.tier_multipliers,
    };
  } catch (e) {
    console.error('Sensi config fetch error:', e);
    return null;
  }
}

export async function saveSensiConfig(config: SensiConfig): Promise<boolean> {
  try {
    const supabase = getSupabase();
    
    const { error } = await supabase.from('sensi_config').upsert({
      id: 'main',
      general_base: config.generalBase,
      red_dot_base: config.redDotBase,
      two_x_base: config.twoXBase,
      four_x_base: config.fourXBase,
      sniper_base: config.sniperBase,
      free_look_base: config.freeLookBase,
      dpi_base: config.dpiBase,
      button_size_base: config.buttonSizeBase,
      battery_multiplier: config.batteryMultiplier,
      refresh_rate_multiplier: config.refreshRateMultiplier,
      tier_multipliers: config.tierMultipliers,
    });
    
    if (error) {
      console.error('Error saving sensi config:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Sensi config save error:', e);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// CHECK IF TABLES EXIST
// ═══════════════════════════════════════════════════════════

export async function checkTablesExist(): Promise<boolean> {
  try {
    const supabase = getSupabase();
    // Try to query settings table
    const { error } = await supabase.from('settings').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// INITIALIZE DATABASE - Push local data to Supabase
// ═══════════════════════════════════════════════════════════

export async function initializeDatabase(
  products: Product[],
  mods: Mod[],
  proofs: Proof[],
  settings: Settings,
  siteAssets: SiteAssets,
  sensiConfig: SensiConfig
): Promise<boolean> {
  try {
    console.log('Initializing database with local data...');
    
    const results = await Promise.all([
      saveProducts(products),
      saveMods(mods),
      saveProofs(proofs),
      saveSettings(settings),
      saveSiteAssets(siteAssets),
      saveSensiConfig(sensiConfig),
    ]);
    
    const allSuccess = results.every(r => r);
    console.log('Database initialization:', allSuccess ? 'SUCCESS' : 'PARTIAL FAILURE');
    return allSuccess;
  } catch (e) {
    console.error('Database initialization error:', e);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// SQL SCHEMA - Run this in Supabase SQL Editor
// ═══════════════════════════════════════════════════════════
export const SUPABASE_SCHEMA = `
-- ═══════════════════════════════════════════════════════════
-- TREVOR EGYPT HUB - DATABASE SCHEMA
-- Run this in Supabase SQL Editor (one time only)
-- ═══════════════════════════════════════════════════════════

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  status TEXT DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  limited_stock BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mods table
CREATE TABLE IF NOT EXISTS mods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  safety TEXT DEFAULT 'safe',
  download_url TEXT,
  requires_key BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proofs table
CREATE TABLE IF NOT EXISTS proofs (
  id TEXT PRIMARY KEY,
  image TEXT,
  caption TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (single row)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  whatsapp_number TEXT,
  tiktok TEXT,
  discord TEXT,
  youtube TEXT,
  whatsapp_group TEXT,
  tiktok_followers TEXT,
  discord_members TEXT,
  youtube_subscribers TEXT,
  whatsapp_members TEXT,
  announcement TEXT,
  total_deals INTEGER DEFAULT 0,
  site_name TEXT DEFAULT 'TREVOR EGYPT HUB',
  site_tagline TEXT DEFAULT 'Premium Free Fire Services',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Assets table (single row)
CREATE TABLE IF NOT EXISTS site_assets (
  id TEXT PRIMARY KEY DEFAULT 'main',
  logo TEXT,
  hero_banner TEXT,
  diamonds_image TEXT,
  weapon_skin_image TEXT,
  character_bundle_image TEXT,
  rank_boost_image TEXT,
  proof_default_image TEXT,
  phone_mockup_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sensi Config table (single row)
CREATE TABLE IF NOT EXISTS sensi_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  general_base INTEGER DEFAULT 170,
  red_dot_base INTEGER DEFAULT 156,
  two_x_base INTEGER DEFAULT 144,
  four_x_base INTEGER DEFAULT 116,
  sniper_base INTEGER DEFAULT 90,
  free_look_base INTEGER DEFAULT 136,
  dpi_base INTEGER DEFAULT 450,
  button_size_base INTEGER DEFAULT 65,
  battery_multiplier DECIMAL DEFAULT 0.15,
  refresh_rate_multiplier DECIMAL DEFAULT 0.08,
  tier_multipliers JSONB DEFAULT '{"low": 0.85, "mid": 1.0, "high": 1.1, "ultra": 1.18}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) - Allow public read/write
-- ═══════════════════════════════════════════════════════════

-- Disable RLS for simplicity (or enable with policies below)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE mods DISABLE ROW LEVEL SECURITY;
ALTER TABLE proofs DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensi_config DISABLE ROW LEVEL SECURITY;

-- Grant access to anon role
GRANT ALL ON products TO anon;
GRANT ALL ON mods TO anon;
GRANT ALL ON proofs TO anon;
GRANT ALL ON settings TO anon;
GRANT ALL ON site_assets TO anon;
GRANT ALL ON sensi_config TO anon;

-- ═══════════════════════════════════════════════════════════
-- DONE! Your database is ready.
-- ═══════════════════════════════════════════════════════════
`;
