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
import { SnackbarProvider } from '@/components/product/SnackbarContext';

export default function WishlistPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const router = useRouter();
  const { addItem } = useCart();

  const fetchWishlist = async () => {
    const data = await wishlistService.getWishlist();
    setProducts(data.productIds ?? []);
  };

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetchWishlist().finally(() => setLoading(false));
  }, [token]);

  const handleRemove = async (productId: string) => {
    await wishlistService.removeProduct(productId);
    setProducts((p) => p.filter((item) => item._id !== productId));
  };

  if (!token) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <SnackbarProvider>
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
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard
                  product={product}
                  isWishlisted
                  onAddToCart={(id) => addItem(id)}
                  onToggleWishlist={handleRemove}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </SnackbarProvider>
  );
}
