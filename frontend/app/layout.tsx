'use client';

import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import theme from '@/lib/theme';
import { AuthProvider } from '@/context/AuthContext';
import { ReactNode } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Toaster position="top-center" />
              {children}
            </LocalizationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
