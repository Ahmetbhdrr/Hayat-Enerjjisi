import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  CheckCircle2, 
  Droplets, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft,
  Trophy
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { UserProfile } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReadyForDayViewProps {
  onComplete: (points: number, date: string) => void;
  onBack: () => void;
  motivationCard: { content: string; author: string } | null;
  profile: UserProfile | null;
}

export default function ReadyForDayView({ onComplete, onBack, motivationCard, profile }: ReadyForDayViewProps) {
  const [step, setStep] = useState(1);
  const [breathingStatus, setBreathingStatus] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isWaterChecked, setIsWaterChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [alreadyCompletedToday, setAlreadyCompletedToday] = useState(false);

  useEffect(() => {
    if (profile?.lastReadyForDayDate === format(new Date(), 'yyyy-MM-dd')) {
      setAlreadyCompletedToday(true);
    }
  }, [profile]);

  // Breathing Exercise Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 1 && breathingStatus !== 'idle' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 1) {
      setStep(2);
    }
    return () => clearInterval(timer);
  }, [step, breathingStatus, timeLeft]);

  useEffect(() => {
    let cycle: NodeJS.Timeout;
    if (step === 1 && breathingStatus !== 'idle') {
      const runCycle = () => {
        setBreathingStatus('inhale');
        setTimeout(() => {
          setBreathingStatus('hold');
          setTimeout(() => {
            setBreathingStatus('exhale');
            setTimeout(() => {
              if (timeLeft > 0) runCycle();
            }, 4000);
          }, 4000);
        }, 4000);
      };
      runCycle();
    }
    return () => clearTimeout(cycle);
  }, [step, breathingStatus === 'idle']);

  const handleFinish = () => {
    setIsFinished(true);
    if (!alreadyCompletedToday) {
      onComplete(20, format(new Date(), 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="flex flex-col h-full transition-colors duration-300">
      {/* Header */}
      <header className="px-5 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Güne Hazırım</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-white/5 -translate-y-1/2 z-0" />
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500",
                step > s ? "bg-green-500 text-white" : 
                step === s ? "bg-purple-500 text-white scale-110 shadow-lg shadow-purple-200 dark:shadow-none" : 
                "bg-white dark:bg-gray-800 text-gray-300 border-2 border-gray-100 dark:border-white/5"
              )}
            >
              {step > s ? <CheckCircle2 size={20} /> : <span className="font-bold">{s}</span>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Breathing */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6">
                <Wind size={48} className="text-blue-400 mx-auto mb-2" />
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Derin Bir Nefes Al</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Zihnini sakinleştir ve ana odaklan.</p>
              </div>

              <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                {/* Animated Circle */}
                <motion.div
                  animate={{
                    scale: breathingStatus === 'inhale' ? 1.5 : breathingStatus === 'hold' ? 1.5 : 1,
                    opacity: breathingStatus === 'idle' ? 0.5 : 1
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute w-32 h-32 bg-blue-400/20 rounded-full blur-xl"
                />
                <motion.div
                  animate={{
                    scale: breathingStatus === 'inhale' ? 1.5 : breathingStatus === 'hold' ? 1.5 : 1,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="w-32 h-32 border-4 border-blue-400 rounded-full flex items-center justify-center"
                >
                  <span className="text-blue-500 font-bold text-lg uppercase tracking-widest">
                    {breathingStatus === 'idle' ? 'Hazır mısın?' : 
                     breathingStatus === 'inhale' ? 'Nefes Al' : 
                     breathingStatus === 'hold' ? 'Tut' : 'Nefes Ver'}
                  </span>
                </motion.div>
              </div>

              <div className="text-4xl font-mono font-bold text-gray-300 dark:text-gray-700 mb-8">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>

              {breathingStatus === 'idle' && (
                <button
                  onClick={() => setBreathingStatus('inhale')}
                  className="px-12 py-4 bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-200 dark:shadow-none active:scale-95 transition-transform"
                >
                  Başlat
                </button>
              )}
            </motion.div>
          )}

          {/* Step 2: Motivation */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-8">
                <Sparkles size={48} className="text-amber-400 mx-auto mb-2" />
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Günün İlhamı</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Bu sözü kalbinde hisset.</p>
              </div>

              <div className="w-full p-8 rounded-[40px] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-900/20 mb-12 shadow-inner">
                <p className="text-xl font-serif italic text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                  “{motivationCard?.content || "Her gün yeni bir başlangıçtır."}”
                </p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">— {motivationCard?.author || "Hayat Enerjisi"}</p>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-5 bg-amber-500 text-white rounded-full font-bold shadow-lg shadow-amber-200 dark:shadow-none flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                Okudum <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {/* Step 3: Water */}
          {step === 3 && !isFinished && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-8">
                <Droplets size={48} className="text-blue-500 mx-auto mb-2" />
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Vücudunu Tazele</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Bir bardak su içerek güne başla.</p>
              </div>

              <div 
                onClick={() => setIsWaterChecked(!isWaterChecked)}
                className={cn(
                  "w-full p-10 rounded-[40px] border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 mb-12",
                  isWaterChecked ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20" : "bg-gray-50 border-gray-100 dark:bg-white/5 dark:border-white/5"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                  isWaterChecked ? "bg-blue-500 text-white scale-110" : "bg-white dark:bg-gray-800 text-gray-300"
                )}>
                  <CheckCircle2 size={32} />
                </div>
                <span className={cn(
                  "font-bold text-lg",
                  isWaterChecked ? "text-blue-600 dark:text-blue-400" : "text-gray-400"
                )}>
                  Suyu İçtim
                </span>
              </div>

              <button
                disabled={!isWaterChecked}
                onClick={handleFinish}
                className={cn(
                  "w-full py-5 rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95",
                  isWaterChecked ? "bg-green-500 text-white shadow-green-200 dark:shadow-none" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                Rutini Tamamla <Trophy size={20} />
              </button>
            </motion.div>
          )}

          {/* Success State */}
          {isFinished && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-12"
            >
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8">
                <Trophy size={48} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">Harika Bir Başlangıç!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs">
                Sabah rutinini tamamladın ve güne hazırsın.
              </p>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 px-6 py-3 rounded-2xl border border-purple-100 dark:border-purple-900/40 mb-12">
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {alreadyCompletedToday ? "Bugün zaten puan kazandın!" : "+20 Gelişim Puanı Kazandın!"}
                </span>
              </div>

              <button
                onClick={onBack}
                className="w-full py-5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-full font-bold active:scale-95 transition-transform"
              >
                Ana Sayfaya Dön
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
