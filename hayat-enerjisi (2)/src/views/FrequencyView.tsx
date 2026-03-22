import React from 'react';
import { motion } from 'motion/react';
import { Play, Volume2 } from 'lucide-react';
import { FREQUENCY_SOUNDS, NATURE_SOUNDS } from '../constants';
import { useSound } from '../contexts/SoundContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function FrequencyView() {
  const { 
    activeSound, 
    playSound, 
    volume, 
    setVolume, 
    duration, 
    setDuration 
  } = useSound();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const durations = [
    { label: '∞', value: null },
    { label: '5dk', value: 5 },
    { label: '15dk', value: 15 },
    { label: '30dk', value: 30 },
  ];

  return (
    <div className="flex flex-col h-full px-6 py-8 overflow-y-auto pb-32">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif font-bold text-gray-800 dark:text-white mb-2">Frekans & Doğa</h1>
        <p className="text-gray-500 dark:text-gray-400 italic">Ruhu besleyen titreşimler 🎶</p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-[32px] p-6 mb-8 shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4 mb-6">
          <Volume2 size={18} className="text-purple-500" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] font-bold text-gray-400 w-8">{Math.round(volume * 100)}%</span>
        </div>

        <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-1 rounded-full border border-gray-100 dark:border-white/5">
          {durations.map((d) => (
            <button
              key={d.label}
              onClick={() => setDuration(d.value)}
              className={cn(
                "flex-1 py-2 rounded-full text-xs font-bold transition-all",
                duration === d.value ? "bg-white dark:bg-[#2A2A2A] text-purple-600 shadow-sm" : "text-gray-400"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frequencies */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <div className="w-1 h-3 bg-purple-500 rounded-full" /> Şifa Frekansları
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {FREQUENCY_SOUNDS.map((sound) => (
            <motion.div 
              key={sound.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => playSound(sound)}
              className={cn(
                "p-6 rounded-[50px] flex flex-col items-start gap-3 cursor-pointer transition-all relative overflow-hidden shadow-sm",
                activeSound?.id === sound.id ? "ring-2 ring-offset-2 dark:ring-offset-[#0A0A0A]" : ""
              )}
              style={{ 
                backgroundColor: sound.color + '40', // More solid background
                boxShadow: activeSound?.id === sound.id ? `0 0 0 2px ${sound.color}` : undefined
              }}
            >
              <div className="flex justify-between items-start w-full mb-1">
                <div className="w-12 h-12 rounded-full bg-white/80 dark:bg-white/20 flex items-center justify-center text-2xl shadow-sm">
                  {sound.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-gray-600 dark:text-white/70">
                  <Play size={14} fill={activeSound?.id === sound.id ? "currentColor" : "none"} />
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight">{sound.name}</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">{sound.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Nature Sounds */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <div className="w-1 h-3 bg-purple-500 rounded-full" /> Doğa Sesleri
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {NATURE_SOUNDS.map((sound) => (
            <motion.div 
              key={sound.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => playSound(sound)}
              className={cn(
                "p-6 rounded-[50px] flex flex-col items-start gap-3 cursor-pointer transition-all relative overflow-hidden shadow-sm",
                activeSound?.id === sound.id ? "ring-2 ring-offset-2 dark:ring-offset-[#0A0A0A]" : ""
              )}
              style={{ 
                backgroundColor: sound.color + '40', // More solid background
                boxShadow: activeSound?.id === sound.id ? `0 0 0 2px ${sound.color}` : undefined
              }}
            >
              <div className="flex justify-between items-start w-full mb-1">
                <div className="w-12 h-12 rounded-full bg-white/80 dark:bg-white/20 flex items-center justify-center text-2xl shadow-sm">
                  {sound.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-gray-600 dark:text-white/70">
                  <Play size={14} fill={activeSound?.id === sound.id ? "currentColor" : "none"} />
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight">{sound.name}</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">{sound.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
