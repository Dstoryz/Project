import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" className="header">
      <Toolbar className="header-toolbar">
        <Typography 
          className="header-title"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          Image Generator
        </Typography>
        <div className="header-buttons">
          <Button 
            color="inherit" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 