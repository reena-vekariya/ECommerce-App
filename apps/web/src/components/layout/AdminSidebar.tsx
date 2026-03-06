'use client';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box,
} from '@mui/material';
import {
  Dashboard, Inventory, Category, ShoppingBag, People, LocalOffer,
} from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const DRAWER_WIDTH = 220;

const navItems = [
  { label: 'Dashboard', icon: <Dashboard />, href: '/admin' },
  { label: 'Products', icon: <Inventory />, href: '/admin/products' },
  { label: 'Categories', icon: <Category />, href: '/admin/categories' },
  { label: 'Orders', icon: <ShoppingBag />, href: '/admin/orders' },
  { label: 'Users', icon: <People />, href: '/admin/users' },
  { label: 'Coupons', icon: <LocalOffer />, href: '/admin/coupons' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={pathname === item.href}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
