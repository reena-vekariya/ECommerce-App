'use client';

import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
  TextField, Select, MenuItem, FormControl, InputLabel, Chip,
  DialogActions, Alert, Switch, FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, Image } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { productService, categoryService } from '@/services/product.service';
import { adminService } from '@/services/wishlist.service';
import { IProduct, ICategory } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const EMPTY_PRODUCT = {
  name: '', slug: '', description: '', price: 0, discountPrice: '',
  stock: 0, brand: '', categoryId: '', tags: '', isActive: true, images: [] as string[],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IProduct | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch = async () => {
    const [p, c] = await Promise.all([
      productService.getProducts({ limit: 100 }),
      categoryService.getCategories(),
    ]);
    setProducts(p.data);
    setCategories(c);
  };

  useEffect(() => { fetch().finally(() => setLoading(false)); }, []);

  const handleOpen = (product?: IProduct) => {
    if (product) {
      setEditing(product);
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice?.toString() ?? '',
        stock: product.stock,
        brand: product.brand ?? '',
        categoryId: typeof product.categoryId === 'string' ? product.categoryId : (product.categoryId as ICategory)._id,
        tags: product.tags.join(', '),
        isActive: product.isActive,
        images: product.images,
      });
    } else {
      setEditing(null);
      setForm(EMPTY_PRODUCT);
    }
    setError('');
    setOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await adminService.uploadImage(file);
    setForm((f) => ({ ...f, images: [...f.images, url] }));
  };

  const handleSave = async () => {
    setError('');
    try {
      const data = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (editing) {
        await productService.updateProduct(editing._id, data);
      } else {
        await productService.createProduct(data);
      }
      setOpen(false);
      fetch();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await productService.deleteProduct(id);
    fetch();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" fontWeight="bold">Products ({products.length})</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ bgcolor: '#FF9900', color: '#000' }}>
          Add Product
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>
                  <Box className="flex items-center gap-2">
                    {p.images?.[0] && (
                      <img
                        src={p.images[0].startsWith('http') ? p.images[0] : `http://localhost:4000${p.images[0]}`}
                        alt="" style={{ width: 40, height: 40, objectFit: 'contain' }}
                      />
                    )}
                    <Typography variant="body2">{p.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>${p.price.toFixed(2)}{p.discountPrice && ` / $${p.discountPrice.toFixed(2)}`}</TableCell>
                <TableCell>
                  <Chip label={p.stock} color={p.stock > 0 ? 'success' : 'error'} size="small" />
                </TableCell>
                <TableCell>
                  {typeof p.categoryId === 'object' ? (p.categoryId as ICategory).name : p.categoryId}
                </TableCell>
                <TableCell>
                  <Chip label={p.isActive ? 'Active' : 'Inactive'} color={p.isActive ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(p)}><Edit /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(p._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} fullWidth />
            <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} fullWidth />
            <TextField label="Discount Price" type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} fullWidth />
            <TextField label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} fullWidth />
            <TextField label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={form.categoryId} label="Category" onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} fullWidth />
            <Box className="col-span-2">
              <TextField
                label="Description"
                multiline rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                fullWidth
              />
            </Box>
            <Box className="col-span-2">
              <FormControlLabel
                control={<Switch checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />}
                label="Active"
              />
              <Button startIcon={<Image />} variant="outlined" onClick={() => fileRef.current?.click()} sx={{ ml: 2 }}>
                Upload Image
              </Button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleUpload} />
              <Box className="flex gap-2 mt-2 flex-wrap">
                {form.images.map((img, i) => (
                  <img key={i} src={img.startsWith('http') ? img : `http://localhost:4000${img}`} alt="" style={{ height: 60, objectFit: 'contain', border: '1px solid #eee', borderRadius: 4 }} />
                ))}
              </Box>
            </Box>
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
