import { MOTIVATION_CARDS, AFFIRMATION_CARDS } from '../constants';

export const getDailySeed = () => {
  const now = new Date();
  
  // Return YYYYMMDD as seed (resets at 00:00)
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const getDailyCards = () => {
  const seed = getDailySeed();
  
  // Shuffle and pick 2 motivation
  const shuffledMotivation = [...MOTIVATION_CARDS].sort((a, b) => {
    const seedA = seed + parseInt(a.id.replace(/\D/g, '') || '0');
    const seedB = seed + parseInt(b.id.replace(/\D/g, '') || '0');
    return seededRandom(seedA) - seededRandom(seedB);
  });
  
  // Shuffle and pick 20 affirmation
  const shuffledAffirmation = [...AFFIRMATION_CARDS].sort((a, b) => {
    const seedA = seed + parseInt(a.id.replace(/\D/g, '') || '0') + 1000;
    const seedB = seed + parseInt(b.id.replace(/\D/g, '') || '0') + 1000;
    return seededRandom(seedA) - seededRandom(seedB);
  });
  
  return {
    motivation: shuffledMotivation.slice(0, 20),
    affirmation: shuffledAffirmation.slice(0, 20)
  };
};
