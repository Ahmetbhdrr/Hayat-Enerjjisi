import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, RefreshCw, ChevronLeft } from 'lucide-react';
import { MYSTIC_ANSWERS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MysticAnswersView({ onBack }: { onBack: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    
    if (!isFlipped) {
      const random = Math.floor(Math.random() * MYSTIC_ANSWERS.length);
      setCurrentAnswer(MYSTIC_ANSWERS[random]);
      setIsAnimating(true);
      setIsFlipped(true);
      setTimeout(() => setIsAnimating(false), 600);
    } else {
      setIsAnimating(true);
      setIsFlipped(false);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <div className="flex flex-col h-full px-6 py-8 bg-[#0F0F1B] text-white overflow-y-auto pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-purple-400 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Mistik Cevaplar
          </h1>
          <p className="text-[10px] text-purple-300/60 font-medium uppercase tracking-widest">Evrenin Fısıltısı</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="relative w-full max-w-[280px] aspect-[3/4] perspective-1000">
          <motion.div
            className="w-full h-full relative preserve-3d cursor-pointer"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            onClick={handleFlip}
          >
            {/* Front Side (Mystic Pattern) */}
            <div className="absolute inset-0 backface-hidden rounded-[32px] overflow-hidden border-2 border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
              <div className="absolute inset-0 bg-[#1A1A2E]" />
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent" />
              
              {/* Mystic Pattern SVG */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full border-2 border-purple-500/20 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border border-purple-400/40 animate-ping opacity-20" />
                  <HelpCircle size={40} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-serif font-bold text-purple-100 mb-4">Sorunu Sor</h3>
                <p className="text-xs text-purple-300/70 leading-relaxed italic">
                  Sorunu sor ve cevabı görmek için tıkla...
                </p>
              </div>

              {/* Decorative Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-purple-500/40 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-purple-500/40 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-purple-500/40 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-purple-500/40 rounded-br-lg" />
            </div>

            {/* Back Side (The Answer) */}
            <div 
              className="absolute inset-0 backface-hidden rounded-[32px] overflow-hidden border-2 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="absolute inset-0 bg-[#1A1A2E]" />
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-8">
                  <Sparkles size={24} className="text-indigo-400" />
                </div>
                
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">Evrenin Yanıtı</span>
                  <h2 className="text-3xl font-serif font-bold text-white leading-tight">
                    {currentAnswer}
                  </h2>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 w-full">
                  <p className="text-[8px] text-indigo-300/40 font-bold uppercase tracking-widest">Hayat Enerjisi ✨</p>
                </div>
              </div>

              {/* Decorative Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-indigo-500/40 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-indigo-500/40 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-indigo-500/40 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-indigo-500/40 rounded-br-lg" />
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {isFlipped && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={handleFlip}
              className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest hover:text-purple-300 transition-colors"
            >
              <RefreshCw size={14} className={cn(isAnimating && "animate-spin")} />
              Tekrar Sor
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Background Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
