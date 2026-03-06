'use client';

import { Container, Typography, Paper, Box, Chip, Grid, Divider, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { orderService } from '@/services/order.service';
import { IOrder } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'error',
};

interface Props { params: { id: string } }

export default function OrderDetailPage({ params }: Props) {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    orderService.getOrder(params.id).then(setOrder).finally(() => setLoading(false));
  }, [params.id, token]);

  if (!token) return null;
  if (loading) return <LoadingSpinner />;
  if (!order) return <Alert severity="error">Order not found</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ mb: 2 }}>Back</Button>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Order #{order._id.slice(-8).toUpperCase()}
      </Typography>

      <Box className="flex items-center gap-2 mb-4">
        <Chip
          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          color={STATUS_COLORS[order.status] ?? 'default'}
        />
        <Typography variant="body2" color="text.secondary">
          Placed on {new Date(order.createdAt).toLocaleString()}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Items</Typography>
            {order.items.map((item, i) => (
              <Box key={i} className="flex gap-3 py-2">
                {item.image && (
                  <img
                    src={item.image.startsWith('http') ? item.image : `http://localhost:4000${item.image}`}
                    alt={item.name}
                    style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 4 }}
                  />
                )}
                <Box className="flex-1">
                  <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price.toFixed(2)} × {item.qty}
                  </Typography>
                </Box>
                <Typography fontWeight="bold">${(item.price * item.qty).toFixed(2)}</Typography>
              </Box>
            ))}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Shipping Address</Typography>
            <Typography variant="body2">{order.shippingAddress.street}</Typography>
            <Typography variant="body2">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </Typography>
            <Typography variant="body2">{order.shippingAddress.country}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Order Summary</Typography>
            <Box className="flex flex-col gap-2">
              <Box className="flex justify-between">
                <Typography>Subtotal</Typography>
                <Typography>${(order.totalAmount + order.discount).toFixed(2)}</Typography>
              </Box>
              {order.discount > 0 && (
                <Box className="flex justify-between">
                  <Typography color="success.main">Discount {order.couponCode && `(${order.couponCode})`}</Typography>
                  <Typography color="success.main">-${order.discount.toFixed(2)}</Typography>
                </Box>
              )}
              <Box className="flex justify-between">
                <Typography>Shipping</Typography>
                <Typography color="success.main">FREE</Typography>
              </Box>
              <Divider />
              <Box className="flex justify-between">
                <Typography fontWeight="bold">Total</Typography>
                <Typography fontWeight="bold" color="primary">${order.totalAmount.toFixed(2)}</Typography>
              </Box>
              <Box className="flex justify-between mt-2">
                <Typography color="text.secondary">Payment</Typography>
                <Typography>Cash on Delivery</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
