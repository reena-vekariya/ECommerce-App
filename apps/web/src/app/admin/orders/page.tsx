'use client';

import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Select, MenuItem, FormControl, Pagination,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { orderService } from '@/services/order.service';
import { IOrder } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'error',
};
const ALL_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();

  const fetch = async () => {
    setLoading(true);
    const res = await orderService.getOrders({ all: true, page, limit: 20, status: statusFilter || undefined });
    setOrders(res.data ?? []);
    setTotalPages(res.totalPages ?? 1);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [page, statusFilter]);

  const handleStatusChange = async (orderId: string, status: string) => {
    await orderService.updateStatus(orderId, status);
    fetch();
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" fontWeight="bold">Orders</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} displayEmpty>
            <MenuItem value="">All Status</MenuItem>
            {ALL_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {loading ? <LoadingSpinner /> : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Update Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const user = order.userId as any;
                return (
                  <TableRow key={order._id} hover sx={{ cursor: 'pointer' }}>
                    <TableCell onClick={() => router.push(`/orders/${order._id}`)}>
                      #{order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>{user?.email ?? user ?? 'N/A'}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell><strong>${order.totalAmount.toFixed(2)}</strong></TableCell>
                    <TableCell>
                      <Chip label={order.status} color={STATUS_COLORS[order.status] ?? 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        sx={{ fontSize: 12 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {ALL_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <Box className="flex justify-center p-3">
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
