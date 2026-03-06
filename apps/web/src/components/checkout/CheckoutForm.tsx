'use client';
import {
  Box, TextField, Typography, Button, Alert, Divider, Paper,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { orderService } from '@/services/order.service';
import { couponService } from '@/services/wishlist.service';
import { useCart } from '@/hooks/useCart';
import { useCartStore } from '@/store/cart.store';
import { useRouter } from 'next/navigation';

const schema = z.object({
  label: z.string().default('Home'),
  street: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zip: z.string().min(1, 'Required'),
  country: z.string().default('US'),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutForm() {
  const { totalPrice } = useCart();
  const { clearCart } = useCartStore();
  const router = useRouter();
  const [coupon, setCoupon] = useState('');
  const [couponData, setCouponData] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'US', label: 'Home' },
  });

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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Shipping Address</Typography>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField label="Street Address" fullWidth {...register('street')} error={!!errors.street} helperText={errors.street?.message} />
          <TextField label="City" fullWidth {...register('city')} error={!!errors.city} helperText={errors.city?.message} />
          <TextField label="State" fullWidth {...register('state')} error={!!errors.state} helperText={errors.state?.message} />
          <TextField label="ZIP Code" fullWidth {...register('zip')} error={!!errors.zip} helperText={errors.zip?.message} />
          <TextField label="Country" fullWidth {...register('country')} />
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Coupon Code</Typography>
        <Box className="flex gap-2">
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

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Order Summary</Typography>
        <Box className="flex flex-col gap-2">
          <Box className="flex justify-between">
            <Typography>Subtotal</Typography>
            <Typography>${totalPrice.toFixed(2)}</Typography>
          </Box>
          {discount > 0 && (
            <Box className="flex justify-between">
              <Typography color="success.main">Discount</Typography>
              <Typography color="success.main">-${discount.toFixed(2)}</Typography>
            </Box>
          )}
          <Box className="flex justify-between">
            <Typography>Shipping</Typography>
            <Typography color="success.main">FREE</Typography>
          </Box>
          <Divider />
          <Box className="flex justify-between">
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold" color="primary">${finalTotal.toFixed(2)}</Typography>
          </Box>
          <Alert severity="info" sx={{ mt: 1 }}>Payment method: Cash on Delivery (COD)</Alert>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 3, bgcolor: '#FF9900', color: '#000', py: 1.5, fontSize: 16 }}
        >
          {loading ? 'Placing Order...' : `Place Order — $${finalTotal.toFixed(2)}`}
        </Button>
      </Paper>
    </Box>
  );
}
