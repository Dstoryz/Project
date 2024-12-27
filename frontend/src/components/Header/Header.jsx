import { AppBar, Toolbar, Typography, Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';

// Выносим строковые константы
const TEXTS = {
  TITLE: 'Image Generator',
  LOGIN: 'Login',
};

function Header({ onLoginClick }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid 
          container 
          alignItems="center" 
          justifyContent="space-between" // Улучшаем выравнивание
          spacing={2}
        >
          <Grid item>
            <Typography variant="h6" component="h1">
              {TEXTS.TITLE}
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              color="inherit" 
              onClick={onLoginClick}
            >
              {TEXTS.LOGIN}
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onLoginClick: PropTypes.func,
};

Header.defaultProps = {
  onLoginClick: () => {},
};

export default Header; 