import { AppBar, Toolbar, Typography, Button, Grid } from '@mui/material';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs>
            <Typography variant="h6">
              Image Generator
            </Typography>
          </Grid>
          <Grid item>
            <Button color="inherit">Login</Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 