'use client';

import { Container, Typography, Paper, Avatar, Box, Button, Divider } from '@mui/material';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, logout, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token]);

  if (!user) return null;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>My Profile</Typography>

      <Paper sx={{ p: 4 }}>
        <Box className="flex flex-col items-center gap-3 mb-4">
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#FF9900', color: '#000', fontSize: 32 }}>
            {user.fullName[0].toUpperCase()}
          </Avatar>
          <Box className="text-center">
            <Typography variant="h6">{user.fullName}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            {user.role === 'admin' && (
              <Typography variant="caption" sx={{ bgcolor: '#FF9900', color: '#000', px: 1.5, py: 0.5, borderRadius: 2 }}>
                Admin
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box className="flex flex-col gap-2">
          <Button variant="outlined" fullWidth onClick={() => router.push('/orders')}>
            My Orders
          </Button>
          <Button variant="outlined" fullWidth onClick={() => router.push('/wishlist')}>
            My Wishlist
          </Button>
          {user.role === 'admin' && (
            <Button variant="contained" fullWidth onClick={() => router.push('/admin')} sx={{ bgcolor: '#232F3E' }}>
              Admin Dashboard
            </Button>
          )}
          <Button variant="outlined" color="error" fullWidth onClick={() => { logout(); router.push('/'); }}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
