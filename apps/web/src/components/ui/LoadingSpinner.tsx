'use client';
import { Box, CircularProgress } from '@mui/material';

export default function LoadingSpinner() {
  return (
    <Box className="flex justify-center items-center py-16">
      <CircularProgress color="primary" />
    </Box>
  );
}
