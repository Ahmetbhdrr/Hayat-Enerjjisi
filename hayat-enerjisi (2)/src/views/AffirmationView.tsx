import React, { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Share2, ChevronLeft, ChevronRight, Sparkles, Bookmark } from 'lucide-react';
import { AFFIRMATION_CARDS } from '../constants';
import { toPng } from 'html-to-image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AffirmationView({ onLike, likedCards, cards, onNavigateToLiked }: { onLike: (card: any) => void, likedCards: any[], cards: any[], onNavigateToLiked: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentCard = cards[currentIndex] || cards[0];
  const isLiked = likedCards.some(c => c.cardId === currentCard?.id);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + cards.length) % cards.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => paginate(1),
    onSwipedRight: () => paginate(-1),
    trackMouse: true,
  });

  const handleShare = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        backgroundColor: currentCard.color,
        style: {
          borderRadius: '30px',
        },
        filter: (node) => {
          return !node.classList?.contains('share-exclude');
        }
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `hayat-enerjisi-olumlama-${currentCard.id}.png`, { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Hayat Enerjisi',
          text: currentCard.content
        });
      } else {
        const link = document.createElement('a');
        link.download = `hayat-enerjisi-olumlama-${currentCard.id}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      scale: 0.8,
      opacity: 0,
      rotate: direction > 0 ? 5 : -5,
    }),
    center: {
      zIndex: 1,
      scale: 1,
      opacity: 1,
      rotate: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      scale: 0.8,
      opacity: 0,
      rotate: direction < 0 ? 5 : -5,
    }),
  };

  return (
    <div className="flex flex-col h-full px-4 py-3">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[280px] aspect-[4/5]" {...handlers}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                scale: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.3 },
                rotate: { duration: 0.5 }
              }}
              className="absolute inset-0"
            >
              <div 
                ref={cardRef}
                className="w-full h-full glass-card flex flex-col items-center justify-center p-6 md:p-8 text-center relative"
                style={{ backgroundColor: currentCard.color }}
              >
                <div className="w-10 h-10 rounded-full bg-white/30 dark:bg-white/20 flex items-center justify-center mb-6 animate-float">
                  <Sparkles size={20} className="text-white" />
                </div>
                <p className="text-lg md:text-xl font-serif font-bold text-gray-800 dark:text-white leading-relaxed px-2">
                  {currentCard.content}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 w-full max-w-sm mx-auto px-2">
        <button 
          onClick={() => paginate(-1)}
          className="p-2 bg-white dark:bg-[#1A1A1A] rounded-full text-purple-500 border border-purple-100 dark:border-white/10 shadow-sm shrink-0"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex-1 flex items-center justify-between bg-white dark:bg-[#1A1A1A] rounded-full px-3 py-1 shadow-sm border border-gray-100 dark:border-white/5">
          <button 
            onClick={(e) => { e.stopPropagation(); onLike(currentCard); }}
            className={cn(
              "p-1.5 rounded-full transition-all",
              isLiked ? "text-red-500 scale-110" : "text-gray-400 dark:text-gray-500"
            )}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>

          <div className="text-[9px] font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-full">
            {currentIndex + 1} / {cards.length}
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-purple-500 transition-all"
          >
            <Share2 size={16} />
          </button>
        </div>

        <button 
          onClick={() => paginate(1)}
          className="p-2 bg-white dark:bg-[#1A1A1A] rounded-full text-purple-500 border border-purple-100 dark:border-white/10 shadow-sm shrink-0"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      <p className="mt-4 text-[10px] text-gray-400 font-medium tracking-wide uppercase">
        Kartı sağa/sola kaydır ya da butonları kullan
      </p>
    </div>
  );
}
