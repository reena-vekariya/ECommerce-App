import { useCartStore } from '@/store/cart.store';
import { cartService } from '@/services/cart.service';
import { useAuthStore } from '@/store/auth.store';

export function useCart() {
  const { cart, itemCount, setCart } = useCartStore();
  const { token } = useAuthStore();

  const fetchCart = async () => {
    if (!token) return;
    const data = await cartService.getCart();
    setCart(data);
  };

  const addItem = async (productId: string, qty: number = 1) => {
    const data = await cartService.addItem(productId, qty);
    setCart(data);
  };

  const updateItem = async (itemId: string, qty: number) => {
    const data = await cartService.updateItem(itemId, qty);
    setCart(data);
  };

  const removeItem = async (itemId: string) => {
    const data = await cartService.removeItem(itemId);
    setCart(data);
  };

  const totalPrice = cart?.items.reduce((sum, item) => sum + item.price * item.qty, 0) ?? 0;

  return { cart, itemCount, totalPrice, fetchCart, addItem, updateItem, removeItem };
}
