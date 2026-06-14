import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  name: string;
  onboarded: boolean;
}

interface UserState {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
  resetOnboarding: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: {
        name: "",
        onboarded: false,
      },
      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
      resetOnboarding: () =>
        set({
          profile: { name: "", onboarded: false },
        }),
    }),
    {
      name: "user-storage",
    }
  )
);
