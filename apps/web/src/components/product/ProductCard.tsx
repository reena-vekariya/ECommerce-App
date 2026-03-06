'use client';
import {
  Card, CardContent, CardActions, Typography, IconButton, Button, Box, Chip,
} from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import { IProduct } from '@/types';
import StarRating from '@/components/ui/StarRating';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Props {
  product: IProduct;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }: Props) {
  const router = useRouter();
  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const imgSrc = product.images?.[0]
    ? product.images[0].startsWith('http') ? product.images[0] : `http://localhost:4000${product.images[0]}`
    : '/placeholder.png';

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow" sx={{ position: 'relative' }}>
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

      <CardContent className="flex-1 p-3">
        <Typography
          variant="body2"
          className="line-clamp-2 cursor-pointer"
          fontWeight={500}
          onClick={() => router.push(`/products/${product._id}`)}
        >
          {product.name}
        </Typography>
        <StarRating value={product.ratings.avg} count={product.ratings.count} />
        <Box className="flex items-center gap-2 mt-1">
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            ${effectivePrice.toFixed(2)}
          </Typography>
          {hasDiscount && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              ${product.price.toFixed(2)}
            </Typography>
          )}
        </Box>
        {product.brand && (
          <Typography variant="caption" color="text.secondary">by {product.brand}</Typography>
        )}
      </CardContent>

      <CardActions className="p-3 pt-0 flex justify-between">
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
        <IconButton size="small" onClick={() => onToggleWishlist?.(product._id)}>
          {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </CardActions>
    </Card>
  );
}
