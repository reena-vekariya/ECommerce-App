'use client';
import { Box, Typography, Avatar, Divider } from '@mui/material';
import { IReview, IUser } from '@/types';
import StarRating from '@/components/ui/StarRating';

interface Props {
  reviews: IReview[];
}

export default function ReviewList({ reviews }: Props) {
  if (!reviews.length) {
    return <Typography color="text.secondary" className="py-4">No reviews yet. Be the first!</Typography>;
  }

  return (
    <Box className="flex flex-col gap-3">
      {reviews.map((r) => {
        const user = r.userId as IUser;
        const name = user?.fullName ?? 'Anonymous';
        return (
          <Box key={r._id}>
            <Box className="flex items-center gap-2 mb-1">
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF9900', color: '#000', fontSize: 13 }}>
                {name[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">{name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(r.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box className="ml-auto">
                <StarRating value={r.rating} size="small" />
              </Box>
            </Box>
            <Typography variant="body2" sx={{ pl: '40px' }}>{r.comment}</Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>
        );
      })}
    </Box>
  );
}
