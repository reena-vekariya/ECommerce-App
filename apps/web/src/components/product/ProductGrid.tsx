'use client';
import { Grid, Typography, Box } from '@mui/material';
import { IProduct } from '@/types';
import ProductCard from './ProductCard';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useSnackbar } from './SnackbarContext';

interface Props {
  products: IProduct[];
}

export default function ProductGrid({ products }: Props) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { token } = useAuthStore();
  const router = useRouter();

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
      <Box className="py-16 text-center">
        <Typography color="text.secondary">No products found.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
          <ProductCard
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted(product._id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
