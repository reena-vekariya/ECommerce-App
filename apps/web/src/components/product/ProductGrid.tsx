'use client';
import { Grid, Typography, Box } from '@mui/material';
import { useEffect } from 'react';
import { IProduct } from '@/types';
import ProductCard from './ProductCard';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

interface Props {
  products: IProduct[];
}

export default function ProductGrid({ products }: Props) {
  const { cart, addItem, updateItem, removeItem } = useCart();
  const { fetchWishlist, toggle, isWishlisted } = useWishlist();
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token) fetchWishlist();
  }, [token]);

  // Find the cart item for a given product ID
  const getCartItem = (productId: string) =>
    cart?.items.find((item) => {
      const id = typeof item.productId === 'object' ? item.productId._id : item.productId;
      return id === productId;
    });

  const handleAddToCart = async (productId: string) => {
    if (!token) { router.push('/login'); return; }
    await addItem(productId);
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!token) { router.push('/login'); return; }
    await toggle(productId);
  };

  if (!products.length) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="text.secondary">No products found.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => {
        const cartItem = getCartItem(product._id);
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isWishlisted(product._id)}
              cartQty={cartItem?.qty ?? 0}
              onUpdateQty={(qty) => updateItem(cartItem!._id, qty)}
              onRemoveFromCart={() => removeItem(cartItem!._id)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
