'use client';

import {
  AppBar, Toolbar, Typography, IconButton, Badge, Box,
  InputBase, Button, Avatar, Menu, MenuItem, Drawer,
} from '@mui/material';
import {
  ShoppingCart, Search, Favorite, AccountCircle,
  Dashboard, Menu as MenuIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cartService } from '@/services/cart.service';
import CartDrawer from '@/components/cart/CartDrawer';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const { itemCount, setCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (token) {
      cartService.getCart().then(setCart).catch(() => {});
    }
  }, [token]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    router.push('/');
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#232F3E', zIndex: 1200 }}>
        <Toolbar className="gap-3">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#FF9900', whiteSpace: 'nowrap' }}>
              ShopHub
            </Typography>
          </Link>

          <Box
            component="form"
            onSubmit={handleSearch}
            className="flex flex-1 max-w-2xl mx-auto bg-white rounded overflow-hidden"
          >
            <InputBase
              sx={{ flex: 1, px: 1.5, color: 'text.primary' }}
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton type="submit" sx={{ bgcolor: '#FF9900', borderRadius: 0, px: 1.5 }}>
              <Search />
            </IconButton>
          </Box>

          <Box className="flex items-center gap-1 ml-auto">
            <ThemeToggle />

            <Link href="/wishlist" style={{ color: 'inherit' }}>
              <IconButton color="inherit">
                <Favorite />
              </IconButton>
            </Link>

            <IconButton color="inherit" onClick={() => setCartOpen(true)}>
              <Badge badgeContent={itemCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" style={{ color: 'inherit' }}>
                    <IconButton color="inherit"><Dashboard /></IconButton>
                  </Link>
                )}
                <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF9900', color: '#000', fontSize: 14 }}>
                    {user.fullName[0].toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  <MenuItem onClick={() => { router.push('/profile'); setAnchorEl(null); }}>Profile</MenuItem>
                  <MenuItem onClick={() => { router.push('/orders'); setAnchorEl(null); }}>My Orders</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                sx={{ color: 'white', borderColor: 'white', ml: 1 }}
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
