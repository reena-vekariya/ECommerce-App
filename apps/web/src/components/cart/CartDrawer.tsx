'use client';
import {
  Drawer, Box, Typography, IconButton, Button, Divider,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useCart } from '@/hooks/useCart';
import CartItem from './CartItem';
import { useRouter } from 'next/navigation';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, totalPrice, removeItem, updateItem } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 380 } }}>
      <Box className="flex flex-col h-full">
        <Box className="flex items-center justify-between p-4">
          <Typography variant="h6" fontWeight="bold">
            Cart ({cart?.items.length ?? 0} items)
          </Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Box>
        <Divider />

        <Box className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {!cart?.items.length ? (
            <Typography color="text.secondary" className="py-8 text-center">
              Your cart is empty
            </Typography>
          ) : (
            cart.items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onRemove={() => removeItem(item._id)}
                onUpdateQty={(qty) => updateItem(item._id, qty)}
              />
            ))
          )}
        </Box>

        {!!cart?.items.length && (
          <>
            <Divider />
            <Box className="p-4 flex flex-col gap-3">
              <Box className="flex justify-between">
                <Typography fontWeight="bold">Total</Typography>
                <Typography fontWeight="bold" color="primary">${totalPrice.toFixed(2)}</Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#FF9900', color: '#000' }}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
