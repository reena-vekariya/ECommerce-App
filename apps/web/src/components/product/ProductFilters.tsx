'use client';
import {
  Box, Typography, Slider, Select, MenuItem, FormControl,
  InputLabel, Checkbox, FormControlLabel, Button, Divider,
} from '@mui/material';
import { ICategory } from '@/types';
import { useState } from 'react';

interface Filters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: string;
}

interface Props {
  categories: ICategory[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function ProductFilters({ categories, filters, onChange }: Props) {
  const [price, setPrice] = useState<number[]>([filters.minPrice ?? 0, filters.maxPrice ?? 1000]);

  return (
    <Box className="flex flex-col gap-4">
      <Typography variant="subtitle1" fontWeight="bold">Filters</Typography>
      <Divider />

      <FormControl size="small" fullWidth>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sort ?? 'newest'}
          label="Sort By"
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="price_asc">Price: Low to High</MenuItem>
          <MenuItem value="price_desc">Price: High to Low</MenuItem>
          <MenuItem value="rating">Top Rated</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.categoryId ?? ''}
          label="Category"
          onChange={(e) => onChange({ ...filters, categoryId: e.target.value || undefined })}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box>
        <Typography variant="body2" gutterBottom>Price Range: ${price[0]} – ${price[1]}</Typography>
        <Slider
          value={price}
          onChange={(_, v) => setPrice(v as number[])}
          onChangeCommitted={(_, v) => {
            const [min, max] = v as number[];
            onChange({ ...filters, minPrice: min, maxPrice: max });
          }}
          min={0} max={2000} step={10}
          disableSwap
          sx={{ color: '#FF9900' }}
        />
      </Box>

      <Box>
        <Typography variant="body2" gutterBottom>Min Rating</Typography>
        <Slider
          value={filters.minRating ?? 0}
          onChange={(_, v) => onChange({ ...filters, minRating: v as number })}
          min={0} max={5} step={1}
          marks
          sx={{ color: '#FF9900' }}
        />
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={filters.inStock ?? false}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked })}
          />
        }
        label="In Stock Only"
      />

      <Button
        variant="outlined"
        size="small"
        onClick={() => { setPrice([0, 1000]); onChange({}); }}
      >
        Clear Filters
      </Button>
    </Box>
  );
}
