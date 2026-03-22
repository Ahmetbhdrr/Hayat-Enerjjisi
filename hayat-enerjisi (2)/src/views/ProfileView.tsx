import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  ChevronRight, 
  Trophy, 
  Star, 
  Heart, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  LayoutGrid, 
  ListTodo, 
  Package,
  Camera,
  User as UserIcon,
  X,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserTask, UserTodoList, SoulFriend } from '../types';
import { THEMES, PET_OPTIONS, OUTFITS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProfileViewProps {
  profile: UserProfile | null;
  soulFriend: SoulFriend | null;
  tasks: UserTask[];
  todoLists: UserTodoList[];
  onNavigateToSettings: () => void;
  onNavigateToSoulFriend: () => void;
  onUpdateTheme: (themeId: string) => Promise<void>;
  onAddTodoList: (list: Partial<UserTodoList>) => Promise<void>;
  onDeleteTodoList: (id: string) => Promise<void>;
  onToggleTodoTask: (listId: string, taskId: string, completed: boolean) => Promise<void>;
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<void>;
  onUpdateSoulFriend: (data: Partial<SoulFriend>) => Promise<void>;
}

export default function ProfileView({ 
  profile, 
  soulFriend,
  tasks, 
  todoLists,
  onNavigateToSettings, 
  onNavigateToSoulFriend,
  onUpdateTheme,
  onAddTodoList,
  onDeleteTodoList,
  onToggleTodoTask,
  onUpdateProfile,
  onUpdateSoulFriend
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'todo' | 'items'>('stats');
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDuration, setNewTodoDuration] = useState<'weekly' | 'yearly'>('weekly');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalPoints = profile?.points || 0;

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;
    await onAddTodoList({
      title: newTodoTitle.trim(),
      duration: newTodoDuration,
      tasks: []
    });
    setNewTodoTitle('');
    setShowAddTodo(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert('Resim boyutu 1MB\'dan küçük olmalıdır.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      await onUpdateProfile({ photoURL: base64String });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-32">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Profil</h1>
        <button 
          onClick={onNavigateToSettings}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-400"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-4">
        <div className="glass-card p-6 flex items-center gap-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-3xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon size={32} />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
            >
              <Camera size={12} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.displayName || 'Kullanıcı'}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{profile?.email}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                <Star size={10} fill="currentColor" />
                <span className="text-[10px] font-bold">{totalPoints} Puan</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
                <Trophy size={10} />
                <span className="text-[10px] font-bold">Seviye {Math.floor(totalPoints / 100) + 1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Soul Friend Quick Access - Moved here */}
      <div className="px-6 mb-8">
        <button 
          onClick={onNavigateToSoulFriend}
          className="w-full glass-card p-6 flex items-center justify-between group active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center overflow-hidden">
              {soulFriend ? (
                <img 
                  src={PET_OPTIONS.find(p => p.type === soulFriend.type)?.image} 
                  alt="Pet" 
                  className="w-12 h-12 object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Heart size={24} className="text-purple-400" />
              )}
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {soulFriend ? soulFriend.name : 'Ruh Arkadaşı Edin'}
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">
                {soulFriend ? `Seviye ${soulFriend.level} • %${soulFriend.happiness} Mutlu` : 'Henüz bir dostun yok'}
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl">
          {[
            { id: 'stats', label: 'İstatistik', icon: LayoutGrid },
            { id: 'todo', label: 'Hedefler', icon: ListTodo },
            { id: 'items', label: 'Öğelerim', icon: Package },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                activeTab === tab.id 
                  ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm" 
                  : "text-gray-400 dark:text-gray-500"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Tamamlanan Görev</p>
                </div>
                <div className="glass-card p-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                    <Calendar size={18} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.createdAt ? Math.floor((Date.now() - (profile.createdAt.seconds * 1000)) / (1000 * 60 * 60 * 24)) + 1 : 1}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Gündür Beraberiz</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'todo' && (
            <motion.div
              key="todo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Hedef Listelerim</h3>
                <button 
                  onClick={() => setShowAddTodo(true)}
                  className="p-2 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-none"
                >
                  <Plus size={16} />
                </button>
              </div>

              {todoLists.length === 0 ? (
                <div className="p-12 rounded-[32px] border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-4">
                    <ListTodo size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                    Henüz bir hedef listesi oluşturmadın.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todoLists.map((list) => (
                    <div key={list.id} className="glass-card overflow-hidden">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{list.title}</h4>
                          <span className="text-[9px] font-bold text-purple-600 uppercase tracking-widest">
                            {list.duration === 'weekly' ? 'Haftalık' : 'Yıllık'}
                          </span>
                        </div>
                        <button 
                          onClick={() => onDeleteTodoList(list.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="p-2 space-y-1">
                        {(list.tasks || []).map((task) => (
                          <button
                            key={task.id}
                            onClick={() => onToggleTodoTask(list.id, task.id, !task.completed)}
                            className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-left"
                          >
                            {task.completed ? (
                              <CheckCircle2 size={18} className="text-emerald-500" />
                            ) : (
                              <Circle size={18} className="text-gray-300" />
                            )}
                            <span className={cn(
                              "text-xs font-medium transition-all",
                              task.completed ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-300"
                            )}>
                              {task.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'items' && (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Unlocked Pets */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Heart size={16} className="text-rose-500" />
                  Dostlarım
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {PET_OPTIONS.filter(p => soulFriend?.unlockedPets?.includes(p.type)).map(pet => {
                    const isActive = soulFriend?.type === pet.type;
                    return (
                      <div key={pet.type} className={cn(
                        "glass-card p-4 flex flex-col items-center text-center gap-3 transition-all",
                        isActive && "ring-2 ring-amber-500 bg-amber-50/50 dark:bg-amber-900/10"
                      )}>
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                          <img src={pet.image} alt={pet.label} className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">
                            {soulFriend?.petNames?.[pet.type] || pet.label}
                          </p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            {soulFriend?.petNames?.[pet.type] ? pet.label : 'Açık'}
                          </p>
                        </div>
                        <button
                          onClick={() => !isActive && onUpdateSoulFriend({ type: pet.type })}
                          disabled={isActive}
                          className={cn(
                            "w-full py-1.5 rounded-lg text-[10px] font-bold transition-all",
                            isActive 
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" 
                              : "bg-purple-600 text-white hover:bg-purple-700"
                          )}
                        >
                          {isActive ? 'Aktif' : 'Aktif Et'}
                        </button>
                      </div>
                    );
                  })}
                  {(!soulFriend?.unlockedPets || soulFriend.unlockedPets.length === 0) && (
                    <p className="col-span-2 text-center py-8 text-xs text-gray-400 italic">Henüz başka dostun yok.</p>
                  )}
                </div>
              </section>

              {/* Unlocked Outfits */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package size={16} className="text-amber-500" />
                  Aksesuarlarım
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {OUTFITS.filter(o => soulFriend?.unlockedOutfits?.includes(o.id)).map(outfit => {
                    const isEquipped = soulFriend?.outfits?.includes(outfit.id) || (!soulFriend?.outfits?.length && outfit.id === 'default');
                    return (
                      <div key={outfit.id} className={cn(
                        "glass-card p-3 flex flex-col items-center text-center gap-2 transition-all",
                        isEquipped && "ring-1 ring-purple-500 bg-purple-50/30 dark:bg-purple-900/10"
                      )}>
                        <div className="text-2xl">{outfit.emoji}</div>
                        <p className="text-[10px] font-bold text-gray-900 dark:text-white truncate w-full">{outfit.name}</p>
                        <button
                          onClick={() => {
                            if (isEquipped) return;
                            let newOutfits = [outfit.id];
                            if (outfit.id === 'default') newOutfits = [];
                            onUpdateSoulFriend({ outfits: newOutfits });
                          }}
                          disabled={isEquipped}
                          className={cn(
                            "w-full py-1 rounded-md text-[9px] font-bold transition-all",
                            isEquipped 
                              ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" 
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                          )}
                        >
                          {isEquipped ? 'Giyildi' : 'Giy'}
                        </button>
                      </div>
                    );
                  })}
                  {(!soulFriend?.unlockedOutfits || soulFriend.unlockedOutfits.length === 0) && (
                    <p className="col-span-3 text-center py-8 text-xs text-gray-400 italic">Henüz aksesuarın yok.</p>
                  )}
                </div>
              </section>

              {/* Unlocked Themes */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-500" />
                  Temalarım
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.filter(t => profile?.unlockedThemes?.includes(t.id)).map((theme) => {
                    const isActive = profile?.activeThemeId === theme.id;
                    return (
                      <div key={theme.id} className={cn(
                        "glass-card p-3 text-left relative overflow-hidden transition-all",
                        isActive && "ring-2 ring-purple-500 bg-purple-50/30 dark:bg-purple-900/10"
                      )}>
                        <div className={cn("w-full h-12 rounded-lg mb-2", theme.preview)} />
                        <p className="text-[10px] font-bold text-gray-900 dark:text-white mb-2">{theme.name}</p>
                        <button
                          onClick={() => !isActive && onUpdateTheme(theme.id)}
                          disabled={isActive}
                          className={cn(
                            "w-full py-1 rounded-md text-[9px] font-bold transition-all",
                            isActive 
                              ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" 
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                          )}
                        >
                          {isActive ? 'Aktif' : 'Seç'}
                        </button>
                      </div>
                    );
                  })}
                  {(!profile?.unlockedThemes || profile.unlockedThemes.length === 0) && (
                    <p className="col-span-2 text-center py-8 text-xs text-gray-400 italic">Henüz teman yok.</p>
                  )}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Todo Modal */}
      <AnimatePresence>
        {showAddTodo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-8 w-full max-w-xs shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-white">Yeni Hedef</h3>
                <button onClick={() => setShowAddTodo(false)} className="text-gray-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Liste Başlığı</label>
                  <input 
                    type="text" 
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="Örn: Haftalık Spor"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Süreç</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNewTodoDuration('weekly')}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[10px] font-bold transition-all",
                        newTodoDuration === 'weekly' ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                      )}
                    >
                      Haftalık
                    </button>
                    <button
                      onClick={() => setNewTodoDuration('yearly')}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[10px] font-bold transition-all",
                        newTodoDuration === 'yearly' ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                      )}
                    >
                      Yıllık
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={handleAddTodo}
                  className="glass-button w-full py-3 text-sm font-bold mt-4"
                >
                  Oluştur
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
