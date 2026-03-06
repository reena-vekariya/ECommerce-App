'use client';

import { Box, Container, Typography, Button, Paper, Divider } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/cart/CartItem';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export default function CartPage() {
  const { cart, totalPrice, fetchCart, removeItem, updateItem } = useCart();
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => { fetchCart(); }, [token]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Shopping Cart</Typography>

      {!cart?.items.length ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>Your cart is empty</Typography>
          <Button variant="contained" onClick={() => router.push('/products')} sx={{ bgcolor: '#FF9900', color: '#000' }}>
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <Box className="flex flex-col lg:flex-row gap-4">
          <Paper sx={{ flex: 1, p: 3 }}>
            <Box className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <Box key={item._id}>
                  <CartItem
                    item={item}
                    onRemove={() => removeItem(item._id)}
                    onUpdateQty={(qty) => updateItem(item._id, qty)}
                  />
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ width: { xs: '100%', lg: 300 }, p: 3, alignSelf: 'flex-start' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Order Summary</Typography>
            <Box className="flex justify-between mb-2">
              <Typography>Items ({cart.items.length})</Typography>
              <Typography>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Box className="flex justify-between mb-3">
              <Typography>Shipping</Typography>
              <Typography color="success.main">FREE</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box className="flex justify-between mb-3">
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold" color="primary">${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push('/checkout')}
              sx={{ bgcolor: '#FF9900', color: '#000' }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Box>
      )}
    </Container>
  );
}
