'use client';

import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import { signUp } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await signUp(email, password);
      toast.success('Signed up successfully!');
      router.push('/signin');
    } catch {
      toast.error('Failed to sign up.');
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} maxWidth={400} margin="auto" mt={8}>
      <Typography variant="h4">Sign Up</Typography>
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
        Sign Up
      </Button>
      <Typography variant='caption'>Already have an account? <Link href='/signin'>Sign In</Link></Typography>
    </Box>
  );
}
