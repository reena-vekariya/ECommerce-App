'use client';
import { Box, Typography, Grid, Link as MuiLink } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#232F3E', color: 'white', py: 4, mt: 8 }}>
      <Box className="max-w-6xl mx-auto px-4">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>ShopHub</Typography>
            <Typography variant="body2" color="grey.400">
              Your one-stop shop for everything.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Shop</Typography>
            <Box className="flex flex-col gap-1">
              {['Products', 'Categories', 'Deals'].map((t) => (
                <MuiLink key={t} href="#" underline="hover" sx={{ color: 'grey.400', fontSize: 14 }}>{t}</MuiLink>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Account</Typography>
            <Box className="flex flex-col gap-1">
              {['Profile', 'Orders', 'Wishlist'].map((t) => (
                <MuiLink key={t} href="#" underline="hover" sx={{ color: 'grey.400', fontSize: 14 }}>{t}</MuiLink>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Help</Typography>
            <Box className="flex flex-col gap-1">
              {['FAQ', 'Shipping', 'Returns'].map((t) => (
                <MuiLink key={t} href="#" underline="hover" sx={{ color: 'grey.400', fontSize: 14 }}>{t}</MuiLink>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid #374151', mt: 4, pt: 3 }}>
          <Typography variant="body2" color="grey.500" align="center">
            © {new Date().getFullYear()} ShopHub. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
