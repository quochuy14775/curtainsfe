"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_ITEMS = 8;

type RecentlyViewedStore = {
  ids: number[];
  add: (id: number) => void;
  clear: () => void;
};

export const useRecentlyViewed = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) =>
        set({
          ids: [id, ...get().ids.filter((i) => i !== id)].slice(0, MAX_ITEMS),
        }),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "maison-recently-viewed",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
