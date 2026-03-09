'use client';

import {
  Container, Typography, Paper, Box, Chip, Tabs, Tab,
  Table, TableBody, TableCell, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { Cancel, ShoppingBag } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { orderService } from '@/services/order.service';
import { IOrder } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
};

const UPCOMING = ['pending', 'processing', 'shipped'];
const DONE = ['delivered', 'cancelled'];
const CANCELLABLE = ['pending', 'processing'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [cancelTarget, setCancelTarget] = useState<IOrder | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    orderService.getOrders().then((res) => {
      setOrders(Array.isArray(res) ? res : res.data ?? []);
    }).finally(() => setLoading(false));
  }, [token]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(cancelTarget._id);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  };

  const upcoming = orders.filter((o) => UPCOMING.includes(o.status));
  const done = orders.filter((o) => DONE.includes(o.status));
  const visible = tab === 0 ? upcoming : done;

  if (!token) return null;
  if (loading) return <LoadingSpinner />;

  const EmptyState = ({ message }: { message: string }) => (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <ShoppingBag sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );

  const OrderTable = ({ rows }: { rows: IOrder[] }) => (
    rows.length === 0 ? (
      <EmptyState
        message={tab === 0 ? 'No upcoming orders.' : 'No completed or cancelled orders.'}
      />
    ) : (
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell><strong>Order ID</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Items</strong></TableCell>
            <TableCell><strong>Total</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((order) => (
            <TableRow key={order._id} hover>
              {/* clicking any cell except Action navigates to detail */}
              {(['orderId', 'date', 'items', 'total', 'status'] as const).map((col) => (
                <TableCell
                  key={col}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/orders/${order._id}`)}
                >
                  {col === 'orderId' && (
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </Typography>
                  )}
                  {col === 'date' && new Date(order.createdAt).toLocaleDateString()}
                  {col === 'items' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {order.items.slice(0, 3).map((item, i) => (
                        <img
                          key={i}
                          src={
                            item.image
                              ? item.image.startsWith('http') ? item.image : `http://localhost:4000${item.image}`
                              : '/placeholder.png'
                          }
                          alt={item.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                          style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4, backgroundColor: '#f5f5f5' }}
                        />
                      ))}
                      <Typography variant="caption" color="text.secondary">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  )}
                  {col === 'total' && <strong>${order.totalAmount.toFixed(2)}</strong>}
                  {col === 'status' && (
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={STATUS_COLORS[order.status] ?? 'default'}
                      size="small"
                    />
                  )}
                </TableCell>
              ))}
              <TableCell>
                {CANCELLABLE.includes(order.status) && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel fontSize="small" />}
                    onClick={(e) => { e.stopPropagation(); setCancelTarget(order); }}
                  >
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>My Orders</Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 6 }}>
          <EmptyState message="You haven't placed any orders yet." />
        </Paper>
      ) : (
        <Paper>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: 2,
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
              '& .Mui-selected': { color: '#FF9900' },
              '& .MuiTabs-indicator': { bgcolor: '#FF9900' },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Upcoming
                  {upcoming.length > 0 && (
                    <Chip label={upcoming.length} size="small" color="warning" sx={{ height: 20, fontSize: 11 }} />
                  )}
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Completed / Cancelled
                  {done.length > 0 && (
                    <Chip label={done.length} size="small" sx={{ height: 20, fontSize: 11 }} />
                  )}
                </Box>
              }
            />
          </Tabs>

          <OrderTable rows={visible} />
        </Paper>
      )}

      {/* Confirm cancel dialog */}
      <Dialog open={!!cancelTarget} onClose={() => setCancelTarget(null)}>
        <DialogTitle>Cancel Order?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel order{' '}
            <strong>#{cancelTarget?._id.slice(-8).toUpperCase()}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelTarget(null)}>Keep Order</Button>
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
