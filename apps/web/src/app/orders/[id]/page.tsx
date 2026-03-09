'use client';

import {
  Container, Typography, Paper, Box, Chip, Grid, Divider, Alert,
  Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { orderService } from '@/services/order.service';
import { IOrder } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { ArrowBack, Cancel } from '@mui/icons-material';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'error',
};

interface Props { params: { id: string } }

const CANCELLABLE = ['pending', 'processing'];

export default function OrderDetailPage({ params }: Props) {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    orderService.getOrder(params.id).then(setOrder).finally(() => setLoading(false));
  }, [params.id, token]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(order._id);
      setOrder(updated);
    } finally {
      setCancelling(false);
      setCancelOpen(false);
    }
  };

  if (!token) return null;
  if (loading) return <LoadingSpinner />;
  if (!order) return <Alert severity="error">Order not found</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Button startIcon={<ArrowBack />} onClick={() => router.back()}>Back</Button>
        {CANCELLABLE.includes(order.status) && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={() => setCancelOpen(true)}
          >
            Cancel Order
          </Button>
        )}
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Order #{order._id.slice(-8).toUpperCase()}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
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
              <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 1.5 }}>
                <img
                  src={
                    item.image
                      ? item.image.startsWith('http')
                        ? item.image
                        : `http://localhost:4000${item.image}`
                      : '/placeholder.png'
                  }
                  alt={item.name}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                  style={{
                    width: 72,
                    height: 72,
                    objectFit: 'contain',
                    borderRadius: 4,
                    backgroundColor: '#f5f5f5',
                    flexShrink: 0,
                    padding: 4,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${(item.price ?? 0).toFixed(2)} × {item.qty}
                  </Typography>
                </Box>
                <Typography fontWeight="bold">
                  ${((item.price ?? 0) * item.qty).toFixed(2)}
                </Typography>
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

      {/* Cancel confirmation dialog */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <DialogTitle>Cancel Order?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel order{' '}
            <strong>#{order._id.slice(-8).toUpperCase()}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelOpen(false)}>Keep Order</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
