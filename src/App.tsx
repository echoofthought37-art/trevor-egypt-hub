import { useState, useEffect, createContext, useContext } from 'react';
import { DeviceInfo, SensiValues, SensiConfig, Product, Mod, Proof, Settings, SiteAssets, TabId } from './types';
import {
  detectDevice, calculateSensi,
  defaultSensiConfig, defaultProducts, defaultMods, defaultProofs, defaultSettings, defaultSiteAssets,
  loadData, saveData, STORAGE_KEYS, getProductImage, getProofImage,
} from './store';
import {
  isSupabaseConfigured,
  checkTablesExist,
  fetchProducts, saveProducts as saveProductsToSupabase,
  fetchMods, saveMods as saveModsToSupabase,
  fetchProofs, saveProofs as saveProofsToSupabase,
  fetchSettings, saveSettings as saveSettingsToSupabase,
  fetchSiteAssets, saveSiteAssets as saveSiteAssetsToSupabase,
  fetchSensiConfig, saveSensiConfig as saveSensiConfigToSupabase,
  initializeDatabase,
} from './lib/supabase';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import SensiTab from './components/SensiTab';
import VaultTab from './components/VaultTab';
import ProfileTab from './components/ProfileTab';
import AdminPanel from './components/AdminPanel';

interface AppContextType {
  device: DeviceInfo | null;
  sensi: SensiValues | null;
  sensiConfig: SensiConfig;
  products: Product[];
  mods: Mod[];
  proofs: Proof[];
  settings: Settings;
  siteAssets: SiteAssets;
  setSensiConfig: (c: SensiConfig) => void;
  setProducts: (p: Product[]) => void;
  setMods: (m: Mod[]) => void;
  setProofs: (p: Proof[]) => void;
  setSettings: (s: Settings) => void;
  setSiteAssets: (a: SiteAssets) => void;
  generateSensi: () => void;
  sensiGenerated: boolean;
  getProductImage: (product: Product) => string;
  getProofImage: (proof: Proof) => string;
  isSupabaseConnected: boolean;
  dbStatus: 'checking' | 'connected' | 'no-tables' | 'error';
  syncWithSupabase: () => Promise<void>;
  pushToSupabase: () => Promise<void>;
}

export const AppContext = createContext<AppContextType>(null!);
export const useApp = () => useContext(AppContext);

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showAdmin, setShowAdmin] = useState(false);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [sensi, setSensi] = useState<SensiValues | null>(null);
  const [sensiGenerated, setSensiGenerated] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'no-tables' | 'error'>('checking');
  
  const [sensiConfig, setSensiConfigState] = useState<SensiConfig>(
    loadData(STORAGE_KEYS.sensiConfig, defaultSensiConfig)
  );
  const [products, setProductsState] = useState<Product[]>(
    loadData(STORAGE_KEYS.products, defaultProducts)
  );
  const [mods, setModsState] = useState<Mod[]>(
    loadData(STORAGE_KEYS.mods, defaultMods)
  );
  const [proofs, setProofsState] = useState<Proof[]>(
    loadData(STORAGE_KEYS.proofs, defaultProofs)
  );
  const [settings, setSettingsState] = useState<Settings>(
    loadData(STORAGE_KEYS.settings, defaultSettings)
  );
  const [siteAssets, setSiteAssetsState] = useState<SiteAssets>(
    loadData(STORAGE_KEYS.siteAssets, defaultSiteAssets)
  );

  // Sync with Supabase on load
  const syncWithSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setIsSupabaseConnected(false);
      setDbStatus('error');
      return;
    }

    setDbStatus('checking');
    console.log('🔄 Checking Supabase connection...');

    try {
      // Check if tables exist
      const tablesExist = await checkTablesExist();
      
      if (!tablesExist) {
        console.log('⚠️ Tables not found. Need to run SQL schema.');
        setDbStatus('no-tables');
        setIsSupabaseConnected(false);
        return;
      }

      setIsSupabaseConnected(true);
      setDbStatus('connected');
      console.log('✅ Connected to Supabase!');

      // Fetch all data from Supabase
      const [
        supabaseProducts,
        supabaseMods,
        supabaseProofs,
        supabaseSettings,
        supabaseSiteAssets,
        supabaseSensiConfig,
      ] = await Promise.all([
        fetchProducts(),
        fetchMods(),
        fetchProofs(),
        fetchSettings(),
        fetchSiteAssets(),
        fetchSensiConfig(),
      ]);

      // Update state with Supabase data (if exists) or keep local
      if (supabaseProducts && supabaseProducts.length > 0) {
        setProductsState(supabaseProducts);
        saveData(STORAGE_KEYS.products, supabaseProducts);
        console.log(`📦 Loaded ${supabaseProducts.length} products from Supabase`);
      }
      if (supabaseMods && supabaseMods.length > 0) {
        setModsState(supabaseMods);
        saveData(STORAGE_KEYS.mods, supabaseMods);
        console.log(`🧪 Loaded ${supabaseMods.length} mods from Supabase`);
      }
      if (supabaseProofs && supabaseProofs.length > 0) {
        setProofsState(supabaseProofs);
        saveData(STORAGE_KEYS.proofs, supabaseProofs);
        console.log(`✅ Loaded ${supabaseProofs.length} proofs from Supabase`);
      }
      if (supabaseSettings) {
        setSettingsState(supabaseSettings);
        saveData(STORAGE_KEYS.settings, supabaseSettings);
        console.log('⚙️ Loaded settings from Supabase');
      }
      if (supabaseSiteAssets) {
        setSiteAssetsState(supabaseSiteAssets);
        saveData(STORAGE_KEYS.siteAssets, supabaseSiteAssets);
        console.log('🎨 Loaded site assets from Supabase');
      }
      if (supabaseSensiConfig) {
        setSensiConfigState(supabaseSensiConfig);
        saveData(STORAGE_KEYS.sensiConfig, supabaseSensiConfig);
        console.log('🎯 Loaded sensi config from Supabase');
      }

      console.log('✅ Supabase sync complete!');
    } catch (error) {
      console.error('❌ Supabase sync error:', error);
      setDbStatus('error');
    }
  };

  // Push local data to Supabase (for first-time setup)
  const pushToSupabase = async () => {
    console.log('📤 Pushing local data to Supabase...');
    const success = await initializeDatabase(
      products,
      mods,
      proofs,
      settings,
      siteAssets,
      sensiConfig
    );
    if (success) {
      setDbStatus('connected');
      setIsSupabaseConnected(true);
      console.log('✅ Data pushed to Supabase!');
    }
  };

  // Save functions that sync to both localStorage and Supabase
  const setSensiConfig = async (c: SensiConfig) => {
    setSensiConfigState(c);
    saveData(STORAGE_KEYS.sensiConfig, c);
    if (isSupabaseConnected) {
      await saveSensiConfigToSupabase(c);
    }
  };

  const setProducts = async (p: Product[]) => {
    setProductsState(p);
    saveData(STORAGE_KEYS.products, p);
    if (isSupabaseConnected) {
      await saveProductsToSupabase(p);
    }
  };

  const setMods = async (m: Mod[]) => {
    setModsState(m);
    saveData(STORAGE_KEYS.mods, m);
    if (isSupabaseConnected) {
      await saveModsToSupabase(m);
    }
  };

  const setProofs = async (p: Proof[]) => {
    setProofsState(p);
    saveData(STORAGE_KEYS.proofs, p);
    if (isSupabaseConnected) {
      await saveProofsToSupabase(p);
    }
  };

  const setSettings = async (s: Settings) => {
    setSettingsState(s);
    saveData(STORAGE_KEYS.settings, s);
    if (isSupabaseConnected) {
      await saveSettingsToSupabase(s);
    }
  };

  const setSiteAssets = async (a: SiteAssets) => {
    setSiteAssetsState(a);
    saveData(STORAGE_KEYS.siteAssets, a);
    if (isSupabaseConnected) {
      await saveSiteAssetsToSupabase(a);
    }
  };

  const generateSensi = () => {
    if (device) {
      setSensi(calculateSensi(device, sensiConfig));
      setSensiGenerated(true);
    }
  };

  useEffect(() => {
    detectDevice().then((d) => {
      setDevice(d);
    });
    
    // Check Supabase connection and sync
    syncWithSupabase();
  }, []);

  // Check URL hash for admin
  useEffect(() => {
    const checkHash = () => {
      setShowAdmin(window.location.hash === '#admin');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const ctx: AppContextType = {
    device, sensi, sensiConfig, products, mods, proofs, settings, siteAssets,
    setSensiConfig, setProducts, setMods, setProofs, setSettings, setSiteAssets,
    generateSensi, sensiGenerated,
    getProductImage: (product: Product) => getProductImage(product, siteAssets),
    getProofImage: (proof: Proof) => getProofImage(proof, siteAssets),
    isSupabaseConnected,
    dbStatus,
    syncWithSupabase,
    pushToSupabase,
  };

  if (showAdmin) {
    return (
      <AppContext.Provider value={ctx}>
        <AdminPanel onClose={() => { window.location.hash = ''; setShowAdmin(false); }} />
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className="min-h-screen bg-dark text-white pb-20">
        <Header />
        {settings.announcement && (
          <div className="bg-gold/10 border-b border-gold/20 px-4 py-2 text-center">
            <p className="text-xs text-gold font-medium">{settings.announcement}</p>
          </div>
        )}
        <main>
          {activeTab === 'home' && <HomeTab onNavigate={setActiveTab} />}
          {activeTab === 'sensi' && <SensiTab />}
          {activeTab === 'vault' && <VaultTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </main>
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </div>
    </AppContext.Provider>
  );
}
