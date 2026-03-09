'use client';
import { Box, Typography, IconButton } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { ICartItem } from '@/types';

interface Props {
  item: ICartItem;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}

export default function CartItem({ item, onRemove, onUpdateQty }: Props) {
  const product = item.productId;
  const imgSrc = product.images?.[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]
      : `http://localhost:4000${product.images[0]}`
    : '/placeholder.png';

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <Box
        component="img"
        src={imgSrc}
        alt={product.name}
        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
        sx={{
          width: 90,
          height: 90,
          objectFit: 'contain',
          borderRadius: 1,
          bgcolor: 'grey.100',
          flexShrink: 0,
          p: 0.5,
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontWeight: 500,
          }}
        >
          {product.name}
        </Typography>
        {product.brand && (
          <Typography variant="caption" color="text.secondary">
            by {product.brand}
          </Typography>
        )}
        <Typography variant="body1" color="primary" fontWeight="bold" sx={{ mt: 0.5 }}>
          ${item.price.toFixed(2)}
        </Typography>

        {/* Quantity controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <IconButton
            size="small"
            onClick={() => (item.qty > 1 ? onUpdateQty(item.qty - 1) : onRemove())}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 0.5 }}
          >
            <Remove sx={{ fontSize: 16 }} />
          </IconButton>

          <Box
            sx={{
              minWidth: 36,
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              py: 0.25,
              px: 1,
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {item.qty}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={() => onUpdateQty(item.qty + 1)}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 0.5 }}
          >
            <Add sx={{ fontSize: 16 }} />
          </IconButton>

          <IconButton size="small" onClick={onRemove} color="error" sx={{ ml: 1 }}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
