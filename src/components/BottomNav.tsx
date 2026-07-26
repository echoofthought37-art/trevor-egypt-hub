import { Home, Crosshair, ShoppingBag, User } from 'lucide-react';
import { TabId } from '../types';
import { motion } from 'framer-motion';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: { id: TabId; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'sensi', icon: Crosshair, label: 'Sensi' },
  { id: 'vault', icon: ShoppingBag, label: 'Vault' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-md border-t border-white/5">
      <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-col items-center gap-0.5 py-1 px-4 relative"
          >
            {active === id && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-0.5 w-8 h-0.5 bg-gold rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              className={`w-5 h-5 transition-colors ${
                active === id ? 'text-gold' : 'text-white/40'
              }`}
              strokeWidth={active === id ? 2.5 : 1.5}
            />
            <span
              className={`text-[10px] font-medium transition-colors ${
                active === id ? 'text-gold' : 'text-white/40'
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
