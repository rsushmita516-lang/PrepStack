import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Stack,
} from '@mui/material';

export default function LoginPage() {
  const { firebaseUser, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && firebaseUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [firebaseUser, loading, navigate]);

  if (loading) return <div>Loading...</div>;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Firebase state observer in AuthContext will take over
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          PrepStack Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" fullWidth>
              Log in
            </Button>
            <Button variant="outlined" fullWidth onClick={handleSignup}>
              Create account
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
