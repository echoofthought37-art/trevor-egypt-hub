import { DeviceInfo, SensiValues, SensiConfig, Product, Mod, Proof, Settings, SiteAssets } from './types';

// Default sensi config (admin-editable) - MAX IS 200
export const defaultSensiConfig: SensiConfig = {
  generalBase: 170,
  redDotBase: 156,
  twoXBase: 144,
  fourXBase: 116,
  sniperBase: 90,
  freeLookBase: 136,
  dpiBase: 450,
  buttonSizeBase: 65,
  batteryMultiplier: 0.15,
  refreshRateMultiplier: 0.08,
  tierMultipliers: { low: 0.85, mid: 1.0, high: 1.1, ultra: 1.18 },
};

// Dynamic sensi engine - MAX 200
export function calculateSensi(device: DeviceInfo, config: SensiConfig): SensiValues {
  const tierMult = config.tierMultipliers[device.tier];
  const batteryFactor = 1 + (device.battery / 100 - 0.5) * config.batteryMultiplier;
  const refreshFactor = 1 + (device.refreshRate / 120 - 0.5) * config.refreshRateMultiplier;
  const factor = tierMult * batteryFactor * refreshFactor;

  const clamp = (v: number, min: number, max: number) => Math.round(Math.min(max, Math.max(min, v)));

  return {
    general: clamp(config.generalBase * factor, 50, 200),
    redDot: clamp(config.redDotBase * factor, 40, 200),
    twoX: clamp(config.twoXBase * factor, 35, 190),
    fourX: clamp(config.fourXBase * factor, 25, 170),
    sniper: clamp(config.sniperBase * factor, 20, 150),
    freeLook: clamp(config.freeLookBase * factor, 40, 180),
    dpi: clamp(config.dpiBase * factor, 200, 800),
    buttonSize: clamp(config.buttonSizeBase * factor, 40, 100),
  };
}

// Device brand/model database for accurate detection
const deviceDatabase: Record<string, { brand: string; name: string }> = {
  // Samsung Galaxy S Series
  'SM-S928': { brand: 'Samsung', name: 'Galaxy S24 Ultra' },
  'SM-S926': { brand: 'Samsung', name: 'Galaxy S24+' },
  'SM-S921': { brand: 'Samsung', name: 'Galaxy S24' },
  'SM-S918': { brand: 'Samsung', name: 'Galaxy S23 Ultra' },
  'SM-S916': { brand: 'Samsung', name: 'Galaxy S23+' },
  'SM-S911': { brand: 'Samsung', name: 'Galaxy S23' },
  'SM-S908': { brand: 'Samsung', name: 'Galaxy S22 Ultra' },
  'SM-S906': { brand: 'Samsung', name: 'Galaxy S22+' },
  'SM-S901': { brand: 'Samsung', name: 'Galaxy S22' },
  'SM-G998': { brand: 'Samsung', name: 'Galaxy S21 Ultra' },
  'SM-G996': { brand: 'Samsung', name: 'Galaxy S21+' },
  'SM-G991': { brand: 'Samsung', name: 'Galaxy S21' },
  'SM-G988': { brand: 'Samsung', name: 'Galaxy S20 Ultra' },
  'SM-G986': { brand: 'Samsung', name: 'Galaxy S20+' },
  'SM-G981': { brand: 'Samsung', name: 'Galaxy S20' },
  // Samsung Galaxy A Series
  'SM-A556': { brand: 'Samsung', name: 'Galaxy A55' },
  'SM-A546': { brand: 'Samsung', name: 'Galaxy A54' },
  'SM-A536': { brand: 'Samsung', name: 'Galaxy A53' },
  'SM-A526': { brand: 'Samsung', name: 'Galaxy A52' },
  'SM-A356': { brand: 'Samsung', name: 'Galaxy A35' },
  'SM-A346': { brand: 'Samsung', name: 'Galaxy A34' },
  'SM-A336': { brand: 'Samsung', name: 'Galaxy A33' },
  'SM-A256': { brand: 'Samsung', name: 'Galaxy A25' },
  'SM-A246': { brand: 'Samsung', name: 'Galaxy A24' },
  'SM-A156': { brand: 'Samsung', name: 'Galaxy A15' },
  'SM-A146': { brand: 'Samsung', name: 'Galaxy A14' },
  'SM-A137': { brand: 'Samsung', name: 'Galaxy A13' },
  'SM-A127': { brand: 'Samsung', name: 'Galaxy A12' },
  'SM-A057': { brand: 'Samsung', name: 'Galaxy A05s' },
  'SM-A055': { brand: 'Samsung', name: 'Galaxy A05' },
  // Samsung Galaxy M Series
  'SM-M546': { brand: 'Samsung', name: 'Galaxy M54' },
  'SM-M536': { brand: 'Samsung', name: 'Galaxy M53' },
  'SM-M346': { brand: 'Samsung', name: 'Galaxy M34' },
  'SM-M336': { brand: 'Samsung', name: 'Galaxy M33' },
  'SM-M146': { brand: 'Samsung', name: 'Galaxy M14' },
  // Samsung Galaxy F Series
  'SM-E546': { brand: 'Samsung', name: 'Galaxy F54' },
  'SM-E236': { brand: 'Samsung', name: 'Galaxy F23' },
  // Samsung Fold/Flip
  'SM-F946': { brand: 'Samsung', name: 'Galaxy Z Fold 5' },
  'SM-F936': { brand: 'Samsung', name: 'Galaxy Z Fold 4' },
  'SM-F731': { brand: 'Samsung', name: 'Galaxy Z Flip 5' },
  'SM-F721': { brand: 'Samsung', name: 'Galaxy Z Flip 4' },
  // Xiaomi
  '2201116SG': { brand: 'Xiaomi', name: 'Xiaomi 12' },
  '2203121C': { brand: 'Xiaomi', name: 'Xiaomi 12 Pro' },
  '2304FPN6DC': { brand: 'Xiaomi', name: 'Xiaomi 13' },
  '2210132C': { brand: 'Xiaomi', name: 'Xiaomi 13 Pro' },
  '23116PN5BC': { brand: 'Xiaomi', name: 'Xiaomi 14' },
  '23127PN0CC': { brand: 'Xiaomi', name: 'Xiaomi 14 Pro' },
  // Redmi
  '22101316G': { brand: 'Redmi', name: 'Redmi Note 12' },
  '23021RAA2Y': { brand: 'Redmi', name: 'Redmi Note 12 Pro' },
  '23076RN4BI': { brand: 'Redmi', name: 'Redmi Note 13' },
  '23090RA98G': { brand: 'Redmi', name: 'Redmi Note 13 Pro' },
  '22111317PG': { brand: 'Redmi', name: 'Redmi 12' },
  '23053RN02A': { brand: 'Redmi', name: 'Redmi 12C' },
  '220733SG': { brand: 'Redmi', name: 'Redmi A1' },
  '23028RA60L': { brand: 'Redmi', name: 'Redmi A2' },
  // POCO
  '22071219CG': { brand: 'POCO', name: 'POCO X4 GT' },
  '22041219PG': { brand: 'POCO', name: 'POCO F4' },
  '23049PCD8G': { brand: 'POCO', name: 'POCO F5' },
  '23013PC75G': { brand: 'POCO', name: 'POCO X5 Pro' },
  '22101320G': { brand: 'POCO', name: 'POCO X5' },
  '2312DRA50G': { brand: 'POCO', name: 'POCO M6 Pro' },
  // Realme
  'RMX3630': { brand: 'Realme', name: 'Realme 11 Pro+' },
  'RMX3771': { brand: 'Realme', name: 'Realme GT Neo 5' },
  'RMX3800': { brand: 'Realme', name: 'Realme GT 5' },
  'RMX3393': { brand: 'Realme', name: 'Realme GT 2 Pro' },
  'RMX3761': { brand: 'Realme', name: 'Realme 12 Pro+' },
  'RMX3516': { brand: 'Realme', name: 'Realme 9 Pro+' },
  'RMX3506': { brand: 'Realme', name: 'Realme 9 Pro' },
  'RMX3491': { brand: 'Realme', name: 'Realme 9i' },
  'RMX3710': { brand: 'Realme', name: 'Realme C55' },
  'RMX3690': { brand: 'Realme', name: 'Realme C53' },
  'RMX3760': { brand: 'Realme', name: 'Realme C67' },
  // OPPO
  'CPH2451': { brand: 'OPPO', name: 'OPPO Reno 8' },
  'CPH2493': { brand: 'OPPO', name: 'OPPO Reno 10 Pro+' },
  'CPH2525': { brand: 'OPPO', name: 'OPPO Find X6 Pro' },
  'CPH2505': { brand: 'OPPO', name: 'OPPO A78' },
  'CPH2477': { brand: 'OPPO', name: 'OPPO A58' },
  'CPH2579': { brand: 'OPPO', name: 'OPPO A98' },
  // Vivo
  'V2254': { brand: 'Vivo', name: 'Vivo X90 Pro' },
  'V2219': { brand: 'Vivo', name: 'Vivo Y36' },
  'V2238': { brand: 'Vivo', name: 'Vivo Y56' },
  'V2239': { brand: 'Vivo', name: 'Vivo Y35' },
  'V2237': { brand: 'Vivo', name: 'Vivo Y22s' },
  'V2204': { brand: 'Vivo', name: 'Vivo T1 Pro' },
  // Infinix
  'X6831': { brand: 'Infinix', name: 'Infinix Note 30' },
  'X6711': { brand: 'Infinix', name: 'Infinix Hot 30' },
  'X6515': { brand: 'Infinix', name: 'Infinix GT 10 Pro' },
  'X6826': { brand: 'Infinix', name: 'Infinix Note 30 Pro' },
  'X6710': { brand: 'Infinix', name: 'Infinix Hot 30i' },
  'X6525': { brand: 'Infinix', name: 'Infinix Smart 7' },
  'X670': { brand: 'Infinix', name: 'Infinix Hot 12' },
  'X6817': { brand: 'Infinix', name: 'Infinix Hot 40 Pro' },
  'X6837': { brand: 'Infinix', name: 'Infinix Note 40 Pro' },
  // Tecno
  'CK7n': { brand: 'Tecno', name: 'Tecno Camon 20 Pro' },
  'CH9n': { brand: 'Tecno', name: 'Tecno Phantom X2' },
  'CK6n': { brand: 'Tecno', name: 'Tecno Camon 19 Pro' },
  'CE7j': { brand: 'Tecno', name: 'Tecno Spark 10 Pro' },
  'CE8': { brand: 'Tecno', name: 'Tecno Spark 10' },
  'BG6': { brand: 'Tecno', name: 'Tecno Pop 7' },
  'CK8n': { brand: 'Tecno', name: 'Tecno Camon 30 Pro' },
  // itel
  'itel A665L': { brand: 'itel', name: 'itel A60s' },
  'itel P40': { brand: 'itel', name: 'itel P40' },
  'itel S23': { brand: 'itel', name: 'itel S23' },
  // OnePlus
  'NE2215': { brand: 'OnePlus', name: 'OnePlus 10 Pro' },
  'CPH2449': { brand: 'OnePlus', name: 'OnePlus 11' },
  'CPH2451OP': { brand: 'OnePlus', name: 'OnePlus 12' },
  'IV2201': { brand: 'OnePlus', name: 'OnePlus Nord CE 3' },
  'CPH2493OP': { brand: 'OnePlus', name: 'OnePlus Nord 3' },
  // Huawei
  'NOH-NX9': { brand: 'Huawei', name: 'Huawei Mate 40 Pro' },
  'OCE-AN10': { brand: 'Huawei', name: 'Huawei Mate 50 Pro' },
  // Google Pixel
  'Pixel 8 Pro': { brand: 'Google', name: 'Pixel 8 Pro' },
  'Pixel 8': { brand: 'Google', name: 'Pixel 8' },
  'Pixel 7 Pro': { brand: 'Google', name: 'Pixel 7 Pro' },
  'Pixel 7': { brand: 'Google', name: 'Pixel 7' },
  'Pixel 6 Pro': { brand: 'Google', name: 'Pixel 6 Pro' },
  'Pixel 6': { brand: 'Google', name: 'Pixel 6' },
};

// Improved device detection with multiple fallback methods
export function detectDevice(): Promise<DeviceInfo> {
  return new Promise(async (resolve) => {
    const ua = navigator.userAgent;
    let model = '';
    let brand = '';
    let os = 'Unknown';
    let osVersion = '';
    let tier: DeviceInfo['tier'] = 'mid';

    console.log('User Agent:', ua); // Debug

    // Android detection
    if (/Android/.test(ua)) {
      const androidMatch = ua.match(/Android\s*([\d.]+)/);
      osVersion = androidMatch ? androidMatch[1] : '';
      os = 'Android';

      // Multiple patterns to extract device model
      let rawModel = '';
      
      // Pattern 1: Standard format - "Android X.X; MODEL Build/"
      const pattern1 = ua.match(/Android[^;]*;\s*([^;)]+?)\s*(?:Build|MIUI)/i);
      if (pattern1) rawModel = pattern1[1].trim();
      
      // Pattern 2: With locale - "Android X.X; en-us; MODEL Build/"
      if (!rawModel) {
        const pattern2 = ua.match(/Android[^;]*;[^;]*;\s*([^;)]+?)\s*Build/i);
        if (pattern2) rawModel = pattern2[1].trim();
      }
      
      // Pattern 3: Simple extraction between Android and Build
      if (!rawModel) {
        const pattern3 = ua.match(/\(Linux;[^)]*Android[^;]*;([^)]+)\)/i);
        if (pattern3) {
          const parts = pattern3[1].split(';');
          rawModel = parts[parts.length - 1].replace(/Build.*$/i, '').trim();
        }
      }
      
      // Pattern 4: Look for known device identifiers anywhere in UA
      if (!rawModel) {
        const pattern4 = ua.match(/(SM-[A-Z]\d{3,4}[A-Z]?|RMX\d{4}|CPH\d{4}|V\d{4}|X\d{3,4}|CK\d[a-z]|CE\d[a-z]?|BG\d)/i);
        if (pattern4) rawModel = pattern4[1];
      }

      console.log('Raw Model:', rawModel); // Debug

      if (rawModel) {
        // Clean up the model string
        rawModel = rawModel.replace(/Build.*$/i, '').replace(/MIUI.*$/i, '').trim();
        
        // Check database for exact match first
        let found = false;
        for (const [code, info] of Object.entries(deviceDatabase)) {
          if (rawModel.toUpperCase().includes(code.toUpperCase())) {
            brand = info.brand;
            model = info.name;
            found = true;
            break;
          }
        }
        
        // If not in database, parse the model string for brand
        if (!found) {
          // Samsung
          if (/^SM-/i.test(rawModel)) {
            brand = 'Samsung';
            // Try to decode Samsung model
            const samsungMatch = rawModel.match(/SM-([AGMESF])(\d{3})/i);
            if (samsungMatch) {
              const series: Record<string, string> = { 'S': 'Galaxy S', 'A': 'Galaxy A', 'M': 'Galaxy M', 'G': 'Galaxy S', 'F': 'Galaxy Z', 'E': 'Galaxy F' };
              model = `${series[samsungMatch[1].toUpperCase()] || 'Galaxy'} ${rawModel}`;
            } else {
              model = `Samsung ${rawModel}`;
            }
          }
          // Xiaomi/Redmi/POCO
          else if (/redmi/i.test(rawModel)) {
            brand = 'Redmi';
            model = rawModel;
          }
          else if (/poco/i.test(rawModel)) {
            brand = 'POCO';
            model = rawModel;
          }
          else if (/mi\s/i.test(rawModel) || /xiaomi/i.test(rawModel)) {
            brand = 'Xiaomi';
            model = rawModel;
          }
          // Realme
          else if (/^RMX/i.test(rawModel) || /realme/i.test(rawModel)) {
            brand = 'Realme';
            model = /realme/i.test(rawModel) ? rawModel : `Realme ${rawModel}`;
          }
          // OPPO
          else if (/^CPH/i.test(rawModel) || /oppo/i.test(rawModel)) {
            brand = 'OPPO';
            model = /oppo/i.test(rawModel) ? rawModel : `OPPO ${rawModel}`;
          }
          // Vivo
          else if (/^V\d{4}/i.test(rawModel) || /vivo/i.test(rawModel)) {
            brand = 'Vivo';
            model = /vivo/i.test(rawModel) ? rawModel : `Vivo ${rawModel}`;
          }
          // Infinix
          else if (/^X\d{3,4}/i.test(rawModel) || /infinix/i.test(rawModel)) {
            brand = 'Infinix';
            model = /infinix/i.test(rawModel) ? rawModel : `Infinix ${rawModel}`;
          }
          // Tecno
          else if (/^(CK|CE|CH|BG)\d/i.test(rawModel) || /tecno/i.test(rawModel)) {
            brand = 'Tecno';
            model = /tecno/i.test(rawModel) ? rawModel : `Tecno ${rawModel}`;
          }
          // itel
          else if (/itel/i.test(rawModel)) {
            brand = 'itel';
            model = rawModel;
          }
          // Huawei
          else if (/huawei/i.test(rawModel) || /honor/i.test(rawModel)) {
            brand = rawModel.toLowerCase().includes('honor') ? 'Honor' : 'Huawei';
            model = rawModel;
          }
          // Google Pixel
          else if (/pixel/i.test(rawModel)) {
            brand = 'Google';
            model = rawModel;
          }
          // OnePlus
          else if (/oneplus/i.test(rawModel)) {
            brand = 'OnePlus';
            model = rawModel;
          }
          // Generic fallback
          else {
            // Try to extract brand from first word
            const parts = rawModel.split(/[\s_-]/);
            if (parts.length > 0) {
              brand = parts[0];
              model = rawModel;
            } else {
              brand = 'Android';
              model = rawModel;
            }
          }
        }
      }
      
      // Last resort - if still no model
      if (!model) {
        model = 'Android Device';
        brand = 'Android';
      }
    } 
    // iOS detection
    else if (/iPhone|iPad|iPod/.test(ua)) {
      os = 'iOS';
      brand = 'Apple';
      
      const iosMatch = ua.match(/OS\s*([\d_]+)/);
      osVersion = iosMatch ? iosMatch[1].replace(/_/g, '.') : '';
      
      if (/iPhone/.test(ua)) {
        // Detect iPhone model from screen dimensions
        const screenWidth = Math.min(window.screen.width, window.screen.height);
        const screenHeight = Math.max(window.screen.width, window.screen.height);
        
        // Use logical dimensions for comparison
        const logicalWidth = screenWidth;
        const logicalHeight = screenHeight;
        
        if (logicalWidth >= 430 && logicalHeight >= 932) {
          model = 'iPhone 15 Pro Max';
        } else if (logicalWidth >= 393 && logicalHeight >= 852) {
          model = 'iPhone 15 Pro';
        } else if (logicalWidth >= 390 && logicalHeight >= 844) {
          model = 'iPhone 14 / 15';
        } else if (logicalWidth >= 428 && logicalHeight >= 926) {
          model = 'iPhone 14 Plus';
        } else if (logicalWidth >= 414 && logicalHeight >= 896) {
          model = 'iPhone 11 Pro Max / XS Max';
        } else if (logicalWidth >= 375 && logicalHeight >= 812) {
          model = 'iPhone 12 / 13 / 14';
        } else if (logicalWidth >= 375 && logicalHeight >= 667) {
          model = 'iPhone 8 / SE';
        } else {
          model = 'iPhone';
        }
      } else if (/iPad/.test(ua)) {
        model = 'iPad';
      } else {
        model = 'iPod';
      }
    } 
    // Windows
    else if (/Windows/.test(ua)) {
      os = 'Windows';
      brand = 'PC';
      const winMatch = ua.match(/Windows NT ([\d.]+)/);
      osVersion = winMatch ? winMatch[1] : '';
      model = 'Windows PC';
    } 
    // Mac
    else if (/Mac/.test(ua)) {
      os = 'macOS';
      brand = 'Apple';
      model = 'Mac';
    }
    // Linux
    else if (/Linux/.test(ua)) {
      os = 'Linux';
      brand = 'Linux';
      model = 'Linux Device';
    }

    // Tier detection based on memory and cores
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    if (memory <= 2 || cores <= 2) tier = 'low';
    else if (memory <= 4 || cores <= 4) tier = 'mid';
    else if (memory <= 6 || cores <= 6) tier = 'high';
    else tier = 'ultra';

    // Battery API
    let battery = 75;
    let charging = false;
    try {
      const batt = await (navigator as any).getBattery?.();
      if (batt) {
        battery = Math.round(batt.level * 100);
        charging = batt.charging;
      }
    } catch {}

    // Refresh rate estimation
    let refreshRate = 60;
    try {
      const times: number[] = [];
      let last = 0;
      await new Promise<void>((res) => {
        let count = 0;
        const loop = (ts: number) => {
          if (last) times.push(ts - last);
          last = ts;
          count++;
          if (count > 20) {
            res();
            return;
          }
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      });
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const est = Math.round(1000 / avg);
      if (est > 100) refreshRate = 120;
      else if (est > 75) refreshRate = 90;
      else refreshRate = 60;
    } catch {
      refreshRate = 60;
    }

    console.log('Detected:', { model, brand, os, osVersion }); // Debug
    resolve({ model, brand, os, osVersion, battery, charging, refreshRate, tier });
  });
}

// Default site assets (using generated images)
export const defaultSiteAssets: SiteAssets = {
  logo: '',
  heroBanner: '/images/hero-banner.jpg',
  diamondsImage: '/images/diamonds.jpg',
  weaponSkinImage: '/images/weapon-skin.jpg',
  characterBundleImage: '/images/character-bundle.jpg',
  rankBoostImage: '/images/rank-boost.jpg',
  proofDefaultImage: '/images/proof-wall.jpg',
  phoneMockupImage: '/images/phone-mockup.jpg',
};

// Default data - PRICES IN NAIRA (₦)
export const defaultProducts: Product[] = [
  { id: '1', title: '1,000 Diamonds', price: '₦1,500', category: 'diamonds', image: '', status: 'available', featured: false, limitedStock: false },
  { id: '2', title: '2,000 Diamonds', price: '₦2,800', category: 'diamonds', image: '', status: 'available', featured: false, limitedStock: false },
  { id: '3', title: '5,000 Diamonds', price: '₦6,500', category: 'diamonds', image: '', status: 'available', featured: true, limitedStock: false },
  { id: '4', title: '10,000 Diamonds', price: '₦12,000', category: 'diamonds', image: '', status: 'available', featured: false, limitedStock: true },
  { id: '5', title: 'Dragon AK47 Skin', price: '₦4,000', category: 'skins', image: '', status: 'available', featured: true, limitedStock: true },
  { id: '6', title: 'M1887 Golden Glare', price: '₦5,500', category: 'skins', image: '', status: 'available', featured: false, limitedStock: false },
  { id: '7', title: 'Criminal Bundle (Green)', price: '₦8,000', category: 'bundles', image: '', status: 'available', featured: true, limitedStock: true },
  { id: '8', title: 'Hip Hop Bundle', price: '₦6,000', category: 'bundles', image: '', status: 'available', featured: false, limitedStock: false },
  { id: '9', title: 'Sakura Bundle', price: '₦10,000', category: 'bundles', image: '', status: 'available', featured: true, limitedStock: true },
  { id: '10', title: 'Rank Boost → Heroic', price: '₦3,500', category: 'services', image: '', status: 'available', featured: false, limitedStock: false },
  { id: '11', title: 'Rank Boost → Grandmaster', price: '₦7,000', category: 'services', image: '', status: 'available', featured: true, limitedStock: false },
  { id: '12', title: 'Account Recovery', price: '₦2,000', category: 'services', image: '', status: 'available', featured: false, limitedStock: false },
  { id: '13', title: 'Heroic Account (Full Access)', price: '₦15,000', category: 'accounts', image: '', status: 'available', featured: true, limitedStock: true },
  { id: '14', title: 'Grandmaster Account', price: '₦25,000', category: 'accounts', image: '', status: 'available', featured: true, limitedStock: true },
  { id: '15', title: 'Loaded Account (50K+ Diamonds)', price: '₦50,000', category: 'accounts', image: '', status: 'available', featured: false, limitedStock: true },
];

export const defaultMods: Mod[] = [
  // Aim & Headshot Mods
  { id: '1', name: 'Aim Assist Pro', version: 'v4.2.1', safety: 'safe', downloadUrl: '#', requiresKey: false },
  { id: '2', name: 'Auto Headshot', version: 'v3.8.0', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '3', name: 'Headshot Hack 99%', version: 'v5.1.2', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '4', name: 'One Tap Headshot', version: 'v2.4.0', safety: 'safe', downloadUrl: '#', requiresKey: true },
  
  // ESP & Wallhack
  { id: '5', name: 'ESP Wallhack', version: 'v6.0.1', safety: 'safe', downloadUrl: '#', requiresKey: false },
  { id: '6', name: 'Wall Hack Pro', version: 'v4.5.3', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '7', name: 'Enemy Location ESP', version: 'v3.2.0', safety: 'safe', downloadUrl: '#', requiresKey: false },
  { id: '8', name: 'Box ESP + Name', version: 'v2.8.1', safety: 'safe', downloadUrl: '#', requiresKey: false },
  
  // Hologram & Teleport
  { id: '9', name: 'Hologram Hack', version: 'v1.5.0', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '10', name: 'Teleport Mod', version: 'v2.0.4', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '11', name: 'Invisible Mode', version: 'v1.2.3', safety: 'safe', downloadUrl: '#', requiresKey: true },
  
  // Speed & Movement
  { id: '12', name: 'Speed Hack', version: 'v3.1.0', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '13', name: 'Fast Run Mod', version: 'v2.5.1', safety: 'safe', downloadUrl: '#', requiresKey: false },
  { id: '14', name: 'High Jump', version: 'v1.8.2', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '15', name: 'No Recoil', version: 'v4.0.0', safety: 'safe', downloadUrl: '#', requiresKey: false },
  
  // Damage & Weapon
  { id: '16', name: 'Damage Hack x5', version: 'v2.3.1', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '17', name: 'Unlimited Ammo', version: 'v3.0.2', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '18', name: 'Auto Fire', version: 'v1.9.0', safety: 'safe', downloadUrl: '#', requiresKey: false },
  { id: '19', name: 'Rapid Fire Mod', version: 'v2.1.4', safety: 'safe', downloadUrl: '#', requiresKey: true },
  
  // Antenna & Detection
  { id: '20', name: 'Antenna Hack', version: 'v3.5.0', safety: 'safe', downloadUrl: '#', requiresKey: false },
  { id: '21', name: 'Enemy Detector', version: 'v2.7.1', safety: 'safe', downloadUrl: '#', requiresKey: false },
  { id: '22', name: 'Loot ESP', version: 'v1.6.3', safety: 'safe', downloadUrl: '#', requiresKey: false },
  
  // Anti-Ban & Safety
  { id: '23', name: 'Anti-Ban Shield', version: 'v5.0.0', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '24', name: 'Ghost Mode', version: 'v2.2.0', safety: 'safe', downloadUrl: '#', requiresKey: true },
  
  // Sensi & Configs
  { id: '25', name: 'Pro Player Config', version: 'v4.1.0', safety: 'safe', downloadUrl: '#', requiresKey: false },
  { id: '26', name: 'Drag Headshot Config', version: 'v3.3.2', safety: 'safe', downloadUrl: '#', requiresKey: false },
  { id: '27', name: 'AWM One Shot Config', version: 'v2.0.1', safety: 'safe', downloadUrl: '#', requiresKey: false },
  
  // VIP Mods
  { id: '28', name: 'VIP Mod Menu', version: 'v6.5.0', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '29', name: 'All-in-One Hack', version: 'v7.0.0', safety: 'safe', downloadUrl: '#', requiresKey: true },
  { id: '30', name: 'Diamond Generator', version: 'v1.0.0', safety: 'safe', downloadUrl: '#', requiresKey: true },
];

export const defaultProofs: Proof[] = [
  { id: '1', image: '', caption: 'Diamond top-up — 5,000 delivered ✅', date: '2025-01-15' },
  { id: '2', image: '', caption: 'Rank boost Silver → Heroic 🏆', date: '2025-01-14' },
  { id: '3', image: '', caption: 'Account recovery successful ✅', date: '2025-01-13' },
  { id: '4', image: '', caption: 'Grandmaster push complete 🔥', date: '2025-01-12' },
  { id: '5', image: '', caption: '10,000 diamonds delivered 💎', date: '2025-01-11' },
  { id: '6', image: '', caption: 'Criminal bundle claimed ✅', date: '2025-01-10' },
];

export const defaultSettings: Settings = {
  whatsappNumber: '+2348012345678',
  tiktok: 'https://tiktok.com/@trevor_nigeria',
  discord: 'https://discord.gg/trevor',
  youtube: 'https://youtube.com/@trevor_nigeria',
  whatsappGroup: 'https://chat.whatsapp.com/trevor',
  tiktokFollowers: '25.4K',
  discordMembers: '3.2K',
  youtubeSubscribers: '12.8K',
  whatsappMembers: '5.1K',
  announcement: '🔥 Flash Sale: 50% OFF all Diamond packs today only!',
  totalDeals: 2847,
  siteName: 'TREVOR EGYPT HUB',
  siteTagline: 'Premium Free Fire Services',
};

// LocalStorage helpers
const STORAGE_KEYS = {
  sensiConfig: 'trevor_sensi_config',
  products: 'trevor_products',
  mods: 'trevor_mods',
  proofs: 'trevor_proofs',
  settings: 'trevor_settings',
  siteAssets: 'trevor_site_assets',
  adminAuth: 'trevor_admin_auth',
};

export function loadData<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

// Helper to get product image with fallback
export function getProductImage(product: Product, assets: SiteAssets): string {
  if (product.image) return product.image;
  switch (product.category) {
    case 'diamonds': return assets.diamondsImage;
    case 'skins': return assets.weaponSkinImage;
    case 'bundles': return assets.characterBundleImage;
    case 'services': return assets.rankBoostImage;
    case 'accounts': return assets.rankBoostImage;
    default: return assets.diamondsImage;
  }
}

// Helper to get proof image with fallback
export function getProofImage(proof: Proof, assets: SiteAssets): string {
  return proof.image || assets.proofDefaultImage;
}

export { STORAGE_KEYS };
