// stores/useStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface StoreState {
  // State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        isLoading: false,
        setLoading: (loading) => set({ isLoading: loading }),
      }),
      {
        name: "h5store", // tên của storage key
      },
    ),
  ),
);
