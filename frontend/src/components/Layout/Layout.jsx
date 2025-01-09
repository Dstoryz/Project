import React from 'react';
import { Box } from '@mui/material';
import Header from '../Header/Header';
import './Layout.css';

function Layout({ children }) {
  return (
    <Box className="layout">
      <Header />
      <main className="layout-main">
        {children}
      </main>
    </Box>
  );
}

export default Layout; 