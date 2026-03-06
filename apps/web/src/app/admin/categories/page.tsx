'use client';

import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
  TextField, Select, MenuItem, FormControl, InputLabel, DialogActions, Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { categoryService } from '@/services/product.service';
import { ICategory } from '@/types';

const EMPTY = { name: '', slug: '', parentId: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ICategory | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const fetch = () => categoryService.getCategories().then(setCategories);
  useEffect(() => { fetch(); }, []);

  const handleOpen = (cat?: ICategory) => {
    setEditing(cat ?? null);
    setForm(cat ? { name: cat.name, slug: cat.slug, parentId: cat.parentId ?? '' } : EMPTY);
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setError('');
    try {
      const data = { ...form, parentId: form.parentId || undefined };
      if (editing) await categoryService.updateCategory(editing._id, data);
      else await categoryService.createCategory(data);
      setOpen(false);
      fetch();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await categoryService.deleteCategory(id);
    fetch();
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" fontWeight="bold">Categories</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ bgcolor: '#FF9900', color: '#000' }}>
          Add Category
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.slug}</TableCell>
                <TableCell>
                  {c.parentId ? categories.find((cat) => cat._id === c.parentId)?.name ?? c.parentId : '—'}
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
        <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-3 mt-2">
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Parent Category</InputLabel>
              <Select value={form.parentId} label="Parent Category" onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
                <MenuItem value="">None (Root)</MenuItem>
                {categories.filter((c) => c._id !== editing?._id).map((c) => (
                  <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
