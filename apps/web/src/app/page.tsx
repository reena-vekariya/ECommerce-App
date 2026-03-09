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
      <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: { xs: 320, md: 480 }, display: 'flex', alignItems: 'center' }}>
        {/* Background image */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=900&fit=crop&auto=format)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'scale(1.03)',
            transition: 'transform 8s ease-out',
          }}
        />
        {/* Gradient overlay for readability */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(15,17,17,0.78) 0%, rgba(35,47,62,0.68) 60%, rgba(35,47,62,0.45) 100%)',
          }}
        />
        {/* Content */}
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 14 }, textAlign: 'center' }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ color: 'white', fontSize: { xs: '2rem', md: '3rem' }, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
          >
            Welcome to{' '}
            <Box component="span" sx={{ color: '#FF9900' }}>ShopHub</Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'grey.300', mb: 4, textShadow: '0 1px 6px rgba(0,0,0,0.6)', fontWeight: 400 }}
          >
            Millions of products. Fast delivery. Cash on delivery.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/products')}
              sx={{ bgcolor: '#FF9900', color: '#000', px: 4, py: 1.5, fontSize: 17, fontWeight: 'bold', '&:hover': { bgcolor: '#FEBD69' } }}
            >
              Shop Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/search?q=')}
              sx={{ borderColor: 'white', color: 'white', px: 4, py: 1.5, fontSize: 17, '&:hover': { borderColor: '#FF9900', color: '#FF9900' } }}
            >
              Browse Deals
            </Button>
          </Box>
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
