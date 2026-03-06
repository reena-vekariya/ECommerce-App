'use client';
import { Box, Typography, TextField, Button, Rating } from '@mui/material';
import { useState } from 'react';
import { reviewService } from '@/services/review.service';

interface Props {
  productId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await reviewService.createReview({ productId, rating, comment });
      setComment('');
      setRating(5);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
      <Typography variant="subtitle2" fontWeight="bold">Write a Review</Typography>
      <Box className="flex items-center gap-2">
        <Typography variant="body2">Your rating:</Typography>
        <Rating value={rating} onChange={(_, v) => setRating(v ?? 5)} />
      </Box>
      <TextField
        multiline
        rows={3}
        placeholder="Share your thoughts..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        size="small"
        fullWidth
      />
      {error && <Typography color="error" variant="caption">{error}</Typography>}
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ bgcolor: '#FF9900', color: '#000', alignSelf: 'flex-start' }}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </Box>
  );
}
