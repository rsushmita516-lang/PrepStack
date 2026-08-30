import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

const features = [
  'Track coding problems you want to solve',
  'Save useful articles and learning notes',
  'Monitor your interview prep momentum',
];

export default function LoginPage() {
  const { firebaseUser, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && firebaseUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [firebaseUser, loading, navigate]);

  if (loading) {
    return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>Loading...</Box>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 72px)',
        display: 'grid',
        alignItems: 'center',
        py: { xs: 4, md: 6 },
        background: 'linear-gradient(180deg, #dff4ff 0%, #cfeeff 28%, #eaf7ff 100%)',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} lg={7}>
            <Box sx={{ maxWidth: 620, px: { xs: 0, md: 2 } }}>
              <Chip label="Built for interview prep" color="secondary" sx={{ mb: 2, fontWeight: 700 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, letterSpacing: '-0.05em', mb: 2 }}>
                Organize your coding journey with clarity.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                PrepStack helps developers track problems, save learning resources, and build a
                steady interview practice routine without the clutter.
              </Typography>

              <Stack spacing={2}>
                {features.map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleOutlineRoundedIcon color="primary" />
                    <Typography variant="body1" color="text.primary">{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 24px 60px rgba(37,99,235,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  <Button
                    fullWidth
                    variant={mode === 'login' ? 'contained' : 'outlined'}
                    onClick={() => setMode('login')}
                  >
                    Login
                  </Button>
                  <Button
                    fullWidth
                    variant={mode === 'signup' ? 'contained' : 'outlined'}
                    onClick={() => setMode('signup')}
                  >
                    Sign up
                  </Button>
                </Stack>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Stack spacing={2.5}>
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
                    <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                      {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
