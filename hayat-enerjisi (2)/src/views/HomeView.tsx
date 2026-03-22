import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Quote, ChevronRight, Coins, Heart, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { MOTIVATION_CARDS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toBlob } from 'html-to-image';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WORDS_OF_THE_DAY = [
  { word: "Niyet", description: "Zihnin bir şeye yönelmesi ve amaç edinme hali. ✨" },
  { word: "Sabır", description: "Zorluklar karşısında sükunetle bekleme gücü. 🌱" },
  { word: "Şükür", description: "Sahip olunan güzelliklerin değerini bilme bilinci. 🙏" },
  { word: "Denge", description: "Zihin, beden ve ruh arasındaki eşsiz uyum. ⚖️" },
  { word: "Akış", description: "Hayatın getirdiklerine dirençsiz uyum sağlama hali. 🌊" },
  { word: "Cesaret", description: "Korkularına rağmen inançla adım atma gücü. 🦁" },
  { word: "Huzur", description: "Ruhun dinginlik ve içsel sessizlik hali. ⚓" },
];

export default function HomeView({ 
  onNavigateToMotivation, 
  onNavigateToAffirmation,
  onNavigateToAnswers,
  profile,
  onLike,
  likedCards,
  isDarkMode,
  affirmationCards = []
}: { 
  onNavigateToMotivation: () => void, 
  onNavigateToAffirmation: () => void,
  onNavigateToAnswers: () => void,
  profile: UserProfile | null,
  onLike: (cardId: string) => void,
  likedCards: string[],
  isDarkMode: boolean,
  affirmationCards?: any[]
}) {
  const [wordOfDay, setWordOfDay] = useState(WORDS_OF_THE_DAY[0]);

  useEffect(() => {
    const updateWord = () => {
      const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      setWordOfDay(WORDS_OF_THE_DAY[dayOfYear % WORDS_OF_THE_DAY.length]);
    };

    updateWord();
    const interval = setInterval(updateWord, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full px-5 py-6 overflow-y-auto pb-32 transition-colors duration-300">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-start"
      >
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Merhaba ✨</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bugün senin günün olsun.</p>
        </div>
        
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 dark:border-white/10 shadow-sm flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-gray-900 dark:text-white">{profile?.points || 0}</span>
        </div>
      </motion.div>

      {/* Word of the Day Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative p-6 rounded-[32px] overflow-hidden mb-8 shadow-2xl shadow-purple-100 dark:shadow-none min-h-[180px] flex flex-col justify-center"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/80 via-white/40 to-indigo-100/80 dark:from-purple-900/20 dark:via-gray-900/40 dark:to-indigo-900/20 backdrop-blur-xl border border-white/50 dark:border-white/5" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Quote size={60} className="text-purple-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-200 dark:shadow-none">
              <Sparkles size={10} />
            </div>
            <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-[0.2em]">Günün Kelimesi</span>
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2 tracking-tight break-words">
            {wordOfDay.word}
          </h2>
          <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-snug italic opacity-80">
            {wordOfDay.description}
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {/* Ready for Day Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => (window as any).onNavigateToReadyForDay?.()}
          className="relative group overflow-hidden p-6 rounded-3xl flex items-center justify-between transition-all shadow-xl shadow-purple-50 dark:shadow-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100/80 to-indigo-100/80 dark:from-purple-900/20 dark:to-indigo-900/20 backdrop-blur-md border border-white/50 dark:border-white/5" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-purple-500 shadow-sm group-hover:rotate-12 transition-transform">
              <Sparkles size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Güne Hazırım</h3>
              <p className="text-[10px] text-purple-700 dark:text-purple-400 font-medium uppercase tracking-wider">Sabah Rutini & +20 Puan</p>
            </div>
          </div>
          
          <div className="relative z-10 text-purple-400 group-hover:translate-x-1 transition-transform">
            <ChevronRight size={20} />
          </div>
        </motion.button>

        {/* Motivation Cards Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNavigateToMotivation}
          className="relative group overflow-hidden p-6 rounded-3xl flex items-center justify-between transition-all shadow-xl shadow-purple-50 dark:shadow-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100/80 to-indigo-100/80 dark:from-purple-900/20 dark:to-indigo-900/20 backdrop-blur-md border border-white/50 dark:border-white/5" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-purple-500 shadow-sm group-hover:rotate-12 transition-transform">
              <Sparkles size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Motivasyon Kartları</h3>
              <p className="text-[10px] text-purple-700 dark:text-purple-400 font-medium uppercase tracking-wider">İçindeki Gücü Keşfet</p>
            </div>
          </div>
          
          <div className="relative z-10 text-purple-400 group-hover:translate-x-1 transition-transform">
            <ChevronRight size={20} />
          </div>
        </motion.button>

        {/* Answers Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNavigateToAnswers}
          className="relative group overflow-hidden p-6 rounded-3xl flex items-center justify-between transition-all shadow-xl shadow-rose-50 dark:shadow-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-100/80 to-pink-100/80 dark:from-rose-900/20 dark:to-pink-900/20 backdrop-blur-md border border-white/50 dark:border-white/5" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-sm group-hover:-rotate-12 transition-transform">
              <HelpCircle size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Cevaplar</h3>
              <p className="text-[10px] text-rose-700 dark:text-rose-400 font-medium uppercase tracking-wider">Evrenin Cevaplarını Al</p>
            </div>
          </div>
          
          <div className="relative z-10 text-rose-400 group-hover:translate-x-1 transition-transform">
            <ChevronRight size={20} />
          </div>
        </motion.button>
      </div>
      
      {/* Affirmation Cards Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Heart size={14} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Günün Olumlaması</h2>
          </div>
          <button 
            onClick={onNavigateToAffirmation}
            className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest hover:underline"
          >
            Tümünü Gör
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x scrollbar-hide">
          {(affirmationCards.length > 0 ? affirmationCards : []).slice(0, 5).map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="min-w-[240px] max-w-[240px] p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 shadow-sm snap-center flex flex-col justify-between h-40"
            >
              <p className="text-sm text-gray-700 dark:text-gray-200 font-serif italic leading-relaxed line-clamp-4">
                “{card.content}”
              </p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                <span className="text-[10px] text-gray-400 font-medium">Olumlama</span>
                <button 
                  onClick={() => onLike(card.id)}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    likedCards.includes(card.id) ? "bg-rose-100 text-rose-500" : "bg-gray-50 dark:bg-gray-800 text-gray-400"
                  )}
                >
                  <Heart size={14} fill={likedCards.includes(card.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Decorative Circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
