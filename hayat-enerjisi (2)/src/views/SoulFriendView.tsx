import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Heart, 
  Utensils, 
  Gamepad2, 
  Shirt, 
  Sparkles, 
  Trophy,
  Star,
  Info,
  Edit3,
  X,
  CheckCircle2
} from 'lucide-react';
import { SoulFriend, PetType } from '../types';
import { PET_OPTIONS, OUTFITS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SoulFriendViewProps {
  soulFriend: SoulFriend | null;
  onCreate: (type: PetType, name: string) => Promise<void>;
  onUpdate: (data: Partial<SoulFriend>) => Promise<void>;
  onBack: () => void;
  points: number;
  onAddPoints: (points: number) => Promise<void>;
}

export const SoulFriendView: React.FC<SoulFriendViewProps> = ({
  soulFriend,
  onCreate,
  onUpdate,
  onBack,
  points,
  onAddPoints
}) => {
  const [step, setStep] = useState<'selection' | 'naming' | 'main'>('selection');
  const [selectedType, setSelectedType] = useState<PetType | null>(null);
  const [petName, setPetName] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const unlockedOutfits = soulFriend?.unlockedOutfits || ['default'];

  useEffect(() => {
    if (soulFriend) {
      setStep('main');
    } else {
      setStep('selection');
    }
  }, [soulFriend]);

  const handleCreate = async () => {
    if (!selectedType || !petName.trim()) return;
    setIsActionLoading(true);
    await onCreate(selectedType, petName.trim());
    setIsActionLoading(false);
  };

  const handleFeed = async () => {
    if (!soulFriend || isActionLoading) return;
    
    const today = new Date().toISOString().split('T')[0];
    const isNewDay = soulFriend.lastFedDate !== today;
    const currentFeedCount = isNewDay ? 0 : (soulFriend.feedCount || 0);

    if (currentFeedCount >= 5) {
      setMessage({ text: 'Dostun bugün doydu! Yarın tekrar besleyebilirsin.', type: 'error' });
      return;
    }

    if (points < 5) {
      setMessage({ text: 'Yeterli gelişim puanın yok! (5 puan gerekli)', type: 'error' });
      return;
    }
    
    setIsActionLoading(true);
    try {
      await onAddPoints(-5);
      
      const newFeedCount = currentFeedCount + 1;
      const newHunger = newFeedCount * 20;
      const newExp = soulFriend.experience + 10;
      
      let newLevel = soulFriend.level;
      let finalExp = newExp;
      if (finalExp >= 100) {
        newLevel += 1;
        finalExp -= 100;
      }

      await onUpdate({
        hunger: newHunger,
        feedCount: newFeedCount,
        lastFedDate: today,
        experience: finalExp,
        level: newLevel,
        lastFed: new Date().toISOString()
      });
      
      setMessage({ text: 'Dostun afiyetle yedi! +10 TP', type: 'success' });
    } catch (error) {
      console.error('Feeding error:', error);
      setMessage({ text: 'Bir hata oluştu.', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePet = async () => {
    if (!soulFriend || isActionLoading) return;
    if (soulFriend.happiness >= 100) {
      setMessage({ text: 'Dostun şu an çok mutlu! ❤️', type: 'success' });
      return;
    }

    setIsActionLoading(true);
    try {
      const newHappiness = Math.min(100, soulFriend.happiness + 5);
      await onUpdate({
        happiness: newHappiness,
        lastPlayed: new Date().toISOString()
      });
      // No message for petting to keep it fluid, maybe just visual feedback
    } catch (error) {
      console.error('Petting error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePlay = async () => {
    if (!soulFriend || isActionLoading) return;
    if (soulFriend.happiness >= 100) {
      setMessage({ text: 'Dostun şu an çok mutlu! ❤️', type: 'success' });
      return;
    }

    setIsActionLoading(true);
    try {
      const newHappiness = Math.min(100, soulFriend.happiness + 5);
      await onUpdate({
        happiness: newHappiness,
        lastPlayed: new Date().toISOString()
      });
      setMessage({ text: 'Dostunla oyun oynadın! ❤️', type: 'success' });
    } catch (error) {
      console.error('Play error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOutfitChange = async (outfitId: string) => {
    if (!soulFriend || isActionLoading) return;
    
    const currentOutfits = soulFriend.outfits || [];
    let newOutfits: string[];
    
    if (outfitId === 'default') {
      newOutfits = ['default'];
    } else {
      if (currentOutfits.includes(outfitId)) {
        newOutfits = currentOutfits.filter(id => id !== outfitId);
        if (newOutfits.length === 0) newOutfits = ['default'];
      } else {
        newOutfits = [...currentOutfits.filter(id => id !== 'default'), outfitId];
      }
    }
    
    await onUpdate({ outfits: newOutfits });
  };

  const handleRename = async () => {
    if (!newName.trim() || isActionLoading) return;
    setIsActionLoading(true);
    await onUpdate({ name: newName.trim() });
    setIsRenaming(false);
    setIsActionLoading(false);
  };

  if (step === 'selection') {
    return (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
        <div className="p-6 flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm">
            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Ruh Arkadaşını Seç</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4">
            {PET_OPTIONS.map((pet) => (
              <motion.button
                key={pet.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedType(pet.type);
                  setStep('naming');
                }}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 text-left"
              >
                <div className="w-24 h-24 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <img src={pet.image} alt={pet.label} className="w-20 h-20 object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {pet.label}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{pet.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'naming') {
    const selectedPet = PET_OPTIONS.find(p => p.type === selectedType);
    return (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
        <div className="p-6">
          <button onClick={() => setStep('selection')} className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm">
            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-64 h-64 mb-8 relative"
          >
            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
            <img 
              src={selectedPet?.image} 
              alt="Selected Pet" 
              className="w-full h-full object-contain relative z-10"
            />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Yeni dostuna bir isim ver
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Bu isim onunla olan bağını simgeleyecek.
          </p>

          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="İsim yazın..."
            className="w-full max-w-xs p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-8"
          />

          <button
            onClick={handleCreate}
            disabled={!petName.trim() || isActionLoading}
            className={cn(
              "w-full max-w-xs py-5 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2",
              isActionLoading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 shadow-purple-200 dark:shadow-none"
            )}
          >
            {isActionLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              'Dostumu Başlat'
            )}
          </button>
        </div>
      </div>
    );
  }

  if (!soulFriend) return null;

  const currentPet = PET_OPTIONS.find(p => p.type === soulFriend.type);
  const equippedOutfits = OUTFITS.filter(o => (soulFriend.outfits || []).includes(o.id));

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto pb-24 scrollbar-hide">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm">
            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              {isRenaming ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                  />
                  <button 
                    onClick={handleRename}
                    className="text-emerald-500 hover:text-emerald-600"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button 
                    onClick={() => setIsRenaming(false)}
                    className="text-rose-500 hover:text-rose-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white">{soulFriend.name}</h1>
                  <button 
                    onClick={() => {
                      setNewName(soulFriend.name);
                      setIsRenaming(true);
                    }}
                    className="text-slate-400 hover:text-purple-500 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Trophy size={12} className="text-amber-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Seviye {soulFriend.level}</span>
            </div>
          </div>
        </div>
        
        <div className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{points}</span>
        </div>
      </div>

      <div className="flex flex-col px-6 py-2">
        {/* Message Overlay */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "absolute top-24 left-6 right-6 z-50 p-4 rounded-2xl text-center text-sm font-bold shadow-xl",
                message.type === 'success' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
              )}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pet Display */}
        <div 
          className="flex flex-col items-center justify-center relative py-2 cursor-pointer group"
          onClick={handlePet}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-80 h-80 rounded-full bg-purple-500 blur-3xl animate-pulse" />
          </div>

          <motion.div
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <div className="relative z-10">
              <img 
                src={currentPet?.image} 
                alt={soulFriend.name} 
                className="w-80 h-80 object-contain drop-shadow-2xl"
              />
              
              {/* Floating Hearts Animation */}
              <AnimatePresence>
                {isActionLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, y: -100, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 text-rose-500 pointer-events-none text-4xl"
                  >
                    ❤️
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute -top-4 -right-4 flex flex-col gap-1">
                {equippedOutfits.map((outfit, idx) => (
                  <motion.div 
                    key={outfit.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl"
                    style={{ marginLeft: idx * 10 }}
                  >
                    {outfit.emoji !== '✨' && outfit.emoji}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="w-40 h-4 bg-black/5 dark:bg-white/5 rounded-[100%] blur-md mt-4 mx-auto" />
          </motion.div>

          {/* Stats */}
          <div className="w-full max-w-xs mt-6 space-y-4">
            {/* Hunger */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Açlık</span>
                <span>%{soulFriend.hunger}</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${soulFriend.hunger}%` }}
                  className={cn(
                    "h-full rounded-full transition-all",
                    soulFriend.hunger < 30 ? "bg-rose-500" : "bg-emerald-500"
                  )}
                />
              </div>
            </div>

            {/* Happiness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Mutluluk</span>
                <span>%{soulFriend.happiness}</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${soulFriend.happiness}%` }}
                  className={cn(
                    "h-full rounded-full transition-all",
                    soulFriend.happiness < 30 ? "bg-rose-500" : "bg-purple-500"
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleFeed}
            disabled={isActionLoading}
            className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm disabled:opacity-50 relative"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Utensils size={20} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Besle</span>
              <span className="text-[8px] font-bold text-slate-400">5 Puan</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {new Date().toISOString().split('T')[0] === soulFriend.lastFedDate ? (soulFriend.feedCount || 0) : 0}/5
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePlay}
            disabled={soulFriend.happiness >= 100 || isActionLoading}
            className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Gamepad2 size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Oyna</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {}} // Open outfit selector
            className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Shirt size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Giydir</span>
          </motion.button>
        </div>

        {/* Outfit Selector (Only show unlocked) */}
        <div className="mt-6 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {OUTFITS.filter(o => unlockedOutfits.includes(o.id)).map((outfit) => (
            <button
              key={outfit.id}
              onClick={() => handleOutfitChange(outfit.id)}
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all",
                (soulFriend.outfits || []).includes(outfit.id) 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-none" 
                  : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
              )}
            >
              {outfit.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
