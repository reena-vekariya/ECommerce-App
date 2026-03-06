'use client';

import { Box, Container, Typography, Button, Chip, Grid, Divider, Paper, Alert } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, ArrowBack } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { productService } from '@/services/product.service';
import { reviewService } from '@/services/review.service';
import { IProduct, IReview } from '@/types';
import StarRating from '@/components/ui/StarRating';
import ReviewList from '@/components/product/ReviewList';
import ReviewForm from '@/components/product/ReviewForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { toggle, isWishlisted, fetchWishlist } = useWishlist();
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      productService.getProduct(params.id),
      reviewService.getReviews(params.id),
    ]).then(([p, r]) => {
      setProduct(p);
      setReviews(r);
      if (token) fetchWishlist();
    }).finally(() => setLoading(false));
  }, [params.id, token]);

  const handleAddToCart = async () => {
    if (!token) { router.push('/login'); return; }
    if (product) await addItem(product._id);
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <Alert severity="error">Product not found</Alert>;

  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ mb: 2 }}>
        Back
      </Button>

      <Grid container spacing={4}>
        {/* Images */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <img
              src={
                product.images?.[selectedImage]
                  ? product.images[selectedImage].startsWith('http')
                    ? product.images[selectedImage]
                    : `http://localhost:4000${product.images[selectedImage]}`
                  : '/placeholder.png'
              }
              alt={product.name}
              style={{ width: '100%', height: 400, objectFit: 'contain' }}
            />
          </Paper>
          {product.images.length > 1 && (
            <Box className="flex gap-2 mt-2 flex-wrap">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.startsWith('http') ? img : `http://localhost:4000${img}`}
                  alt=""
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: 64, height: 64, objectFit: 'contain',
                    border: selectedImage === i ? '2px solid #FF9900' : '2px solid transparent',
                    cursor: 'pointer', borderRadius: 4,
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={7}>
          <Typography variant="h5" fontWeight="bold">{product.name}</Typography>
          {product.brand && (
            <Typography variant="body2" color="text.secondary">by {product.brand}</Typography>
          )}
          <Box className="flex items-center gap-2 my-2">
            <StarRating value={product.ratings.avg} count={product.ratings.count} size="medium" />
          </Box>
          <Divider sx={{ my: 2 }} />

          <Box className="flex items-baseline gap-3 mb-3">
            <Typography variant="h4" fontWeight="bold" color="primary">
              ${effectivePrice.toFixed(2)}
            </Typography>
            {hasDiscount && (
              <>
                <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                  ${product.price.toFixed(2)}
                </Typography>
                <Chip
                  label={`${Math.round((1 - effectivePrice / product.price) * 100)}% OFF`}
                  color="error" size="small"
                />
              </>
            )}
          </Box>

          <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'} fontWeight="bold" sx={{ mb: 2 }}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </Typography>

          <Box className="flex gap-2 mb-4">
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              sx={{ bgcolor: '#FF9900', color: '#000', px: 4, py: 1.2 }}
            >
              Add to Cart
            </Button>
            {token && (
              <Button
                variant="outlined"
                startIcon={isWishlisted(product._id) ? <Favorite color="error" /> : <FavoriteBorder />}
                onClick={() => toggle(product._id)}
              >
                {isWishlisted(product._id) ? 'Wishlisted' : 'Add to Wishlist'}
              </Button>
            )}
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            Payment: Cash on Delivery (COD) — FREE Shipping
          </Alert>

          {product.tags.length > 0 && (
            <Box className="flex flex-wrap gap-1 mb-3">
              {product.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}

          <Typography variant="h6" fontWeight="bold" gutterBottom>Description</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{product.description}</Typography>
        </Grid>
      </Grid>

      {/* Reviews */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Customer Reviews ({reviews.length})
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <ReviewList reviews={reviews} />
        {token && (
          <ReviewForm
            productId={product._id}
            onSuccess={() => reviewService.getReviews(product._id).then(setReviews)}
          />
        )}
      </Box>
    </Container>
  );
}
