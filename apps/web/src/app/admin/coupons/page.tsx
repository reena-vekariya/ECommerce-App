'use client';

import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem,
  FormControl, InputLabel, DialogActions, Alert, Chip, Switch, FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { couponService } from '@/services/wishlist.service';
import { ICoupon } from '@/types';

const EMPTY = {
  code: '', discountType: 'percent', discountValue: 10,
  minOrderAmount: 0, maxUses: 100, expiresAt: '', isActive: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ICoupon | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [error, setError] = useState('');

  const fetch = () => couponService.getCoupons().then(setCoupons);
  useEffect(() => { fetch(); }, []);

  const handleOpen = (coupon?: ICoupon) => {
    setEditing(coupon ?? null);
    setForm(coupon ? {
      code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount, maxUses: coupon.maxUses,
      expiresAt: coupon.expiresAt.split('T')[0], isActive: coupon.isActive,
    } : EMPTY);
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setError('');
    try {
      if (editing) await couponService.updateCoupon(editing._id, form);
      else await couponService.createCoupon(form);
      setOpen(false);
      fetch();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await couponService.deleteCoupon(id);
    fetch();
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" fontWeight="bold">Coupons</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ bgcolor: '#FF9900', color: '#000' }}>
          Add Coupon
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Min Order</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c._id}>
                <TableCell><strong>{c.code}</strong></TableCell>
                <TableCell>
                  {c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue}`}
                </TableCell>
                <TableCell>${c.minOrderAmount}</TableCell>
                <TableCell>{c.usedCount}/{c.maxUses}</TableCell>
                <TableCell>{new Date(c.expiresAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={c.isActive ? 'Active' : 'Inactive'} color={c.isActive ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(c)}><Edit /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(c._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-3 mt-2">
            <TextField label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} fullWidth disabled={!!editing} />
            <FormControl fullWidth>
              <InputLabel>Discount Type</InputLabel>
              <Select value={form.discountType} label="Discount Type" onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                <MenuItem value="percent">Percent (%)</MenuItem>
                <MenuItem value="fixed">Fixed ($)</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Discount Value" type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} fullWidth />
            <TextField label="Min Order Amount" type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} fullWidth />
            <TextField label="Max Uses" type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} fullWidth />
            <TextField label="Expires At" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
            <FormControlLabel control={<Switch checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />} label="Active" />
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#FF9900', color: '#000' }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
