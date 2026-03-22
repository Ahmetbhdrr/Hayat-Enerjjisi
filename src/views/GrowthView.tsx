import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function GrowthView({ tasks, profile, onToggle }: { tasks: any[], profile: any, onToggle: (id: string, completed: boolean, points: number) => void }) {
  const [activeTab, setActiveTab] = useState<'physical' | 'spiritual'>('physical');

  const physicalTasks = tasks.filter(t => t.type === 'physical');
  const spiritualTasks = tasks.filter(t => t.type === 'spiritual');
  
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggle = (task: any) => {
    if (!task.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8A2BE2', '#FF7F50', '#F8F9FA']
      });
    }
    onToggle(task.id, task.completed, task.points);
  };

  const days = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];
  const currentDay = new Date().getDay(); // 0 is Sunday, 1 is Monday
  const dayIndex = currentDay === 0 ? 6 : currentDay - 1;

  return (
    <div className="flex flex-col h-full px-4 py-3 overflow-y-auto bg-[#F8F9FA] dark:bg-[#0A0A0A]">
      {/* Weekly Progress */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Haftalık Gelişim</h2>
          <TrendingUp size={18} className="text-purple-500" />
        </div>

        <div className="flex justify-between items-end h-24 gap-1.5">
          {days.map((day, i) => (
            <div key={i} className="flex flex-col items-center flex-1 gap-1.5">
              {i === dayIndex && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full mb-0.5"
                >
                  +{Math.round(progressPercent)}%
                </motion.div>
              )}
              <div className="relative w-full h-16 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: i === dayIndex ? `${progressPercent}%` : i < dayIndex ? '100%' : '0%' }}
                  className={cn(
                    "absolute bottom-0 w-full rounded-full transition-colors duration-500",
                    i === dayIndex ? "bg-purple-500" : i < dayIndex ? "bg-purple-200 dark:bg-purple-900/40" : "bg-transparent"
                  )}
                />
              </div>
              <span className={cn(
                "text-xs font-medium",
                i === dayIndex ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"
              )}>
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-white/5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Bugünkü Gelişim</h2>
        <div className="flex items-center gap-3 mb-1.5">
          <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-purple-500 rounded-full"
            />
          </div>
          <span className="text-base font-bold text-purple-600 dark:text-purple-400">{Math.round(progressPercent)}%</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Tebrikler! Bugün harika gidiyorsun.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setActiveTab('physical')}
          className={cn(
            "flex-1 py-2 rounded-full text-xs font-bold transition-all border",
            activeTab === 'physical' 
              ? "bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-100 dark:shadow-none" 
              : "bg-white dark:bg-[#1A1A1A] text-purple-500 border-purple-100 dark:border-white/10"
          )}
        >
          Fiziksel
        </button>
        <button 
          onClick={() => setActiveTab('spiritual')}
          className={cn(
            "flex-1 py-2 rounded-full text-xs font-bold transition-all border",
            activeTab === 'spiritual' 
              ? "bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-100 dark:shadow-none" 
              : "bg-white dark:bg-[#1A1A1A] text-purple-500 border-purple-100 dark:border-white/10"
          )}
        >
          Ruhsal
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col gap-2"
          >
            {(activeTab === 'physical' ? physicalTasks : spiritualTasks).map((task) => (
              <motion.div 
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggle(task)}
                className={cn(
                  "bg-white dark:bg-[#1A1A1A] p-3 rounded-full flex items-center justify-between cursor-pointer transition-all border border-gray-50 dark:border-white/5 shadow-sm",
                  task.completed && "opacity-60"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    task.completed 
                      ? "bg-purple-500 border-purple-500 text-white" 
                      : "border-purple-100 dark:border-white/10"
                  )}>
                    {task.completed && <Check size={12} strokeWidth={3} />}
                  </div>
                  <h3 className={cn(
                    "text-xs font-semibold text-gray-800 dark:text-gray-200",
                    task.completed && "line-through text-gray-400"
                  )}>{task.title}</h3>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full text-[9px] font-bold text-purple-600 dark:text-purple-300">
                  {task.points} P
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
