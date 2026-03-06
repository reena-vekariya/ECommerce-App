'use client';
import { Rating, Typography, Box } from '@mui/material';

interface Props {
  value: number;
  count?: number;
  size?: 'small' | 'medium' | 'large';
  readOnly?: boolean;
  onChange?: (value: number) => void;
}

export default function StarRating({ value, count, size = 'small', readOnly = true, onChange }: Props) {
  return (
    <Box className="flex items-center gap-1">
      <Rating
        value={value}
        size={size}
        readOnly={readOnly}
        precision={0.5}
        onChange={(_, v) => onChange?.(v ?? 0)}
      />
      {count !== undefined && (
        <Typography variant="caption" color="text.secondary">
          ({count})
        </Typography>
      )}
    </Box>
  );
}
