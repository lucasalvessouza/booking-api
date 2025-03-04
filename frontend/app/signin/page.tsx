'use client';

import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      const { data } = await signIn(email, password);
      login(data.access_token);
      toast.success('Signed in successfully!');
    } catch (error) {
      toast.error('Failed to sign in.');
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} maxWidth={400} margin="auto" mt={8}>
      <Typography variant="h4">Sign In</Typography>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Sign In
      </Button>
      <Typography variant='caption'>Don't have an account? <Link href='/signup'>Sign Up</Link></Typography>
    </Box>
  );
}
