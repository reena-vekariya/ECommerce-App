'use client';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeStore } from '@/store/theme.store';

export default function ThemeToggle() {
  const { mode, toggle } = useThemeStore();
  return (
    <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
      <IconButton onClick={toggle} color="inherit">
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}
