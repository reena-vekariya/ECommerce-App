'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { useThemeStore } from '@/store/theme.store';
import { lightTheme, darkTheme } from '@/lib/theme';
import { createEmotionCache } from '@/lib/emotion-cache';
import { CacheProvider } from '@emotion/react';

const clientSideEmotionCache = createEmotionCache();

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } }),
  );
  const { mode } = useThemeStore();
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
