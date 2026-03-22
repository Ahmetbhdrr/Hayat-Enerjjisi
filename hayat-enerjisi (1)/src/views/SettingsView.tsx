import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, 
  Sun, 
  ChevronRight, 
  Bell, 
  Volume2, 
  Shield, 
  Lock, 
  Fingerprint,
  Music,
  Coffee,
  SunMedium,
  MoonStar,
  X,
  Save,
  Key
} from 'lucide-react';
import { UserProfile, UserSettings } from '../types';

interface SettingsViewProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onNavigateToStore: () => void;
  profile: UserProfile | null;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  onSetPassword: (password: string) => Promise<void>;
}

export default function SettingsView({ isDarkMode, toggleDarkMode, onNavigateToStore, profile, updateSettings, onSetPassword }: SettingsViewProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const settings = {
    notifications: {
      morning: profile?.settings?.notifications?.morning ?? false,
      noon: profile?.settings?.notifications?.noon ?? false,
      evening: profile?.settings?.notifications?.evening ?? false,
    },
    sound: {
      bgMusicEnabled: profile?.settings?.sound?.bgMusicEnabled ?? true,
      bgMusicVolume: profile?.settings?.sound?.bgMusicVolume ?? 50,
    },
    security: {
      biometricEnabled: profile?.settings?.security?.biometricEnabled ?? false,
    }
  };

  const handleToggleNotification = async (key: keyof UserSettings['notifications']) => {
    if (!settings.notifications[key] && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Bildirim gönderebilmek için izin vermeniz gerekmektedir.');
        return;
      }
    }

    await updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const handleToggleSound = async () => {
    await updateSettings({
      sound: {
        ...settings.sound,
        bgMusicEnabled: !settings.sound.bgMusicEnabled
      }
    });
  };

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateSettings({
      sound: {
        ...settings.sound,
        bgMusicVolume: parseInt(e.target.value)
      }
    });
  };

  const handleToggleBiometric = async () => {
    await updateSettings({
      security: {
        ...settings.security,
        biometricEnabled: !settings.security.biometricEnabled
      }
    });
  };

  const handleSavePassword = async () => {
    setPasswordError('');

    // If a password already exists, verify it
    if (profile?.journalPasswordHash && currentPassword !== profile.journalPasswordHash) {
      setPasswordError('Mevcut şifre hatalı.');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('Yeni şifre en az 4 karakter olmalıdır.');
      return;
    }

    try {
      await onSetPassword(newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
      setCurrentPassword('');
      alert('Şifreniz başarıyla güncellendi.');
    } catch (error) {
      setPasswordError('Şifre güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div className="flex flex-col h-full px-4 py-4 overflow-y-auto pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ayarlar</h2>
          <div className="space-y-3">
            {/* Dark Mode */}
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">Karanlık Tema</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Gözlerinizi dinlendirin</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  isDarkMode ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-800'
                }`}
              >
                <motion.div
                  animate={{ x: isDarkMode ? 22 : 4 }}
                  className="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            {/* Themes */}
            <button
              onClick={onNavigateToStore}
              className="w-full glass-card p-4 flex items-center justify-between group active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                  <SunMedium size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">Temalar</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Uygulamanı kişiselleştir</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-purple-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Bildirimler</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: 'morning', title: 'Sabah Bildirimi', desc: 'Güne merhaba ve rutin hatırlatıcısı', icon: Coffee, color: 'bg-orange-100 text-orange-600' },
              { key: 'noon', title: 'Öğle Bildirimi', desc: 'Niyetini hatırlıyor musun?', icon: Sun, color: 'bg-yellow-100 text-yellow-600' },
              { key: 'evening', title: 'Akşam Bildirimi', desc: 'Olumlama ve frekans hatırlatıcısı', icon: MoonStar, color: 'bg-blue-100 text-blue-600' },
            ].map((item) => (
              <div key={item.key} className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${item.color} dark:bg-opacity-20 rounded-xl`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.title}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleNotification(item.key as keyof UserSettings['notifications'])}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    settings.notifications[item.key as keyof UserSettings['notifications']] ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.notifications[item.key as keyof UserSettings['notifications']] ? 22 : 4 }}
                    className="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Sound Settings */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="text-purple-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ses Ayarları</h2>
          </div>
          <div className="glass-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                  <Music size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">Arka Plan Müziği</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Sakinleştirici melodi</p>
                </div>
              </div>
              <button
                onClick={handleToggleSound}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  settings.sound.bgMusicEnabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-800'
                }`}
              >
                <motion.div
                  animate={{ x: settings.sound.bgMusicEnabled ? 22 : 4 }}
                  className="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
            
            {settings.sound.bgMusicEnabled && (
              <div className="pt-2">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ses Seviyesi</span>
                  <span className="text-[10px] font-bold text-purple-600">{settings.sound.bgMusicVolume}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={settings.sound.bgMusicVolume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            )}
          </div>
        </section>

        {/* Data & Security */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-purple-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Veri ve Güvenlik</h2>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full glass-card p-4 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                  <Lock size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">Günlük Kilidini Değiştir</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Şifreni güncelle</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Fingerprint size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">Biyometrik Kilit</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Face ID veya Parmak İzi</p>
                </div>
              </div>
              <button
                onClick={handleToggleBiometric}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  settings.security.biometricEnabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-800'
                }`}
              >
                <motion.div
                  animate={{ x: settings.security.biometricEnabled ? 22 : 4 }}
                  className="absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>
        </section>

        <div className="text-center pt-8 opacity-30">
          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Hayat Enerjisi v1.1.0
          </p>
        </div>
      </motion.div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-8 w-full max-w-xs shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-white">Şifre Değiştir</h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-gray-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {profile?.journalPasswordHash && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Mevcut Şifre</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Mevcut şifreniz"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Yeni Şifre</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="En az 4 karakter"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 dark:text-white"
                    />
                  </div>
                </div>

                {passwordError && (
                  <p className="text-xs text-red-500 font-medium text-center">{passwordError}</p>
                )}
                
                <button 
                  onClick={handleSavePassword}
                  className="glass-button w-full py-3 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  <span className="text-sm font-bold">Güncelle</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
