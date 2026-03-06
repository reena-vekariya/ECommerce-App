'use client';
import { Box, Typography, IconButton, Select, MenuItem } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ICartItem } from '@/types';

interface Props {
  item: ICartItem;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}

export default function CartItem({ item, onRemove, onUpdateQty }: Props) {
  const product = item.productId;
  const imgSrc = product.images?.[0]
    ? product.images[0].startsWith('http') ? product.images[0] : `http://localhost:4000${product.images[0]}`
    : '/placeholder.png';

  return (
    <Box className="flex gap-3">
      <img src={imgSrc} alt={product.name} className="w-16 h-16 object-contain rounded bg-gray-100" />
      <Box className="flex-1 min-w-0">
        <Typography variant="body2" className="line-clamp-2">{product.name}</Typography>
        <Typography variant="body2" color="primary" fontWeight="bold">${item.price.toFixed(2)}</Typography>
        <Box className="flex items-center gap-1 mt-1">
          <Select
            size="small"
            value={item.qty}
            onChange={(e) => onUpdateQty(Number(e.target.value))}
            sx={{ fontSize: 12, height: 28 }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <MenuItem key={n} value={n}>{n}</MenuItem>
            ))}
          </Select>
          <IconButton size="small" onClick={onRemove} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
