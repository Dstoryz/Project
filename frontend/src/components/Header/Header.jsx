import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          {isAuthenticated ? (
            <Button 
              color="inherit" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 