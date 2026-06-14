import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Achievement {
  id: string;
  unlockedAt: string;
}

interface GamificationState {
  xp: number;
  level: number;
  streak: {
    current: number;
    lastActionDate: string | null;
  };
  badges: string[];
  achievements: Achievement[];
  addXP: (amount: number) => void;
  updateStreak: () => void;
  unlockBadge: (badgeId: string) => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      xp: 0,
      level: 1,
      streak: {
        current: 0,
        lastActionDate: null,
      },
      badges: [],
      achievements: [],
      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          return { xp: newXP, level: newLevel };
        }),
      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split("T")[0];
          const lastDate = state.streak.lastActionDate;
          
          if (lastDate === today) return state;

          let newStreak = 1;
          if (lastDate) {
            const last = new Date(lastDate);
            const diff = (new Date(today).getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
            if (diff === 1) newStreak = state.streak.current + 1;
          }

          return {
            streak: {
              current: newStreak,
              lastActionDate: today,
            },
          };
        }),
      unlockBadge: (badgeId) =>
        set((state) => {
          if (state.badges.includes(badgeId)) return state;
          return {
            badges: [...state.badges, badgeId],
            achievements: [
              ...state.achievements,
              { id: badgeId, unlockedAt: new Date().toISOString() },
            ],
          };
        }),
    }),
    {
      name: "gamification-storage",
    }
  )
);
