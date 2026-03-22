export interface LikedCard {
  id: string;
  uid: string;
  cardId: string;
  type: CardType;
  content: string;
  likedAt: any;
}

export type CardType = 'motivation' | 'affirmation';

export interface Card {
  id: string;
  content: string;
  type: CardType;
  color?: string;
}

export interface UserTask {
  id: string;
  taskId: string;
  title: string;
  points: number;
  type: 'physical' | 'spiritual';
  completed: boolean;
  date: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  bestThing: string;
  gratitude: string[];
  achievement: string;
  createdAt: any;
}

export interface UserSettings {
  notifications: {
    morning: boolean;
    noon: boolean;
    evening: boolean;
  };
  sound: {
    bgMusicEnabled: boolean;
    bgMusicVolume: number;
  };
  security: {
    biometricEnabled: boolean;
  };
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  points: number;
  totalTasksCompleted: number;
  journalPasswordHash?: string;
  lastReadyForDayDate?: string;
  unlockedThemes?: string[];
  unlockedPets?: string[];
  activeThemeId?: string;
  settings?: UserSettings;
  photoURL?: string;
  createdAt?: any;
}

export interface Theme {
  id: string;
  name: string;
  price: number;
  type: 'color' | 'image';
  value: string; // Hex color or image URL
  preview: string;
}

export interface FrequencySound {
  id: string;
  name: string;
  description: string;
  hz: string;
  icon: string;
  url: string;
  color: string;
}

export interface NatureSound {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  color: string;
}

export interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserTodoList {
  id: string;
  uid: string;
  title: string;
  duration: 'weekly' | 'yearly';
  tasks: TodoTask[];
  createdAt: any;
}

export type PetType = 'cat' | 'dog' | 'rabbit' | 'panda' | 'fox' | 'koala';

export interface SoulFriend {
  id: string;
  uid: string;
  type: PetType;
  name: string;
  petNames?: Partial<Record<PetType, string>>;
  level: number;
  experience: number;
  hunger: number;
  happiness: number;
  feedCount: number;
  lastFedDate: string;
  lastFed: any;
  lastPlayed: any;
  outfits: string[];
  unlockedOutfits: string[];
  unlockedPets: string[];
  createdAt: any;
}
