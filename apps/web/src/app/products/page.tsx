'use client';

import { Box, Container, Typography, Pagination, Grid } from '@mui/material';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { productService, categoryService } from '@/services/product.service';
import { IProduct, ICategory } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SnackbarProvider } from '@/components/product/SnackbarContext';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    categoryId: searchParams.get('categoryId') ?? undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    minRating: undefined as number | undefined,
    inStock: false,
    sort: 'newest',
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({ ...filters, page, limit: 12 });
      setProducts(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        All Products {total > 0 && `(${total})`}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} md={2.5}>
          <ProductFilters
            categories={categories}
            filters={filters}
            onChange={(f) => { setFilters({ ...filters, ...f }); setPage(1); }}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={9.5}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <ProductGrid products={products} />
              {totalPages > 1 && (
                <Box className="flex justify-center mt-6">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <SnackbarProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductsContent />
      </Suspense>
    </SnackbarProvider>
  );
}
