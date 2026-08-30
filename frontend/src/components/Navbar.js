import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  Avatar,
  Chip,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Problems', to: '/problems' },
  { label: 'Articles', to: '/articles' },
];

const Navbar = () => {
  const { firebaseUser, backendUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.82)',
        color: 'text.primary',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72, px: { xs: 2, md: 4 } }}>
        <Box component={Link} to={firebaseUser ? '/dashboard' : '/login'} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'inherit' }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'linear-gradient(135deg, #2563eb, #14b8a6)',
              background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
              fontWeight: 800,
              fontSize: '0.95rem',
            }}
          >
            P
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.04em', color: 'inherit' }}>
            PrepStack
          </Typography>
        </Box>

        {firebaseUser ? (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                color="inherit"
                sx={{ color: 'text.primary', fontWeight: 600 }}
              >
                {item.label}
              </Button>
            ))}

            <Chip
              label={backendUser?.displayName || firebaseUser.email}
              variant="outlined"
              sx={{ ml: 1, fontWeight: 600 }}
            />
            <Button onClick={handleLogout} variant="contained" color="primary">
              Logout
            </Button>
          </Stack>
        ) : (
          <Button component={Link} to="/login" variant="contained" sx={{ borderRadius: 999 }}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;