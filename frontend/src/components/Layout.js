import React from 'react';
import { Container, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const location = useLocation();
  const hideNavbarPaths = ['/login'];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #dff4ff 0%, #cfeeff 28%, #eaf7ff 100%)',
      }}
    >
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      <Box
        component="main"
        sx={{
          flex: 1,
          pt: hideNavbarPaths.includes(location.pathname) ? 0 : 3,
          pb: 6,
        }}
      >
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}
