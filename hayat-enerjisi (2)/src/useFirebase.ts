import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  Timestamp,
  increment,
  addDoc,
  deleteDoc,
  arrayUnion
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, UserTask, LikedCard, JournalEntry, UserTodoList, TodoTask, UserSettings, SoulFriend, PetType } from './types';
import { PHYSICAL_TASKS, SPIRITUAL_TASKS } from './constants';
import { format } from 'date-fns';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useFirebase() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [likedCards, setLikedCards] = useState<LikedCard[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [todoLists, setTodoLists] = useState<UserTodoList[]>([]);
  const [soulFriend, setSoulFriend] = useState<SoulFriend | null>(null);
  const [loading, setLoading] = useState(true);

  const [today, setToday] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const interval = setInterval(() => {
      const newToday = format(new Date(), 'yyyy-MM-dd');
      if (newToday !== today) {
        setToday(newToday);
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [today]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Listen to profile
        const profileRef = doc(db, 'users', u.uid);
        const unsubProfile = onSnapshot(profileRef, async (snap) => {
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            // Create profile
            const newProfile: UserProfile = {
              uid: u.uid,
              displayName: u.displayName || 'Misafir',
              email: u.email || '',
              points: 0,
              totalTasksCompleted: 0,
              settings: {
                notifications: { morning: false, noon: false, evening: false },
                sound: { bgMusicEnabled: true, bgMusicVolume: 50 },
                security: { biometricEnabled: false }
              }
            };
            try {
              await setDoc(profileRef, { ...newProfile, createdAt: Timestamp.now() });
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `users/${u.uid}`);
            }
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${u.uid}`);
        });

        // Listen to tasks for today
        const tasksRef = collection(db, 'users', u.uid, 'tasks');
        const qTasks = query(tasksRef, where('date', '==', today));
        const unsubTasks = onSnapshot(qTasks, (snap) => {
          const fetchedTasks = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserTask));
          
          // If no tasks for today, initialize them
          if (fetchedTasks.length === 0) {
            initializeTasks(u.uid);
          } else {
            setTasks(fetchedTasks);
          }
        });

        // Listen to liked cards
        const likedRef = collection(db, 'users', u.uid, 'likedCards');
        const unsubLiked = onSnapshot(likedRef, (snap) => {
          setLikedCards(snap.docs.map(d => ({ id: d.id, ...d.data() } as LikedCard)));
        });

        // Listen to journals
        const journalRef = collection(db, 'users', u.uid, 'journals');
        const unsubJournal = onSnapshot(journalRef, (snap) => {
          setJournals(snap.docs.map(d => ({ id: d.id, ...d.data() } as JournalEntry)));
        });

        // Listen to todo lists
        const todoRef = collection(db, 'users', u.uid, 'todoLists');
        const unsubTodo = onSnapshot(todoRef, (snap) => {
          setTodoLists(snap.docs.map(d => ({ id: d.id, ...d.data() } as UserTodoList)));
        });

        // Listen to soul friend
        const soulFriendRef = doc(db, 'users', u.uid, 'soulFriend', 'pet');
        const unsubSoulFriend = onSnapshot(soulFriendRef, async (snap) => {
          if (snap.exists()) {
            const data = snap.data() as SoulFriend;
            const todayStr = format(new Date(), 'yyyy-MM-dd');
            
            if (data.lastFedDate !== todayStr) {
              // Reset for new day
              try {
                await updateDoc(soulFriendRef, {
                  hunger: 0,
                  happiness: 0,
                  feedCount: 0,
                  lastFedDate: todayStr
                });
              } catch (e) {
                console.error('Error resetting pet for new day:', e);
              }
            }
            
            setSoulFriend({ id: snap.id, ...data } as SoulFriend);
          } else {
            setSoulFriend(null);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${u.uid}/soulFriend/pet`);
        });

        setLoading(false);
        return () => {
          unsubProfile();
          unsubTasks();
          unsubLiked();
          unsubJournal();
          unsubTodo();
          unsubSoulFriend();
        };
      } else {
        setProfile(null);
        setTasks([]);
        setLikedCards([]);
        setJournals([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [today]);

  const initializeTasks = async (uid: string) => {
    const tasksRef = collection(db, 'users', uid, 'tasks');
    const batch: Promise<any>[] = [];

    PHYSICAL_TASKS.forEach(t => {
      batch.push(addDoc(tasksRef, {
        uid,
        taskId: t.id,
        title: t.title,
        points: t.points,
        type: 'physical',
        completed: false,
        date: today,
      }));
    });

    SPIRITUAL_TASKS.forEach(t => {
      batch.push(addDoc(tasksRef, {
        uid,
        taskId: t.id,
        title: t.title,
        points: t.points,
        type: 'spiritual',
        completed: false,
        date: today,
      }));
    });

    await Promise.all(batch);
  };

  const toggleTask = async (taskId: string, completed: boolean, points: number) => {
    if (!user) return;
    const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
    const profileRef = doc(db, 'users', user.uid);

    await updateDoc(taskRef, {
      completed: !completed,
      completedAt: !completed ? Timestamp.now() : null,
    });

    await updateDoc(profileRef, {
      points: increment(!completed ? points : -points),
      totalTasksCompleted: increment(!completed ? 1 : -1),
    });
  };

  const likeCard = async (card: any) => {
    if (!user) return;
    const likedRef = collection(db, 'users', user.uid, 'likedCards');
    
    // Check if already liked
    const cardId = card.cardId || card.id;
    const q = query(likedRef, where('cardId', '==', cardId));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      await addDoc(likedRef, {
        uid: user.uid,
        cardId: cardId,
        type: card.type,
        content: card.content,
        likedAt: Timestamp.now(),
      });
    } else {
      // Unlike all instances (should be only one)
      const deletePromises = snap.docs.map(d => deleteDoc(doc(db, 'users', user.uid, 'likedCards', d.id)));
      await Promise.all(deletePromises);
    }
  };

  const saveJournal = async (entry: Partial<JournalEntry>) => {
    if (!user) return;
    const { id, ...data } = entry;
    if (id) {
      const entryRef = doc(db, 'users', user.uid, 'journals', id);
      await updateDoc(entryRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } else {
      const journalRef = collection(db, 'users', user.uid, 'journals');
      await addDoc(journalRef, {
        ...data,
        uid: user.uid,
        createdAt: Timestamp.now(),
      });
    }
  };

  const deleteJournal = async (journalId: string) => {
    if (!user) return;
    const entryRef = doc(db, 'users', user.uid, 'journals', journalId);
    await deleteDoc(entryRef);
  };

  const getHistoricalTasks = async (days: number = 7) => {
    if (!user) return [];
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksRef, where('uid', '==', user.uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as UserTask));
  };

  const setJournalPassword = async (password: string) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    // In a real app, we'd hash this. For now, simple storage or mock hash.
    await updateDoc(profileRef, {
      journalPasswordHash: password, 
    });
  };

  const saveTodoList = async (list: Partial<UserTodoList>) => {
    if (!user) return;
    const { id, ...data } = list;
    if (id) {
      const listRef = doc(db, 'users', user.uid, 'todoLists', id);
      await updateDoc(listRef, {
        ...data,
      });
    } else {
      const todoRef = collection(db, 'users', user.uid, 'todoLists');
      await addDoc(todoRef, {
        ...data,
        uid: user.uid,
        createdAt: Timestamp.now(),
      });
    }
  };

  const deleteTodoList = async (listId: string) => {
    if (!user) return;
    const listRef = doc(db, 'users', user.uid, 'todoLists', listId);
    await deleteDoc(listRef);
  };

  const toggleTodoTask = async (listId: string, taskId: string, completed: boolean) => {
    if (!user) return;
    const listRef = doc(db, 'users', user.uid, 'todoLists', listId);
    const list = todoLists.find(l => l.id === listId);
    if (!list) return;

    const updatedTasks = list.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !completed } : t
    );

    await updateDoc(listRef, {
      tasks: updatedTasks,
    });
  };

  const addPoints = async (points: number, date?: string) => {
    if (!user) return;
    const profileRef = doc(db, 'users', user.uid);
    const updateData: any = {
      points: increment(points),
    };
    if (date) {
      updateData.lastReadyForDayDate = date;
    }
    await updateDoc(profileRef, updateData);
  };

  const unlockTheme = async (themeId: string, price: number) => {
    if (!user || !profile) return false;
    if (profile.points < price) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        points: increment(-price),
        unlockedThemes: arrayUnion(themeId)
      });
      return true;
    } catch (error) {
      console.error('Error unlocking theme:', error);
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      return false;
    }
  };

  const setActiveTheme = async (themeId: string) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        activeThemeId: themeId
      });
    } catch (error) {
      console.error('Error setting active theme:', error);
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const updateSettings = async (settings: Partial<UserSettings>) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      // Deep merge settings if needed, but for now we can just update the settings object
      await updateDoc(userRef, {
        settings: {
          ...profile?.settings,
          ...settings
        }
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const createSoulFriend = async (type: PetType, name: string) => {
    if (!user) return;
    try {
      const soulFriendRef = doc(db, 'users', user.uid, 'soulFriend', 'pet');
      const newPet: any = {
        uid: user.uid,
        type,
        name,
        level: 1,
        experience: 0,
        hunger: 0,
        happiness: 0,
        feedCount: 0,
        lastFedDate: format(new Date(), 'yyyy-MM-dd'),
        lastFed: Timestamp.now(),
        lastPlayed: Timestamp.now(),
        outfits: ['default'],
        unlockedOutfits: ['default'],
        unlockedPets: [type],
        petNames: { [type]: name },
        createdAt: Timestamp.now(),
      };
      await setDoc(soulFriendRef, newPet);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/soulFriend/pet`);
    }
  };

  const updateSoulFriend = async (data: Partial<SoulFriend>) => {
    if (!user || !soulFriend) return;
    try {
      const soulFriendRef = doc(db, 'users', user.uid, 'soulFriend', 'pet');
      
      const updateData: any = { ...data };
      
      // If switching type, also switch name to the one saved in petNames
      if (data.type && data.type !== soulFriend.type) {
        const savedName = soulFriend.petNames?.[data.type];
        if (savedName) {
          updateData.name = savedName;
        }
      }

      // If updating name, also update petNames for the current type
      if (data.name) {
        const currentType = data.type || soulFriend.type;
        updateData[`petNames.${currentType}`] = data.name;
      }

      await updateDoc(soulFriendRef, updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/soulFriend/pet`);
    }
  };

  const unlockPet = async (petType: string, price: number) => {
    if (!user || !profile || !soulFriend) return false;
    if (profile.points < price) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      const soulFriendRef = doc(db, 'users', user.uid, 'soulFriend', 'pet');
      
      await updateDoc(userRef, {
        points: increment(-price)
      });
      
      await updateDoc(soulFriendRef, {
        unlockedPets: arrayUnion(petType)
      });
      
      return true;
    } catch (error) {
      console.error('Error unlocking pet:', error);
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/soulFriend/pet`);
      return false;
    }
  };

  const unlockOutfit = async (outfitId: string, price: number) => {
    if (!user || !profile || !soulFriend) return false;
    if (profile.points < price) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      const soulFriendRef = doc(db, 'users', user.uid, 'soulFriend', 'pet');
      
      await updateDoc(userRef, {
        points: increment(-price)
      });
      
      await updateDoc(soulFriendRef, {
        unlockedOutfits: arrayUnion(outfitId)
      });
      
      return true;
    } catch (error) {
      console.error('Error unlocking outfit:', error);
      return false;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return {
    user,
    profile,
    tasks,
    likedCards,
    journals,
    todoLists,
    soulFriend,
    loading,
    toggleTask,
    likeCard,
    saveJournal,
    deleteJournal,
    getHistoricalTasks,
    setJournalPassword,
    saveTodoList,
    deleteTodoList,
    toggleTodoTask,
    addPoints,
    unlockTheme,
    setActiveTheme,
    updateSettings,
    createSoulFriend,
    updateSoulFriend,
    unlockPet,
    unlockOutfit,
    updateProfile,
  };
}
