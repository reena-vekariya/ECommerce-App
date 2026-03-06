'use client';

import { Container, Typography, Alert } from '@mui/material';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CheckoutPage() {
  const { token } = useAuthStore();
  const { cart, fetchCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetchCart();
  }, [token]);

  if (!token) return null;
  if (!cart) return <LoadingSpinner />;
  if (!cart.items.length) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Your cart is empty. <a href="/products">Continue shopping</a></Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Checkout</Typography>
      <CheckoutForm />
    </Container>
  );
}
