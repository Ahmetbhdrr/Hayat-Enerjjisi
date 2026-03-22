import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Save, Calendar, Plus, ChevronLeft, ChevronRight, Heart, Sparkles, BookOpen, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function JournalView({ journals, onSave, onDelete, profile, onSetPassword }: { journals: any[], onSave: (entry: any) => void, onDelete: (id: string) => void, profile: any, onSetPassword: (password: string) => void }) {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const initialEntryState = {
    mood: '😊',
    bestThing: '',
    gratitude: ['', '', ''],
    achievement: '',
  };

  const [newEntry, setNewEntry] = useState(initialEntryState);

  const moods = ['😊', '😌', '🥰', '🤩', '😴', '🤔', '😔', '😤'];

  const handleUnlock = () => {
    if (password === profile?.journalPasswordHash || !profile?.journalPasswordHash) {
      setIsLocked(false);
    } else {
      alert('Hatalı şifre!');
    }
  };

  const handleSetPassword = () => {
    if (password.length < 4) {
      alert('Şifre en az 4 karakter olmalıdır.');
      return;
    }
    onSetPassword(password);
    setIsLocked(false);
  };

  const handleSave = () => {
    if (!newEntry.mood || !newEntry.bestThing) {
      alert('Lütfen en azından modunuzu ve günün en iyi şeyini yazın.');
      return;
    }
    onSave({
      ...newEntry,
      id: editingId,
      date: editingId ? journals.find(j => j.id === editingId)?.date : format(new Date(), 'yyyy-MM-dd'),
    });
    setShowNewEntry(false);
    setEditingId(null);
    setNewEntry(initialEntryState);
  };

  const handleEdit = (journal: any) => {
    setNewEntry({
      mood: journal.mood,
      bestThing: journal.bestThing,
      gratitude: journal.gratitude || ['', '', ''],
      achievement: journal.achievement || '',
    });
    setEditingId(journal.id);
    setShowNewEntry(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  const openNewEntry = () => {
    setNewEntry(initialEntryState);
    setEditingId(null);
    setShowNewEntry(true);
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-6">
        <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6 animate-float">
          <Lock size={40} className="text-purple-500" />
        </div>
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-1.5">Günlük Arşivi</h2>
        <p className="text-xs text-gray-500 mb-8 text-center">Notlarına erişmek için şifreni gir.</p>
        
        <div className="w-full max-w-xs flex flex-col gap-3">
          <input 
            type="password" 
            placeholder="Şifre" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 glass-card focus:outline-none focus:ring-1 focus:ring-purple-500 text-center text-base"
          />
          <button 
            onClick={profile?.journalPasswordHash ? handleUnlock : handleSetPassword}
            className="glass-button w-full py-2.5 flex items-center justify-center gap-2"
          >
            {profile?.journalPasswordHash ? <Unlock size={16} /> : <Save size={16} />}
            <span className="text-xs font-bold">
              {profile?.journalPasswordHash ? "Kilidi Aç" : "Şifre Belirle & Kaydet"}
            </span>
          </button>
          {!profile?.journalPasswordHash && (
            <p className="text-[8px] text-gray-400 text-center uppercase tracking-widest font-bold">
              İlk kez giriş yapıyorsun, bir şifre belirle.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-4 py-4 overflow-y-auto pb-32">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Günlük</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">Bugün nasıl hissediyorsun? ✨</p>
        </div>
        <button 
          onClick={openNewEntry}
          className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg"
        >
          <Plus size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 w-full max-w-xs text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-800 dark:text-white mb-2">Notu Sil?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Bu notu kalıcı olarak silmek istediğinden emin misin?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full font-bold text-sm"
                >
                  Vazgeç
                </button>
                <button 
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-full font-bold text-sm shadow-lg shadow-red-100 dark:shadow-none"
                >
                  Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewEntry && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-8 mb-10 border-purple-200 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-white">
                {editingId ? 'Notu Düzenle' : 'Yeni Not'}
              </h3>
              <button 
                onClick={() => { setShowNewEntry(false); setEditingId(null); }} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              {moods.map(m => (
                <button 
                  key={m}
                  onClick={() => setNewEntry({...newEntry, mood: m})}
                  className={cn(
                    "w-12 h-12 text-2xl rounded-2xl flex items-center justify-center transition-all",
                    newEntry.mood === m ? "bg-purple-500 scale-110 shadow-lg" : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">İyi Ki Köşesi</label>
                <textarea 
                  placeholder="Bugün kendim için yaptığım en iyi şey..."
                  value={newEntry.bestThing}
                  onChange={(e) => setNewEntry({...newEntry, bestThing: e.target.value})}
                  className="w-full h-24 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 resize-none dark:text-gray-200"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Şükran Notu (3 Şey)</label>
                <div className="flex flex-col gap-2">
                  {newEntry.gratitude.map((g, i) => (
                    <input 
                      key={i}
                      placeholder={`${i+1}. Minnettar olduğum şey...`}
                      value={g}
                      onChange={(e) => {
                        const newGrat = [...newEntry.gratitude];
                        newGrat[i] = e.target.value;
                        setNewEntry({...newEntry, gratitude: newGrat});
                      }}
                      className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 dark:text-gray-200"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Gelişim Günlüğü</label>
                <textarea 
                  placeholder="Gelişim sekmesinde bugün neyi başardım?"
                  value={newEntry.achievement}
                  onChange={(e) => setNewEntry({...newEntry, achievement: e.target.value})}
                  className="w-full h-24 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 resize-none dark:text-gray-200"
                />
              </div>

              <button 
                onClick={handleSave}
                className="glass-button w-full py-3 flex items-center justify-center gap-2"
              >
                <Save size={18} /> 
                <span className="text-sm font-bold">
                  {editingId ? 'Güncelle' : 'Kaydet'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1 h-4 bg-purple-500 rounded-full" /> Geçmiş Notlar
        </h2>
        
        {journals.length === 0 ? (
          <div className="glass-card p-12 text-center flex flex-col items-center gap-4">
            <BookOpen size={48} className="text-purple-200 dark:text-purple-900/50" />
            <p className="text-gray-400 dark:text-gray-500 italic">Henüz bir notun yok. İlkini eklemeye ne dersin?</p>
          </div>
        ) : (
          journals.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).map((j) => (
            <motion.div 
              key={j.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => handleEdit(j)}
              className="glass-card p-4 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all border border-transparent hover:border-purple-100 dark:hover:border-purple-900/50 group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 dark:bg-purple-900/20 -mr-10 -mt-10 rounded-full opacity-30 group-hover:scale-110 transition-transform" />
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="text-2xl">{j.mood}</div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{format(new Date(j.date), 'dd MMMM yyyy')}</h4>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Günlük Not</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(j.id);
                  }}
                  className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <h5 className="text-[9px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-0.5">İyi Ki</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">“{j.bestThing}”</p>
                </div>
                {j.gratitude?.some((g: string) => g) && (
                  <div>
                    <h5 className="text-[10px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-1">Şükran</h5>
                    <ul className="text-xs text-gray-500 dark:text-gray-500 list-disc list-inside">
                      {j.gratitude.filter((g: string) => g).map((g: string, i: number) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
