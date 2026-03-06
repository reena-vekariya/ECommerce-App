import { create } from 'zustand';
import { ICart, ICartItem } from '@/types';

// Cart is always fetched fresh from the API after login/reload (via Navbar useEffect).
// No localStorage persistence needed — the backend is the source of truth.
interface CartState {
  cart: ICart | null;
  itemCount: number;
  setCart: (cart: ICart | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  cart: null,
  itemCount: 0,
  setCart: (cart) =>
    set({
      cart,
      itemCount: cart?.items.reduce((sum: number, i: ICartItem) => sum + i.qty, 0) ?? 0,
    }),
  clearCart: () => set({ cart: null, itemCount: 0 }),
}));
