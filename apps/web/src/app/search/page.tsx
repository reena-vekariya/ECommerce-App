'use client';

import { Container, Typography } from '@mui/material';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/services/product.service';
import { IProduct } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SnackbarProvider } from '@/components/product/SnackbarContext';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!q) { setLoading(false); return; }
    setLoading(true);
    productService.getProducts({ search: q, limit: 24 }).then((res) => {
      setProducts(res.data);
      setTotal(res.total);
    }).finally(() => setLoading(false));
  }, [q]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Search results for &ldquo;{q}&rdquo; {total > 0 && `(${total} products)`}
      </Typography>
      {loading ? <LoadingSpinner /> : <ProductGrid products={products} />}
    </Container>
  );
}

export default function SearchPage() {
  return (
    <SnackbarProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <SearchContent />
      </Suspense>
    </SnackbarProvider>
  );
}
