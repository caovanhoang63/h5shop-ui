import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user/user.ts";

interface UserStore {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      login: (userData) => set({ user: userData }),

      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    },
  ),
);
