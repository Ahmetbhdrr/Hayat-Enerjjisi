import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Share2, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toPng } from 'html-to-image';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LikedCardItem: React.FC<{ 
  card: any, 
  onLike: (card: any) => void, 
  handleShare: (id: string, content: string) => Promise<void>,
  type: 'motivation' | 'affirmation'
}> = ({ card, onLike, handleShare, type }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-6 relative overflow-hidden group"
      id={`liked-card-${card.id}`}
    >
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        type === 'motivation' ? "bg-amber-400" : "bg-rose-400"
      )} />
      <p className="text-base font-serif italic text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">“{card.content}”</p>
      
      <div className="flex justify-between items-center">
        <span className={cn(
          "text-[9px] font-bold uppercase tracking-widest",
          type === 'motivation' ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"
        )}>
          {type === 'motivation' ? 'Motivasyon' : 'Olumlama'}
        </span>
        <div className="flex gap-1.5">
          <button 
            onClick={() => handleShare(card.id, card.content)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 dark:text-gray-500 transition-colors"
          >
            <Share2 size={16} />
          </button>
          <button 
            onClick={() => onLike(card)}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-500 transition-colors"
          >
            <Heart size={16} fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function LikedCardsView({ likedCards, onLike }: { likedCards: any[], onLike: (card: any) => void }) {
  const [activeType, setActiveType] = useState<'motivation' | 'affirmation'>('motivation');
  
  const motivationCards = likedCards.filter(c => c.type === 'motivation');
  const affirmationCards = likedCards.filter(c => c.type === 'affirmation');

  const currentCards = activeType === 'motivation' ? motivationCards : affirmationCards;

  const handleShare = async (id: string, content: string) => {
    const element = document.getElementById(`share-card-${id}`);
    if (!element) return;
    
    try {
      // Temporarily show the element for capture
      element.style.display = 'block';
      const dataUrl = await toPng(element, { quality: 0.95, backgroundColor: 'transparent' });
      element.style.display = 'none';

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'hayat-enerjisi-kart.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Hayat Enerjisi',
          text: content
        });
      } else {
        const link = document.createElement('a');
        link.download = 'hayat-enerjisi-kart.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Paylaşım hatası:', err);
    }
  };

  return (
    <div className="flex flex-col h-full px-4 py-4 overflow-y-auto pb-32">
      {/* Hidden Share Templates */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
        {currentCards.map(card => (
          <div 
            key={`share-${card.id}`} 
            id={`share-card-${card.id}`}
            className="w-[400px] p-12 rounded-[48px] bg-white shadow-2xl text-center relative overflow-hidden"
            style={{ display: 'none' }}
          >
            <div className={cn(
              "absolute inset-0 opacity-10",
              activeType === 'motivation' ? "bg-amber-400" : "bg-rose-400"
            )} />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-8">
                {activeType === 'motivation' ? <Sparkles size={32} className="text-amber-500" /> : <Heart size={32} className="text-rose-500" />}
              </div>
              <p className="text-2xl font-serif italic text-gray-900 leading-relaxed mb-8">“{card.content}”</p>
              <div className="pt-8 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Hayat Enerjisi ✨</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">
            <Heart size={18} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Beğenilenler</h1>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Koleksiyonun</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
          <button 
            onClick={() => setActiveType('motivation')}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2",
              activeType === 'motivation' 
                ? "bg-white dark:bg-gray-800 text-amber-500 shadow-sm" 
                : "text-gray-400 dark:text-gray-500"
            )}
          >
            <Sparkles size={14} />
            Motivasyon
            <span className="text-[9px] opacity-60">({motivationCards.length})</span>
          </button>
          <button 
            onClick={() => setActiveType('affirmation')}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2",
              activeType === 'affirmation' 
                ? "bg-white dark:bg-gray-800 text-rose-500 shadow-sm" 
                : "text-gray-400 dark:text-gray-500"
            )}
          >
            <Heart size={14} />
            Olumlama
            <span className="text-[9px] opacity-60">({affirmationCards.length})</span>
          </button>
        </div>

        <div className="mt-2">
          {currentCards.length === 0 ? (
            <div className="p-12 rounded-[32px] border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-4">
                {activeType === 'motivation' ? <Sparkles size={24} className="text-gray-300" /> : <Heart size={24} className="text-gray-300" />}
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                Henüz beğendiğin bir {activeType === 'motivation' ? 'motivasyon' : 'olumlama'} kartı yok.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {currentCards.map(card => (
                  <LikedCardItem 
                    key={card.id} 
                    card={card} 
                    onLike={onLike} 
                    handleShare={handleShare} 
                    type={activeType} 
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
