"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type WishlistStore = {
  ids: number[];
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  clear: () => void;
};

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      isOpen: false,
      openPanel: () => set({ isOpen: true }),
      closePanel: () => set({ isOpen: false }),
      toggle: (id) =>
        set({
          ids: get().ids.includes(id)
            ? get().ids.filter((i) => i !== id)
            : [...get().ids, id],
        }),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "maison-wishlist",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ ids: s.ids }) as WishlistStore,
    }
  )
);
