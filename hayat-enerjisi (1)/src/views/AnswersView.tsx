import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Share2, Cookie, Heart, X, Quote } from 'lucide-react';
import { ANSWERS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toBlob } from 'html-to-image';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AnswersView({ isDarkMode }: { isDarkMode: boolean }) {
  const [isBroken, setIsBroken] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const breakCookie = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (!isBroken) {
      // Breaking the cookie: Pick a new answer first
      const random = Math.floor(Math.random() * ANSWERS.length);
      setCurrentAnswer(ANSWERS[random]);
      
      // Delay the "broken" state slightly to allow for initial animation
      setTimeout(() => {
        setIsBroken(true);
        setIsAnimating(false);
      }, 600);
    } else {
      // Resetting the cookie
      setIsBroken(false);
      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);

    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
      });

      if (!blob) throw new Error('Blob generation failed');

      const file = new File([blob], 'sans-kurabiyesi.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Şans Kurabiyesi ✨',
          text: `Şans kurabiyemden çıkan mesaj: "${currentAnswer}"`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sans-kurabiyesi.png';
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 overflow-y-auto pb-32 bg-white dark:bg-black transition-colors duration-300">
      <div className="text-center mb-12 z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif"
        >
          ŞANS KURABİYESİ
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 dark:text-gray-400 italic"
        >
          Kurabiyeni kır ve içindeki gizemli notu oku... 🥠
        </motion.p>
      </div>

      <div className="relative w-full max-w-[320px] flex flex-col items-center justify-center min-h-[300px] z-10">
        <AnimatePresence>
          {!isBroken ? (
            <motion.div
              key="whole-cookie"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              onClick={breakCookie}
              className="cursor-pointer group relative"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -2, 2, -2, 0],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Fortune Cookie SVG */}
                <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                  <path d="M100 20C60 20 20 50 20 90C20 130 60 140 100 140C140 140 180 130 180 90C180 50 140 20 100 20Z" fill="#E6B17E" />
                  <path d="M100 20C130 20 160 40 170 70C150 60 120 55 100 55C80 55 50 60 30 70C40 40 70 20 100 20Z" fill="#D49A66" />
                  <path d="M100 140C70 140 40 130 30 110C50 120 80 125 100 125C120 125 150 120 170 110C160 130 130 140 100 140Z" fill="#D49A66" />
                </svg>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Kırmak İçin Dokun</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsBroken(false)}
            >
              <motion.div
                key="broken-cookie-modal"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-[40px] p-6 text-center shadow-2xl border border-gray-100 dark:border-white/5 relative scrollbar-hide"
              >
                <button 
                  onClick={() => setIsBroken(false)}
                  className="absolute top-5 right-5 z-20 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Broken Cookie Visual */}
                <div className="flex gap-6 mb-4 relative justify-center scale-90">
                  <motion.div
                    initial={{ x: 0, rotate: 0 }}
                    animate={{ x: -30, rotate: -15 }}
                    className="relative"
                  >
                    <svg width="60" height="80" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 20C70 20 30 40 10 90C10 130 50 140 100 140V20Z" fill="#E6B17E" transform="translate(0, -20)" />
                      <path d="M100 20C80 20 60 30 50 50C70 45 90 42 100 42V20Z" fill="#D49A66" transform="translate(0, -20)" />
                    </svg>
                  </motion.div>
                  
                  {/* The Note Paper */}
                  <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <div className="bg-white dark:bg-gray-800 px-3 py-1.5 shadow-xl border border-gray-100 dark:border-gray-700 rounded-sm rotate-1 flex items-center justify-center min-w-[120px]">
                      <div className="absolute -left-1 top-0 bottom-0 w-1 bg-purple-500/20" />
                      <span className="text-[7px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest">Günün Notu</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 0, rotate: 0 }}
                    animate={{ x: 30, rotate: 15 }}
                    className="relative"
                  >
                    <svg width="60" height="80" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 20C30 20 70 40 90 90C90 130 50 140 0 140V20Z" fill="#E6B17E" transform="translate(0, -20)" />
                      <path d="M0 20C20 20 40 30 50 50C30 45 10 42 0 42V20Z" fill="#D49A66" transform="translate(0, -20)" />
                    </svg>
                  </motion.div>
                </div>

                {/* Shareable Card Area */}
                <div ref={cardRef} className="p-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[32px] mb-4">
                  <div className="p-6 bg-white dark:bg-gray-900 rounded-[30px] text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Quote size={32} className="text-amber-500" />
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                        <Cookie size={16} />
                      </div>
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.2em]">Şans Kurabiyesi</span>
                    </div>

                    <p className="text-lg font-serif italic text-gray-800 dark:text-gray-100 leading-relaxed mb-4">
                      “{currentAnswer}”
                    </p>

                    <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                      <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Hayat Enerjisi ✨</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={handleShare}
                    disabled={isSharing}
                    className="w-full py-3.5 bg-amber-500 text-white rounded-full font-bold text-sm shadow-lg shadow-amber-200 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSharing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Share2 size={16} />
                    )}
                    {isSharing ? 'Hazırlanıyor...' : 'Kart Olarak Paylaş'}
                  </button>
                  
                  <button 
                    onClick={() => setIsBroken(false)}
                    className="w-full py-3.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full font-bold text-sm active:scale-95 transition-all"
                  >
                    Yeni Kurabiye
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex flex-col items-center gap-6 z-10">
        {!isBroken && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={breakCookie}
            disabled={isAnimating}
            className="glass-button px-10 py-4 flex items-center gap-3 bg-amber-500/10 border-amber-500/20"
          >
            <Cookie size={20} className={cn("text-amber-600", isAnimating && "animate-bounce")} />
            <span className="text-sm font-bold text-amber-900 dark:text-amber-100 uppercase tracking-widest">
              KURABİYEYİ KIR
            </span>
          </motion.button>
        )}
        
        <div className="flex gap-4 opacity-40">
          <div className="flex flex-col items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[7px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Şans</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[7px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Kader</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[7px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Gelecek</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
