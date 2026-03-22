import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Palette, Image as ImageIcon, Check, Lock, Coins, ChevronLeft, LayoutGrid, Star, Dog, Shirt } from 'lucide-react';
import { UserProfile, Theme, SoulFriend, PetType } from '../types';
import { THEMES, PET_OPTIONS, OUTFITS } from '../constants';
import { clsx } from 'clsx';

interface StoreViewProps {
  profile: UserProfile | null;
  soulFriend: SoulFriend | null;
  onUnlockTheme: (themeId: string, price: number) => Promise<boolean>;
  onSelectTheme: (themeId: string) => void;
  onUnlockPet: (petType: PetType, price: number) => Promise<boolean>;
  onUnlockOutfit: (outfitId: string, price: number) => Promise<boolean>;
  onUpdateSoulFriend: (data: Partial<SoulFriend>) => Promise<void>;
}

type StoreTab = 'main' | 'themes' | 'pets' | 'outfits';

export const StoreView: React.FC<StoreViewProps> = ({ 
  profile, 
  soulFriend,
  onUnlockTheme, 
  onSelectTheme,
  onUnlockPet,
  onUnlockOutfit,
  onUpdateSoulFriend
}) => {
  const [activeTab, setActiveTab] = useState<StoreTab>('main');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showNamingModal, setShowNamingModal] = useState(false);
  const [selectedPetForNaming, setSelectedPetForNaming] = useState<typeof PET_OPTIONS[0] | null>(null);
  const [petNameInput, setPetNameInput] = useState('');

  const unlockedThemes = profile?.unlockedThemes || ['default'];
  const activeThemeId = profile?.activeThemeId || 'default';
  const points = profile?.points || 0;

  const unlockedPets = soulFriend?.unlockedPets || [];
  const unlockedOutfits = soulFriend?.unlockedOutfits || ['default'];

  const handlePurchaseTheme = async (theme: Theme) => {
    if (!profile || purchasing) return;
    
    if (unlockedThemes.includes(theme.id)) {
      onSelectTheme(theme.id);
      return;
    }

    if (points < theme.price) {
      alert('Yetersiz puan!');
      return;
    }

    setPurchasing(theme.id);
    const success = await onUnlockTheme(theme.id, theme.price);
    if (success) {
      onSelectTheme(theme.id);
    }
    setPurchasing(null);
  };

  const handlePurchasePet = async (pet: typeof PET_OPTIONS[0]) => {
    if (!profile || !soulFriend || purchasing) return;

    if (unlockedPets.includes(pet.type)) {
      await onUpdateSoulFriend({ type: pet.type });
      return;
    }

    if (points < pet.price) {
      alert('Yetersiz puan!');
      return;
    }

    setPurchasing(pet.type);
    setSelectedPetForNaming(pet);
    setShowNamingModal(true);
  };

  const confirmPurchasePet = async () => {
    if (!selectedPetForNaming || !petNameInput.trim()) return;
    
    const pet = selectedPetForNaming;
    const name = petNameInput.trim();

    const success = await onUnlockPet(pet.type, pet.price);
    if (success) {
      await onUpdateSoulFriend({ type: pet.type, name });
    }
    setPurchasing(null);
    setShowNamingModal(false);
    setSelectedPetForNaming(null);
    setPetNameInput('');
  };

  const handlePurchaseOutfit = async (outfit: typeof OUTFITS[0]) => {
    if (!profile || !soulFriend || purchasing) return;

    if (unlockedOutfits.includes(outfit.id)) {
      await onUpdateSoulFriend({ outfit: outfit.id });
      return;
    }

    if (points < outfit.price) {
      alert('Yetersiz puan!');
      return;
    }

    setPurchasing(outfit.id);
    const success = await onUnlockOutfit(outfit.id, outfit.price);
    if (success) {
      const newOutfits = outfit.id === 'default' ? [] : [outfit.id];
      await onUpdateSoulFriend({ outfits: newOutfits });
    }
    setPurchasing(null);
  };

  const renderMainMenu = () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveTab('themes')}
        className="aspect-square bg-white dark:bg-gray-900 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 shadow-xl shadow-purple-100 dark:shadow-none border border-gray-100 dark:border-white/5"
      >
        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Palette size={24} />
        </div>
        <span className="font-bold text-gray-900 dark:text-white">Temalar</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveTab('pets')}
        className="aspect-square bg-white dark:bg-gray-900 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 shadow-xl shadow-purple-100 dark:shadow-none border border-gray-100 dark:border-white/5"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Dog size={24} />
        </div>
        <span className="font-bold text-gray-900 dark:text-white">Evcil Hayvan</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveTab('outfits')}
        className="aspect-square bg-white dark:bg-gray-900 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 shadow-xl shadow-purple-100 dark:shadow-none border border-gray-100 dark:border-white/5"
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Shirt size={24} />
        </div>
        <span className="font-bold text-gray-900 dark:text-white">Aksesuar</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="aspect-square bg-white dark:bg-gray-900 rounded-[32px] p-6 flex flex-col items-center justify-center gap-3 shadow-xl shadow-purple-100 dark:shadow-none border border-gray-100 dark:border-white/5 opacity-50 cursor-not-allowed"
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <LayoutGrid size={24} />
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-center">Yakında</span>
      </motion.button>
    </div>
  );

  const renderThemes = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={() => setActiveTab('main')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Temalar</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-20">
        {THEMES.map((theme) => {
          const isUnlocked = unlockedThemes.includes(theme.id) || theme.price === 0;
          const isActive = activeThemeId === theme.id || (!activeThemeId && theme.id === 'default');
          const canAfford = points >= theme.price;

          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "relative group overflow-hidden rounded-[24px] border-2 transition-all",
                isActive ? "border-purple-500 shadow-lg" : "border-transparent bg-white dark:bg-gray-900"
              )}
            >
              {/* Preview */}
              <div className="aspect-[4/3] relative">
                {theme.type === 'color' ? (
                  <div className="w-full h-full" style={{ backgroundColor: theme.value }} />
                ) : (
                  <img src={theme.preview} alt={theme.name} className="w-full h-full object-cover" />
                )}
                
                {isActive && (
                  <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                    <div className="bg-white rounded-full p-1 shadow-lg">
                      <Check size={16} className="text-purple-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate">{theme.name}</h3>
                  {!isUnlocked && (
                    <div className="flex items-center gap-0.5 text-yellow-600 font-bold text-[10px]">
                      <Coins size={10} />
                      <span>{theme.price}</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handlePurchaseTheme(theme)}
                  disabled={purchasing === theme.id || isActive}
                  className={clsx(
                    "w-full py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1",
                    isActive 
                      ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" 
                      : isUnlocked 
                        ? "bg-gray-100 text-gray-600 hover:bg-purple-500 hover:text-white dark:bg-white/5 dark:text-gray-400"
                        : canAfford
                          ? "bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-none"
                          : "bg-gray-100 text-gray-400 dark:bg-white/5 cursor-not-allowed"
                  )}
                >
                  {purchasing === theme.id ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isActive ? (
                    'Aktif'
                  ) : isUnlocked ? (
                    'Uygula'
                  ) : (
                    'Satın Al'
                  )}
                </button>
              </div>

              {isActive && (
                <div className="absolute top-1 left-1 bg-purple-500 text-white p-0.5 rounded-full shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderPets = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={() => setActiveTab('main')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Evcil Hayvanlar</h2>
      </div>

      {!soulFriend ? (
        <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
          <p className="text-gray-500 dark:text-gray-400">Önce bir Ruh Arkadaşı oluşturmalısın!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-20">
          {PET_OPTIONS.map((pet) => {
            const isUnlocked = unlockedPets.includes(pet.type);
            const isActive = soulFriend.type === pet.type;
            const canAfford = points >= pet.price;

            return (
              <motion.div
                key={pet.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                  "p-4 rounded-3xl border-2 transition-all flex items-center gap-4",
                  isActive ? "border-amber-500 bg-amber-50 dark:bg-amber-900/10" : "border-transparent bg-white dark:bg-gray-900"
                )}
              >
                <div className="w-20 h-20 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <img 
                  src={pet.image} 
                  alt={pet.label} 
                  className="w-16 h-16 object-contain" 
                />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {pet.label}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{pet.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {!isUnlocked && (
                    <div className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
                      <Coins size={14} />
                      <span>{pet.price}</span>
                    </div>
                  )}
                  <button
                    onClick={() => handlePurchasePet(pet)}
                    disabled={purchasing === pet.type || isActive}
                    className={clsx(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive 
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" 
                        : isUnlocked 
                          ? "bg-gray-100 text-gray-600 hover:bg-amber-500 hover:text-white dark:bg-white/5 dark:text-gray-400"
                          : canAfford
                            ? "bg-amber-600 text-white shadow-md shadow-amber-200 dark:shadow-none"
                            : "bg-gray-100 text-gray-400 dark:bg-white/5 cursor-not-allowed"
                    )}
                  >
                    {purchasing === pet.type ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isActive ? 'Aktif' : isUnlocked ? 'Seç' : 'Satın Al'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderOutfits = () => (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={() => setActiveTab('main')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Aksesuar</h2>
      </div>

      {!soulFriend ? (
        <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
          <p className="text-gray-500 dark:text-gray-400">Önce bir Ruh Arkadaşı oluşturmalısın!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pb-20">
          {OUTFITS.map((outfit) => {
            const isUnlocked = unlockedOutfits.includes(outfit.id) || outfit.price === 0;
            const isActive = soulFriend.outfit === outfit.id;
            const canAfford = points >= outfit.price;

            return (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                  "p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3",
                  isActive ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10" : "border-transparent bg-white dark:bg-gray-900"
                )}
              >
                <div className="text-4xl">{outfit.emoji}</div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{outfit.name}</h3>
                </div>
                <div className="w-full mt-auto">
                  {!isUnlocked && (
                    <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold text-xs mb-2">
                      <Coins size={12} />
                      <span>{outfit.price}</span>
                    </div>
                  )}
                  <button
                    onClick={() => handlePurchaseOutfit(outfit)}
                    disabled={purchasing === outfit.id || isActive}
                    className={clsx(
                      "w-full py-2 rounded-xl text-xs font-bold transition-all",
                      isActive 
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" 
                        : isUnlocked 
                          ? "bg-gray-100 text-gray-600 hover:bg-emerald-500 hover:text-white dark:bg-white/5 dark:text-gray-400"
                          : canAfford
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none"
                            : "bg-gray-100 text-gray-400 dark:bg-white/5 cursor-not-allowed"
                    )}
                  >
                    {purchasing === outfit.id ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isActive ? 'Giyili' : isUnlocked ? 'Giy' : 'Satın Al'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'main': return renderMainMenu();
      case 'themes': return renderThemes();
      case 'pets': return renderPets();
      case 'outfits': return renderOutfits();
      default: return renderMainMenu();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-6 py-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Mağaza</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Puanlarınla yeni özellikler aç ✨</p>
        </div>
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 dark:border-white/10 shadow-sm flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-gray-900 dark:text-white">{points}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Naming Modal */}
      <AnimatePresence>
        {showNamingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-[32px] p-8 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-white/10"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="w-32 h-32 bg-amber-50 dark:bg-amber-900/20 rounded-[32px] flex items-center justify-center">
                  <img 
                    src={selectedPetForNaming?.image} 
                    alt="Pet" 
                    className="w-24 h-24 object-contain"
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                    Yeni Arkadaşına İsim Ver!
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedPetForNaming?.label} türündeki bu tatlı dosta ne demek istersin?
                  </p>
                </div>

                <div className="w-full">
                  <input
                    type="text"
                    value={petNameInput}
                    onChange={(e) => setPetNameInput(e.target.value)}
                    placeholder="İsim girin..."
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-amber-500 rounded-2xl text-gray-900 dark:text-white outline-none transition-all text-center font-bold"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => {
                      setShowNamingModal(false);
                      setPurchasing(null);
                      setPetNameInput('');
                    }}
                    className="flex-1 py-4 rounded-2xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={confirmPurchasePet}
                    disabled={!petNameInput.trim()}
                    className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-lg shadow-amber-200 dark:shadow-none transition-all"
                  >
                    Tamamla
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
