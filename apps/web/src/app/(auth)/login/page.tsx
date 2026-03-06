'use client';
import { Box, Paper, Typography, TextField, Button, Alert, Link as MuiLink } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const result = await login(data.email, data.password);
      if (result.user.role === 'admin') router.push('/admin');
      else router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen p-4" sx={{ bgcolor: 'background.default' }}>
      <Paper sx={{ p: 4, maxWidth: 420, width: '100%' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          Sign In to <span style={{ color: '#FF9900' }}>ShopHub</span>
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-3">
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ bgcolor: '#FF9900', color: '#000', py: 1.2, mt: 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don&apos;t have an account?{' '}
          <MuiLink component={Link} href="/register" underline="hover" color="info.main">
            Create account
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
