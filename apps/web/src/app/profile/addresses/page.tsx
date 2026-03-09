'use client';

import {
  Container, Typography, Paper, Box, Button, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, Divider,
} from '@mui/material';
import { Add, Delete, Home, CheckCircle } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '@/services/user.service';
import { IAddress } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const schema = z.object({
  label: z.string().min(1, 'Required'),
  street: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zip: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

interface AddressWithId extends IAddress {
  _id: string;
}

export default function AddressesPage() {
  const { token, user, setAuth } = useAuthStore();
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { label: 'Home', country: 'India' },
  });

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    userService.getMe().then((u) => {
      setAddresses((u.addresses ?? []) as AddressWithId[]);
    }).finally(() => setLoading(false));
  }, [token]);

  const handleAdd = async (data: FormData) => {
    setSaving(true);
    setError('');
    try {
      const updatedUser = await userService.addAddress(data);
      setAddresses((updatedUser.addresses ?? []) as AddressWithId[]);
      // sync auth store with updated user data
      if (user && token) setAuth({ ...user, addresses: updatedUser.addresses }, token);
      setDialogOpen(false);
      reset();
    } catch {
      setError('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    try {
      const updatedUser = await userService.removeAddress(addressId);
      setAddresses((updatedUser.addresses ?? []) as AddressWithId[]);
      if (user && token) setAuth({ ...user, addresses: updatedUser.addresses }, token);
    } catch {
      setError('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const updatedUser = await userService.setDefaultAddress(addressId);
      setAddresses((updatedUser.addresses ?? []) as AddressWithId[]);
      if (user && token) setAuth({ ...user, addresses: updatedUser.addresses }, token);
    } catch {
      setError('Failed to update address');
    }
  };

  if (!token) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">My Addresses</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: '#FF9900', color: '#000', '&:hover': { bgcolor: '#FEBD69' } }}
        >
          Add Address
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!addresses.length ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Home sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary" gutterBottom>No saved addresses yet.</Typography>
          <Button
            variant="outlined"
            onClick={() => setDialogOpen(true)}
            sx={{ mt: 1 }}
          >
            Add your first address
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {addresses.map((addr) => (
            <Paper key={addr._id} sx={{ p: 3, border: addr.isDefault ? '2px solid #FF9900' : '1px solid', borderColor: addr.isDefault ? '#FF9900' : 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography fontWeight="bold">{addr.label}</Typography>
                    {addr.isDefault && (
                      <Chip
                        label="Default"
                        size="small"
                        icon={<CheckCircle sx={{ fontSize: 14 }} />}
                        sx={{ bgcolor: '#FF9900', color: '#000', height: 22 }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2">{addr.street}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {addr.city}, {addr.state} {addr.zip}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">{addr.country}</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {!addr.isDefault && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleSetDefault(addr._id)}
                      sx={{ fontSize: 12 }}
                    >
                      Set Default
                    </Button>
                  )}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(addr._id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Add Address Dialog */}
      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); reset(); }} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Label (e.g. Home, Office)"
              fullWidth
              {...register('label')}
              error={!!errors.label}
              helperText={errors.label?.message}
            />
            <TextField
              label="Street Address"
              fullWidth
              {...register('street')}
              error={!!errors.street}
              helperText={errors.street?.message}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="City"
                fullWidth
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
              <TextField
                label="State"
                fullWidth
                {...register('state')}
                error={!!errors.state}
                helperText={errors.state?.message}
              />
              <TextField
                label="ZIP Code"
                fullWidth
                {...register('zip')}
                error={!!errors.zip}
                helperText={errors.zip?.message}
              />
              <TextField
                label="Country"
                fullWidth
                {...register('country')}
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setDialogOpen(false); reset(); }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit(handleAdd)}
            disabled={saving}
            sx={{ bgcolor: '#FF9900', color: '#000' }}
          >
            {saving ? 'Saving…' : 'Save Address'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
