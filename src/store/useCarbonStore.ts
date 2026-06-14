import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CarbonBreakdown {
  transportation: number;
  energy: number;
  diet: number;
  shopping: number;
}

interface CarbonHistory {
  date: string;
  score: number;
}

interface CarbonState {
  totalScore: number;
  breakdown: CarbonBreakdown;
  history: CarbonHistory[];
  lastUpdated: string | null;
  setCarbonData: (data: Partial<CarbonState>) => void;
  addHistoryEntry: (entry: CarbonHistory) => void;
}

export const useCarbonStore = create<CarbonState>()(
  persist(
    (set) => ({
      totalScore: 0,
      breakdown: {
        transportation: 0,
        energy: 0,
        diet: 0,
        shopping: 0,
      },
      history: [],
      lastUpdated: null,
      setCarbonData: (data) => set((state) => ({ ...state, ...data, lastUpdated: new Date().toISOString() })),
      addHistoryEntry: (entry) => set((state) => ({
        history: [...state.history, entry].slice(-30), // Keep last 30 entries
      })),
    }),
    {
      name: "carbon-storage",
    }
  )
);
