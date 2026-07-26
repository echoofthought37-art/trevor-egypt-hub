export interface DeviceInfo {
  model: string;
  brand: string;
  os: string;
  osVersion: string;
  battery: number;
  charging: boolean;
  refreshRate: number;
  tier: 'low' | 'mid' | 'high' | 'ultra';
}

export interface SensiValues {
  general: number;
  redDot: number;
  twoX: number;
  fourX: number;
  sniper: number;
  freeLook: number;
  dpi: number;
  buttonSize: number;
}

export interface SensiConfig {
  generalBase: number;
  redDotBase: number;
  twoXBase: number;
  fourXBase: number;
  sniperBase: number;
  freeLookBase: number;
  dpiBase: number;
  buttonSizeBase: number;
  batteryMultiplier: number;
  refreshRateMultiplier: number;
  tierMultipliers: { low: number; mid: number; high: number; ultra: number };
}

export interface Product {
  id: string;
  title: string;
  price: string;
  category: 'diamonds' | 'skins' | 'bundles' | 'services' | 'accounts';
  image: string;
  status: 'available' | 'sold';
  featured: boolean;
  limitedStock: boolean;
  description?: string;
}

export interface Mod {
  id: string;
  name: string;
  version: string;
  safety: 'safe' | 'risky';
  downloadUrl: string;
  requiresKey: boolean;
}

export interface Proof {
  id: string;
  image: string;
  caption: string;
  date: string;
}

export interface SiteAssets {
  logo: string;
  heroBanner: string;
  diamondsImage: string;
  weaponSkinImage: string;
  characterBundleImage: string;
  rankBoostImage: string;
  proofDefaultImage: string;
  phoneMockupImage: string;
}

export interface Settings {
  whatsappNumber: string;
  tiktok: string;
  discord: string;
  youtube: string;
  whatsappGroup: string;
  tiktokFollowers: string;
  discordMembers: string;
  youtubeSubscribers: string;
  whatsappMembers: string;
  announcement: string;
  totalDeals: number;
  siteName: string;
  siteTagline: string;
}

export type TabId = 'home' | 'sensi' | 'vault' | 'profile';
