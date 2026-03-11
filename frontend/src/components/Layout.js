import React from 'react';
import { Container, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const location = useLocation();
  const hideNavbarPaths = ['/login'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Box component="main" sx={{ mt: hideNavbarPaths.includes(location.pathname) ? 0 : 10, mb: 4 }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </>
  );
}
