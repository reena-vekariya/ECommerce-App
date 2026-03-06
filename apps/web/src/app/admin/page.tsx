'use client';

import { Grid, Paper, Typography, Box, Divider, Chip } from '@mui/material';
import {
  ShoppingBag, People, Inventory, AttachMoney,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { adminService } from '@/services/wishlist.service';
import { AdminStats } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
  <Paper sx={{ p: 3 }}>
    <Box className="flex items-center justify-between">
      <Box>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h5" fontWeight="bold">{value}</Typography>
      </Box>
      <Box sx={{ bgcolor: color, borderRadius: 2, p: 1.5, color: 'white' }}>
        {icon}
      </Box>
    </Box>
  </Paper>
);

const STATUS_COLORS: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'error',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats & { totalUsers: number; totalProducts: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return null;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Dashboard</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag />} color="#FF9900" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue?.toFixed(2) ?? '0.00'}`} icon={<AttachMoney />} color="#007600" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={stats.totalUsers} icon={<People />} color="#007185" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Products" value={stats.totalProducts} icon={<Inventory />} color="#232F3E" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Orders</Typography>
            <Box className="flex flex-col gap-2">
              {stats.recentOrders?.map((order: any) => (
                <Box key={order._id} className="flex items-center justify-between py-2">
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.userId?.email ?? 'N/A'} • {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <Typography fontWeight="bold">${order.totalAmount.toFixed(2)}</Typography>
                    <Chip
                      label={order.status}
                      color={STATUS_COLORS[order.status] ?? 'default'}
                      size="small"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Orders by Status</Typography>
            <Box className="flex flex-col gap-2">
              {Object.entries(stats.ordersByStatus ?? {}).map(([status, count]) => (
                <Box key={status} className="flex justify-between items-center">
                  <Chip label={status} color={STATUS_COLORS[status] ?? 'default'} size="small" />
                  <Typography fontWeight="bold">{String(count)}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Revenue (Last 7 Days)</Typography>
            {stats.revenueByDay?.map((day: any) => (
              <Box key={day.date} className="flex justify-between py-1">
                <Typography variant="body2">{day.date}</Typography>
                <Typography variant="body2" fontWeight="bold">${day.revenue.toFixed(2)}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
