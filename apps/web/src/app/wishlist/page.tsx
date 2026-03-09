'use client';

import { Container, Typography, Grid, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { wishlistService } from '@/services/wishlist.service';
import { IProduct } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

export default function WishlistPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const router = useRouter();
  const { cart, addItem, updateItem, removeItem } = useCart();

  const fetchWishlist = async () => {
    const data = await wishlistService.getWishlist();
    setProducts((data.productIds ?? []).filter(Boolean));
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetchWishlist().finally(() => setLoading(false));
  }, [token]);

  const handleRemoveFromWishlist = async (productId: string) => {
    await wishlistService.removeProduct(productId);
    setProducts((p) => p.filter((item) => item._id !== productId));
  };

  // Find cart item for a product
  const getCartItem = (productId: string) =>
    cart?.items.find((item) => {
      const id = typeof item.productId === 'object' ? item.productId._id : item.productId;
      return id === productId;
    });

  if (!token) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Wishlist ({products.length})
      </Typography>

      {!products.length ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">Your wishlist is empty.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => {
            const cartItem = getCartItem(product._id);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard
                  product={product}
                  isWishlisted
                  onAddToCart={(id) => addItem(id)}
                  onToggleWishlist={handleRemoveFromWishlist}
                  cartQty={cartItem?.qty ?? 0}
                  onUpdateQty={(qty) => updateItem(cartItem!._id, qty)}
                  onRemoveFromCart={() => removeItem(cartItem!._id)}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
