import { AppBar, Toolbar, Typography, Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';

const TEXTS = {
  TITLE: 'Image Generator',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  REGISTER: 'Register',
};

function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid 
          container 
          alignItems="center" 
          justifyContent="space-between"
          spacing={2}
        >
          <Grid item>
            <Typography variant="h6" component="h1">
              {TEXTS.TITLE}
            </Typography>
          </Grid>
          <Grid item>
            {isAuthenticated ? (
              <>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  {user?.username}
                </Typography>
                <Button 
                  color="inherit"
                  onClick={logout}
                >
                  {TEXTS.LOGOUT}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit"
                  href="/login"
                  sx={{ mr: 1 }}
                >
                  {TEXTS.LOGIN}
                </Button>
                <Button 
                  color="inherit"
                  href="/register"
                >
                  {TEXTS.REGISTER}
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 