'use client';
import { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info') => void;
}

const SnackbarContext = createContext<SnackbarContextType>({ showSnackbar: () => {} });

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error' | 'info'>('success');

  const showSnackbar = (msg: string, sev: 'success' | 'error' | 'info' = 'success') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={severity} onClose={() => setOpen(false)}>{message}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = () => useContext(SnackbarContext);
