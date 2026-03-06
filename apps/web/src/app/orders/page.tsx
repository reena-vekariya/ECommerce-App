'use client';

import {
  Container, Typography, Paper, Box, Chip, Divider,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { orderService } from '@/services/order.service';
import { IOrder } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_COLORS: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    orderService.getOrders().then((res) => {
      setOrders(Array.isArray(res) ? res : res.data ?? []);
    }).finally(() => setLoading(false));
  }, [token]);

  if (!token) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>My Orders</Typography>

      {!orders.length ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">No orders yet.</Typography>
        </Paper>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/orders/${order._id}`)}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell><strong>${order.totalAmount.toFixed(2)}</strong></TableCell>
                  <TableCell>
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={STATUS_COLORS[order.status] ?? 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
