'use client';
import {
  Box, TextField, Typography, Button, Alert, Divider, Paper, Chip,
} from '@mui/material';
import { CheckCircle, Add, Home } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { orderService } from '@/services/order.service';
import { couponService } from '@/services/wishlist.service';
import { userService } from '@/services/user.service';
import { useCart } from '@/hooks/useCart';
import { useCartStore } from '@/store/cart.store';
import { useRouter } from 'next/navigation';

interface SavedAddress {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

const schema = z.object({
  label: z.string().default('Home'),
  street: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zip: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutForm() {
  const { totalPrice } = useCart();
  const { clearCart } = useCartStore();
  const router = useRouter();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const [coupon, setCoupon] = useState('');
  const [couponData, setCouponData] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'India', label: 'Home' },
  });

  useEffect(() => {
    userService.getMe().then((u) => {
      const addrs: SavedAddress[] = u.addresses ?? [];
      setSavedAddresses(addrs);
      // auto-select default address
      const def = addrs.find((a) => a.isDefault) ?? addrs[0];
      if (def) {
        selectAddress(def);
      } else {
        setShowNewForm(true);
      }
    }).catch(() => setShowNewForm(true));
  }, []);

  const selectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr._id);
    setShowNewForm(false);
    setValue('label', addr.label);
    setValue('street', addr.street);
    setValue('city', addr.city);
    setValue('state', addr.state);
    setValue('zip', addr.zip);
    setValue('country', addr.country);
  };

  const handleNewAddress = () => {
    setSelectedAddressId(null);
    setShowNewForm(true);
    reset({ label: 'Home', country: 'India', street: '', city: '', state: '', zip: '' });
  };

  const discount = couponData
    ? couponData.discountType === 'percent'
      ? (totalPrice * couponData.discountValue) / 100
      : couponData.discountValue
    : 0;
  const finalTotal = Math.max(0, totalPrice - discount);

  const handleApplyCoupon = async () => {
    setCouponError('');
    try {
      const data = await couponService.validate(coupon, totalPrice);
      setCouponData(data);
    } catch (err: any) {
      setCouponError(err.response?.data?.message ?? 'Invalid coupon');
      setCouponData(null);
    }
  };

  const onSubmit = async (address: FormData) => {
    setLoading(true);
    setError('');
    try {
      const order = await orderService.createOrder({
        shippingAddress: address,
        couponCode: couponData ? coupon : undefined,
      });
      clearCart();
      router.push(`/orders/${order._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Shipping Address */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Shipping Address</Typography>

        {/* Saved address cards */}
        {savedAddresses.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Select a saved address:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddressId === addr._id;
                return (
                  <Box
                    key={addr._id}
                    onClick={() => selectAddress(addr)}
                    sx={{
                      p: 2,
                      border: '2px solid',
                      borderColor: isSelected ? '#FF9900' : 'divider',
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: isSelected ? 'rgba(255,153,0,0.06)' : 'background.paper',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      transition: 'border-color 0.15s, background-color 0.15s',
                      '&:hover': { borderColor: '#FF9900' },
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Home sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight="bold">{addr.label}</Typography>
                        {addr.isDefault && (
                          <Chip label="Default" size="small" sx={{ height: 18, fontSize: 10, bgcolor: '#FF9900', color: '#000' }} />
                        )}
                      </Box>
                      <Typography variant="body2">{addr.street}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {addr.city}, {addr.state} {addr.zip}, {addr.country}
                      </Typography>
                    </Box>
                    {isSelected && (
                      <CheckCircle sx={{ color: '#FF9900', flexShrink: 0, ml: 1 }} />
                    )}
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary">OR</Typography>
            </Divider>
          </Box>
        )}

        {/* Enter new address toggle */}
        {!showNewForm ? (
          <Button
            startIcon={<Add />}
            variant="outlined"
            size="small"
            onClick={handleNewAddress}
            sx={{ mb: 1 }}
          >
            Enter a different address
          </Button>
        ) : (
          <>
            {savedAddresses.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Enter new address:
              </Typography>
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
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
          </>
        )}

        {/* Hidden fields pre-filled from selected address (when not showing new form) */}
        {!showNewForm && selectedAddressId && (
          <Box sx={{ display: 'none' }}>
            <input {...register('label')} />
            <input {...register('street')} />
            <input {...register('city')} />
            <input {...register('state')} />
            <input {...register('zip')} />
            <input {...register('country')} />
          </Box>
        )}
      </Paper>

      {/* Coupon */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Coupon Code</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            sx={{ flex: 1 }}
          />
          <Button variant="outlined" onClick={handleApplyCoupon}>Apply</Button>
        </Box>
        {couponError && <Typography color="error" variant="caption">{couponError}</Typography>}
        {couponData && (
          <Alert severity="success" sx={{ mt: 1 }}>
            Coupon applied! You save ${discount.toFixed(2)}
          </Alert>
        )}
      </Paper>

      {/* Order Summary */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>Order Summary</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Subtotal</Typography>
            <Typography>${totalPrice.toFixed(2)}</Typography>
          </Box>
          {discount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="success.main">Discount</Typography>
              <Typography color="success.main">-${discount.toFixed(2)}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Shipping</Typography>
            <Typography color="success.main">FREE</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold" color="primary">${finalTotal.toFixed(2)}</Typography>
          </Box>
          <Alert severity="info" sx={{ mt: 0.5 }}>Payment method: Cash on Delivery (COD)</Alert>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 3, bgcolor: '#FF9900', color: '#000', py: 1.5, fontSize: 16 }}
        >
          {loading ? 'Placing Order…' : `Place Order — $${finalTotal.toFixed(2)}`}
        </Button>
      </Paper>
    </Box>
  );
}
