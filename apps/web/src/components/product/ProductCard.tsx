'use client';
import {
  Card, CardContent, CardActions, Typography, IconButton, Button, Box, Chip,
} from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart, Add, Remove } from '@mui/icons-material';
import { IProduct } from '@/types';
import StarRating from '@/components/ui/StarRating';
import { useRouter } from 'next/navigation';

interface Props {
  product: IProduct;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  cartQty?: number;
  onUpdateQty?: (qty: number) => void;
  onRemoveFromCart?: () => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  cartQty = 0,
  onUpdateQty,
  onRemoveFromCart,
}: Props) {
  const router = useRouter();
  const effectivePrice = product.discountPrice ?? product.price ?? 0;
  const hasDiscount = product.discountPrice && product.price && product.discountPrice < product.price;
  const imgSrc = product.images?.[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]
      : `http://localhost:4000${product.images[0]}`
    : '/placeholder.png';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.2s' }}>
      <Box
        sx={{ position: 'relative', cursor: 'pointer', bgcolor: 'grey.100', height: 200 }}
        onClick={() => router.push(`/products/${product._id}`)}
      >
        <img
          src={imgSrc}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
        />
        {hasDiscount && (
          <Chip
            label={`-${Math.round((1 - effectivePrice / product.price) * 100)}%`}
            color="error"
            size="small"
            sx={{ position: 'absolute', top: 8, left: 8 }}
          />
        )}
        {product.stock === 0 && (
          <Box
            sx={{
              position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Typography color="white" fontWeight="bold">Out of Stock</Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flex: 1, p: 1.5 }}>
        <Typography
          variant="body2"
          fontWeight={500}
          onClick={() => router.push(`/products/${product._id}`)}
          sx={{
            cursor: 'pointer',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>
        <StarRating value={product.ratings?.avg ?? 0} count={product.ratings?.count ?? 0} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            ${effectivePrice.toFixed(2)}
          </Typography>
          {hasDiscount && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              ${(product.price ?? 0).toFixed(2)}
            </Typography>
          )}
        </Box>
        {product.brand && (
          <Typography variant="caption" color="text.secondary">by {product.brand}</Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: 1.5, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
        {cartQty > 0 ? (
          /* Quantity controls — shown when product is already in cart */
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => cartQty > 1 ? onUpdateQty?.(cartQty - 1) : onRemoveFromCart?.()}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 0.5 }}
            >
              <Remove sx={{ fontSize: 16 }} />
            </IconButton>
            <Box
              sx={{
                minWidth: 34,
                textAlign: 'center',
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 1,
                py: 0.25,
                px: 0.75,
              }}
            >
              <Typography variant="body2" fontWeight={700} color="primary">
                {cartQty}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => onUpdateQty?.(cartQty + 1)}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 0.5 }}
            >
              <Add sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ) : (
          /* Add to Cart button — shown when product is NOT in cart */
          <Button
            size="small"
            variant="contained"
            startIcon={<ShoppingCart />}
            disabled={product.stock === 0}
            onClick={() => onAddToCart?.(product._id)}
            sx={{ bgcolor: '#FF9900', color: '#000', '&:hover': { bgcolor: '#FEBD69' } }}
          >
            Add to Cart
          </Button>
        )}

        <IconButton size="small" onClick={() => onToggleWishlist?.(product._id)}>
          {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </CardActions>
    </Card>
  );
}
