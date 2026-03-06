'use client';

import { Box, Typography } from '@mui/material';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    if (user && user.role !== 'admin') { router.push('/'); }
  }, [token, user]);

  if (!user || user.role !== 'admin') return null;

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </Box>
    </Box>
  );
}
