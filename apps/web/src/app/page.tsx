'use client';

import { Box, Typography, Button, Chip, Grid, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { productService, categoryService } from '@/services/product.service';
import { IProduct, ICategory } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { SnackbarProvider } from '@/components/product/SnackbarContext';

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      productService.getProducts({ limit: 8, sort: 'newest' }),
      categoryService.getCategories(),
    ]).then(([p, c]) => {
      setProducts(p.data);
      setCategories(c);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <SnackbarProvider>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #232F3E 0%, #37475A 100%)',
          color: 'white',
          py: { xs: 6, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Welcome to <span style={{ color: '#FF9900' }}>ShopHub</span>
          </Typography>
          <Typography variant="h6" sx={{ color: 'grey.300', mb: 4 }}>
            Millions of products. Fast delivery. Cash on delivery.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/products')}
            sx={{ bgcolor: '#FF9900', color: '#000', px: 4, py: 1.5, fontSize: 18, fontWeight: 'bold' }}
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Categories */}
        {categories.length > 0 && (
          <Box className="mb-8">
            <Typography variant="h5" fontWeight="bold" gutterBottom>Shop by Category</Typography>
            <Box className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Chip
                  key={cat._id}
                  label={cat.name}
                  onClick={() => router.push(`/products?categoryId=${cat._id}`)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#FF9900', color: '#000' } }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Featured Products */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>Featured Products</Typography>
        {loading ? <LoadingSpinner /> : <ProductGrid products={products} />}

        <Box className="text-center mt-8">
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/products')}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </SnackbarProvider>
  );
}
