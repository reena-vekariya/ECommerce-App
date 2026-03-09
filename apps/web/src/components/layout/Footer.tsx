'use client';
import { Box, Typography, Grid } from '@mui/material';
import Link from 'next/link';

const LINKS = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Categories', href: '/products' },
    { label: 'Search', href: '/search?q=' },
  ],
  Account: [
    { label: 'My Orders', href: '/orders' },
    { label: 'My Wishlist', href: '/wishlist' },
    { label: 'My Addresses', href: '/profile/addresses' },
  ],
  Help: [
    { label: 'Track Order', href: '/orders' },
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout', href: '/checkout' },
  ],
};

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#232F3E', color: 'white', py: 4, mt: 8 }}>
      <Box sx={{ maxWidth: '1152px', mx: 'auto', px: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>ShopHub</Typography>
            <Typography variant="body2" sx={{ color: 'grey.400' }}>
              Your one-stop shop for everything.
            </Typography>
          </Grid>

          {Object.entries(LINKS).map(([section, items]) => (
            <Grid item xs={12} sm={3} key={section}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{section}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {items.map(({ label, href }) => (
                  <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'grey.400',
                        cursor: 'pointer',
                        '&:hover': { color: '#FF9900' },
                        transition: 'color 0.15s',
                      }}
                    >
                      {label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ borderTop: '1px solid #374151', mt: 4, pt: 3 }}>
          <Typography variant="body2" sx={{ color: 'grey.500' }} align="center">
            © {new Date().getFullYear()} ShopHub. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
