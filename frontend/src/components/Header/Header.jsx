import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import './Header.css';

function Header() {
  return (
    <AppBar position="static" className="header">
      <Toolbar className="header-toolbar">
        <Typography className="header-title">
          Your App Name
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 