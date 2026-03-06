import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#FF9900', contrastText: '#000' },
    secondary: { main: '#232F3E' },
    background: { default: '#FFFFFF', paper: '#F3F3F3' },
    text: { primary: '#0F1111', secondary: '#565959' },
    success: { main: '#007600' },
    error: { main: '#B12704' },
    info: { main: '#007185' },
  },
  typography: { fontFamily: '"Amazon Ember", Arial, sans-serif' },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 4 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FF9900', contrastText: '#000' },
    secondary: { main: '#FEBD69' },
    background: { default: '#0F1111', paper: '#1A1A1A' },
    text: { primary: '#FFFFFF', secondary: '#CCCCCC' },
    success: { main: '#4CAF50' },
    error: { main: '#f44336' },
    info: { main: '#29b6f6' },
  },
  typography: { fontFamily: '"Amazon Ember", Arial, sans-serif' },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 4 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});
