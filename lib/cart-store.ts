"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductWithCategory } from "./data";

export type CartItem = {
  product: ProductWithCategory;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: ProductWithCategory) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...get().items, { product, quantity: 1 }], isOpen: true });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return get().removeItem(productId);
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "maison-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = Number(item.product.price.replace(/\./g, ""));
    return sum + price * item.quantity;
  }, 0);
}

export function formatPrice(n: number): string {
  return n.toLocaleString("vi-VN");
}
