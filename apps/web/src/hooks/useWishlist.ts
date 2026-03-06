import { useState } from 'react';
import { wishlistService } from '@/services/wishlist.service';

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const fetchWishlist = async () => {
    const data = await wishlistService.getWishlist();
    setWishlistIds(data.productIds?.map((p: any) => p._id || p) ?? []);
  };

  const toggle = async (productId: string) => {
    if (wishlistIds.includes(productId)) {
      await wishlistService.removeProduct(productId);
      setWishlistIds((ids) => ids.filter((id) => id !== productId));
    } else {
      await wishlistService.addProduct(productId);
      setWishlistIds((ids) => [...ids, productId]);
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  return { wishlistIds, fetchWishlist, toggle, isWishlisted };
}
