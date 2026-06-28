import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  cartId: string;
  variantId: number;
  sku: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  slug: string;
  imageUrl?: string;
  bundleContents?: { id: number; name: string; brand: string }[];
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  totalItems: () => number;
  totalPrice: () => number;
  addItem: (item: Omit<CartItem, 'quantity' | 'cartId'> & { quantity?: number }) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, qty: number) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      addItem: (item) =>
        set((state) => {
          // Find if an identical item exists (same variant AND same bundle contents)
          const existingIndex = state.items.findIndex((i) => {
            const sameVariant = i.variantId === item.variantId;
            if (!item.bundleContents) return sameVariant && !i.bundleContents;
            
            if (!i.bundleContents || i.bundleContents.length !== item.bundleContents.length) return false;
            
            return i.bundleContents.every((p, idx) => p.id === item.bundleContents![idx].id);
          });

          const qtyToAdd = item.quantity || 1;

          if (existingIndex > -1) {
            const nextItems = [...state.items];
            nextItems[existingIndex] = {
              ...nextItems[existingIndex],
              quantity: nextItems[existingIndex].quantity + qtyToAdd
            };
            return { items: nextItems, isOpen: true };
          }

          // New unique item
          const cartId = `${item.variantId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          return {
            items: [...state.items, { ...item, quantity: qtyToAdd, cartId }],
            isOpen: true,
          };
        }),

      removeItem: (cartId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartId !== cartId),
        })),

      updateQuantity: (cartId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.cartId !== cartId)
              : state.items.map((i) =>
                  i.cartId === cartId ? { ...i, quantity: qty } : i,
                ),
        })),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearCart: () => set({ items: [], isOpen: false }),
    }),
    { name: 'athar-cart' },
  ),
);

export default useCartStore;
