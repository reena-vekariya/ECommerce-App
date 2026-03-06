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
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email(),
  password: z.string().min(6, 'Minimum 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
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
      await registerAuth(data.email, data.password, data.fullName);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen p-4" sx={{ bgcolor: 'background.default' }}>
      <Paper sx={{ p: 4, maxWidth: 420, width: '100%' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          Create Your <span style={{ color: '#FF9900' }}>ShopHub</span> Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-3">
          <TextField
            label="Full Name"
            fullWidth
            {...register('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
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
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <MuiLink component={Link} href="/login" underline="hover" color="info.main">
            Sign in
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
