"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "mebel-cart" },
  ),
);
