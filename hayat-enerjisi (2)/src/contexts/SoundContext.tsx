import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

interface SoundContextType {
  activeSound: any | null;
  isPlaying: boolean;
  volume: number;
  duration: number | null;
  playSound: (sound: any) => void;
  stopSound: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setDuration: (duration: number | null) => void;
  timeLeft: number | null;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [activeSound, setActiveSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [duration, setDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  const soundRef = useRef<Howl | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
      soundRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setActiveSound(null);
    setTimeLeft(null);
  };

  const playSound = (sound: any) => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }
    
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const newSound = new Howl({
      src: [sound.url],
      html5: true,
      loop: true,
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        updateMediaSession(sound, true);
        if (duration !== null) {
          const endTime = Date.now() + duration * 60 * 1000;
          setTimeLeft(duration * 60);
          
          timerRef.current = setTimeout(() => {
            stopSound();
          }, duration * 60 * 1000);

          intervalRef.current = setInterval(() => {
            const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining <= 0) {
              if (intervalRef.current) clearInterval(intervalRef.current);
            }
          }, 1000);
        }
      },
      onpause: () => {
        setIsPlaying(false);
        updateMediaSession(sound, false);
      },
      onstop: () => {
        setIsPlaying(false);
        updateMediaSession(sound, false);
      },
      onend: () => {
        if (duration !== null && !timerRef.current) {
          stopSound();
        }
      }
    });

    soundRef.current = newSound;
    newSound.play();
    setActiveSound(sound);
  };

  const updateMediaSession = (sound: any, playing: boolean) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: sound.name,
        artist: 'Hayat Enerjisi',
        album: 'Frekans & Doğa',
        artwork: [
          { src: 'https://raw.githubusercontent.com/Ahmetbhdrr/Hayat-Enerjjisi/main/logo.png', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
        if (soundRef.current && !isPlaying) togglePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (soundRef.current && isPlaying) togglePlay();
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        stopSound();
      });
    }
  };

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      soundRef.current.play();
      if (duration !== null && timeLeft !== null) {
        const endTime = Date.now() + timeLeft * 1000;
        timerRef.current = setTimeout(() => {
          stopSound();
        }, timeLeft * 1000);

        intervalRef.current = setInterval(() => {
          const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
          setTimeLeft(remaining);
          if (remaining <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  return (
    <SoundContext.Provider value={{
      activeSound,
      isPlaying,
      volume,
      duration,
      playSound,
      stopSound,
      togglePlay,
      setVolume,
      setDuration,
      timeLeft
    }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
