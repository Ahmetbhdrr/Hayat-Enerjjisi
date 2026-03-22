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
        <h1 className="text-3xl font-serif font-bold text-[#4A4A4A] dark:text-white mb-2">Frekans & Doğa</h1>
        <p className="text-gray-500 dark:text-gray-400 italic">Ruhu besleyen titreşimler 🎶</p>
      </div>

      {/* Controls Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-[32px] p-6 mb-8 shadow-xl shadow-purple-100/50 dark:shadow-none border border-gray-50 dark:border-white/5">
        <div className="flex items-center gap-4 mb-6">
          <Volume2 size={20} className="text-purple-400" />
          <div className="flex-1 relative flex items-center">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-purple-50 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-400"
            />
          </div>
          <span className="text-xs font-bold text-gray-400 w-8">{Math.round(volume * 100)}%</span>
        </div>

        <div className="flex justify-between items-center bg-purple-50/50 dark:bg-white/5 p-1 rounded-full">
          {durations.map((d) => (
            <button
              key={d.label}
              onClick={() => setDuration(d.value)}
              className={cn(
                "flex-1 py-2 rounded-full text-xs font-bold transition-all",
                duration === d.value 
                  ? "bg-white dark:bg-[#2A2A2A] text-purple-600 shadow-md" 
                  : "text-gray-400 hover:text-purple-400"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frequencies Section */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1 h-4 bg-purple-400 rounded-full" /> ŞİFA FREKANSLARI
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {FREQUENCY_SOUNDS.map((sound) => (
            <motion.div 
              key={sound.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => playSound(sound)}
              className={cn(
                "p-3 rounded-[32px] flex items-center gap-2 cursor-pointer transition-all relative overflow-hidden border border-transparent shadow-sm",
                activeSound?.id === sound.id && "ring-2 ring-purple-400/50"
              )}
              style={{ backgroundColor: sound.color || '#F3F4F6' }}
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm shrink-0">
                {sound.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#4A4A4A] text-[13px] truncate leading-tight">{sound.name}</h3>
                <p className="text-[10px] text-gray-500 font-medium truncate">{sound.description}</p>
              </div>

              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0",
                activeSound?.id === sound.id ? "bg-purple-500 text-white" : "bg-white text-gray-300"
              )}>
                <Play size={10} fill={activeSound?.id === sound.id ? "currentColor" : "none"} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Nature Sounds Section */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-1 h-4 bg-purple-400 rounded-full" /> DOĞA SESLERİ
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {NATURE_SOUNDS.map((sound) => (
            <motion.div 
              key={sound.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => playSound(sound)}
              className={cn(
                "p-3 rounded-[32px] flex items-center gap-2 cursor-pointer transition-all relative overflow-hidden border border-transparent shadow-sm",
                activeSound?.id === sound.id && "ring-2 ring-purple-400/50"
              )}
              style={{ backgroundColor: sound.color || '#F3F4F6' }}
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm shrink-0">
                {sound.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#4A4A4A] text-[13px] truncate leading-tight">{sound.name}</h3>
                <p className="text-[10px] text-gray-500 font-medium truncate">{sound.description}</p>
              </div>

              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0",
                activeSound?.id === sound.id ? "bg-purple-500 text-white" : "bg-white text-gray-300"
              )}>
                <Play size={10} fill={activeSound?.id === sound.id ? "currentColor" : "none"} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
