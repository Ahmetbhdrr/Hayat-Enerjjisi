import React, { Component, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home,
  Sparkles, 
  Zap, 
  Heart, 
  Music, 
  Cookie, 
  User, 
  BookOpen, 
  LogOut, 
  ChevronRight,
  AlertCircle,
  Settings,
  ShoppingBag,
  Circle,
  X,
  Trees,
  Waves
} from 'lucide-react';
import { useFirebase } from './useFirebase';
import { signInWithGoogle, logout } from './firebase';
import MotivationView from './views/MotivationView';
import GrowthView from './views/GrowthView';
import AffirmationView from './views/AffirmationView';
import FrequencyView from './views/FrequencyView';
import AnswersView from './views/AnswersView';
import JournalView from './views/JournalView';
import ProfileView from './views/ProfileView';
import LikedCardsView from './views/LikedCardsView';
import SettingsView from './views/SettingsView';
import HomeView from './views/HomeView';
import ReadyForDayView from './views/ReadyForDayView';
import MysticAnswersView from './views/MysticAnswersView';
import { SoulFriendView } from './views/SoulFriendView';
import { StoreView } from './views/StoreView';
import { THEMES, BACKGROUND_MUSIC_URL } from './constants';
import { SoundProvider, useSound } from './contexts/SoundContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Error Boundary
// Simple wrapper instead of ErrorBoundary for now
import { getDailyCards } from './utils/dailyCards';

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function LoginView() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-[#F8F9FA]">
      <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center mb-8 animate-float shadow-2xl shadow-purple-100">
        <Sparkles size={64} className="text-purple-500" />
      </div>
      <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">Hayat Enerjisi</h1>
      <p className="text-gray-500 mb-12 max-w-xs italic leading-relaxed">İçindeki gücü keşfet, ruhunu besle ve her gün daha da çiçek aç. ✨</p>
      
      <button 
        onClick={signInWithGoogle}
        className="w-full max-w-xs py-5 glass-button rounded-full font-bold flex items-center justify-center gap-4 text-gray-700 shadow-xl shadow-purple-50"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
        Google ile Başla
      </button>
      
      <div className="mt-12 flex gap-4">
        <div className="w-2 h-2 rounded-full bg-purple-200" />
        <div className="w-2 h-2 rounded-full bg-purple-300" />
        <div className="w-2 h-2 rounded-full bg-purple-400" />
      </div>
    </div>
  );
}

function MiniPlayer({ activeTab }: { activeTab: string }) {
  const { activeSound, isPlaying, togglePlay, stopSound, timeLeft } = useSound();

  if (!activeSound || activeTab !== 'frequency') return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-4 right-4 z-50"
    >
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: activeSound.color }}>
            {activeSound.icon}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{activeSound.name}</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
              {isPlaying ? 'Çalıyor' : 'Duraklatıldı'} {timeLeft !== null && `• ${formatTime(timeLeft)}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-200 dark:shadow-none"
          >
            {isPlaying ? <Circle size={14} fill="currentColor" /> : <Zap size={14} fill="currentColor" />}
          </button>
          <button
            onClick={stopSound}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  );
}

function AppContent() {
  const { user, profile, tasks, likedCards, journals, todoLists, soulFriend, loading, toggleTask, likeCard, saveJournal, deleteJournal, getHistoricalTasks, setJournalPassword, saveTodoList, deleteTodoList, toggleTodoTask, addPoints, unlockTheme, setActiveTheme, updateSettings, createSoulFriend, updateSoulFriend, unlockPet, unlockOutfit, updateProfile } = useFirebase();
  const [activeTab, setActiveTab] = useState('home');
  const [dailyCards, setDailyCards] = useState<{ motivation: any[], affirmation: any[] }>({ motivation: [], affirmation: [] });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(BACKGROUND_MUSIC_URL);
      audioRef.current.loop = true;
    }

    const settings = profile?.settings?.sound;
    const bgMusicEnabled = settings?.bgMusicEnabled ?? true;
    const bgMusicVolume = settings?.bgMusicVolume ?? 50;

    if (bgMusicEnabled) {
      audioRef.current.volume = bgMusicVolume / 100;
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser", e));
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [profile?.settings?.sound]);

  useEffect(() => {
    (window as any).onNavigateToReadyForDay = () => setActiveTab('ready-for-day');
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const mainContainerRef = React.useRef<HTMLDivElement>(null);
  const activeTheme = THEMES.find(t => t.id === profile?.activeThemeId) || THEMES[0];

  useEffect(() => {
    if (activeTheme && mainContainerRef.current) {
      if (isDarkMode && activeTheme.type === 'color') {
        // Clear inline styles in dark mode for color themes to let CSS handle it
        mainContainerRef.current.style.backgroundColor = '';
        mainContainerRef.current.style.backgroundImage = 'none';
      } else if (activeTheme.type === 'color') {
        mainContainerRef.current.style.backgroundColor = activeTheme.value;
        mainContainerRef.current.style.backgroundImage = 'none';
      } else {
        mainContainerRef.current.style.backgroundImage = `url(${activeTheme.value})`;
        mainContainerRef.current.style.backgroundSize = 'cover';
        mainContainerRef.current.style.backgroundPosition = 'center';
        mainContainerRef.current.style.backgroundAttachment = 'fixed';
        mainContainerRef.current.style.backgroundColor = 'transparent';
      }
    }
  }, [activeTheme, isDarkMode]);

  useEffect(() => {
    setDailyCards(getDailyCards());
    
    // Check for refresh every minute
    const interval = setInterval(() => {
      setDailyCards(getDailyCards());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8F9FA]">
        <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-purple-500 font-bold tracking-widest uppercase text-[10px]">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView onNavigateToMotivation={() => setActiveTab('motivation')} onNavigateToAffirmation={() => setActiveTab('affirmation')} onNavigateToAnswers={() => setActiveTab('mystic-answers')} profile={profile} onLike={likeCard} likedCards={likedCards} isDarkMode={isDarkMode} affirmationCards={dailyCards.affirmation} />;
      case 'ready-for-day': return <ReadyForDayView onComplete={addPoints} onBack={() => setActiveTab('home')} motivationCard={dailyCards.motivation[0] || null} profile={profile} />;
      case 'motivation': return <MotivationView onLike={likeCard} likedCards={likedCards} cards={dailyCards.motivation} onNavigateToLiked={() => setActiveTab('liked-cards')} />;
      case 'growth': return <GrowthView tasks={tasks} profile={profile} onToggle={toggleTask} />;
      case 'affirmation': return <AffirmationView onLike={likeCard} likedCards={likedCards} cards={dailyCards.affirmation} onNavigateToLiked={() => setActiveTab('liked-cards')} />;
      case 'frequency': return <FrequencyView />;
      case 'answers': return <AnswersView isDarkMode={isDarkMode} />;
      case 'mystic-answers': return <MysticAnswersView onBack={() => setActiveTab('home')} />;
      case 'soul-friend': return <SoulFriendView soulFriend={soulFriend} onCreate={createSoulFriend} onUpdate={updateSoulFriend} onBack={() => setActiveTab('profile')} points={profile?.points || 0} onAddPoints={addPoints} />;
      case 'journal': return <JournalView journals={journals} onSave={saveJournal} onDelete={deleteJournal} profile={profile} onSetPassword={setJournalPassword} />;
      case 'profile': return <ProfileView profile={profile} soulFriend={soulFriend} tasks={tasks} todoLists={todoLists} onNavigateToSettings={() => setActiveTab('settings')} onNavigateToSoulFriend={() => setActiveTab('soul-friend')} onUpdateTheme={setActiveTheme} onAddTodoList={saveTodoList} onDeleteTodoList={deleteTodoList} onToggleTodoTask={toggleTodoTask} onUpdateProfile={updateProfile} onUpdateSoulFriend={updateSoulFriend} />;
      case 'liked-cards': return <LikedCardsView likedCards={likedCards} onLike={likeCard} />;
      case 'settings': return <SettingsView isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} onNavigateToStore={() => setActiveTab('store')} profile={profile} updateSettings={updateSettings} onSetPassword={setJournalPassword} />;
      case 'store':
        return (
          <StoreView 
            profile={profile} 
            soulFriend={soulFriend}
            onUnlockTheme={unlockTheme} 
            onSelectTheme={setActiveTheme} 
            onUnlockPet={unlockPet}
            onUnlockOutfit={unlockOutfit}
            onUpdateSoulFriend={updateSoulFriend}
          />
        );
      default: return <MotivationView onLike={likeCard} likedCards={likedCards} cards={dailyCards.motivation} onNavigateToLiked={() => setActiveTab('liked-cards')} />;
    }
  };

  const navItems = [
    { id: 'motivation', icon: Sparkles, label: 'Motivasyon' },
    { id: 'growth', icon: Zap, label: 'Gelişim' },
    { id: 'home', icon: Trees, label: 'Ana Sayfa' },
    { id: 'frequency', icon: Waves, label: 'Frekans' },
    { id: 'answers', icon: Cookie, label: 'Cevaplar' },
  ];

  return (
    <ErrorBoundary>
      <div 
        ref={mainContainerRef}
        className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden shadow-2xl transition-colors duration-300 bg-white dark:bg-[#0A0A0A]"
      >
        {/* Header */}
        <header 
          className={cn(
            "px-3 py-2 flex justify-between items-center z-40 border-b transition-colors duration-500",
            activeTheme.id === 'default' 
              ? "bg-white dark:bg-[#121212] border-gray-50 dark:border-white/5" 
              : activeTheme.type === 'color'
                ? "border-black/5 dark:border-white/5"
                : "bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/10 dark:border-white/5"
          )}
          style={activeTheme.type === 'color' && activeTheme.id !== 'default' ? { backgroundColor: activeTheme.value } : {}}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-[#E9D5FF] dark:bg-purple-900/40 flex items-center justify-center text-purple-600 shadow-sm">
              <div className="w-5.5 h-5.5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                <Sparkles size={12} />
              </div>
            </div>
            <div>
              <h1 className={cn(
                "text-base font-serif font-bold leading-tight",
                activeTheme.type === 'image' || (activeTheme.type === 'color' && activeTheme.id !== 'default' && !['default', 'lavender_theme', 'mint_theme', 'sunset_theme', 'ocean_theme', 'rose_theme', 'amber_theme', 'slate_theme'].includes(activeTheme.id))
                  ? "text-white"
                  : "text-gray-800 dark:text-white"
              )}>Hayat Enerjisi</h1>
              <p className={cn(
                "text-[8px] font-medium uppercase tracking-wider",
                activeTheme.type === 'image' || (activeTheme.type === 'color' && activeTheme.id !== 'default' && !['default', 'lavender_theme', 'mint_theme', 'sunset_theme', 'ocean_theme', 'rose_theme', 'amber_theme', 'slate_theme'].includes(activeTheme.id))
                  ? "text-white/70"
                  : "text-gray-400 dark:text-gray-500"
              )}>İçindeki gücü keşfet</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[
              { id: 'journal', icon: BookOpen },
              { id: 'liked-cards', icon: Heart, fill: true },
              { id: 'profile', icon: User },
              { id: 'settings', icon: Settings }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm",
                  activeTab === item.id 
                    ? "bg-purple-500 text-white" 
                    : "bg-white dark:bg-gray-800 text-purple-400 border border-gray-100 dark:border-white/5"
                )}
              >
                <item.icon size={16} fill={item.fill && activeTab === item.id ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <MiniPlayer activeTab={activeTab} />
        <nav 
          className={cn(
            "px-1 py-1.5 border-t flex justify-around items-center z-40 transition-colors duration-500",
            activeTheme.id === 'default'
              ? "bg-white dark:bg-black border-gray-100 dark:border-white/5"
              : activeTheme.type === 'color'
                ? "border-black/5 dark:border-white/5"
                : "bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/10 dark:border-white/5"
          )}
          style={activeTheme.type === 'color' && activeTheme.id !== 'default' ? { backgroundColor: activeTheme.value } : {}}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center transition-all duration-300 rounded-lg relative",
                item.id === 'home' ? "px-2 py-1 -mt-4" : "px-1.5 py-1 gap-0.5",
                activeTab === item.id 
                  ? item.id === 'home'
                    ? "text-purple-600 dark:text-purple-400"
                    : "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400" 
                  : activeTheme.type === 'image' || (activeTheme.type === 'color' && activeTheme.id !== 'default' && !['default', 'lavender_theme', 'mint_theme', 'sunset_theme', 'ocean_theme', 'rose_theme', 'amber_theme', 'slate_theme'].includes(activeTheme.id))
                    ? "text-white/60 hover:text-white"
                    : "text-gray-400 dark:text-gray-500"
              )}
            >
              {item.id === 'home' && (
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-1 shadow-lg transition-all duration-300",
                  activeTab === 'home' 
                    ? "bg-purple-600 text-white scale-110" 
                    : "bg-white dark:bg-gray-800 text-purple-500 border border-purple-100 dark:border-white/5"
                )}>
                  <item.icon size={24} strokeWidth={2.5} />
                </div>
              )}
              {item.id !== 'home' && <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />}
              <span className={cn(
                "text-[7px] font-bold uppercase tracking-tighter",
                item.id === 'home' && "mt-0.5"
              )}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </ErrorBoundary>
  );
}
